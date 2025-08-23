// API endpoint to fetch pilot requests from Firebase for admin interface
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
        requests: [],
        total: 0,
        message: "Firebase Admin not configured. Please set up Firebase Admin SDK environment variables to view stored requests."
      });
    }

    // Get all pilot requests from Firebase, ordered by submission date (newest first)
    const pilotRequestsRef = db.collection('pilot-requests');
    const snapshot = await pilotRequestsRef.orderBy('submittedAt', 'desc').get();

    const requests: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      requests.push({
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

    console.log(`Retrieved ${requests.length} pilot requests from Firebase`);

    return NextResponse.json({
      success: true,
      requests,
      total: requests.length
    });

  } catch (error) {
    console.error("Error fetching pilot requests:", error);
    
    // Provide more specific error messages
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json({
        success: false,
        error: "Firebase permissions error. Please check your Firebase Admin SDK configuration.",
        requests: [],
        total: 0
      }, { status: 403 });
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch pilot requests from Firebase",
        details: error instanceof Error ? error.message : 'Unknown error',
        requests: [],
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
