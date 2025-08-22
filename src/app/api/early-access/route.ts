// src/app/api/early-access/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import "../../../lib/firebase-admin"; // Initialize the admin SDK

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { email, name, useCase } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await db.collection("early_access").add({
      email,
      name: name || null,
      useCase: useCase || null,
      createdAt: new Date()
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Early access submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
