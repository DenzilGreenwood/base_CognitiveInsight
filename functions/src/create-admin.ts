import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";

interface CreateAdminData {
  email: string;
  password: string;
  role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
  displayName?: string;
}

export const createAdmin = onCall<CreateAdminData>(async (request) => {
  try {
    // Verify user has admin permissions
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const userClaims = request.auth.token;
    if (!userClaims.admin || userClaims.role !== 'owner_admin') {
      throw new HttpsError('permission-denied', 'Owner admin access required');
    }

    const { email, password, role, displayName } = request.data;

    if (!email || !password || !role) {
      throw new HttpsError('invalid-argument', 'Email, password, and role are required');
    }

    const validRoles = ['regulator', 'auditor', 'ai_builder', 'owner_admin'];
    if (!validRoles.includes(role)) {
      throw new HttpsError('invalid-argument', 'Invalid role specified');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpsError('invalid-argument', 'Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new HttpsError('invalid-argument', 'Password must be at least 8 characters');
    }

    const auth = getAuth();

    try {
      // Create the user
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0],
        emailVerified: true, // Auto-verify admin users
      });

      // Set custom claims for the new admin user
      await auth.setCustomUserClaims(userRecord.uid, {
        admin: true,
        role: role
      });

      return {
        success: true,
        message: `Successfully created ${role} admin user`,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role: role
        }
      };

    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        throw new HttpsError('already-exists', 'User with this email already exists');
      }
      throw new HttpsError('internal', `Failed to create user: ${authError.message}`);
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to create admin user');
  }
});
