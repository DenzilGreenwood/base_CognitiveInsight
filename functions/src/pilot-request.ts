// functions/src/pilot-request.ts
import * as sgMail from "@sendgrid/mail";
import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function checkRateLimit(uid: string | undefined, key: string): Promise<boolean> {
  const RATE_LIMIT = 3; // requests per hour
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

export const submitPilotRequest = onCall(
  { region: "us-central1" },
  async (request) => {
    const allowed = await checkRateLimit(request.auth?.uid, "pilot");
    if (!allowed) {
      throw new HttpsError("resource-exhausted", "Too many requests, please try later.");
    }

    try {
      const {
        name,
        email,
        organization,
        role,
        sector,
        region,
        description,
        timeline,
        budget,
        complianceRequirements,
        expectedOutcomes,
        source,
        primaryGoals,
      } = request.data ?? {};

      const timestamp = new Date();
      const docRef = await db.collection("pilot-requests").add({
        name,
        email,
        organization,
        role,
        sector,
        region,
        description,
        timeline,
        budget,
        complianceRequirements,
        expectedOutcomes,
        source,
        primaryGoals,
        submittedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: request.auth?.uid || null,
      });

      // Optional email
      if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL) {
        try {
          await sgMail.send({
            to: process.env.ADMIN_EMAIL,
            from: process.env.ADMIN_EMAIL,
            subject: `New Pilot Request: ${organization ?? name ?? email}`,
            html: `
              <h2>New Pilot Request</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Organization:</strong> ${organization}</p>
              <p><strong>Role:</strong> ${role}</p>
              <p><strong>Sector:</strong> ${sector}</p>
              <p><strong>Region:</strong> ${region}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Timeline:</strong> ${timeline}</p>
              <p><strong>Budget:</strong> ${budget}</p>
              <p><strong>Compliance Requirements:</strong> ${complianceRequirements}</p>
              <p><strong>Expected Outcomes:</strong> ${expectedOutcomes}</p>
              <p><strong>Primary Goals:</strong> ${primaryGoals}</p>
              <p><strong>Source:</strong> ${source}</p>
              <p><strong>User ID:</strong> ${request.auth?.uid || 'Anonymous'}</p>
              <p><strong>Submitted:</strong> ${timestamp.toISOString()}</p>
              <p><strong>Document ID:</strong> ${docRef.id}</p>
            `,
          });
        } catch (e) {
          // log & continue
          console.error("SendGrid email error:", e);
        }
      }

      return {
        success: true,
        message: "Pilot request submitted successfully",
        requestId: docRef.id,
      };
    } catch (error) {
      console.error("Pilot request error:", error);
      throw new HttpsError("internal", "Internal server error. Please try again later.");
    }
  }
);
