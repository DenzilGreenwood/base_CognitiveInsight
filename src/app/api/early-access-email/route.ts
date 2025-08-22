// src/app/api/early-access-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email-only solution - no database needed
export async function POST(request: NextRequest) {
  try {
    const { email, name, useCase } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create email transporter (use your preferred email service)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to yourself with the lead info
    const emailContent = `
      New Early Access Request:
      
      Email: ${email}
      Name: ${name || 'Not provided'}
      Use Case: ${useCase || 'Not provided'}
      Timestamp: ${new Date().toISOString()}
      
      IP: ${request.headers.get('x-forwarded-for') || 'Unknown'}
      User Agent: ${request.headers.get('user-agent') || 'Unknown'}
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_TO,
      subject: `New Early Access Request - ${email}`,
      text: emailContent,
    });

    // Optional: Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Thanks for your interest in Cognitive Insight™",
      text: `Hi ${name || 'there'},

Thank you for requesting early access to Cognitive Insight™. 

We're building the future of verifiable AI auditability without exposing sensitive models or data. Your interest helps us prioritize development and pilot opportunities.

We'll be in touch soon to discuss how our cryptographic clarity solution can help bridge the gap between regulators, auditors, and AI companies.

Best regards,
The Cognitive Insight Team

---
This is an automated response. Please don't reply to this email.`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Email submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
