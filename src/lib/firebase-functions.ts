// src/lib/firebase-functions.ts
import { httpsCallable } from "firebase/functions";

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
  requests: any[];
  total: number;
}

// Lazy initialization of Firebase functions (client-side only)
let functionsInitialized = false;
let submitEarlyAccessFunction: any = null;
let submitPilotRequestFunction: any = null;
let requestWhitePaperFunction: any = null;
let getPilotRequestsFunction: any = null;

async function initializeFunctions() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase functions can only be used on the client side');
  }
  
  if (functionsInitialized) return;
  
  const { functions } = await import('./firebase');
  
  submitEarlyAccessFunction = httpsCallable<EarlyAccessData, FunctionResponse>(functions, "submitEarlyAccess");
  submitPilotRequestFunction = httpsCallable<PilotRequestData, FunctionResponse>(functions, "submitPilotRequest");
  requestWhitePaperFunction = httpsCallable<WhitePaperData, FunctionResponse>(functions, "requestWhitePaper");
  getPilotRequestsFunction = httpsCallable<{}, PilotRequestsResponse>(functions, "getPilotRequests");
  
  functionsInitialized = true;
}

// Service functions
export const firebaseFunctions = {
  submitEarlyAccess: async (data: EarlyAccessData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      const result = await submitEarlyAccessFunction(data);
      return result.data;
    } catch (error: any) {
      console.error("Error calling submitEarlyAccess:", error);
      throw new Error(error.message || "Failed to submit early access request");
    }
  },

  submitPilotRequest: async (data: PilotRequestData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      const result = await submitPilotRequestFunction(data);
      return result.data;
    } catch (error: any) {
      console.error("Error calling submitPilotRequest:", error);
      throw new Error(error.message || "Failed to submit pilot request");
    }
  },

  requestWhitePaper: async (data: WhitePaperData): Promise<FunctionResponse> => {
    try {
      await initializeFunctions();
      const result = await requestWhitePaperFunction(data);
      return result.data;
    } catch (error: any) {
      console.error("Error calling requestWhitePaper:", error);
      throw new Error(error.message || "Failed to request white paper");
    }
  },

  getPilotRequests: async (): Promise<PilotRequestsResponse> => {
    try {
      await initializeFunctions();
      const result = await getPilotRequestsFunction({});
      return result.data;
    } catch (error: any) {
      console.error("Error calling getPilotRequests:", error);
      throw new Error(error.message || "Failed to get pilot requests");
    }
  }
};
