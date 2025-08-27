// functions/src/white-paper.ts
import * as sgMail from "@sendgrid/mail";
import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function checkRateLimit(uid: string | undefined, key: string): Promise<boolean> {
  const RATE_LIMIT = 3;
  const WINDOW = 60 * 60 * 1000;
  const now = Date.now();

  // Use user ID if authenticated, otherwise skip rate limiting for callable functions
  if (!uid) return true;

  const ref = db.collection("rateLimits").doc(`${key}_${uid}`);
  const doc = await ref.get();
  const data = doc.data();

  if (!data || now > data.resetTime) {
    await ref.set({ count: 1, resetTime: now + WINDOW });
    return true;
  }
  if (data.count >= RATE_LIMIT) return false;

  await ref.update({ count: data.count + 1 });
  return true;
}

export const requestWhitePaper = onCall(
  { region: "us-central1" },
  async (request) => {
    const allowed = await checkRateLimit(request.auth?.uid, "whitepaper");
    if (!allowed) {
      throw new HttpsError("resource-exhausted", "Too many requests, please try later.");
    }

    try {
      const { name, email, company, intent } = request.data ?? {};
      if (!email) {
        throw new HttpsError("invalid-argument", "email required");
      }

      const timestamp = new Date();
      const docRef = await db.collection("whitepaper_requests").add({
        name: name ?? null,
        email,
        company: company ?? null,
        intent: intent ?? null,
        createdAt: timestamp,
        userId: request.auth?.uid || null,
      });

      if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL) {
        try {
          await sgMail.send({
            to: process.env.ADMIN_EMAIL,
            from: process.env.ADMIN_EMAIL,
            subject: `New White Paper Request: ${email}`,
            html: `
              <h2>New White Paper Request</h2>
              <p><strong>Name:</strong> ${name ?? ""}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company ?? ""}</p>
              <p><strong>Intent:</strong> ${intent ?? ""}</p>
              <p><strong>User ID:</strong> ${request.auth?.uid || 'Anonymous'}</p>
              <p><strong>Submitted:</strong> ${timestamp.toISOString()}</p>
              <p><strong>Document ID:</strong> ${docRef.id}</p>
            `,
          });
        } catch (e) {
          console.error("SendGrid email error:", e);
        }
      }

      return { ok: true, id: docRef.id };
    } catch (err: any) {
      console.error(err);
      if (err instanceof HttpsError) {
        throw err;
      }
      throw new HttpsError("internal", "internal error");
    }
  }
);
