import { NextRequest, NextResponse } from 'next/server';
import { ClaimsService } from '@/lib/claims-service';

export async function POST(req: NextRequest) {
  try {
    const body: { uid: string; role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin' } = await req.json();
    const { uid, role } = body;

    if (!uid || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    // Set custom claims based on their role
    await ClaimsService.setAdminClaims(uid, role);

    return NextResponse.json({
      success: true,
      message: 'Custom claims set successfully',
      role: role
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: `Failed to set claims: ${error.message}` },
      { status: 500 }
    );
  }
}
