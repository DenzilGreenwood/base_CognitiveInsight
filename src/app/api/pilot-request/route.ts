// Enhanced pilot request API route with SendGrid email notifications and Firebase storage
import { NextRequest, NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Rate limiting helper (simple in-memory store - consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // 3 requests per hour for pilot requests
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

// Check for duplicate pilot request in Firebase
async function checkDuplicatePilotRequest(db: any, email: string): Promise<boolean> {
  if (!db) {
    console.warn('Firebase not available, skipping duplicate check');
    return false;
  }

  try {
    const pilotRequestsRef = db.collection('pilot-requests');
    const snapshot = await pilotRequestsRef.where('email', '==', email).limit(1).get();
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking for duplicate pilot request:', error);
    return false; // Allow request to proceed if check fails
  }
}

// Store pilot request in Firebase
async function storePilotRequest(db: any, submissionData: any): Promise<string | null> {
  if (!db) {
    console.warn('Firebase not available, skipping database storage');
    return null;
  }

  try {
    const pilotRequestsRef = db.collection('pilot-requests');
    const docRef = await pilotRequestsRef.add({
      ...submissionData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending_scoping',
      followUpScheduled: false,
      notes: []
    });

    console.log(`Pilot request stored in Firebase with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error storing pilot request in Firebase:', error);
    throw new Error('Failed to store pilot request in database');
  }
}

// Send pilot request confirmation email
async function sendPilotConfirmation(email: string, name: string, organization: string, pilotScope: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email');
    return;
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: 'Your Cognitive Insight™ Pilot Program Request',
    text: `Hi ${name},

Thank you for your interest in our Cognitive Insight™ pilot program!

We've received your request and our team will reach out within 24-48 hours to schedule a scoping conversation.

Your Request Details:
Organization: ${organization}
Pilot Scope: ${pilotScope || 'To be discussed'}

During our conversation, we'll discuss:
- Your specific use case and requirements
- Technical integration options
- Pilot timeline and success metrics
- Next steps for implementation

We're excited to explore how Cognitive Insight™ can provide verifiable AI assurance for your organization.

Best regards,
The Cognitive Insight Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Your Cognitive Insight™ Pilot Program Request</h2>
        <p>Hi ${name},</p>
        <p>Thank you for your interest in our <strong>Cognitive Insight™</strong> pilot program!</p>
        <p>We've received your request and our team will reach out within 24-48 hours to schedule a scoping conversation.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Your Request Details</h3>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Organization:</strong> ${organization}</p>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Pilot Scope:</strong> ${pilotScope || 'To be discussed'}</p>
        </div>

        <div style="margin: 30px 0; padding: 20px; background-color: #EEF2FF; border-left: 4px solid #4F46E5; border-radius: 4px;">
          <h3 style="color: #374151; margin-top: 0;">During our conversation, we'll discuss:</h3>
          <ul style="color: #6B7280; margin: 0;">
            <li>Your specific use case and requirements</li>
            <li>Technical integration options</li>
            <li>Pilot timeline and success metrics</li>
            <li>Next steps for implementation</li>
          </ul>
        </div>

        <p>We're excited to explore how <strong>Cognitive Insight™</strong> can provide verifiable AI assurance for your organization.</p>

        <p>Best regards,<br>The Cognitive Insight Team</p>
        
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #9CA3AF;">
          This email was sent because you requested pilot program access at cognitiveinsight.ai
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Pilot confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending pilot confirmation email:', error);
    // Don't throw error - email failure shouldn't block the submission
  }
}

// Send admin notification for pilot request
async function sendPilotAdminNotification(submissionData: any) {
  if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('SendGrid or admin email not configured, skipping admin notification');
    return;
  }

  const msg = {
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: `🚀 Pilot Request: ${submissionData.organization} (${submissionData.name})`,
    text: `New pilot program request:

Name: ${submissionData.name}
Email: ${submissionData.email}
Organization: ${submissionData.organization}
Pilot Scope: ${submissionData.pilotScope || 'Not specified'}
Use Case: ${submissionData.useCase || 'Not specified'}
Partnership Agreement: ${submissionData.agreementAccepted ? 'ACCEPTED' : 'NOT ACCEPTED'} on ${submissionData.agreementAcceptedAt}
Source: ${submissionData.source}
IP Address: ${submissionData.ipAddress}
Submitted: ${new Date().toISOString()}
Firebase Document ID: ${submissionData.documentId || 'Not stored'}

This is a high-value lead requiring immediate follow-up for pilot program scoping.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #DC2626;">🚀 New Pilot Program Request</h2>
        <div style="background-color: #DBEAFE; border: 1px solid #3B82F6; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #1E40AF; font-weight: bold;">🎯 High Priority: Pilot Program Request</p>
          <p style="margin: 5px 0 0 0; color: #1E40AF; font-size: 14px;">This lead requires immediate scoping call and pilot program follow-up.</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Organization:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.organization}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Pilot Scope:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.pilotScope || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Use Case:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.useCase || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Partnership Agreement:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #10B981; font-weight: bold;">✓ ACCEPTED</span> on ${new Date(submissionData.agreementAcceptedAt).toLocaleString()}
            </td>
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
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Firebase ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${submissionData.documentId || 'Not stored'}</td>
          </tr>
        </table>

        <div style="margin: 20px 0; padding: 15px; background-color: #F0F9FF; border-radius: 8px;">
          <h3 style="color: #0369A1; margin-top: 0;">Immediate Action Required</h3>
          <ul style="color: #374151; margin: 0;">
            <li><strong>Schedule scoping call within 24 hours</strong></li>
            <li>Prepare pilot program overview materials</li>
            <li>Review organization background and use case</li>
            <li>Prepare technical integration discussion</li>
            <li>Add to CRM as high-priority pilot lead</li>
            <li>Update Firebase document with follow-up notes</li>
          </ul>
        </div>

        <div style="margin: 20px 0; padding: 15px; background-color: #FFFBEB; border-radius: 8px;">
          <p style="margin: 0; color: #92400E; font-size: 14px;">
            <strong>Note:</strong> This request indicates serious interest in pilot participation. 
            Fast response time is critical for conversion. Data is stored in Firebase for tracking.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Pilot admin notification sent for ${submissionData.email}`);
  } catch (error) {
    console.error('Error sending pilot admin notification:', error);
    // Don't throw error - email failure shouldn't block the submission
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Firebase Admin
    const { db } = getFirebaseAdmin();

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
    const { email, name, organization, pilotScope, useCase, source, agreementAccepted } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Valid email is required" }, 
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Name is required for pilot requests" }, 
        { status: 400 }
      );
    }

    if (!organization || typeof organization !== 'string') {
      return NextResponse.json(
        { error: "Organization is required for pilot requests" }, 
        { status: 400 }
      );
    }

    // Validate agreement acceptance
    if (!agreementAccepted || agreementAccepted !== true) {
      return NextResponse.json(
        { error: "You must accept the Pilot Collaboration Agreement to proceed" }, 
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

    // Check for duplicate pilot request in Firebase
    const isDuplicate = await checkDuplicatePilotRequest(db, cleanEmail);
    if (isDuplicate) {
      return NextResponse.json(
        { error: "A pilot request has already been submitted for this email" }, 
        { status: 409 }
      );
    }

    // Prepare data for storage
    const submissionData = {
      email: cleanEmail,
      name: sanitizeInput(String(name)).substring(0, 100),
      organization: sanitizeInput(String(organization)).substring(0, 200),
      pilotScope: pilotScope ? sanitizeInput(String(pilotScope)).substring(0, 500) : null,
      useCase: useCase ? sanitizeInput(String(useCase)).substring(0, 500) : null,
      agreementAccepted: true,
      agreementAcceptedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      source: source || "pilot-request",
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent')?.substring(0, 500) || null,
      type: "pilot_request"
    };

    // Store in Firebase (graceful fallback if not configured)
    let documentId: string | null = null;
    try {
      documentId = await storePilotRequest(db, submissionData);
      if (documentId) {
        console.log(`Pilot request stored in Firebase with ID: ${documentId}`);
      }
    } catch (error) {
      console.warn('Failed to store in Firebase, continuing with email notification:', error);
      // Don't fail the entire request if Firebase storage fails
    }

    // Send emails asynchronously (don't block on email failures)
    Promise.all([
      sendPilotConfirmation(cleanEmail, name, organization, pilotScope),
      sendPilotAdminNotification({ ...submissionData, documentId })
    ]).catch(error => {
      console.error('Error sending pilot request emails:', error);
    });

    // Log successful submission
    if (documentId) {
      console.log(`New pilot request from ${cleanEmail} (${organization}) stored with ID: ${documentId}`);
    } else {
      console.log(`New pilot request from ${cleanEmail} (${organization}) - email sent but not stored (Firebase not configured)`);
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Thank you! We'll reach out within 24-48 hours to schedule a scoping conversation.",
      requestId: documentId,
      stored: !!documentId
    });

  } catch (error) {
    console.error("Pilot request error:", error);
    
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
