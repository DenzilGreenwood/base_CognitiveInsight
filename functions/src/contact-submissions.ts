import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

export const getContactSubmissions = onCall(async (request) => {
  try {
    // Verify user has admin permissions
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const userClaims = request.auth.token;
    if (!userClaims.admin && !userClaims.role) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    const db = getFirestore();
    
    // Get all contact submissions from Firebase, ordered by submission date (newest first)
    const contactSubmissionsRef = db.collection('contact-submissions');
    const snapshot = await contactSubmissionsRef.orderBy('submittedAt', 'desc').get();

    const submissions: unknown[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to ISO string if needed
        submittedAt: data.submittedAt instanceof Date 
          ? data.submittedAt.toISOString() 
          : data.submittedAt?.toDate ? data.submittedAt.toDate().toISOString() 
          : data.submittedAt
      });
    });

    return {
      success: true,
      submissions,
      total: submissions.length,
      message: `Found ${submissions.length} contact submissions`
    };

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to fetch contact submissions');
  }
});
