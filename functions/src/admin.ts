// functions/src/admin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// If you use a service account JSON (recommended locally), set GOOGLE_APPLICATION_CREDENTIALS
// Otherwise, Functions env will use default credentials.
if (!getApps().length) {
  initializeApp(); // or initializeApp({ credential: cert(serviceAccount as any) })
}

export const db = getFirestore();
