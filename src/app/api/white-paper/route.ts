// Enhanced white paper request API route with SendGrid email notifications
import { NextRequest, NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Rate limiting helper (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // 3 requests per hour for white paper requests
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

// Simple duplicate check using in-memory storage (for demo - use database in production)
const submittedEmails = new Set<string>();

// Send white paper confirmation email
async function sendWhitePaperConfirmation(email: string, name: string, organization: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email');
    return;
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: 'Your Cognitive Insight™ White Paper Request',
    text: `Hi ${name || 'there'},

Thank you for your interest in our Cognitive Insight™ white paper.

We've received your request and will review it shortly. Due to the proprietary nature of our technology, we provide the white paper after a brief qualification process.

Our team will reach out within 24-48 hours to:
1. Verify your request details
2. Schedule a brief intro call (optional)
3. Send you the white paper with technical specifications

Organization: ${organization || 'Not specified'}

Best regards,
The Cognitive Insight Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Your Cognitive Insight™ White Paper Request</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for your interest in our <strong>Cognitive Insight™</strong> white paper.</p>
        <p>We've received your request and will review it shortly. Due to the proprietary nature of our technology, we provide the white paper after a brief qualification process.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Next Steps</h3>
          <p style="margin: 0; color: #6B7280;">Our team will reach out within 24-48 hours to:</p>
          <ol style="color: #6B7280; margin: 10px 0;">
            <li>Verify your request details</li>
            <li>Schedule a brief intro call (optional)</li>
            <li>Send you the white paper with technical specifications</li>
          </ol>
        </div>

        ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}

        <div style="margin: 30px 0; padding: 15px; background-color: #EEF2FF; border-left: 4px solid #4F46E5; border-radius: 4px;">
          <p style="margin: 0; color: #374151; font-size: 14px;">
            <strong>Note:</strong> Our white paper contains high-level design specifications and standard alignment details. 
            Cryptographic implementations are withheld for proprietary reasons.
          </p>
        </div>

        <p>Best regards,<br>The Cognitive Insight Team</p>
        
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #9CA3AF;">
          This email was sent because you requested our white paper at cognitiveinsight.ai
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`White paper confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending white paper confirmation email:', error);
    // Don't throw error - email failure shouldn't block the submission
  }
}

// Send admin notification for white paper request
async function sendWhitePaperAdminNotification(submissionData: any) {
  if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('SendGrid or admin email not configured, skipping admin notification');
    return;
  }

  const msg = {
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: `🏷️ White Paper Request: ${submissionData.name || submissionData.email}`,
    text: `New white paper request:

Name: ${submissionData.name || 'Not provided'}
Email: ${submissionData.email}
Organization: ${submissionData.organization || 'Not provided'}
Source: ${submissionData.source}
IP Address: ${submissionData.ipAddress}
Submitted: ${new Date().toISOString()}

This is a qualified lead requiring white paper follow-up.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #DC2626;">🏷️ New White Paper Request</h2>
        <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400E; font-weight: bold;">⚠️ High Priority: White Paper Request</p>
          <p style="margin: 5px 0 0 0; color: #92400E; font-size: 14px;">This lead requires personal follow-up and white paper delivery.</p>
        </div>
        
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
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Organization:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.organization || 'Not provided'}</td>
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

        <div style="margin: 20px 0; padding: 15px; background-color: #EFF6FF; border-radius: 8px;">
          <h3 style="color: #1E40AF; margin-top: 0;">Action Required</h3>
          <ul style="color: #374151; margin: 0;">
            <li>Review organization and qualification</li>
            <li>Schedule intro call if appropriate</li>
            <li>Send white paper via secure method</li>
            <li>Add to CRM for follow-up</li>
          </ul>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`White paper admin notification sent for ${submissionData.email}`);
  } catch (error) {
    console.error('Error sending white paper admin notification:', error);
    // Don't throw error - email failure shouldn't block the submission
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limit (more restrictive for white paper requests)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." }, 
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { email, name, organization, useCase, source } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Valid email is required" }, 
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Name is required for white paper requests" }, 
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

    // Check for duplicate white paper request (using in-memory store for demo)
    if (submittedEmails.has(cleanEmail)) {
      return NextResponse.json(
        { error: "A white paper request has already been submitted for this email" }, 
        { status: 409 }
      );
    }

    // Add to submitted emails (in production, use database)
    submittedEmails.add(cleanEmail);

    // Prepare data for logging/email
    const submissionData = {
      email: cleanEmail,
      name: sanitizeInput(String(name)).substring(0, 100),
      organization: organization ? sanitizeInput(String(organization)).substring(0, 200) : null,
      useCase: useCase ? sanitizeInput(String(useCase)).substring(0, 500) : null,
      submittedAt: new Date().toISOString(),
      source: source || "white-paper",
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent')?.substring(0, 500) || null,
      status: "pending_review",
      type: "white_paper_request"
    };

    // Send emails asynchronously
    Promise.all([
      sendWhitePaperConfirmation(cleanEmail, name, organization),
      sendWhitePaperAdminNotification(submissionData)
    ]).catch(error => {
      console.error('Error sending white paper emails:', error);
    });

    // Log successful submission
    console.log(`New white paper request from ${cleanEmail} (${organization || 'no org'})`);

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Thank you! We'll review your request and email the white paper within 24-48 hours."
    });

  } catch (error) {
    console.error("White paper request error:", error);
    
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
