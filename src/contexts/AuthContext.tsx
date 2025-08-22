'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymous: () => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockAuth, setUseMockAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymous = useCallback(async () => {
    try {
      console.log('Attempting anonymous sign-in...');
      await signInAnonymously(auth);
      console.log('Anonymous sign-in successful');
    } catch (error: any) {
      console.error('Error signing in anonymously:', error);
      // In development, use mock auth if anonymous auth fails
      if (process.env.NODE_ENV === 'development' && error.code === 'auth/admin-restricted-operation') {
        console.warn('Using mock authentication for development');
        setUseMockAuth(true);
        const mockUser = {
          uid: 'mock-user-id',
          email: null,
          displayName: null,
          photoURL: null,
          phoneNumber: null,
          providerId: 'anonymous',
          emailVerified: false,
          isAnonymous: true,
          metadata: {} as any,
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: () => Promise.resolve(),
          getIdToken: () => Promise.resolve('mock-token'),
          getIdTokenResult: () => Promise.resolve({} as any),
          reload: () => Promise.resolve(),
          toJSON: () => ({}),
        } as User;
        setUser(mockUser);
        setLoading(false);
        console.log('Mock user created:', mockUser);
        return;
      }
      throw error;
    }
  }, []);

  const signInDemo = async () => {
    try {
      // Demo user credentials
      const email = 'demo@cognitiveinsight.app';
      const password = 'demo123456';
      
      try {
        // Try to sign in with existing demo user
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create demo user if it doesn't exist
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error signing in with demo user:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getIdToken = useCallback(async (): Promise<string | null> => {
    console.log('getIdToken called, useMockAuth:', useMockAuth, 'user:', user?.uid);
    
    if (useMockAuth) {
      // Return a mock token for development
      console.log('Returning mock development token');
      return 'mock-development-token';
    }
    
    if (user) {
      try {
        const token = await user.getIdToken();
        console.log('Got real token:', token?.substring(0, 20) + '...');
        return token;
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    
    console.log('No user available for token');
    return null;
  }, [useMockAuth, user]);

  const value = {
    user,
    loading,
    signInAnonymous,
    signInDemo,
    signOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
