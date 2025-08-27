// src/lib/firebase-functions.ts
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase-client';
import type { PilotRequest } from '@/types/admin';

// Type definitions for function parameters and responses
export interface EarlyAccessData {
  email: string;
  name?: string;
  useCase?: string;
}

export interface PilotRequestData {
  name: string;
  email: string;
  organization: string;
  role?: string;
  sector?: string;
  region?: string;
  description?: string;
  timeline?: string;
  budget?: string;
  complianceRequirements?: string;
  expectedOutcomes?: string;
  source?: string;
  primaryGoals?: string;
}

export interface WhitePaperData {
  name?: string;
  email: string;
  company?: string;
  intent?: string;
}

export interface FunctionResponse {
  success?: boolean;
  ok?: boolean;
  message?: string;
  requestId?: string;
  id?: string;
}

export interface PilotRequestsResponse {
  success: boolean;
  requests: PilotRequest[];
  total: number;
}

export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  phone?: string;
}

export interface SetUserClaimsData {
  uid: string;
  role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
}

export interface CreateAdminData {
  email: string;
  password: string;
  role: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
  displayName?: string;
}

export interface DeleteUserDataData {
  uid: string;
  deleteAuthRecord?: boolean;
}

export interface ContactSubmissionsResponse {
  success: boolean;
  submissions: any[];
  total: number;
}

export interface EarlyAccessSendgridData {
  email: string;
  name?: string;
  useCase?: string;
}

// Lazy initialization of Firebase functions (client-side only)
let functionsInitialized = false;
let submitEarlyAccessFunction: ReturnType<typeof httpsCallable<EarlyAccessData, FunctionResponse>> | null = null;
let submitPilotRequestFunction: ReturnType<typeof httpsCallable<PilotRequestData, FunctionResponse>> | null = null;
let requestWhitePaperFunction: ReturnType<typeof httpsCallable<WhitePaperData, FunctionResponse>> | null = null;
let getPilotRequestsFunction: ReturnType<typeof httpsCallable<Record<string, unknown>, PilotRequestsResponse>> | null = null;
let getContactSubmissionsFunction: ReturnType<typeof httpsCallable<Record<string, unknown>, ContactSubmissionsResponse>> | null = null;
let setUserClaimsFunction: ReturnType<typeof httpsCallable<SetUserClaimsData, FunctionResponse>> | null = null;
let createAdminFunction: ReturnType<typeof httpsCallable<CreateAdminData, FunctionResponse>> | null = null;
let deleteUserDataFunction: ReturnType<typeof httpsCallable<DeleteUserDataData, FunctionResponse>> | null = null;
let submitContactFunction: ReturnType<typeof httpsCallable<ContactSubmissionData, FunctionResponse>> | null = null;
let submitEarlyAccessSendgridFunction: ReturnType<typeof httpsCallable<EarlyAccessSendgridData, FunctionResponse>> | null = null;

async function initializeFunctions() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase functions can only be used on the client side');
  }
  
  if (functionsInitialized) return;
  
  const { functions } = await import('./firebase-client');
  
  submitEarlyAccessFunction = httpsCallable<EarlyAccessData, FunctionResponse>(functions, "submitEarlyAccess");
  submitPilotRequestFunction = httpsCallable<PilotRequestData, FunctionResponse>(functions, "submitPilotRequest");
  requestWhitePaperFunction = httpsCallable<WhitePaperData, FunctionResponse>(functions, "requestWhitePaper");
  getPilotRequestsFunction = httpsCallable<Record<string, unknown>, PilotRequestsResponse>(functions, "getPilotRequests");
  getContactSubmissionsFunction = httpsCallable<Record<string, unknown>, ContactSubmissionsResponse>(functions, "getContactSubmissions");
  setUserClaimsFunction = httpsCallable<SetUserClaimsData, FunctionResponse>(functions, "setUserClaims");
  createAdminFunction = httpsCallable<CreateAdminData, FunctionResponse>(functions, "createAdmin");
  deleteUserDataFunction = httpsCallable<DeleteUserDataData, FunctionResponse>(functions, "deleteUserData");
  submitContactFunction = httpsCallable<ContactSubmissionData, FunctionResponse>(functions, "submitContact");
  submitEarlyAccessSendgridFunction = httpsCallable<EarlyAccessSendgridData, FunctionResponse>(functions, "submitEarlyAccessSendgrid");
  
  functionsInitialized = true;
}

// Service functions
export const firebaseFunctions = {
  submitEarlyAccess: async (data: EarlyAccessData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!submitEarlyAccessFunction) {
        throw new Error('Function not initialized');
      }
      const result = await submitEarlyAccessFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling submitEarlyAccess:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit early access request";
      throw new Error(errorMessage);
    }
  },

  submitPilotRequest: async (data: PilotRequestData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!submitPilotRequestFunction) {
        throw new Error('Function not initialized');
      }
      const result = await submitPilotRequestFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling submitPilotRequest:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit pilot request";
      throw new Error(errorMessage);
    }
  },

  requestWhitePaper: async (data: WhitePaperData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!requestWhitePaperFunction) {
        throw new Error('Function not initialized');
      }
      const result = await requestWhitePaperFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling requestWhitePaper:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to request white paper";
      throw new Error(errorMessage);
    }
  },

  getPilotRequests: async (): Promise<PilotRequestsResponse> => {
    try {
      await initializeFunctions();
      if (!getPilotRequestsFunction) {
        throw new Error('Function not initialized');
      }
      const result = await getPilotRequestsFunction({});
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling getPilotRequests:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get pilot requests";
      throw new Error(errorMessage);
    }
  },

  getContactSubmissions: async (): Promise<ContactSubmissionsResponse> => {
    try {
      await initializeFunctions();
      if (!getContactSubmissionsFunction) {
        throw new Error('Function not initialized');
      }
      const result = await getContactSubmissionsFunction({});
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling getContactSubmissions:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get contact submissions";
      throw new Error(errorMessage);
    }
  },

  setUserClaims: async (data: SetUserClaimsData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!setUserClaimsFunction) {
        throw new Error('Function not initialized');
      }
      const result = await setUserClaimsFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling setUserClaims:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to set user claims";
      throw new Error(errorMessage);
    }
  },

  createAdmin: async (data: CreateAdminData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!createAdminFunction) {
        throw new Error('Function not initialized');
      }
      const result = await createAdminFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling createAdmin:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create admin";
      throw new Error(errorMessage);
    }
  },

  deleteUserData: async (data: DeleteUserDataData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!deleteUserDataFunction) {
        throw new Error('Function not initialized');
      }
      const result = await deleteUserDataFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling deleteUserData:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete user data";
      throw new Error(errorMessage);
    }
  },

  submitContact: async (data: ContactSubmissionData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!submitContactFunction) {
        throw new Error('Function not initialized');
      }
      const result = await submitContactFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling submitContact:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit contact form";
      throw new Error(errorMessage);
    }
  },

  submitEarlyAccessSendgrid: async (data: EarlyAccessSendgridData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      if (!submitEarlyAccessSendgridFunction) {
        throw new Error('Function not initialized');
      }
      const result = await submitEarlyAccessSendgridFunction(data);
      return result.data;
    } catch (error: unknown) {
      console.error("Error calling submitEarlyAccessSendgrid:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit early access request";
      throw new Error(errorMessage);
    }
  }
};
