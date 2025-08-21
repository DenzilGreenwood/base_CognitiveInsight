import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

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

export const leads = functions.https.onRequest(async (req, res) => {
  res.set("Access-control-allow-origin", "*");
  res.set("access-control-allow-headers", "content-type");
  if (req.method === "options") return res.status(204).send();
  if (req.method !== "post") return res.status(405).send("method not allowed");

  try {
    const parsed = LeadSchema.parse(req.body);
    const { name, email, orgRole = "", notes = "", preferredTime = "", type = "pilot", source = "" } = parsed;
    
    const docRef = await db.collection("leads").add({
      name,
      email: String(email).toLowerCase().trim(),
      orgRole,
      notes,
      preferredTime,
      type,
      source,
      status: "new",
      sentConfirmation: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (SENDGRID_KEY && type === 'whitepaper') {
       // implementation for whitepaper
    } else if (SENDGRID_KEY) {
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

    return res.json({ ok: true, id: docRef.id });
  } catch (err:any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
});

export const onLeadCreateSendWhitepaper = functions.firestore
  .document("leads/{leadId}")
  .onCreate(async (snap, ctx) => {
    const lead = snap.data() as LeadDoc;
    const leadRef = snap.ref;

    if (lead.sentWhitePaper === true || lead.status === "sent") return;

    const leadType = (lead.type || "whitepaper").toLowerCase();
    if (leadType !== "whitepaper") return;

    const email = (lead.email || "").toLowerCase().trim();
    const name = lead.name || "there";

    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file("whitepapers/CIAF_White_Paper.pdf");
      const expiresAt = Date.now() + TTL_HOURS * 60 * 60 * 1000;

      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: expiresAt,
      });

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
        await leadRef.update({
          sentWhitePaper: true,
          status: "sent",
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
          signedUrl,
        });
        return;
      }

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
