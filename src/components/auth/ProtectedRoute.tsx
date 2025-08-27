'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, User, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePilotAccess?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requirePilotAccess = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isPilotParticipant } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete and we know the user state
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Return null while redirecting (don't render anything)
  if (!user) {
    return null;
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 border-white/20 rounded-lg p-8 backdrop-blur max-w-md w-full text-center"
        >
          <div className="p-4 bg-red-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-indigo-200 mb-6">
            You need administrator privileges to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Check pilot access
  if (requirePilotAccess && !isPilotParticipant && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 border-white/20 rounded-lg p-8 backdrop-blur max-w-md w-full text-center"
        >
          <div className="p-4 bg-yellow-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Pilot Access Required</h2>
          <p className="text-indigo-200 mb-6">
            You need to be part of an active pilot program to access this workspace.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/pilot-request')}
              className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Apply for Pilot Program
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
