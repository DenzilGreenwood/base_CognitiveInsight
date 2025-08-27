import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";

interface SetUserClaimsData {
  uid: string;
  role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
}

export const setUserClaims = onCall<SetUserClaimsData>(async (request) => {
  try {
    // Verify user has admin permissions
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const userClaims = request.auth.token;
    if (!userClaims.admin && !userClaims.role) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    const { uid, role } = request.data;

    if (!uid || !role) {
      throw new HttpsError('invalid-argument', 'User ID and role are required');
    }

    const validRoles = ['regulator', 'auditor', 'ai_builder', 'owner_admin'];
    if (!validRoles.includes(role)) {
      throw new HttpsError('invalid-argument', 'Invalid role specified');
    }

    const auth = getAuth();

    // Set custom claims for the user
    await auth.setCustomUserClaims(uid, {
      admin: true,
      role: role
    });

    return {
      success: true,
      message: `Successfully set ${role} claims for user ${uid}`
    };

  } catch (error) {
    console.error('Error setting user claims:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to set user claims');
  }
});
