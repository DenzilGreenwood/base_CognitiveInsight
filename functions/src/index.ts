import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { z } from "zod";
import { Storage } from "@google-cloud/storage";
import sgMail from "@sendgrid/mail";

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

const SENDGRID_KEY = functions.config().sendgrid?.key;
const EMAIL_FROM = functions.config().email?.from || "no-reply@example.com";
const TTL_HOURS = parseInt(functions.config().whitepaper?.ttl_hours || "168", 10); // 7 days
const CAL_URL = functions.config().calendar?.book_url || "https://calendly.com/your-link/intro";


if (SENDGRID_KEY) sgMail.setApiKey(SENDGRID_KEY);

type LeadDoc = {
  name: string;
  email: string;
  orgRole?: string;
  type?: string;               // "whitepaper", etc.
  sentWhitePaper?: boolean;
  status?: string;             // "new" | "sent" | "error"
  createdAt?: FirebaseFirestore.FieldValue;
};

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  orgRole: z.string().optional(),
  notes: z.string().optional(),
  preferredTime: z.string().optional(),
  type: z.string().optional(),
  source: z.string().optional(),
});

// Standalone endpoint (no router) → /api/leads via firebase.json rewrite
export const leads = functions.https.onRequest(async (req, res) => {
  // Basic CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { 
        name, 
        email, 
        orgRole = "", 
        notes = "", 
        preferredTime = "", 
        type = "pilot", 
        source = "" 
    } = req.body || {};

    if (!name || !email) return res.status(400).json({ ok: false, error: "Missing name/email" });
    
    const docData = {
        name,
        email: String(email).toLowerCase().trim(),
        orgRole,
        notes,
        preferredTime,
        type,
        source,
        status: "new",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (type === 'whitepaper') {
        (docData as any).sentWhitePaper = false;
    } else {
        (docData as any).sentConfirmation = false;
    }

    const docRef = await db.collection("leads").add(docData);
    
    // For pilot/demo requests, immediately send a calendar link.
    if (type !== 'whitepaper' && SENDGRID_KEY) {
      const subj = type === "pilot" ? "Thanks — Pilot request received" : "Thanks — Demo request received";
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111">
          <h2 style="margin:0 0 12px;">Thanks, ${escapeHtml(name)}.</h2>
          <p>We’d love to learn about your use case and show you Cognitive Insight™.</p>
          <p>
            <a href="${CAL_URL}" style="background:#4F46E5;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">
              Book a ${type === "pilot" ? "Pilot" : "Demo"} Slot
            </a>
          </p>
          <p><small>If you don’t see a time that works, reply to this email with your availability.</small></p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          <p style="margin:0"><strong>Your details</strong></p>
          <p style="margin:0">Org/Role: ${escapeHtml(orgRole || "-")}</p>
          <p style="margin:0">Preferred time: ${escapeHtml(preferredTime || "-")}</p>
          <p style="margin:0">Notes: ${escapeHtml(notes || "-")}</p>
        </div>
      `;
      const [resp] = await sgMail.send({ to: email, from: EMAIL_FROM, subject: subj, html });
      await docRef.update({
        sentConfirmation: true,
        status: "sent",
        confirmationAt: admin.firestore.FieldValue.serverTimestamp(),
        provider: "sendgrid",
        messageId: resp?.headers?.["x-message-id"] || "",
      });
    }


    return res.status(200).json({ ok: true, id: docRef.id });
  } catch (err: any) {
    console.error("Error in leads function:", err);
    // Use a more specific check for Zod errors if needed
    if (err.issues) {
        return res.status(400).json({ ok: false, error: "Invalid payload", details: err.issues });
    }
    return res.status(500).json({ ok: false, error: err.message || "Server Error" });
  }
});


export const onLeadCreateSendWhitepaper = functions.firestore
  .document("leads/{leadId}")
  .onCreate(async (snap, ctx) => {
    const lead = snap.data() as LeadDoc;
    const leadRef = snap.ref;

    // Idempotency: if already sent, no-op (helps if function retries)
    if (lead.sentWhitePaper === true || lead.status === "sent") return;

    // Only send for type=whitepaper (others may be pilots, etc.)
    const leadType = (lead.type || "whitepaper").toLowerCase();
    if (leadType !== "whitepaper") return;

    const email = (lead.email || "").toLowerCase().trim();
    const name = lead.name || "there";

    try {
      // Create a signed URL for the PDF (time-limited access)
      const bucket = admin.storage().bucket();
      const file = bucket.file("whitepapers/CIAF_White_Paper.pdf");
      const expiresAt = Date.now() + TTL_HOURS * 60 * 60 * 1000;

      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: expiresAt,
      });

      // Build the email
      const subject = "Thanks for your interest — CIAF White Paper";
      const html = `
        <div style="font-family:Inter,Arial,sans-serif; line-height:1.6; color:#111;">
          <h2 style="margin:0 0 12px;">Thank you, ${escapeHtml(name)}.</h2>
          <p>Here is your access to the Cognitive Insight™ white paper:</p>
          <p>
            <a href="${signedUrl}" style="background:#4F46E5;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">
              Download White Paper
            </a>
          </p>
          <p><small>Link expires in ${TTL_HOURS} hours.</small></p>
          <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
          <p style="margin:0;">
            <strong>What you'll find inside:</strong><br/>
            • CIAF + Lazy Capsule Materialization overview<br/>
            • Alignment with NIST AI RMF, ISO/IEC 42001, EU AI Act<br/>
            • Proof capsules, Merkle anchoring, privacy-by-design<br/>
            • Pilot options for regulators, auditors, and AI providers
          </p>
          <p style="margin-top:16px;">
            If you’d like a quick briefing or a pilot discussion, just reply to this email.
          </p>
          <p style="margin-top:8px;">— Cognitive Insight™</p>
        </div>
      `;

      if (!SENDGRID_KEY) {
        // If email isn’t configured yet, just store the URL and mark "sent" for testing
        await leadRef.update({
          sentWhitePaper: true,
          status: "sent",
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
          signedUrl,
        });
        return;
      }

      // Send with SendGrid
      const msg = {
        to: email,
        from: EMAIL_FROM,
        subject,
        html,
      };

      const [resp] = await sgMail.send(msg);

      await leadRef.update({
        sentWhitePaper: true,
        status: "sent",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        emailProvider: "sendgrid",
        messageId: resp?.headers?.["x-message-id"] || "",
      });
    } catch (err: any) {
      console.error("Whitepaper send error:", err);
      await leadRef.update({
        sentWhitePaper: false,
        status: "error",
        error: String(err?.message || err),
        errorAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

export { simGenerate, simVerify } from "./sim";
