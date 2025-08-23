// API endpoint to fetch contact submissions from Firebase for admin interface
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from '@/lib/firebase-admin';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Initialize Firebase Admin
    const { db } = getFirebaseAdmin();

    if (!db) {
      console.warn('Firebase Admin not configured - returning empty results');
      return NextResponse.json({
        success: true,
        submissions: [],
        total: 0,
        message: "Firebase Admin not configured. Please set up Firebase Admin SDK environment variables to view stored contact submissions."
      });
    }

    // Get all contact submissions from Firebase, ordered by submission date (newest first)
    const contactSubmissionsRef = db.collection('contact-submissions');
    const snapshot = await contactSubmissionsRef.orderBy('submittedAt', 'desc').get();

    const submissions: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to ISO string if needed
        submittedAt: data.submittedAt instanceof Date 
          ? data.submittedAt.toISOString() 
          : data.submittedAt,
        createdAt: data.createdAt instanceof Date 
          ? data.createdAt.toISOString() 
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Date 
          ? data.updatedAt.toISOString() 
          : data.updatedAt,
      });
    });

    console.log(`Retrieved ${submissions.length} contact submissions from Firebase`);

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length
    });

  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    
    // Provide more specific error messages
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json({
        success: false,
        error: "Firebase permissions error. Please check your Firebase Admin SDK configuration.",
        submissions: [],
        total: 0
      }, { status: 403 });
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch contact submissions from Firebase",
        details: error instanceof Error ? error.message : 'Unknown error',
        submissions: [],
        total: 0
      },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
