import { getFirebaseAdmin } from './firebase-admin';

export interface CustomClaims {
  admin?: boolean;
  role?: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
  pilotId?: string;
}

export class ClaimsService {
  /**
   * Check if we're running on the server
   */
  private static isServer(): boolean {
    return typeof window === 'undefined';
  }

  /**
   * Set custom claims for a user
   */
  static async setCustomClaims(uid: string, claims: CustomClaims): Promise<void> {
    if (!this.isServer()) {
      throw new Error('ClaimsService can only be used on the server side');
    }

    const { auth } = getFirebaseAdmin();
    
    if (!auth) {
      throw new Error('Firebase Admin Auth not initialized');
    }

    try {
      await auth.setCustomUserClaims(uid, claims);
      console.log(`Custom claims set for user ${uid}:`, claims);
    } catch (error) {
      console.error('Error setting custom claims:', error);
      throw error;
    }
  }

  /**
   * Set admin claims for a user based on their role
   */
  static async setAdminClaims(uid: string, role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin'): Promise<void> {
    if (!this.isServer()) {
      throw new Error('ClaimsService can only be used on the server side');
    }

    // Only owner_admin gets admin privileges
    const isAdminRole = role === 'owner_admin';
    
    const claims: CustomClaims = {
      admin: isAdminRole,
      role: role
    };

    await this.setCustomClaims(uid, claims);
  }

  /**
   * Remove admin claims from a user
   */
  static async removeAdminClaims(uid: string): Promise<void> {
    if (!this.isServer()) {
      throw new Error('ClaimsService can only be used on the server side');
    }

    const claims: CustomClaims = {
      admin: false,
      role: undefined
    };

    await this.setCustomClaims(uid, claims);
  }

  /**
   * Get current custom claims for a user
   */
  static async getCustomClaims(uid: string): Promise<CustomClaims | null> {
    if (!this.isServer()) {
      throw new Error('ClaimsService can only be used on the server side');
    }

    const { auth } = getFirebaseAdmin();
    
    if (!auth) {
      throw new Error('Firebase Admin Auth not initialized');
    }

    try {
      const userRecord = await auth.getUser(uid);
      return userRecord.customClaims as CustomClaims || null;
    } catch (error) {
      console.error('Error getting custom claims:', error);
      throw error;
    }
  }
}
