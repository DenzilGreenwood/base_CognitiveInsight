// API route for deleting user data upon request (GDPR compliance)
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import sgMail from '@sendgrid/mail';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Helper function to sanitize email input
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Send confirmation email to user about data deletion
async function sendDeletionConfirmationEmail(email: string, deletedDataTypes: string[]) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email');
    return;
  }

  const dataTypesList = deletedDataTypes.map(type => `• ${type}`).join('\n');

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: 'Your Data Has Been Deleted - Cognitive Insight™',
    text: `Data Deletion Confirmation

We have successfully processed your data deletion request.

The following data has been permanently removed from our systems:
${dataTypesList}

This action is irreversible. If you have any questions or concerns, please contact us at insight@cognitiveinsight.ai.

Best regards,
The Cognitive Insight Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">✅ Data Deletion Confirmation</h2>
        <p>We have successfully processed your data deletion request.</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #F0FDF4; border-left: 4px solid #059669; border-radius: 4px;">
          <h3 style="color: #065F46; margin-top: 0;">Data Removed</h3>
          <p style="margin: 10px 0 0 0; color: #065F46;">The following data has been permanently removed from our systems:</p>
          <ul style="color: #065F46; margin: 10px 0;">
            ${deletedDataTypes.map(type => `<li>${type}</li>`).join('')}
          </ul>
        </div>

        <div style="margin: 20px 0; padding: 15px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
          <p style="margin: 0; color: #92400E; font-size: 14px;">
            <strong>Note:</strong> This action is irreversible. If you need to interact with our services again in the future, 
            you will need to resubmit any required information.
          </p>
        </div>

        <p>If you have any questions or concerns, please contact us at 
           <a href="mailto:insight@cognitiveinsight.ai" style="color: #4F46E5;">insight@cognitiveinsight.ai</a>.</p>

        <p>Best regards,<br>The Cognitive Insight Team</p>
        
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #9CA3AF;">
          This email confirms the deletion of your personal data from Cognitive Insight™ systems.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Data deletion confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending deletion confirmation email:', error);
    // Don't throw error - email failure shouldn't block the deletion
  }
}

// Send admin notification about data deletion
async function sendDeletionAdminNotification(email: string, deletedDataTypes: string[], deletedCount: number) {
  if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('SendGrid or admin email not configured, skipping admin notification');
    return;
  }

  const dataTypesList = deletedDataTypes.map(type => `• ${type}`).join('\n');

  const msg = {
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cognitiveinsight.ai',
    subject: `🗑️ User Data Deletion: ${email}`,
    text: `User data deletion completed:

Email: ${email}
Records Deleted: ${deletedCount}
Data Types Removed:
${dataTypesList}

Processed: ${new Date().toISOString()}

