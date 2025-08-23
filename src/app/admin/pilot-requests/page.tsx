"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PilotRequest {
  id: string;
  name: string;
  email: string;
  organization: string;
  pilotScope?: string;
  useCase?: string;
  source: string;
  submittedAt: string;
  status: string;
  followUpScheduled: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export default function PilotRequestsAdmin() {
  const [requests, setRequests] = useState<PilotRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configMessage, setConfigMessage] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    setConfigMessage(null);
    
    try {
      const response = await fetch('/api/admin/pilot-requests');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.requests || []);
        if (data.message) {
          setConfigMessage(data.message);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching pilot requests:', error);
      setError(error instanceof Error ? error.message : 'Failed to load pilot requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_scoping':
        return <Badge variant="default" className="bg-yellow-500">Pending Scoping</Badge>;
      case 'scoping_scheduled':
        return <Badge variant="default" className="bg-blue-500">Scoping Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-green-500">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-gray-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const toggleExpanded = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="ml-3 text-lg">Loading pilot requests...</span>
          </div>
        </div>
      </main>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Pilot Program Requests</h1>
              <p className="text-indigo-200">Manage and track pilot program applications</p>
            </div>
            <Button
              onClick={fetchRequests}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Configuration Message */}
          {configMessage && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-6">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                {configMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Total Requests</p>
                    <p className="text-2xl font-bold">{requests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Pending Scoping</p>
                    <p className="text-2xl font-bold">
                      {requests.filter(r => r.status === 'pending_scoping').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">In Progress</p>
                    <p className="text-2xl font-bold">
                      {requests.filter(r => r.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {configMessage && requests.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Firebase Configuration Required</h3>
                  <p className="text-indigo-200 mb-4">
                    To view and store pilot requests, please configure Firebase Admin SDK with proper credentials.
                  </p>
                  <div className="text-left bg-slate-800/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-indigo-200 mb-2">Required environment variables:</p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• FIREBASE_PROJECT_ID</li>
                      <li>• FIREBASE_CLIENT_EMAIL</li>
                      <li>• FIREBASE_PRIVATE_KEY</li>
                    </ul>
                  </div>
                  <p className="text-sm text-indigo-300">
                    Once configured, pilot requests will be automatically stored and displayed here.
                  </p>
                </CardContent>
              </Card>
            ) : requests.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pilot Requests Yet</h3>
                  <p className="text-indigo-200">
                    Pilot program requests will appear here when submitted through your website.
                  </p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-white flex items-center">
                            <Building2 className="w-5 h-5 mr-2" />
                            {request.organization}
                          </CardTitle>
                          <p className="text-indigo-200 mt-1">
                            {request.name} • {request.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(request.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(request.id)}
                          className="text-indigo-200 hover:text-white"
                        >
                          {expandedRequest === request.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-indigo-200">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(request.submittedAt)}
                      </div>
                      <div className="flex items-center text-sm text-indigo-200">
                        <Mail className="w-4 h-4 mr-2" />
                        Source: {request.source}
                      </div>
                    </div>
                    
                    {request.pilotScope && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Pilot Scope:</h4>
                        <p className="text-indigo-200 text-sm bg-white/5 rounded p-3">
                          {request.pilotScope}
                        </p>
                      </div>
                    )}
                    
                    {expandedRequest === request.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 pt-4 mt-4"
                      >
                        {request.useCase && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-white mb-2">Detailed Use Case:</h4>
                            <p className="text-indigo-200 text-sm bg-white/5 rounded p-3">
                              {request.useCase}
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white font-medium">Request ID:</span>
                            <span className="text-indigo-200 ml-2">{request.id}</span>
                          </div>
                          {request.ipAddress && (
                            <div>
                              <span className="text-white font-medium">IP Address:</span>
                              <span className="text-indigo-200 ml-2">{request.ipAddress}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
