'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Settings,
  BarChart3,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Pilot {
  id: string;
  name: string;
  organization: string;
  status: 'ONBOARDING' | 'SCOPING' | 'IMPL' | 'VALIDATION' | 'SYNTHESIS' | 'CLOSEOUT';
  participants: number;
  progress: number;
  createdAt: string;
  dueDate?: string;
  phase: string;
  metrics: {
    storageDelta: number;
    p95VerifyMs: number;
    milestonesCompleted: number;
    totalMilestones: number;
  };
}

export default function ActivePilotsAdmin() {
  const router = useRouter();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockPilots: Pilot[] = [
      {
        id: 'pilot_001',
        name: 'Financial Audit Verification Pilot',
        organization: 'Global Bank Corp',
        status: 'IMPL',
        participants: 3,
        progress: 65,
        createdAt: '2025-08-01',
        dueDate: '2025-10-15',
        phase: 'Implementation',
        metrics: {
          storageDelta: 12.5,
          p95VerifyMs: 450,
          milestonesCompleted: 4,
          totalMilestones: 6
        }
      },
      {
        id: 'pilot_002',
        name: 'Healthcare Regulatory Compliance',
        organization: 'Metro Health System',
        status: 'VALIDATION',
        participants: 4,
        progress: 85,
        createdAt: '2025-07-15',
        dueDate: '2025-09-30',
        phase: 'Validation',
        metrics: {
          storageDelta: 18.2,
          p95VerifyMs: 380,
          milestonesCompleted: 5,
          totalMilestones: 6
        }
      },
      {
        id: 'pilot_003',
        name: 'Insurance Claims AI Audit',
        organization: 'InsuranceCo',
        status: 'SCOPING',
        participants: 2,
        progress: 25,
        createdAt: '2025-08-20',
        dueDate: '2025-11-01',
        phase: 'Scoping',
        metrics: {
          storageDelta: 0,
          p95VerifyMs: 0,
          milestonesCompleted: 1,
          totalMilestones: 6
        }
      }
    ];
    
    setPilots(mockPilots);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      ONBOARDING: 'bg-blue-500',
      SCOPING: 'bg-yellow-500',
      IMPL: 'bg-purple-500',
      VALIDATION: 'bg-green-500',
      SYNTHESIS: 'bg-indigo-500',
      CLOSEOUT: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="ml-3 text-lg">Loading active pilots...</span>
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
              <h1 className="text-4xl font-bold mb-2">Active Pilots</h1>
              <p className="text-indigo-200">Monitor and manage ongoing pilot programs</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Building2 className="w-8 h-8 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Active Pilots</p>
                    <p className="text-2xl font-bold">{pilots.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Total Participants</p>
                    <p className="text-2xl font-bold">
                      {pilots.reduce((sum, pilot) => sum + pilot.participants, 0)}
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
                    <p className="text-sm text-indigo-200">Avg Completion</p>
                    <p className="text-2xl font-bold">
                      {Math.round(pilots.reduce((sum, pilot) => sum + pilot.progress, 0) / pilots.length)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  <div className="ml-3">
                    <p className="text-sm text-indigo-200">Avg Storage Gain</p>
                    <p className="text-2xl font-bold">
                      {Math.round(pilots.reduce((sum, pilot) => sum + pilot.metrics.storageDelta, 0) / pilots.length * 10) / 10}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pilots List */}
          <div className="space-y-6">
            {pilots.map((pilot) => (
              <Card key={pilot.id} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center">
                        <Building2 className="w-5 h-5 mr-2" />
                        {pilot.name}
                      </CardTitle>
                      <p className="text-indigo-200 mt-1">{pilot.organization}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(pilot.status)} text-white`}>
                        {pilot.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/pilot-workspace?pilotId=${pilot.id}`)}
                        className="text-indigo-200 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Workspace
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-indigo-200">Overall Progress</span>
                      <span className="text-white font-medium">{pilot.progress}%</span>
                    </div>
                    <Progress value={pilot.progress} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-200 text-sm">Storage Efficiency</span>
                        <span className="text-green-400 font-medium">+{pilot.metrics.storageDelta}%</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-200 text-sm">P95 Verify Time</span>
                        <span className="text-blue-400 font-medium">{pilot.metrics.p95VerifyMs}ms</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-200 text-sm">Milestones</span>
                        <span className="text-purple-400 font-medium">
                          {pilot.metrics.milestonesCompleted}/{pilot.metrics.totalMilestones}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-indigo-200">
                      <Users className="w-4 h-4 mr-2" />
                      {pilot.participants} participants
                    </div>
                    <div className="flex items-center text-indigo-200">
                      <Calendar className="w-4 h-4 mr-2" />
                      Started {formatDate(pilot.createdAt)}
                    </div>
                    {pilot.dueDate && (
                      <div className="flex items-center text-indigo-200">
                        <Clock className="w-4 h-4 mr-2" />
                        Due {formatDate(pilot.dueDate)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm text-indigo-200">
                      Current Phase: <span className="text-white font-medium">{pilot.phase}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-300 hover:text-white"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-300 hover:text-white"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Metrics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Links */}
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/pilot-requests')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              View Pilot Requests
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/contact-submissions')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              View Contact Submissions
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
