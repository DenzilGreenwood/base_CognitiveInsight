// Enhanced early access API route with SendGrid email notifications
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "../../../lib/firebase-admin";
import sgMail from '@sendgrid/mail';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Rate limiting helper (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or first request
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Sanitize input helper
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Send confirmation email
async function sendConfirmationEmail(email: string, name: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email');
    return;
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: 'Thank you for your interest in Cognitive Insight™',
    text: `Hi ${name || 'there'},

Thank you for your interest in Cognitive Insight™ and requesting early access.

We've received your request and will be in touch soon with more information about our verifiable AI assurance platform.

Best regards,
The Cognitive Insight Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Thank you for your interest in Cognitive Insight™</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for your interest in <strong>Cognitive Insight™</strong> and requesting early access.</p>
        <p>We've received your request and will be in touch soon with more information about our verifiable AI assurance platform.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">What's Next?</h3>
          <ul style="color: #6B7280;">
            <li>Our team will review your submission</li>
            <li>We'll reach out to schedule a brief intro call</li>
            <li>You'll get early access to our platform preview</li>
          </ul>
        </div>
        <p>Best regards,<br>The Cognitive Insight Team</p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #9CA3AF;">
          This email was sent because you requested early access to Cognitive Insight™ at cognitiveinsight.ai
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error - email failure shouldn't block the submission
  }
}

// Send admin notification
async function sendAdminNotification(submissionData: any) {
  if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('SendGrid or admin email not configured, skipping admin notification');
    return;
  }

  const msg = {
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: `New Early Access Request: ${submissionData.name || submissionData.email}`,
    text: `New early access submission:

Name: ${submissionData.name || 'Not provided'}
Email: ${submissionData.email}
Use Case: ${submissionData.useCase || 'Not provided'}
Source: ${submissionData.source}
IP Address: ${submissionData.ipAddress}
Submitted: ${new Date().toISOString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #DC2626;">New Early Access Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Use Case:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.useCase || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Source:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.source}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">IP Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.ipAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Submitted:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${new Date().toISOString()}</td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Admin notification sent for ${submissionData.email}`);
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw error - email failure shouldn't block the submission
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get Firebase Admin instances
    const { db } = getFirebaseAdmin();
    
    // Check if database is available
    if (!db) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" }, 
        { status: 503 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." }, 
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { email, name, useCase } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Valid email is required" }, 
        { status: 400 }
      );
    }

    // Validate email format
    const cleanEmail = sanitizeInput(email.toLowerCase());
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" }, 
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingSubmission = await db
      .collection("early_access")
      .where("email", "==", cleanEmail)
      .limit(1)
      .get();

    if (!existingSubmission.empty) {
      return NextResponse.json(
        { error: "This email has already been submitted" }, 
        { status: 409 }
      );
    }

    // Prepare data for storage
    const submissionData = {
      email: cleanEmail,
      name: name ? sanitizeInput(String(name)).substring(0, 100) : null,
      useCase: useCase ? sanitizeInput(String(useCase)).substring(0, 500) : null,
      submittedAt: Timestamp.now(),
      source: "website",
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent')?.substring(0, 500) || null,
      status: "pending"
    };

    // Store in Firestore
    const docRef = await db.collection("early_access").add(submissionData);

    // Send emails asynchronously (don't wait for them to complete)
    Promise.all([
      sendConfirmationEmail(cleanEmail, name),
      sendAdminNotification(submissionData)
    ]).catch(error => {
      console.error('Error sending emails:', error);
      // Log but don't fail the request
    });

    // Log successful submission (without sensitive data)
    console.log(`New early access submission: ${docRef.id} from ${cleanEmail}`);

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Thank you! We've received your early access request and sent a confirmation email."
    });

  } catch (error) {
    console.error("Early access submission error:", error);
    
    // Return generic error to avoid information leakage
    return NextResponse.json(
      { error: "An error occurred processing your request. Please try again." },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
