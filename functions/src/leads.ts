/** Firebase Functions for managing leads  
 * This module contains functions for creating and managing leads in the system.
 * It includes HTTP endpoints for lead creation and Firestore triggers for lead events.
 * The main functions are:
 *  - `leads`: HTTP endpoint for creating new leads.
 *  - `onLeadCreate`: Firestore trigger for new lead events.
 */



import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Secrets and configuration
const sendgridApiKey = defineSecret("SENDGRID_API");            // set via: firebase functions:secrets:set SENDGRID_API

// Get config from Firebase functions config (for v1 compatibility)
const getFirebaseConfig = () => functions.config();

export const leads = onRequest(
  {
    cors: true,
    secrets: [sendgridApiKey], // included even if not used here (ok)
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const { name, email, company, notes, source } = req.body || {};

      if (!name || !email) {
        res.status(400).json({ ok: false, error: "Name and email are required" });
        return;
      }

      const leadData = {
        name: String(name),
        email: String(email).toLowerCase().trim(),
        company: company ? String(company) : null,
        notes: notes ? String(notes) : null,
        source: source ? String(source) : "api",
        createdAt: admin.firestore.Timestamp.now(),
        status: "new",
      };

      const docRef = await admin.firestore().collection("leads").add(leadData);
      res.json({ ok: true, id: docRef.id });
    } catch (err: any) {
      console.error("Error creating lead:", err);
      res.status(500).json({ ok: false, error: "Internal server error" });
    }
  }
);

export const onLeadCreate = onDocumentCreated(
  {
    document: "leads/{leadId}",
    secrets: [sendgridApiKey],
  },
  async (event) => {
    const leadData = event.data?.data();
    if (!leadData) {
      console.log("No lead data found");
      return;
    }

    try {
      // Configure SendGrid
      sgMail.setApiKey(sendgridApiKey.value());
      
      const config = getFirebaseConfig();
      const { name, email, company, notes, source } = leadData;

      // Notify admin
      const adminMsg = {
        to: config.notify?.to || "Insight@CognitiveInsight.AI",
        from: config.sendgrid?.from_email || "no-reply@CognitiveInsight.ai",
        subject: `New Early Access Lead: ${name}`,
        text: [
          `New lead submitted:`,
          ``,
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || "Not provided"}`,
          `Notes: ${notes || "Not provided"}`,
          `Source: ${source || "Unknown"}`,
          `Created: ${new Date().toISOString()}`,
        ].join("\n"),
        html: `
          <h2>New Early Access Lead</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Notes:</strong> ${notes || "Not provided"}</p>
          <p><strong>Source:</strong> ${source || "Unknown"}</p>
          <p><strong>Created:</strong> ${new Date().toISOString()}</p>
        `,
      };
      await sgMail.send(adminMsg);
      console.log("Admin notification sent");

      // Auto-reply to lead
      const autoReply = {
        to: email,
        from: config.sendgrid?.from_email || "no-reply@CognitiveInsight.ai",
        subject: "Thanks for your interest in Cognitive Insight™",
        text: [
          `Hi ${name},`,
          ``,
          `Thank you for your interest in Cognitive Insight™ and requesting early access.`,
          ``,
          `We've received your request and will be in touch soon with more information.`,
          ``,
          `Best regards,`,
          `The Cognitive Insight Team`,
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Thank you for your interest in Cognitive Insight™</h2>
            <p>Hi ${name},</p>
            <p>Thank you for your interest in <strong>Cognitive Insight™</strong> and requesting early access.</p>
            <p>We've received your request and will be in touch soon with more information.</p>
            <p>Best regards,<br>The Cognitive Insight Team</p>
          </div>
        `,
      };
      await sgMail.send(autoReply);
      console.log("Auto-reply sent");
    } catch (err) {
      console.error("Error sending emails:", err);
      // Swallow to avoid retries storm on transient email failures
    }
  }
);
