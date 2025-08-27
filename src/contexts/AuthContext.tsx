'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { UserService, UserProfile } from '@/lib/user-service';

interface AuthUser extends User {
  isAdmin?: boolean;
  pilotId?: string;
  role?: 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin';
  organization?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isPilotParticipant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default auth state for non-authenticated routes
    return {
      user: null,
      loading: false,
      login: async () => { throw new Error('Authentication not available on this page'); },
      logout: async () => { throw new Error('Authentication not available on this page'); },
      isAdmin: false,
      isPilotParticipant: false
    };
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get custom claims to check admin status and pilot participation
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const customClaims = idTokenResult.claims;
          
          // Get user profile from Firestore
          const userProfile = await UserService.getUserProfile(firebaseUser.uid);
          
          const authUser: AuthUser = {
            ...firebaseUser,
            isAdmin: customClaims.admin === true || userProfile?.role === 'owner_admin',
            pilotId: customClaims.pilotId as string,
            role: (customClaims.role || userProfile?.role) as 'regulator' | 'auditor' | 'ai_builder' | 'owner_admin',
            organization: userProfile?.organization,
            profile: userProfile || undefined
          };
          
          setUser(authUser);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to basic auth user if profile loading fails
          const authUser: AuthUser = {
            ...firebaseUser,
            isAdmin: false,
            role: 'ai_builder'
          };
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = user?.isAdmin === true;
  const isPilotParticipant = user?.pilotId !== undefined;

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isPilotParticipant
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
