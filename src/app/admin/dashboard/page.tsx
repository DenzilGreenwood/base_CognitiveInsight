'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  Settings, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  UserCheck,
  FileSignature,
  Building2,
  MessageSquare,
  Shield,
  BarChart3,
  Eye,
  UserX,
  Archive,
  Hash,
  ArrowRight,
  Plus,
  MoreHorizontal,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  PilotRequest, 
  AdminFilter, 
  BulkAction, 
  STATUS_FLOWS, 
  QUICK_TAGS,
  EMAIL_TEMPLATES 
} from '@/types/admin';
import { AdminService } from '@/lib/admin-service';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDashboardProps {
  initialView?: 'requests' | 'pilots';
}

export default function AdminDashboard({ initialView = 'requests' }: AdminDashboardProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [currentView, setCurrentView] = useState<'requests' | 'pilots'>(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState<AdminFilter>({
    facets: {}
  });
  const [requests, setRequests] = useState<PilotRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: PilotRequest[] = [
      {
        id: 'req_001',
        name: 'Sarah Chen',
        email: 'sarah.chen@globalbank.com',
        org: 'Global Bank Corp',
        roleHint: 'regulator',
        sector: 'financial',
        region: 'us',
        status: 'NEW',
        ownerUserId: undefined,
        tags: ['high-priority', 'tier-1'],
        score: {
          fit: 0,
          feasibility: 0,
          timeline: 0,
          notes: ''
        },
        audit: { entries: [] },
        createdAt: new Date('2025-08-20'),
        updatedAt: new Date('2025-08-20')
      },
      {
        id: 'req_002',
        name: 'Dr. Marcus Webb',
        email: 'm.webb@healthsystem.org',
        org: 'Metro Health System',
        roleHint: 'auditor',
        sector: 'healthcare',
        region: 'eu',
        status: 'SCOPING',
        ownerUserId: 'admin_001',
        tags: ['gdpr-compliant', 'medical'],
        score: {
          fit: 4,
          feasibility: 3,
          timeline: 4,
          notes: 'Strong mission alignment, complex data requirements'
        },
        audit: { entries: [] },
        createdAt: new Date('2025-08-18'),
        updatedAt: new Date('2025-08-25')
      },
      {
        id: 'req_003',
        name: 'Jennifer Rodriguez',
        email: 'j.rodriguez@insuranceco.com',
        org: 'InsuranceCo',
        roleHint: 'ai_builder',
        sector: 'insurance',
        region: 'us',
        status: 'AGREEMENT_OUT',
        ownerUserId: 'admin_002',
        tags: ['fraud-detection', 'ml-focus'],
        score: {
          fit: 5,
          feasibility: 4,
          timeline: 3,
          notes: 'Excellent fit, ready to proceed'
        },
        agreementLink: {
          token: 'agr_xyz789',
          expiresAt: new Date('2025-09-25')
        },
        audit: { entries: [] },
        createdAt: new Date('2025-08-15'),
        updatedAt: new Date('2025-08-24')
      }
    ];
    
    setRequests(mockRequests);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      NEW: 'bg-blue-500',
      SCOPING: 'bg-yellow-500',
      AGREEMENT_OUT: 'bg-purple-500',
      SIGNED: 'bg-green-500',
      CONVERTED: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'regulator': return <Shield className="w-4 h-4" />;
      case 'auditor': return <FileText className="w-4 h-4" />;
      case 'ai_builder': return <Settings className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const handleAssignToMe = async (requestId: string) => {
    await AdminService.assignReviewer(requestId, 'current_user');
    // Refresh data
  };

  const handleSendAgreement = async (requestId: string) => {
    const agreementLink = await AdminService.generateAgreementLink(requestId);
    await AdminService.sendEmail(EMAIL_TEMPLATES.AGREEMENT, ['recipient@example.com'], {
      requestId,
      agreementLink
    });
    // Refresh data
  };

  const handleCreateWorkspace = async (requestId: string) => {
    const pilotId = await AdminService.createPilotWorkspace(requestId);
    console.log(`Created pilot workspace: ${pilotId}`);
    // Navigate to pilot view
  };

  const handleAdvanceStatus = async (requestId: string, newStatus: string) => {
    await AdminService.advanceStatus(requestId, newStatus, 'Manual advancement');
    // Refresh data
  };

  const handleBulkAction = async (action: BulkAction['action'], params: any = {}) => {
    const bulkAction: BulkAction = {
      action,
      requestIds: selectedItems,
      params
    };
    
    switch (action) {
      case 'ASSIGN_REVIEWER':
        for (const id of selectedItems) {
          await AdminService.assignReviewer(id, params.reviewerId);
        }
        break;
      case 'TAG':
        for (const id of selectedItems) {
          await AdminService.tagRequest(id, params.tags);
        }
        break;
      case 'SEND_EMAIL':
        await AdminService.sendEmail(params.templateId, params.recipients, params.vars);
        break;
      case 'ADVANCE_STATUS':
        for (const id of selectedItems) {
          await AdminService.advanceStatus(id, params.status, params.reason);
        }
        break;
    }
    
    setSelectedItems([]);
    // Refresh data
  };

  const filteredRequests = requests.filter(req => {
    if (searchQuery && !req.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !req.org.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !req.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.facets.status?.length && !filters.facets.status.includes(req.status)) {
      return false;
    }
    
    if (filters.facets.role?.length && !filters.facets.role.includes(req.roleHint)) {
      return false;
    }
    
    if (filters.facets.sector?.length && !filters.facets.sector.includes(req.sector)) {
      return false;
    }
    
    return true;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-indigo-200">Manage pilot requests and workspace operations</p>
              {user && (
                <p className="text-indigo-300 text-sm mt-1">
                  Logged in as: {user.email}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Select 
                value={currentView} 
                onValueChange={(value: 'requests' | 'pilots') => {
                  if (value === 'requests') {
                    router.push('/admin/pilot-requests');
                  } else if (value === 'pilots') {
                    router.push('/admin/pilots');
                  }
                }}
              >
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requests">Pilot Requests</SelectItem>
                  <SelectItem value="pilots">Active Pilots</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push('/admin/contact-submissions')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Submissions
              </Button>
              
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              
              <Button 
                variant="outline" 
                className="border-red-400/50 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm">New Requests</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm">Active Pilots</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Building2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm">Overdue SLAs</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-white">94%</p>
                  </div>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                  <Input
                    placeholder="Search by name, organization, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-indigo-300"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2">
                  <Select
                    value={filters.facets.status?.[0] || ''}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      facets: { ...prev.facets, status: value ? [value] : undefined }
                    }))}
                  >
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="SCOPING">Scoping</SelectItem>
                      <SelectItem value="AGREEMENT_OUT">Agreement Out</SelectItem>
                      <SelectItem value="SIGNED">Signed</SelectItem>
                      <SelectItem value="CONVERTED">Converted</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.facets.role?.[0] || ''}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      facets: { ...prev.facets, role: value ? [value] : undefined }
                    }))}
                  >
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="regulator">Regulator</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                      <SelectItem value="ai_builder">AI Builder</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.facets.sector?.[0] || ''}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      facets: { ...prev.facets, sector: value ? [value] : undefined }
                    }))}
                  >
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sectors</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200">
                      {selectedItems.length} selected
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                          Bulk Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkAction('ASSIGN_REVIEWER', { reviewerId: 'current_user' })}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Assign to Me
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('TAG', { tags: ['bulk-processed'] })}>
                          <Hash className="w-4 h-4 mr-2" />
                          Add Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('SEND_EMAIL', { templateId: EMAIL_TEMPLATES.INVITE })}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction('ADVANCE_STATUS', { status: 'SCOPING' })}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Advance Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-5 gap-6">
            {['NEW', 'SCOPING', 'AGREEMENT_OUT', 'SIGNED', 'CONVERTED'].map((status) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{status.replace('_', ' ')}</h3>
                  <Badge className={`${getStatusColor(status)} text-white`}>
                    {filteredRequests.filter(req => req.status === status).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {filteredRequests
                    .filter(req => req.status === status)
                    .map((request) => (
                      <motion.div
                        key={request.id}
                        layout
                        className="bg-white/10 border-white/20 rounded-lg p-4 backdrop-blur hover:bg-white/15 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedItems.includes(request.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems(prev => [...prev, request.id]);
                                } else {
                                  setSelectedItems(prev => prev.filter(id => id !== request.id));
                                }
                              }}
                            />
                            <div className="p-1 bg-white/10 rounded">
                              {getRoleIcon(request.roleHint)}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-indigo-300 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAssignToMe(request.id)}>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Assign to me
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendAgreement(request.id)}>
                                <FileSignature className="w-4 h-4 mr-2" />
                                Send Agreement
                              </DropdownMenuItem>
                              {request.status === 'SIGNED' && (
                                <DropdownMenuItem onClick={() => handleCreateWorkspace(request.id)}>
                                  <Building2 className="w-4 h-4 mr-2" />
                                  Create Workspace
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="w-4 h-4 mr-2" />
                                Export Case File
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Impersonate View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <UserX className="w-4 h-4 mr-2" />
                                Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white text-sm">{request.name}</h4>
                          <p className="text-indigo-200 text-xs">{request.org}</p>
                          <p className="text-indigo-300 text-xs">{request.email}</p>
                          
                          {request.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {request.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs border-indigo-400/50 text-indigo-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {request.score.fit > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-indigo-300">Score</span>
                                <span className="text-white">{request.score.fit}/5</span>
                              </div>
                              <Progress value={(request.score.fit / 5) * 100} className="h-1" />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-indigo-300">
                            <span>{request.sector} • {request.region}</span>
                            <span>{request.createdAt.toLocaleDateString()}</span>
                          </div>
                          
                          {request.ownerUserId && (
                            <div className="flex items-center text-xs text-green-400">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Assigned
                            </div>
                          )}
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                          <div className="flex items-center space-x-1">
                            {STATUS_FLOWS.REQUEST[request.status as keyof typeof STATUS_FLOWS.REQUEST]?.map(nextStatus => (
                              <Button
                                key={nextStatus}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-indigo-300 hover:text-white hover:bg-white/10"
                                onClick={() => handleAdvanceStatus(request.id, nextStatus)}
                              >
                                {nextStatus}
                              </Button>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-indigo-300 hover:text-white">
                              <Mail className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-indigo-300 hover:text-white">
                              <Calendar className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-indigo-300 hover:text-white">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
