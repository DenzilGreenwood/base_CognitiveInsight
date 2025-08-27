import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserService } from '@/lib/user-service';
import { SettingsService } from '@/lib/settings-service';
import { ClaimsService } from '@/lib/claims-service';

export async function POST(req: NextRequest) {
  try {
    const body: { requestId: string; adminUid: string } = await req.json();
    const { requestId, adminUid } = body;

    if (!requestId || !adminUid) {
      return NextResponse.json(
        { error: 'Request ID and admin UID are required' },
        { status: 400 }
      );
    }

    // Get the admin request details
    const adminRequests = await SettingsService.getPendingAdminRequests();
    const adminRequest = adminRequests.find(req => req.id === requestId);

    if (!adminRequest) {
      return NextResponse.json(
        { error: 'Admin request not found' },
        { status: 404 }
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

    // Create the user account
    try {
      // Generate a temporary password - in production, you might want to send this via email
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
      
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        adminRequest.email, 
        tempPassword
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: adminRequest.displayName
      });

      // Create user profile in Firestore
      await UserService.createUserProfile({
        uid: userCredential.user.uid,
        email: adminRequest.email,
        displayName: adminRequest.displayName,
        organization: adminRequest.organization,
        role: adminRequest.requestedRole as 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin',
        emailVerified: false
      });

      // Set Firebase Auth custom claims for admin access
      await ClaimsService.setAdminClaims(
        userCredential.user.uid,
        adminRequest.requestedRole as 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin'
      );

      // If creating owner_admin, disable further admin creation for security
      if (adminRequest.requestedRole === 'owner_admin') {
        try {
          const currentSettings = await SettingsService.getPlatformSettings();
          await SettingsService.updatePlatformSettings({
            ...currentSettings,
            allowAdminCreation: false
          }, adminUid);
          console.log('Admin creation disabled after creating owner_admin for security');
        } catch (settingsError) {
          console.warn('Failed to disable admin creation:', settingsError);
        }
      }

      // Mark the request as approved
      await SettingsService.processAdminRequest(
        requestId,
        'approved',
        adminUid,
        'Account created successfully'
      );

      return NextResponse.json({
        success: true,
        message: 'Admin account created successfully',
        tempPassword,
        userId: userCredential.user.uid
      });

    } catch (firebaseError: any) {
      console.error('Firebase error:', firebaseError);
      
      // Mark the request as rejected due to creation failure
      await SettingsService.processAdminRequest(
        requestId,
        'rejected',
        adminUid,
        `Account creation failed: ${firebaseError.message}`
      );

      return NextResponse.json(
        { error: `Failed to create account: ${firebaseError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
