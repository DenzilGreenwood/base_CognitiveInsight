// src/app/api/early-access-supabase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, name, useCase } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('early_access')
      .insert([{
        email: email.toLowerCase().trim(),
        name: name || null,
        use_case: useCase || null,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Early access submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