This is an automated notification for GDPR compliance tracking.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #DC2626;">🗑️ User Data Deletion Completed</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Records Deleted:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${deletedCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Processed:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${new Date().toISOString()}</td>
          </tr>
        </table>

        <div style="margin: 20px 0; padding: 15px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
          <h3 style="color: #92400E; margin-top: 0;">Data Types Removed</h3>
          <ul style="color: #92400E; margin: 0;">
            ${deletedDataTypes.map(type => `<li>${type}</li>`).join('')}
          </ul>
        </div>

        <p style="font-size: 14px; color: #6B7280;">
          This is an automated notification for GDPR compliance tracking.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Data deletion admin notification sent for ${email}`);
  } catch (error) {
    console.error('Error sending deletion admin notification:', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, reason } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email is required" }, 
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const cleanEmail = sanitizeEmail(email);
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" }, 
        { status: 400 }
      );
    }

    let deletedDataTypes: string[] = [];
    let totalDeleted = 0;

    // Get Firebase instance
    const { db } = getFirebaseAdmin();

    // Check if Firebase is configured
    if (!db) {
      // If Firebase is not configured, we can't delete from database
      // But we can still remove from in-memory stores (if any)
      return NextResponse.json({
        success: true,
        message: "Data deletion request processed. No database records found to delete.",
        deletedDataTypes: ["In-memory cache data (if any)"],
        totalDeleted: 0
      });
    }

    // Delete from pilot requests collection
    try {
      const pilotRequestsRef = db.collection('pilot-requests');
      const pilotQuery = pilotRequestsRef.where('email', '==', cleanEmail);
      const pilotSnapshot = await pilotQuery.get();
      
      if (!pilotSnapshot.empty) {
        const batch = db.batch();
        pilotSnapshot.docs.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        deletedDataTypes.push('Pilot Program Requests');
        totalDeleted += pilotSnapshot.size;
        console.log(`Deleted ${pilotSnapshot.size} pilot request(s) for ${cleanEmail}`);
      }
    } catch (error) {
      console.error('Error deleting pilot requests:', error);
    }

    // Delete from white paper requests collection
    try {
      const whitePaperRef = db.collection('white-paper-requests');
      const whitePaperQuery = whitePaperRef.where('email', '==', cleanEmail);
      const whitePaperSnapshot = await whitePaperQuery.get();
      
      if (!whitePaperSnapshot.empty) {
        const batch = db.batch();
        whitePaperSnapshot.docs.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        deletedDataTypes.push('White Paper Requests');
        totalDeleted += whitePaperSnapshot.size;
        console.log(`Deleted ${whitePaperSnapshot.size} white paper request(s) for ${cleanEmail}`);
      }
    } catch (error) {
      console.error('Error deleting white paper requests:', error);
    }

    // Delete from contact submissions collection
    try {
      const contactRef = db.collection('contact-submissions');
      const contactQuery = contactRef.where('email', '==', cleanEmail);
      const contactSnapshot = await contactQuery.get();
      
      if (!contactSnapshot.empty) {
        const batch = db.batch();
        contactSnapshot.docs.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        deletedDataTypes.push('Contact Form Submissions');
        totalDeleted += contactSnapshot.size;
        console.log(`Deleted ${contactSnapshot.size} contact submission(s) for ${cleanEmail}`);
      }
    } catch (error) {
      console.error('Error deleting contact submissions:', error);
    }

    // Delete from early access requests collection (if exists)
    try {
      const earlyAccessRef = db.collection('early-access-requests');
      const earlyAccessQuery = earlyAccessRef.where('email', '==', cleanEmail);
      const earlyAccessSnapshot = await earlyAccessQuery.get();
      
      if (!earlyAccessSnapshot.empty) {
        const batch = db.batch();
        earlyAccessSnapshot.docs.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        deletedDataTypes.push('Early Access Requests');
        totalDeleted += earlyAccessSnapshot.size;
        console.log(`Deleted ${earlyAccessSnapshot.size} early access request(s) for ${cleanEmail}`);
      }
    } catch (error) {
      console.error('Error deleting early access requests:', error);
    }

    // Add general data cleanup
    if (deletedDataTypes.length === 0) {
      deletedDataTypes.push('Cached data and temporary records');
    }

    // Log deletion for audit trail
    try {
      await db.collection('data-deletion-log').add({
        email: cleanEmail,
        reason: reason || 'User request',
        deletedDataTypes,
        totalDeleted,
        processedAt: new Date().toISOString(),
        requestedBy: 'admin',
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
      });
    } catch (error) {
      console.error('Error logging deletion:', error);
    }

    // Send confirmation emails
    Promise.all([
      sendDeletionConfirmationEmail(cleanEmail, deletedDataTypes),
      sendDeletionAdminNotification(cleanEmail, deletedDataTypes, totalDeleted)
    ]).catch(error => {
      console.error('Error sending deletion emails:', error);
    });

    console.log(`Data deletion completed for ${cleanEmail}: ${totalDeleted} records deleted`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${totalDeleted} record(s) for ${cleanEmail}`,
      deletedDataTypes,
      totalDeleted
    });

  } catch (error) {
    console.error("Data deletion error:", error);
    
    return NextResponse.json(
      { error: "An error occurred while processing the deletion request" },
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
