"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Shield,
  User,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export default function PilotOnboardingPage() {
  const router = useRouter();
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'agreement',
      title: 'Accept Pilot Collaboration Agreement',
      description: 'Review and accept the terms of the pilot collaboration',
      completed: false,
      required: true
    },
    {
      id: 'role',
      title: 'Confirm Your Role',
      description: 'Select or confirm your role in the pilot program',
      completed: false,
      required: true
    },
    {
      id: 'charter',
      title: 'Review Pilot Charter',
      description: 'Understand the pilot scope, risks, and success metrics',
      completed: false,
      required: true
    },
    {
      id: 'workspace',
      title: 'Workspace Tour',
      description: 'Learn how to navigate your pilot workspace',
      completed: false,
      required: false
    }
  ]);

  const handleStepComplete = (stepId: string, completed: boolean) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed } : step
    ));
  };

  const handleAgreementAccept = (accepted: boolean) => {
    setAgreementAccepted(accepted);
    handleStepComplete('agreement', accepted);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    handleStepComplete('role', !!role);
  };

  const requiredStepsCompleted = steps.filter(s => s.required).every(s => s.completed);
  const allStepsCompleted = steps.every(s => s.completed);

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'regulator':
        return 'Observer & Standards Guide - Review capsule evidence vs. regulatory intent';
      case 'auditor':
        return 'Evaluator & Process Integrator - Test capsules in assurance workflows';
      case 'builder':
        return 'Builder & Validator - Implement and stress-test capsule generation';
      default:
        return '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Pilot Workspace</h1>
            <p className="text-indigo-200 text-lg">
              Let's get you set up for collaborative AI auditability pilot participation
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Onboarding Progress</h3>
                <span className="text-sm text-indigo-200">
                  {steps.filter(s => s.completed).length} of {steps.length} completed
                </span>
              </div>
              <div className="flex space-x-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 h-2 rounded-full ${
                      step.completed ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Steps */}
          <div className="space-y-6">
            
            {/* Step 1: Agreement */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    steps.find(s => s.id === 'agreement')?.completed ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {steps.find(s => s.id === 'agreement')?.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm font-bold">1</span>
                    )}
                  </div>
                  Accept Pilot Collaboration Agreement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-200 mb-4">
                  Review and accept the terms of our collaborative pilot partnership
                </p>
                
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-white mb-2">Key Terms Summary:</h4>
                  <ul className="text-sm text-indigo-200 space-y-1">
                    <li>• Non-commercial, exploratory collaboration</li>
                    <li>• Mutual confidentiality and IP protection</li>
                    <li>• Synthetic/simulated data preferred</li>
                    <li>• Either party may terminate with notice</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-3 mb-4">
                  <Checkbox
                    id="agreement"
                    checked={agreementAccepted}
                    onCheckedChange={handleAgreementAccept}
                  />
                  <Label htmlFor="agreement" className="text-white text-sm cursor-pointer">
                    I have read and agree to the{" "}
                    <a 
                      href="/partnership-agreement" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-200 underline hover:text-indigo-100"
                    >
                      Pilot Collaboration Agreement
                    </a>
                  </Label>
                </div>

                {agreementAccepted && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <Shield className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      Agreement accepted! You can proceed to the next step.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Role Selection */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    steps.find(s => s.id === 'role')?.completed ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {steps.find(s => s.id === 'role')?.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm font-bold">2</span>
                    )}
                  </div>
                  Confirm Your Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-200 mb-4">
                  Select your primary role in this pilot collaboration
                </p>
                
                <div className="space-y-4">
                  <Select value={selectedRole} onValueChange={handleRoleSelect}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-white text-black">
                      <SelectItem value="regulator">Regulator</SelectItem>
                      <SelectItem value="auditor">Auditor & Compliance</SelectItem>
                      <SelectItem value="builder">AI / IT / ML Team</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedRole && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">
                        {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Role:
                      </h4>
                      <p className="text-indigo-200 text-sm">
                        {getRoleDescription(selectedRole)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Charter Review */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    steps.find(s => s.id === 'charter')?.completed ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {steps.find(s => s.id === 'charter')?.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm font-bold">3</span>
                    )}
                  </div>
                  Review Pilot Charter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-200 mb-4">
                  Understand the pilot scope, timeline, and success metrics
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Pilot Scope</h4>
                    <ul className="text-sm text-indigo-200 space-y-1">
                      <li>• CIAF + LCM framework validation</li>
                      <li>• Cross-stakeholder collaboration</li>
                      <li>• Verifiable AI auditability testing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Success Metrics</h4>
                    <ul className="text-sm text-indigo-200 space-y-1">
                      <li>• Regulatory alignment verified</li>
                      <li>• Audit effort reduction &gt; 30%</li>
                      <li>• Zero IP exposure incidents</li>
                    </ul>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => handleStepComplete('charter', true)}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  I understand the pilot charter
                </Button>
              </CardContent>
            </Card>

            {/* Step 4: Workspace Tour */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    steps.find(s => s.id === 'workspace')?.completed ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {steps.find(s => s.id === 'workspace')?.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm font-bold">4</span>
                    )}
                  </div>
                  Workspace Tour (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-200 mb-4">
                  Take a quick tour of your pilot workspace features
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="text-sm">
                    <h4 className="font-semibold text-white mb-2">Available Features:</h4>
                    <ul className="text-indigo-200 space-y-1">
                      <li>• Role-aware dashboard</li>
                      <li>• Milestone tracking</li>
                      <li>• Secure file sharing</li>
                      <li>• Meeting coordination</li>
                      <li>• Activity audit log</li>
                    </ul>
                  </div>
                  
                  <div className="text-sm">
                    <h4 className="font-semibold text-white mb-2">Quick Navigation:</h4>
                    <ul className="text-indigo-200 space-y-1">
                      <li>• Overview tab for status</li>
                      <li>• My Role for responsibilities</li>
                      <li>• Milestones for deadlines</li>
                      <li>• Artifacts for documents</li>
                      <li>• Messages for communication</li>
                    </ul>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => handleStepComplete('workspace', true)}
                  className="w-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Skip tour - I'm ready to start
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Completion Action */}
          <Card className="bg-indigo-500/10 border-indigo-500/20 backdrop-blur mt-8">
            <CardContent className="p-6 text-center">
              {requiredStepsCompleted ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Start!</h3>
                  <p className="text-indigo-200 mb-4">
                    You've completed all required onboarding steps. Welcome to the pilot program!
                  </p>
                  <Button 
                    onClick={() => router.push('/pilot-workspace')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Enter Pilot Workspace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Complete Required Steps</h3>
                  <p className="text-indigo-200">
                    Please complete all required onboarding steps to access your pilot workspace.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
