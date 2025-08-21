import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});

export const onLeadCreate = functions.firestore.onDocumentCreated("leads/{id}", async (event) => {
  const lead = event.data?.data();
  if (!lead) return;

  const subject = `New Early Access Lead: ${lead.name}`;
  const msg = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company ?? "-"}`,
    `Notes: ${lead.notes ?? "-"}`,
    `Source: ${lead.source ?? "-"}`,
    `Created: ${new Date().toISOString()}`
  ].join("\n");

  // notify you
  await transporter.sendMail({
    from: `"Cognitive Insight" <no-reply@${process.env.MAIL_FROM_DOMAIN}>`,
    to: process.env.NOTIFY_TO!,
    subject, text: msg,
  });

  // optional: auto-reply to lead
  await transporter.sendMail({
    from: `"Cognitive Insight" <no-reply@${process.env.MAIL_FROM_DOMAIN}>`,
    to: lead.email,
    subject: "Thanks — Early Access request received",
    text: `Hi ${lead.name},\n\nThanks for your interest. We’ll follow up shortly.\n\n— Cognitive Insight`,
  });
});
