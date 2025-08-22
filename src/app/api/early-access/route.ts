// src/app/api/early-access/route.ts - Enhanced version
import { NextRequest, NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import "../../../lib/firebase-admin"; // Initialize the admin SDK

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const db = getFirestore();

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

export async function POST(request: NextRequest) {
  try {
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

    // Log successful submission (without sensitive data)
    console.log(`New early access submission: ${docRef.id} from ${cleanEmail}`);

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Thank you! We've received your early access request."
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
