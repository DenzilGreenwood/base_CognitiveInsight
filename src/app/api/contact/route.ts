// API endpoint for handling contact form submissions
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  subject?: string;
  category?: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare submission data
    const submissionData: ContactFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organization: body.organization?.trim() || '',
      subject: body.subject?.trim() || '',
      category: body.category || 'general',
      message: message.trim(),
      ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      source: body.source || 'contact-form',
    };

    console.log('Processing contact form submission for:', submissionData.email);

    // Store in Firebase (if configured)
    let contactId = null;
    try {
      const { db } = getFirebaseAdmin();
      if (db) {
        const contactRef = await db.collection('contact-submissions').add({
          ...submissionData,
          submittedAt: new Date(),
          createdAt: new Date(),
          status: 'new'
        });
        contactId = contactRef.id;
        console.log(`Contact submission stored in Firebase with ID: ${contactId}`);
      } else {
        console.warn('Firebase not configured - contact submission not stored');
      }
    } catch (firebaseError) {
      console.error('Firebase storage failed:', firebaseError);
      // Continue with email sending even if Firebase fails
    }

    // Send emails if SendGrid is configured
    const emailPromises = [];
    
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Send confirmation email to user
      emailPromises.push(sendConfirmationEmail(submissionData));
      
      // Send notification email to admin
      emailPromises.push(sendAdminNotification(submissionData, contactId));
    } else {
      console.warn('SendGrid not configured - emails not sent');
    }

    // Execute email sending in parallel
    if (emailPromises.length > 0) {
      await Promise.allSettled(emailPromises);
    }

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      contactId
    });

  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process contact form submission",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Send confirmation email to the user
async function sendConfirmationEmail(submissionData: ContactFormData) {
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn('SendGrid from email not configured, skipping user confirmation');
    return;
  }

  try {
    const msg = {
      to: submissionData.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Thank you for contacting Cognitive Insight™',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting us</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Reaching Out!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Dear ${submissionData.name},
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for contacting Cognitive Insight™. We have received your message and will respond within 24 hours.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Your Message Details:</h3>
              <p><strong>Name:</strong> ${submissionData.name}</p>
              <p><strong>Email:</strong> ${submissionData.email}</p>
              ${submissionData.organization ? `<p><strong>Organization:</strong> ${submissionData.organization}</p>` : ''}
              ${submissionData.subject ? `<p><strong>Subject:</strong> ${submissionData.subject}</p>` : ''}
              ${submissionData.category ? `<p><strong>Inquiry Type:</strong> ${submissionData.category}</p>` : ''}
              <p><strong>Message:</strong></p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${submissionData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              In the meantime, feel free to explore:
            </p>
            
            <ul style="font-size: 16px; margin-bottom: 25px;">
              <li><a href="https://cognitiveinsight.ai/pilot-request" style="color: #667eea; text-decoration: none;">Apply for our Pilot Program</a></li>
              <li><a href="https://cognitiveinsight.ai/#whitepaper" style="color: #667eea; text-decoration: none;">Download our White Paper</a></li>
              <li><a href="https://cognitiveinsight.ai/privacy" style="color: #667eea; text-decoration: none;">Review our Privacy Policy</a></li>
            </ul>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 25px 0;">
            
            <p style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">
              Best regards,<br>
              The Cognitive Insight™ Team
            </p>
            
            <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
              This is an automated confirmation email. Please do not reply to this email. 
              If you need immediate assistance, contact us at 
              <a href="mailto:insight@cognitiveinsight.ai" style="color: #667eea;">insight@cognitiveinsight.ai</a>
            </p>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`Contact confirmation email sent to ${submissionData.email}`);
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    throw error;
  }
}

// Send admin notification email
async function sendAdminNotification(submissionData: ContactFormData, contactId: string | null) {
  if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('SendGrid or admin email not configured, skipping admin notification');
    return;
  }

  try {
    const msg = {
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cognitiveinsight.ai',
      subject: `New Contact Form Submission - ${submissionData.category || 'General'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px 0;">${submissionData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${submissionData.email}" style="color: #667eea;">${submissionData.email}</a></td>
                </tr>
                ${submissionData.organization ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Organization:</td>
                  <td style="padding: 8px 0;">${submissionData.organization}</td>
                </tr>
                ` : ''}
                ${submissionData.subject ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0;">${submissionData.subject}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Inquiry Type:</td>
                  <td style="padding: 8px 0;">${submissionData.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Source:</td>
                  <td style="padding: 8px 0;">${submissionData.source}</td>
                </tr>
                ${contactId ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Contact ID:</td>
                  <td style="padding: 8px 0;">${contactId}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Message</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea;">
                ${submissionData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #667eea; margin-top: 0;">Technical Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #6c757d;">
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; width: 120px;">IP Address:</td>
                  <td style="padding: 4px 0;">${submissionData.ipAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold;">User Agent:</td>
                  <td style="padding: 4px 0; word-break: break-all;">${submissionData.userAgent}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold;">Submitted:</td>
                  <td style="padding: 4px 0;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⏱️ Response Required</p>
              <p style="margin: 5px 0 0 0; color: #856404; font-size: 14px;">
                Please respond to this inquiry within 24 hours per our customer service standards.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`Contact admin notification sent for ${submissionData.email}`);
  } catch (error) {
    console.error('Error sending contact admin notification:', error);
    throw error;
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
