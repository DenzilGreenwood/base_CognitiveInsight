import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { z } from "zod";

admin.initializeApp();
const db = admin.firestore();

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  orgRole: z.string().min(2),
  // optionally accept 'type' from client, but enforce whitepaper in server:
  type: z.string().optional()
});

// Standalone endpoint (no router) → /api/leads via firebase.json rewrite
export const leads = functions.https.onRequest(async (req, res) => {
  // Basic CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const parsed = LeadSchema.parse(req.body);
    const { name, email, orgRole } = parsed;

    const docRef = await db.collection("leads").add({
      name,
      email: email.toLowerCase().trim(),
      orgRole,
      type: "whitepaper",
      status: "new",
      sentWhitePaper: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // OPTIONAL: immediately send email with a white-paper link here via SendGrid/Mailgun
    // const ok = await sendWhitepaperEmail(email, name);
    // if (ok) await docRef.update({ sentWhitePaper: true, status: "sent" });

    return res.status(200).json({ ok: true, id: docRef.id });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err.message || "Invalid payload" });
  }
});
