// src/app/api/early-access-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, appendFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { email, name, useCase } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create lead entry
    const leadEntry = {
      timestamp: new Date().toISOString(),
      email: email.toLowerCase().trim(),
      name: name || null,
      useCase: useCase || null,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Append to CSV file (creates if doesn't exist)
    const csvLine = `${leadEntry.timestamp},"${leadEntry.email}","${leadEntry.name || ''}","${leadEntry.useCase || ''}","${leadEntry.ip}","${leadEntry.userAgent}"\n`;
    const filePath = path.join(process.cwd(), 'data', 'early-access-leads.csv');
    
    try {
      await appendFile(filePath, csvLine);
    } catch (error) {
      // Create directory and file if they don't exist
      const { mkdir } = await import('fs/promises');
      await mkdir(path.dirname(filePath), { recursive: true });
      const header = "timestamp,email,name,useCase,ip,userAgent\n";
      await writeFile(filePath, header + csvLine);
    }

    // Also save as JSON for easier processing
    const jsonPath = path.join(process.cwd(), 'data', 'early-access-leads.json');
    let existingData = [];
    try {
      const { readFile } = await import('fs/promises');
      const content = await readFile(jsonPath, 'utf-8');
      existingData = JSON.parse(content);
    } catch {
      // File doesn't exist, start fresh
    }
    
    existingData.push(leadEntry);
    await writeFile(jsonPath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("File storage error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
