"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Shield, 
  Save, 
  AlertCircle,
  CheckCircle,
  UserPlus,
  UserX,
  Mail,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { SettingsService, PlatformSettings, AdminCreationRequest } from '@/lib/settings-service';
import { UserService } from '@/lib/user-service';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [adminRequests, setAdminRequests] = useState<AdminCreationRequest[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasSettingsAccess, setHasSettingsAccess] = useState(false);

  useEffect(() => {
    checkAccessAndLoadData();
  }, [user]);

  const checkAccessAndLoadData = async () => {
    if (!user) return;
    
    try {
      // Check if user has settings access (only owner_admin)
      const isOwnerAdmin = await UserService.isOwnerAdmin(user.uid);
      setHasSettingsAccess(isOwnerAdmin);
      
      if (isOwnerAdmin) {
        await loadData();
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [settingsData, requestsData, countData] = await Promise.all([
        SettingsService.getPlatformSettings(),
        SettingsService.getPendingAdminRequests(),
        SettingsService.getAdminCount()
      ]);

      setSettings(settingsData);
      setAdminRequests(requestsData);
      setAdminCount(countData);
    } catch (error) {
      console.error('Error loading admin settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings || !user) return;

    setSaving(true);
    try {
      await SettingsService.updatePlatformSettings(settings, user.uid);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleProcessRequest = async (requestId: string, status: 'approved' | 'rejected', reason?: string) => {
    if (!user) return;

    try {
      if (status === 'approved') {
        // Call the API to create the admin account
        const response = await fetch('/api/admin/create-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId,
            adminUid: user.uid
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage({ 
            type: 'success', 
            text: `Admin account created successfully. Temporary password: ${result.tempPassword}` 
          });
          setTimeout(() => setMessage(null), 10000); // Clear after 10 seconds for security
        } else {
          setMessage({ 
            type: 'error', 
            text: result.error || 'Failed to create admin account' 
          });
          setTimeout(() => setMessage(null), 5000);
        }
      } else {
        // Just reject the request without creating an account
        await SettingsService.processAdminRequest(requestId, status, user.uid, reason);
        setMessage({ 
          type: 'success', 
          text: `Request ${status} successfully` 
        });
        setTimeout(() => setMessage(null), 3000);
      }
      
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error processing request:', error);
      setMessage({ type: 'error', text: 'Failed to process request' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateSetting = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (!hasSettingsAccess && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-red-200 mb-4">You need Owner Admin or Regulator privileges to access settings</p>
          <Button onClick={() => window.history.back()} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-200">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Settings className="w-12 h-12 text-indigo-400 mr-4" />
              <h1 className="text-5xl font-bold">Admin Settings</h1>
            </div>
            <p className="text-indigo-200 text-lg">
              Manage platform configuration and admin access
            </p>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-lg flex items-start space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
              )}
              <div className={`${message.type === 'success' ? 'text-green-200' : 'text-red-200'} text-sm`}>
                {message.text.includes('Temporary password:') ? (
                  <div>
                    <div>{message.text.split('Temporary password:')[0]}</div>
                    <div className="mt-2 p-2 bg-black/20 rounded font-mono text-xs">
                      <strong>Temporary Password:</strong> {message.text.split('Temporary password:')[1].trim()}
                    </div>
                    <div className="mt-2 text-xs opacity-75">
                      Please share this password securely with the new admin. They should change it upon first login.
                    </div>
                  </div>
                ) : (
                  message.text
                )}
              </div>
            </motion.div>
          )}

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm text-indigo-200">Current Admins</p>
                    <p className="text-2xl font-bold text-white">{adminCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm text-indigo-200">Pending Requests</p>
                    <p className="text-2xl font-bold text-white">{adminRequests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm text-indigo-200">Creation Status</p>
                    <p className="text-lg font-bold text-white">
                      {settings.allowAdminCreation ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Admin Creation Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="allowAdminCreation" className="text-white font-medium">
                    Allow Admin Creation
                  </Label>
                  <p className="text-sm text-indigo-200">
                    Enable or disable the ability to create new owner_admin accounts.
                    <br />
                    <span className="text-yellow-300">Security: Automatically disabled after creating first owner_admin.</span>
                  </p>
                </div>
                <Switch
                  id="allowAdminCreation"
                  checked={settings.allowAdminCreation}
                  onCheckedChange={(checked) => updateSetting('allowAdminCreation', checked)}
                />
              </div>

              {/* Max Admin Users */}
              <div className="space-y-2">
                <Label htmlFor="maxAdminUsers" className="text-white font-medium">
                  Maximum Admin Users
                </Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="maxAdminUsers"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxAdminUsers}
                    onChange={(e) => updateSetting('maxAdminUsers', parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white w-32"
                  />
                  <p className="text-sm text-indigo-200">
                    Current: {adminCount} / {settings.maxAdminUsers}
                  </p>
                </div>
              </div>

              {/* Require Approval */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="requireApproval" className="text-white font-medium">
                    Require Approval
                  </Label>
                  <p className="text-sm text-indigo-200">
                    Require manual approval for new admin accounts
                  </p>
                </div>
                <Switch
                  id="requireApproval"
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) => updateSetting('requireApproval', checked)}
                />
              </div>

              {/* Notification Email */}
              <div className="space-y-2">
                <Label htmlFor="notificationEmail" className="text-white font-medium">
                  Notification Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                  <Input
                    id="notificationEmail"
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => updateSetting('notificationEmail', e.target.value)}
                    placeholder="admin@yourcompany.com"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                  />
                </div>
                <p className="text-sm text-indigo-200">
                  Email address to receive admin creation notifications
                </p>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {saving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          {adminRequests.length > 0 && (
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Pending Admin Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-medium">{request.displayName}</h3>
                          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                            {request.requestedRole}
                          </Badge>
                        </div>
                        <p className="text-indigo-200 text-sm">{request.email}</p>
                        <p className="text-indigo-200 text-sm">{request.organization}</p>
                        <p className="text-indigo-300 text-xs">
                          Requested: {request.requestedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleProcessRequest(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProcessRequest(request.id, 'rejected', 'Request denied')}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </main>
  );
}
