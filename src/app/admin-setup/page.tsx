"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, UserPlus, AlertCircle, CheckCircle, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/lib/user-service';
import { SettingsService } from '@/lib/settings-service';

export default function AdminSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<'regulator' | 'auditor' | 'ai_builder' | 'owner_admin'>('regulator');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await UserService.getUserProfile(user.uid);
      setUserProfile(profile);
      
      if (profile?.role && ['regulator', 'auditor', 'ai_builder', 'owner_admin'].includes(profile.role)) {
        setMessage({ 
          type: 'success', 
          text: `You already have admin access as a ${profile.role}!` 
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      // Create or update user profile with admin role
      await UserService.createUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Admin User',
        organization: 'CognitiveInsight.AI',
        role: selectedRole,
        emailVerified: user.emailVerified
      });

      // Set Firebase Auth custom claims for admin access
      try {
        const response = await fetch('/api/admin/set-user-claims', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            role: selectedRole
          })
        });

        if (!response.ok) {
          console.warn('Failed to set custom claims - user may need to re-login for full admin access');
        }
      } catch (claimsError) {
        console.warn('Failed to set custom claims:', claimsError);
      }

      // Initialize default platform settings
      try {
        // If creating owner_admin, disable further admin creation for security
        const disableAdminCreation = selectedRole === 'owner_admin';
        
        await SettingsService.updatePlatformSettings({
          allowAdminCreation: !disableAdminCreation,
          maxAdminUsers: 10,
          requireApproval: false,
          notificationEmail: user.email || ''
        }, user.uid);
        
        if (disableAdminCreation) {
          console.log('Admin creation disabled after creating owner_admin for security');
        }
      } catch (settingsError) {
        console.log('Settings already exist or permission denied, continuing...');
      }

      setMessage({ 
        type: 'success', 
        text: `Success! You now have ${selectedRole} admin access. Redirecting to admin dashboard...` 
      });

      // Reload user profile
      await loadUserProfile();

      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error: any) {
      console.error('Error setting up admin:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to set up admin access' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-200">Loading...</p>
        </div>
      </div>
    );
  }

  const isAlreadyAdmin = userProfile?.role && ['regulator', 'auditor', 'ai_builder', 'owner_admin'].includes(userProfile.role);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-12 h-12 text-indigo-400 mr-4" />
              <h1 className="text-5xl font-bold">Admin Setup</h1>
            </div>
            <p className="text-indigo-200 text-lg">
              Set up your admin access to the Cognitive Insight platform
            </p>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                {message.text}
              </span>
            </motion.div>
          )}

          {/* User Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Current User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-indigo-200 text-sm">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Display Name</p>
                <p className="text-white font-medium">{user.displayName || 'Not set'}</p>
              </div>
              {userProfile && (
                <div>
                  <p className="text-indigo-200 text-sm">Current Role</p>
                  <p className="text-white font-medium capitalize">
                    {userProfile.role || 'No admin role assigned'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Setup */}
          {!isAlreadyAdmin && (
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <UserPlus className="w-6 h-6 mr-2" />
                  Set Up Admin Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Select Admin Role</label>
                  <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="regulator" className="text-white hover:bg-slate-700">
                        <div>
                          <div className="font-medium">Regulator</div>
                          <div className="text-slate-400 text-xs">Full admin access (recommended)</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="auditor" className="text-white hover:bg-slate-700">
                        <div>
                          <div className="font-medium">Auditor</div>
                          <div className="text-slate-400 text-xs">Audit and review access</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="ai_builder" className="text-white hover:bg-slate-700">
                        <div>
                          <div className="font-medium">AI Builder</div>
                          <div className="text-slate-400 text-xs">Platform configuration access</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="owner_admin" className="text-white hover:bg-slate-700">
                        <div>
                          <div className="font-medium">Owner Admin</div>
                          <div className="text-slate-400 text-xs">System owner with full control</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-200 mb-2">About Admin Roles</h3>
                  <ul className="text-xs text-blue-200/70 space-y-1">
                    <li><strong>Regulator:</strong> Complete access to all admin functions</li>
                    <li><strong>Auditor:</strong> View and review access for compliance</li>
                    <li><strong>AI Builder:</strong> Technical administration and configuration</li>
                    <li><strong>Owner Admin:</strong> System owner with full control over settings</li>
                  </ul>
                </div>

                <Button
                  onClick={handleMakeAdmin}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Crown className="w-4 h-4 mr-2" />
                  )}
                  Set Up Admin Access
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Already Admin */}
          {isAlreadyAdmin && (
            <Card className="bg-green-500/10 border-green-500/20 backdrop-blur">
              <CardContent className="p-8 text-center">
                <Crown className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Admin Access Active</h2>
                <p className="text-green-200 mb-6">
                  You have {userProfile.role} admin privileges and can access all admin features.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/admin')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Go to Admin Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push('/admin/settings')}
                    variant="outline"
                    className="w-full border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    Admin Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back to Home */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="text-indigo-300 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
