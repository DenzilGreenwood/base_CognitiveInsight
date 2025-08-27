import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  organization: string;
  role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  isActive: boolean;
}

export class UserService {
  /**
   * Create a user profile in Firestore after signup
   */
  static async createUserProfile(userData: Omit<UserProfile, 'createdAt' | 'updatedAt' | 'isActive'>): Promise<void> {
    const userDoc = doc(db, 'users', userData.uid);
    
    const userProfile: UserProfile = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    await setDoc(userDoc, userProfile);
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    
    return null;
  }

  /**
   * Update user profile in Firestore
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userDoc = doc(db, 'users', uid);
    
    await setDoc(userDoc, {
      ...updates,
      updatedAt: new Date()
    }, { merge: true });
  }

  /**
   * Check if user has admin privileges (only owner_admin)
   */
  static async isAdmin(uid: string): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    return profile?.role === 'owner_admin' || false;
  }

  /**
   * Check if user is the system owner (same as isAdmin now)
   */
  static async isOwnerAdmin(uid: string): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    return profile?.role === 'owner_admin' || false;
  }

  /**
   * Check if user has full admin privileges (only owner_admin)
   */
  static async hasFullAdminAccess(uid: string): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    return profile?.role === 'owner_admin' || false;
  }

  /**
   * Get user's pilot access
   */
  static async getPilotAccess(uid: string): Promise<string[]> {
    // This would typically be stored in a separate collection
    // For now, return empty array - to be implemented with pilot management
    return [];
  }
}
