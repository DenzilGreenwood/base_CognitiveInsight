'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthUser extends User {
  isAdmin?: boolean;
  pilotId?: string;
  role?: 'regulator' | 'auditor' | 'ai_builder' | 'admin';
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get custom claims to check admin status and pilot participation
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const customClaims = idTokenResult.claims;
        
        const authUser: AuthUser = {
          ...firebaseUser,
          isAdmin: customClaims.admin === true,
          pilotId: customClaims.pilotId as string,
          role: customClaims.role as 'regulator' | 'auditor' | 'ai_builder' | 'admin'
        };
        
        setUser(authUser);
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
