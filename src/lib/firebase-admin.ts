// src/lib/firebase-admin.ts
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let _db: any = null;
let _storage: any = null;
let _initialized = false;

function initializeFirebaseAdmin() {
  if (_initialized) {
    return { db: _db, storage: _storage };
  }

  try {
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
      console.warn("Missing Firebase Admin env variables");
      _initialized = true;
      return { db: null, storage: null };
    }

    // ---- Initialize (idempotent) ----
    const app = getApps().length
      ? getApp()
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
          projectId, // optional but harmless
        });

    _db = getFirestore(app);
    _storage = getStorage(app);
    _initialized = true;

    return { db: _db, storage: _storage };
  } catch (error) {
    console.warn("Firebase Admin initialization failed:", error);
    _initialized = true;
    return { db: null, storage: null };
  }
}

export function getFirebaseAdmin() {
  return initializeFirebaseAdmin();
}
