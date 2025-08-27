import { NextRequest, NextResponse } from 'next/server';
import { ClaimsService } from '@/lib/claims-service';
import { UserService } from '@/lib/user-service';

export async function POST(req: NextRequest) {
  try {
    const body: { uid: string; adminUid: string } = await req.json();
    const { uid, adminUid } = body;

    if (!uid || !adminUid) {
      return NextResponse.json(
        { error: 'User ID and admin UID are required' },
        { status: 400 }
      );
    }

    // Verify the requesting user is an admin
    const isAdmin = await UserService.isAdmin(adminUid);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Get user profile to determine their role
    const userProfile = await UserService.getUserProfile(uid);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Set custom claims based on their role
    await ClaimsService.setAdminClaims(uid, userProfile.role);

    return NextResponse.json({
      success: true,
      message: 'Custom claims updated successfully',
      role: userProfile.role
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: `Failed to update claims: ${error.message}` },
      { status: 500 }
    );
  }
}
