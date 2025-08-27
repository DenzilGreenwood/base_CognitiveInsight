"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Upload,
  MessageSquare,
  Activity,
  Settings,
  Target,
  TrendingUp,
  Shield,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ROLE_CONFIGS, PILOT_PHASES } from '@/types/pilot';
import type { User as UserType, Pilot, Milestone, Deliverable, PilotKPIs } from '@/types/pilot';

export default function PilotWorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [kpis, setKpis] = useState<PilotKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        orgId: 'org1',
        role: 'regulator',
        isActive: true,
        createdAt: '2025-08-20T10:00:00Z',
        updatedAt: '2025-08-26T10:00:00Z'
      });

      setPilot({
        id: 'pilot1',
        orgId: 'org1',
        name: 'CIAF+LCM Regulatory Validation Pilot',
        description: 'Collaborative pilot to validate verifiable AI auditability framework',
        status: 'scoping',
        phases: PILOT_PHASES.map((phase, index) => ({
          ...phase,
          status: index === 0 ? 'completed' : index === 1 ? 'in_progress' : 'not_started'
        })),
        successMetrics: [
          'Regulatory compliance alignment verified',
          'Audit effort reduction > 30%',
          'Zero IP exposure incidents'
        ],
        startDate: '2025-08-20T00:00:00Z',
        createdAt: '2025-08-20T10:00:00Z',
        updatedAt: '2025-08-26T10:00:00Z'
      });

      setMilestones([
        {
          id: 'm1',
          pilotId: 'pilot1',
          title: 'Criteria aligned',
          description: 'Define regulatory acceptance criteria',
          phase: 1,
          ownerUserId: '1',
          dueAt: '2025-08-30T23:59:59Z',
          status: 'in_progress',
          evidenceLinks: [],
          createdAt: '2025-08-20T10:00:00Z',
          updatedAt: '2025-08-26T10:00:00Z'
        },
        {
          id: 'm3',
          pilotId: 'pilot1',
          title: 'Mid-pilot sufficiency review',
          description: 'Review capsule evidence sufficiency',
          phase: 3,
          ownerUserId: '1',
          dueAt: '2025-09-15T23:59:59Z',
          status: 'not_started',
          evidenceLinks: [],
          createdAt: '2025-08-20T10:00:00Z',
          updatedAt: '2025-08-26T10:00:00Z'
        }
      ]);

      setDeliverables([
        {
          id: 'd1',
          pilotId: 'pilot1',
          role: 'regulator',
          title: 'Regulatory Sufficiency Notes',
          description: 'Template for regulatory compliance assessment',
          type: 'document',
          dueAt: '2025-09-01T23:59:59Z',
          status: 'in_progress',
          ownerUserId: '1',
          createdAt: '2025-08-20T10:00:00Z',
          updatedAt: '2025-08-26T10:00:00Z'
        }
      ]);

      setKpis({
        storageReductionTarget: 40,
        storageReductionObserved: 35,
        verificationLatencyP50: 150,
        verificationLatencyP95: 280,
        milestonesOnTimePercentage: 85,
        auditEffortDelta: -25
      });

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">Loading workspace...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!user || !pilot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Required</h1>
            <p className="text-indigo-200 mb-6">You need to be invited to access this pilot workspace.</p>
            <Button onClick={() => router.push('/')}>Return Home</Button>
          </div>
        </div>
      </main>
    );
  }

  const roleConfig = ROLE_CONFIGS[user.role];
  const currentPhase = pilot.phases.find(p => p.status === 'in_progress') || pilot.phases[0];
  const nextMilestone = milestones.find(m => m.status !== 'done');
  const userDeliverables = deliverables.filter(d => d.ownerUserId === user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': case 'completed': case 'approved': return 'bg-green-500';
      case 'in_progress': case 'submitted': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Pilot Workspace</h1>
              <p className="text-indigo-200">Your role, responsibilities, deliverables, and milestones in one place.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-indigo-400 text-indigo-300">
                {pilot.status.charAt(0).toUpperCase() + pilot.status.slice(1)}
              </Badge>
              <Button variant="outline" onClick={() => router.push('/pilot-workspace/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'role', label: 'My Role', icon: User },
              { id: 'milestones', label: 'Milestones', icon: CheckCircle },
              { id: 'artifacts', label: 'Artifacts', icon: FileText },
              { id: 'meetings', label: 'Meetings', icon: Calendar },
              { id: 'activity', label: 'Activity', icon: Activity },
              { id: 'messages', label: 'Messages', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 bg-indigo-600 text-white"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Role & Status */}
            <div className="space-y-6">
              
              {/* Role Panel */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Your Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="border-indigo-400 text-indigo-300 mb-3">
                        {roleConfig.role.charAt(0).toUpperCase() + roleConfig.role.slice(1)} - Observer & Standards Guide
                      </Badge>
                      <h4 className="font-semibold text-white mb-2">Primary responsibilities:</h4>
                      <ul className="text-indigo-200 text-sm space-y-1">
                        {roleConfig.responsibilities.map((resp, index) => (
                          <li key={index}>• {resp}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {nextMilestone && (
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="font-semibold text-white mb-2">Next due:</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-indigo-200 text-sm">{nextMilestone.title}</span>
                          <Button size="sm" onClick={() => {}}>
                            Open
                          </Button>
                        </div>
                        <p className="text-xs text-indigo-300 mt-1">
                          Due: {new Date(nextMilestone.dueAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Phase */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Current Phase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white">Phase {currentPhase.phase}: {currentPhase.name}</h3>
                      <p className="text-indigo-200 text-sm">{currentPhase.description}</p>
                    </div>
                    <Progress value={((currentPhase.phase + 1) / PILOT_PHASES.length) * 100} className="h-2" />
                    <p className="text-xs text-indigo-300">
                      Phase {currentPhase.phase + 1} of {PILOT_PHASES.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* KPIs */}
              {kpis && (
                <Card className="bg-white/5 border-white/10 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Pilot KPIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-indigo-200">Storage Reduction</span>
                          <span className="text-white">{kpis.storageReductionObserved}%</span>
                        </div>
                        <Progress value={kpis.storageReductionObserved} className="h-2 mt-1" />
                        <p className="text-xs text-indigo-300">Target: {kpis.storageReductionTarget}%</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-indigo-200">Latency P50</p>
                          <p className="text-white font-medium">{kpis.verificationLatencyP50}ms</p>
                        </div>
                        <div>
                          <p className="text-indigo-200">On Time</p>
                          <p className="text-white font-medium">{kpis.milestonesOnTimePercentage}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Center Column - Milestones & Deliverables */}
            <div className="space-y-6">
              
              {/* Milestones Timeline */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full mt-1 ${getStatusColor(milestone.status)}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white">{milestone.title}</h4>
                          <p className="text-sm text-indigo-200">{milestone.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-indigo-300">
                              Due: {new Date(milestone.dueAt).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(milestone.status)}`}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    My Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userDeliverables.map((deliverable) => (
                      <div key={deliverable.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{deliverable.title}</h4>
                          <p className="text-sm text-indigo-200">{deliverable.description}</p>
                          <p className="text-xs text-indigo-300">
                            Due: {new Date(deliverable.dueAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(deliverable.status)}>
                            {deliverable.status.replace('_', ' ')}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Upload className="w-3 h-3 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Activity & Quick Actions */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Artifact
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Milestone updated', time: '2 hours ago', actor: 'John Smith' },
                      { action: 'Document uploaded', time: '1 day ago', actor: 'Sarah Johnson' },
                      { action: 'Meeting scheduled', time: '2 days ago', actor: 'Mike Chen' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-white">{activity.action}</p>
                          <p className="text-xs text-indigo-300">{activity.actor} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pilot Participants */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Pilot Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'John Smith', role: 'Regulator', status: 'online' },
                      { name: 'Sarah Johnson', role: 'Auditor', status: 'offline' },
                      { name: 'Mike Chen', role: 'AI Builder', status: 'online' }
                    ].map((participant, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${participant.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className="text-sm text-white">{participant.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {participant.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
