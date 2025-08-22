// functions/src/early-access.ts
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import cors from "cors";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin if not already done
if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

// Allow localhost and your deployed host
const allowed = [
  "http://localhost:9002",
  "http://localhost:3000",
  "https://cognitiveinsight-j7xwb.web.app",
  "https://cognitiveinsight-j7xwb.firebaseapp.com"
];

const corsHandler = cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true
});

export const submitEarlyAccess = onRequest(
  { 
    region: "us-central1", 
    cors: true,
    invoker: "public"
  }, // v2 has built-in CORS; we still run our handler for origin filtering
  async (req, res) => {
    // wrap CORS
    await new Promise<void>((resolve) => corsHandler(req, res, () => resolve()));

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    try {
      const { email, name, useCase } = req.body ?? {};
      if (!email) {
        res.status(400).json({ error: "email required" });
        return;
      }

      await db.collection("early_access").add({
        email,
        name: name ?? null,
        useCase: useCase ?? null,
        createdAt: new Date()
      });

      logger.info("Early access submission", { email });
      res.json({ ok: true });
    } catch (err: any) {
      logger.error(err);
      res.status(500).json({ error: "internal error" });
    }
  }
);
