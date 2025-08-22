// src/lib/firebase-admin.ts
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// ---- Normalize env ----
const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

// Prefer plain key; support BASE64 fallback.
let privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64;

if (privateKey?.includes("BEGIN PRIVATE KEY") === false && process.env.FIREBASE_PRIVATE_KEY_BASE64) {
  // Decode base64 variant
  privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8");
}

// Strip wrapping quotes (some hosts add them)
if (privateKey?.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1);
}

// Convert escaped \n to real newlines
if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

// ---- Validate early (server only) ----
if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    [
      "Missing Firebase Admin env:",
      `FIREBASE_PROJECT_ID=${!!projectId}`,
      `FIREBASE_CLIENT_EMAIL=${!!clientEmail}`,
      `FIREBASE_PRIVATE_KEY/BASE64=${!!privateKey}`,
    ].join(" ")
  );
}

// ---- Initialize (idempotent) ----
const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId, // optional but harmless
    });

export const db = getFirestore(app);
export const storage = getStorage(app);
