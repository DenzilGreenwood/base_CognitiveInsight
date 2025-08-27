'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NavigationHeader() {
  const router = useRouter();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors"
        >
          <Brain className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold">CognitiveInsight</span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => router.push('/white-paper')}
            className="text-indigo-200 hover:text-white transition-colors"
          >
            White Paper
          </button>
          <button
            onClick={() => router.push('/contact')}
            className="text-indigo-200 hover:text-white transition-colors"
          >
            Contact
          </button>
          <button
            onClick={() => router.push('/privacy')}
            className="text-indigo-200 hover:text-white transition-colors"
          >
            Privacy
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push('/login')}
            variant="ghost"
            size="sm"
            className="text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button
            onClick={() => router.push('/signup')}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
