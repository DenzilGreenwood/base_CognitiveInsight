"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3,
  ArrowRight,
  Shield,
  Database,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const router = useRouter();

  const adminSections = [
    {
      title: "Pilot Requests",
      description: "View and manage pilot program applications",
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      path: "/admin/pilot-requests",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Contact Submissions",
      description: "View and respond to contact form submissions",
      icon: <MessageSquare className="w-8 h-8 text-green-400" />,
      path: "/admin/contact-submissions",
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30"
    }
  ];

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
              <Shield className="w-12 h-12 text-indigo-400 mr-4" />
              <h1 className="text-5xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-indigo-200 text-lg">
              Manage and monitor your Cognitive Insight™ platform
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Database className="w-8 h-8 text-indigo-400" />
                  <div className="ml-4">
                    <p className="text-sm text-indigo-200">System Status</p>
                    <p className="text-xl font-bold text-green-400">Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm text-indigo-200">Active Monitoring</p>
                    <p className="text-xl font-bold text-white">Firebase & SendGrid</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  <div className="ml-4">
                    <p className="text-sm text-indigo-200">Last Updated</p>
                    <p className="text-xl font-bold text-white">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {adminSections.map((section, index) => (
              <motion.div
                key={section.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={`bg-gradient-to-br ${section.color} border ${section.borderColor} backdrop-blur cursor-pointer hover:scale-105 transition-transform duration-200`}
                  onClick={() => router.push(section.path)}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        {section.icon}
                        <span className="ml-3">{section.title}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/70" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-indigo-100 mb-4">
                      {section.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(section.path);
                      }}
                    >
                      Access Section
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-auto py-4"
                  onClick={() => router.push('/contact')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">View Contact Page</div>
                    <div className="text-xs opacity-70">Test contact form</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-auto py-4"
                  onClick={() => router.push('/pilot-request')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">View Pilot Page</div>
                    <div className="text-xs opacity-70">Test pilot request form</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-auto py-4"
                  onClick={() => router.push('/')}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">View Homepage</div>
                    <div className="text-xs opacity-70">Return to main site</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-yellow-200 text-sm">
                <strong>Security Notice:</strong> This admin dashboard provides access to sensitive data. 
                Ensure proper authentication and access controls are implemented in production environments.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
