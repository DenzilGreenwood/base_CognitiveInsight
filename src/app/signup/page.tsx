'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, User, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { UserService } from '@/lib/user-service';
import { SettingsService } from '@/lib/settings-service';

type UserRole = 'regulator' | 'auditor' | 'ai_builder';

const roleOptions = [
  { value: 'regulator', label: 'Regulator', description: 'Platform oversight and compliance monitoring' },
  { value: 'auditor', label: 'Auditor', description: 'Independent verification and assessment' },
  { value: 'ai_builder', label: 'AI Builder', description: 'Platform administration and configuration' }
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    organization: '',
    role: '' as UserRole | '',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminCreationAllowed, setAdminCreationAllowed] = useState(true);
  const [adminLimitReached, setAdminLimitReached] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminCreationStatus();
  }, []);

  const checkAdminCreationStatus = async () => {
    try {
      const [isAllowed, isLimitReached] = await Promise.all([
        SettingsService.isAdminCreationAllowed(),
        SettingsService.isAdminLimitReached()
      ]);
      
      const settings = await SettingsService.getPlatformSettings();
      
      setAdminCreationAllowed(isAllowed);
      setAdminLimitReached(isLimitReached);
      setRequiresApproval(settings.requireApproval);

      // Redirect to home if admin creation is disabled
      if (!isAllowed) {
        setTimeout(() => {
          router.push('/?message=admin-creation-disabled');
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking admin creation status:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!adminCreationAllowed) {
      return 'Admin account creation is currently disabled';
    }

    if (adminLimitReached) {
      return 'Maximum number of admin accounts reached';
    }

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.displayName || !formData.organization || !formData.role) {
      return 'All fields are required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    if (!formData.acceptTerms) {
      return 'You must accept the Terms of Service';
    }
    
    if (!formData.acceptPrivacy) {
      return 'You must accept the Privacy Policy';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // If approval is required, create a request instead of creating the user directly
      if (requiresApproval) {
        await SettingsService.createAdminRequest({
          email: formData.email,
          displayName: formData.displayName,
          organization: formData.organization,
          requestedRole: formData.role as 'regulator' | 'auditor' | 'ai_builder'
        });

        // Redirect to a success page indicating the request was submitted
        router.push('/login?signup=pending');
        return;
      }

      // Create user with Firebase Auth (direct creation)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName
      });

      // Store additional user data in Firestore
      await UserService.createUserProfile({
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        organization: formData.organization,
        role: formData.role as 'regulator' | 'auditor' | 'ai_builder',
        emailVerified: userCredential.user.emailVerified
      });

      // Set Firebase Auth custom claims for admin access
      try {
        const response = await fetch('/api/admin/set-user-claims', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            role: formData.role
          })
        });

        if (!response.ok) {
          console.warn('Failed to set custom claims - user may need to re-login for full admin access');
        }
      } catch (claimsError) {
        console.warn('Failed to set custom claims:', claimsError);
      }

      console.log('User created successfully:', userCredential.user);
      
      // Redirect to login page with success message
      router.push('/login?signup=success');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Please contact support');
          break;
        default:
          setError(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Create User Account
            </CardTitle>
            <p className="text-indigo-200">Join the Cognitive Insight Platform</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Admin Creation Status */}
            {!adminCreationAllowed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-200 text-sm">
                  Admin account creation is currently disabled. Please contact your system administrator.
                </span>
              </motion.div>
            )}

            {adminLimitReached && adminCreationAllowed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 text-sm">
                  Maximum number of admin accounts reached. Contact your system administrator.
                </span>
              </motion.div>
            )}

            {requiresApproval && adminCreationAllowed && !adminLimitReached && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 text-sm">
                  Admin account requests require approval. Your request will be reviewed by an administrator.
                </span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-200 text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-indigo-200">Personal Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                    <Input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="John Doe"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-indigo-200">Organization Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Organization</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                    <Input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      placeholder="Your Organization Name"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Role</label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-gray-900 hover:bg-gray-100">
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-gray-600 text-xs">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-indigo-200">Security</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-indigo-200">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/terms')}
                      className="text-indigo-400 hover:text-white underline"
                    >
                      Terms of Service
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-indigo-200">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/privacy')}
                      className="text-indigo-400 hover:text-white underline"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !adminCreationAllowed || adminLimitReached}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {requiresApproval ? 'Submit Request' : 'Create Admin Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-indigo-300 text-sm">
                Already have an admin account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-indigo-400 hover:text-white font-medium transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="text-indigo-300 hover:text-white text-sm transition-colors"
              >
                ← Back to Home
              </button>
            </div>

            {/* Admin Context */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-200 mb-2">Admin Portal Access</h3>
              <p className="text-xs text-blue-200/70">
                This signup form is specifically for platform administrators who need access to the 
                admin portal for managing pilots, user accounts, and system configuration. 
                {requiresApproval 
                  ? ' Your request will be reviewed and you will be notified of the decision.'
                  : ' Regular platform users and pilot participants do not need to create accounts here.'
                }
              </p>
              {requiresApproval && (
                <p className="text-xs text-yellow-200/70 mt-2">
                  <strong>Note:</strong> Admin approval is required for new accounts. You will receive 
                  an email notification once your request has been processed.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
