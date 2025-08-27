import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  phone?: string;
}

export const submitContact = onCall<ContactSubmissionData>(async (request) => {
  try {
    const { name, email, subject, message, organization, phone } = request.data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new HttpsError('invalid-argument', 'Name, email, subject, and message are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpsError('invalid-argument', 'Invalid email format');
    }

    // Validate message length
    if (message.length > 5000) {
      throw new HttpsError('invalid-argument', 'Message must be less than 5000 characters');
    }

    // Validate name length
    if (name.length > 100) {
      throw new HttpsError('invalid-argument', 'Name must be less than 100 characters');
    }

    // Validate subject length
    if (subject.length > 200) {
      throw new HttpsError('invalid-argument', 'Subject must be less than 200 characters');
    }

    const db = getFirestore();

    // Create contact submission document
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      organization: organization?.trim() || null,
      phone: phone?.trim() || null,
      timestamp: FieldValue.serverTimestamp(),
      status: 'new',
      uid: request.auth?.uid || null,
      ipAddress: request.rawRequest?.ip || null,
      userAgent: request.rawRequest?.headers['user-agent'] || null
    };

    const docRef = await db.collection('contactSubmissions').add(contactData);

    return {
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: docRef.id
    };

  } catch (error) {
    console.error('Error submitting contact form:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to submit contact form');
  }
});
