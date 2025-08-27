import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase-client';

export interface PlatformSettings {
  id: string;
  allowAdminCreation: boolean;
  maxAdminUsers: number;
  requireApproval: boolean;
  notificationEmail: string;
  lastUpdated: Date;
  updatedBy: string;
}

export interface AdminCreationRequest {
  id: string;
  email: string;
  displayName: string;
  organization: string;
  requestedRole: 'regulator' | 'auditor' | 'ai_builder' | "owner_admin";
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  reason?: string;
}

export class SettingsService {
  private static readonly SETTINGS_DOC_ID = 'platform_settings';

  /**
   * Get platform settings
   */
  static async getPlatformSettings(): Promise<PlatformSettings> {
    const settingsDoc = doc(db, 'settings', this.SETTINGS_DOC_ID);
    const docSnap = await getDoc(settingsDoc);
    
    if (docSnap.exists()) {
      return docSnap.data() as PlatformSettings;
    }
    
    // Return default settings if none exist
    const defaultSettings: PlatformSettings = {
      id: this.SETTINGS_DOC_ID,
      allowAdminCreation: true,
      maxAdminUsers: 10,
      requireApproval: false,
      notificationEmail: '',
      lastUpdated: new Date(),
      updatedBy: 'system'
    };

    // Save default settings
    await setDoc(settingsDoc, defaultSettings);
    return defaultSettings;
  }

  /**
   * Update platform settings
   */
  static async updatePlatformSettings(updates: Partial<PlatformSettings>, updatedBy: string): Promise<void> {
    const settingsDoc = doc(db, 'settings', this.SETTINGS_DOC_ID);
    
    await setDoc(settingsDoc, {
      ...updates,
      lastUpdated: new Date(),
      updatedBy
    }, { merge: true });
  }

  /**
   * Check if admin creation is allowed
   */
  static async isAdminCreationAllowed(): Promise<boolean> {
    const settings = await this.getPlatformSettings();
    return settings.allowAdminCreation;
  }

  /**
   * Get current admin count (only owner_admin roles)
   */
  static async getAdminCount(): Promise<number> {
    const usersCollection = collection(db, 'users');
    const adminQuery = query(usersCollection, where('role', '==', 'owner_admin'));
    const querySnapshot = await getDocs(adminQuery);
    return querySnapshot.size;
  }

  /**
   * Check if admin limit is reached
   */
  static async isAdminLimitReached(): Promise<boolean> {
    const settings = await this.getPlatformSettings();
    const currentCount = await this.getAdminCount();
    return currentCount >= settings.maxAdminUsers;
  }

  /**
   * Create admin creation request
   */
  static async createAdminRequest(requestData: Omit<AdminCreationRequest, 'id' | 'status' | 'requestedAt'>): Promise<string> {
    const requestDoc = doc(collection(db, 'admin_requests'));
    const requestId = requestDoc.id;
    
    const request: AdminCreationRequest = {
      ...requestData,
      id: requestId,
      status: 'pending',
      requestedAt: new Date()
    };

    await setDoc(requestDoc, request);
    return requestId;
  }

  /**
   * Get pending admin requests
   */
  static async getPendingAdminRequests(): Promise<AdminCreationRequest[]> {
    const requestsCollection = collection(db, 'admin_requests');
    const pendingQuery = query(requestsCollection, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(pendingQuery);
    
    return querySnapshot.docs.map(doc => doc.data() as AdminCreationRequest);
  }

  /**
   * Process admin request
   */
  static async processAdminRequest(
    requestId: string, 
    status: 'approved' | 'rejected', 
    processedBy: string, 
    reason?: string
  ): Promise<void> {
    const requestDoc = doc(db, 'admin_requests', requestId);
    
    await setDoc(requestDoc, {
      status,
      processedAt: new Date(),
      processedBy,
      reason
    }, { merge: true });
  }
}
