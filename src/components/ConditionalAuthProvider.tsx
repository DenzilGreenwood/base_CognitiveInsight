'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';

interface ConditionalAuthProviderProps {
  children: React.ReactNode;
}

export function ConditionalAuthProvider({ children }: ConditionalAuthProviderProps) {
  const pathname = usePathname();
  
  // Define routes that need authentication
  const authRequiredRoutes = [
    '/admin',
    '/pilot-workspace'

  ];
  
  // Check if current route requires authentication
  const needsAuth = authRequiredRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If authentication is needed, wrap with AuthProvider
  if (needsAuth) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
  
  // For public routes, return children without AuthProvider
  return <>{children}</>;
}
