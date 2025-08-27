import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

interface DeleteUserDataData {
  uid: string;
  deleteAuthRecord?: boolean;
}

export const deleteUserData = onCall<DeleteUserDataData>(async (request) => {
  try {
    // Verify user has admin permissions
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const userClaims = request.auth.token;
    if (!userClaims.admin || userClaims.role !== 'owner_admin') {
      throw new HttpsError('permission-denied', 'Owner admin access required');
    }

    const { uid, deleteAuthRecord = false } = request.data;

    if (!uid) {
      throw new HttpsError('invalid-argument', 'User ID is required');
    }

    // Prevent self-deletion
    if (uid === request.auth.uid) {
      throw new HttpsError('invalid-argument', 'Cannot delete your own account');
    }

    const auth = getAuth();
    const db = getFirestore();

    try {
      // First, verify the user exists
      const userRecord = await auth.getUser(uid);
      
      // Delete Firestore data associated with the user
      const batch = db.batch();
      
      // Delete from collections that might contain user data
      const collectionsToCheck = [
        'users',
        'userProfiles', 
        'userSettings',
        'earlyAccessRequests',
        'pilotRequests',
        'whitepaperRequests',
        'contactSubmissions'
      ];

      for (const collectionName of collectionsToCheck) {
        const userDocsQuery = await db.collection(collectionName)
          .where('uid', '==', uid)
          .get();
        
        userDocsQuery.forEach(doc => {
          batch.delete(doc.ref);
        });

        // Also check for documents where the user ID is the document ID
        try {
          const userDocRef = db.collection(collectionName).doc(uid);
          const userDoc = await userDocRef.get();
          if (userDoc.exists) {
            batch.delete(userDocRef);
          }
        } catch (docError) {
          // Document doesn't exist, continue
        }
      }

      // Commit the batch delete
      await batch.commit();

      let authDeletionResult = null;
      if (deleteAuthRecord) {
        // Delete the authentication record
        await auth.deleteUser(uid);
        authDeletionResult = 'Authentication record deleted';
      }

      return {
        success: true,
        message: `Successfully deleted user data for ${userRecord.email}`,
        details: {
          email: userRecord.email,
          firestoreDataDeleted: true,
          authRecordDeleted: deleteAuthRecord,
          authDeletionResult
        }
      };

    } catch (authError: any) {
      if (authError.code === 'auth/user-not-found') {
        throw new HttpsError('not-found', 'User not found');
      }
      throw new HttpsError('internal', `Failed to process user deletion: ${authError.message}`);
    }

  } catch (error) {
    console.error('Error deleting user data:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to delete user data');
  }
});
