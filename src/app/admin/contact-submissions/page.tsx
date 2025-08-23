"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  Building2, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Tag,
  User,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  organization?: string;
  subject?: string;
  category: string;
  message: string;
  source: string;
  submittedAt: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function ContactSubmissionsAdmin() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configMessage, setConfigMessage] = useState<string | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    setConfigMessage(null);
    
    try {
      const response = await fetch('/api/admin/contact-submissions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions || []);
        if (data.message) {
          setConfigMessage(data.message);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      general: { color: 'bg-gray-500', label: 'General' },
      pilot: { color: 'bg-blue-500', label: 'Pilot Program' },
      technical: { color: 'bg-green-500', label: 'Technical' },
      partnership: { color: 'bg-purple-500', label: 'Partnership' },
      media: { color: 'bg-yellow-500', label: 'Media' },
      support: { color: 'bg-red-500', label: 'Support' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;
    return <Badge variant="default" className={config.color}>{config.label}</Badge>;
  };

  const toggleExpanded = (submissionId: string) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  const getSubmissionsByCategory = () => {
    const categories = submissions.reduce((acc, submission) => {
      acc[submission.category] = (acc[submission.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return categories;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="ml-3 text-lg">Loading contact submissions...</span>
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
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-indigo-200 hover:text-white mb-4 p-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-4xl font-bold mb-2">Contact Submissions</h1>
              <p className="text-indigo-200">Manage and track contact form submissions</p>
            </div>
            <Button
              onClick={fetchSubmissions}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Total Submissions</p>
                    <p className="text-2xl font-bold">{submissions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Today</p>
                    <p className="text-2xl font-bold">
                      {submissions.filter(s => {
                        const today = new Date().toDateString();
                        const subDate = new Date(s.submittedAt).toDateString();
                        return today === subDate;
                      }).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Tag className="w-8 h-8 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Most Common</p>
                    <p className="text-lg font-bold">
                      {Object.entries(getSubmissionsByCategory()).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Building2 className="w-8 h-8 text-purple-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">With Organization</p>
                    <p className="text-2xl font-bold">
                      {submissions.filter(s => s.organization && s.organization.trim()).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {configMessage && submissions.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Firebase Configuration Required</h3>
                  <p className="text-indigo-200 mb-4">
                    To view and store contact submissions, please configure Firebase Admin SDK with proper credentials.
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
                    Once configured, contact submissions will be automatically stored and displayed here.
                  </p>
                </CardContent>
              </Card>
            ) : submissions.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Contact Submissions Yet</h3>
                  <p className="text-indigo-200">
                    Contact form submissions will appear here when submitted through your website.
                  </p>
                </CardContent>
              </Card>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-white flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            {submission.name}
                            {submission.organization && (
                              <span className="text-indigo-300 ml-2 font-normal">
                                • {submission.organization}
                              </span>
                            )}
                          </CardTitle>
                          <p className="text-indigo-200 mt-1 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {submission.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getCategoryBadge(submission.category)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(submission.id)}
                          className="text-indigo-200 hover:text-white"
                        >
                          {expandedSubmission === submission.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-indigo-200">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(submission.submittedAt)}
                      </div>
                      <div className="flex items-center text-sm text-indigo-200">
                        <Tag className="w-4 h-4 mr-2" />
                        Source: {submission.source}
                      </div>
                    </div>
                    
                    {submission.subject && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Subject:</h4>
                        <p className="text-indigo-200 text-sm bg-white/5 rounded p-3">
                          {submission.subject}
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-semibold text-white mb-2">Message:</h4>
                      <p className="text-indigo-200 text-sm bg-white/5 rounded p-3">
                        {submission.message}
                      </p>
                    </div>
                    
                    {expandedSubmission === submission.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 pt-4 mt-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white font-medium">Submission ID:</span>
                            <span className="text-indigo-200 ml-2">{submission.id}</span>
                          </div>
                          {submission.ipAddress && (
                            <div>
                              <span className="text-white font-medium">IP Address:</span>
                              <span className="text-indigo-200 ml-2">{submission.ipAddress}</span>
                            </div>
                          )}
                        </div>
                        
                        {submission.userAgent && (
                          <div className="mt-3 text-sm">
                            <span className="text-white font-medium">User Agent:</span>
                            <p className="text-indigo-200 text-xs mt-1 bg-white/5 rounded p-2 break-all">
                              {submission.userAgent}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject || 'Your inquiry'}`)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Reply via Email
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Navigation Links */}
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/pilot-requests')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              View Pilot Requests
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
