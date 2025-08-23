// src/app/api/admin/early-access/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "../../../../lib/firebase-admin";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Simple API key authentication (replace with your preferred auth)
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.ADMIN_API_KEY;
  
  if (!validApiKey) {
    console.warn('ADMIN_API_KEY not set in environment variables');
    return false;
  }
  
  return apiKey === validApiKey;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Firebase Admin instances
    const { db } = getFirebaseAdmin();

    // Check if database is available
    if (!db) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const startAfter = searchParams.get('startAfter');

    // Build query
    let query = db.collection("early_access")
      .orderBy("submittedAt", "desc");

    if (status) {
      query = query.where("status", "==", status);
    }

    if (startAfter) {
      const lastDoc = await db.collection("early_access").doc(startAfter).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(Math.min(limit, 100)); // Max 100 records

    // Execute query
    const snapshot = await query.get();
    const submissions = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || null
    }));

    // Get total count (for pagination)
    const totalSnapshot = await db.collection("early_access").count().get();
    const total = totalSnapshot.data().count;

    return NextResponse.json({
      submissions,
      total,
      count: submissions.length,
      hasMore: submissions.length === limit
    });

  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update submission status
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Firebase Admin instances
    const { db } = getFirebaseAdmin();

    // Check if database is available
    if (!db) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    const { id, status, notes } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'contacted', 'pilot', 'declined'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update document
    const updateData: any = {
      status,
      lastUpdated: new Date()
    };

    if (notes) {
      updateData.adminNotes = notes;
    }

    await db.collection("early_access").doc(id).update(updateData);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Admin update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Export submissions as CSV
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Firebase Admin instances
    const { db } = getFirebaseAdmin();

    // Check if database is available
    if (!db) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    const snapshot = await db.collection("early_access")
      .orderBy("submittedAt", "desc")
      .get();

    const csvHeaders = [
      'Email',
      'Name', 
      'Use Case',
      'Status',
      'Submitted At',
      'IP Address',
      'Source'
    ].join(',');

    const csvRows = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return [
        `"${data.email || ''}"`,
        `"${data.name || ''}"`,
        `"${(data.useCase || '').replace(/"/g, '""')}"`,
        `"${data.status || 'pending'}"`,
        `"${data.submittedAt?.toDate?.()?.toISOString() || ''}"`,
        `"${data.ipAddress || ''}"`,
        `"${data.source || 'website'}"`
      ].join(',');
    });

    const csvContent = [csvHeaders, ...csvRows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="early-access-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
