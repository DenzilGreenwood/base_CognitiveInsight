// functions/src/getPilotRequests.ts
import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";

export const getPilotRequests = onCall(
  { region: "us-central1" },
  async (request) => {
    // Check if user is authenticated and has admin privileges
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    // Check if user has admin role (you can customize this logic)
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();
    
    if (!userData?.isAdmin && !request.auth.token?.admin) {
      throw new HttpsError("permission-denied", "Admin access required");
    }

    try {
      const snapshot = await db
        .collection("pilot-requests")
        .orderBy("submittedAt", "desc")
        .get();

      const requests: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() || {};
        const normalize = (v: any) =>
          v?.toDate ? v.toDate().toISOString() : v instanceof Date ? v.toISOString() : v;

        requests.push({
          id: doc.id,
          ...data,
          submittedAt: normalize(data.submittedAt),
          createdAt: normalize(data.createdAt),
          updatedAt: normalize(data.updatedAt),
        });
      });

      return {
        success: true,
        requests,
        total: requests.length,
      };
    } catch (error: any) {
      const msg =
        error?.message?.includes("permission")
          ? "Firebase permissions error. Please check your Firebase Admin SDK configuration."
          : "Failed to fetch pilot requests from Firebase";

      throw new HttpsError(
        error?.message?.includes("permission") ? "permission-denied" : "internal",
        msg
      );
    }
  }
);
