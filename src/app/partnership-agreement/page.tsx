"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Mail, 
  Shield, 
  Users, 
  Lightbulb,
  Database,
  Scale,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PartnershipAgreementPage() {
  const router = useRouter();

  const lastUpdated = "August 26, 2025";

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
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-indigo-200 hover:text-white mb-6 p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-indigo-400 mr-3" />
              <h1 className="text-4xl font-bold">Pilot Collaboration Agreement</h1>
            </div>
            <p className="text-indigo-200 text-lg mb-2">
              Collaborative framework for exploring verifiable AI auditability together.
            </p>
            <p className="text-indigo-300 text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Agreement Overview Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Agreement at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-indigo-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">What This Is</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Collaborative exploration, not commercial deployment</li>
                    <li>• Non-commercial research and evaluation</li>
                    <li>• Mutual protection of contributions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">What This Isn't</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Commercial service or license agreement</li>
                    <li>• Binding obligation for future business</li>
                    <li>• Production-ready deployment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Introduction */}
          <section className="mb-8">
            <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
              <p className="text-indigo-100 mb-4">
                This Pilot Collaboration Agreement ("Agreement") is entered into by and between 
                Cognitive Insight™ ("I," "me," or "my") and the participating organization 
                ("Partner," "you," or "your") for the purpose of exploring and evaluating the 
                Cognitive Insight™ Audit Framework (CIAF) and Lazy Capsule Materialization (LCM) 
                in a collaborative pilot program.
              </p>
              <p className="text-indigo-100">
                By applying for or participating in the pilot, you agree to the following terms:
              </p>
            </div>
          </section>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Purpose */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-indigo-400" />
                1. Purpose
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100">
                  The purpose of this pilot is collaborative exploration, not commercial deployment. 
                  Together, we will test and refine methods for verifiable AI auditability. This 
                  Agreement defines our roles and protects both parties' contributions.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Scope of Collaboration */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-indigo-400" />
                2. Scope of Collaboration
              </h2>
              <div className="space-y-4">
                
                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">I will provide:</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li>• Access to research materials, white papers, and/or pilot demonstration tools</li>
                    <li>• Technical support and communication regarding pilot activities</li>
                  </ul>
                </div>

                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">You will provide:</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li>• Feedback, domain expertise, and (if applicable) test environments to evaluate CIAF + LCM</li>
                    <li>• Input on challenges, requirements, and success criteria from your industry perspective</li>
                  </ul>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                  <p className="text-indigo-200 text-sm">
                    <strong>Important:</strong> This pilot is non-commercial and exploratory. It does not create 
                    a binding obligation for either party to enter into future business arrangements.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Confidentiality */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-indigo-400" />
                3. Confidentiality
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  Both parties agree to keep confidential information shared during the pilot confidential, 
                  including technical methods, business practices, and sensitive organizational data.
                </p>
                <p className="text-indigo-100 mb-4">
                  Confidential information may only be used for the purpose of this pilot and may not be 
                  disclosed to third parties without written consent, except as required by law.
                </p>
                <p className="text-indigo-100">
                  <strong>No Publicity:</strong> Neither party may use the other's name, logo, or participation 
                  in public communications without written consent.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-indigo-400" />
                4. Intellectual Property
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <div className="space-y-4">
                  <p className="text-indigo-100">
                    <strong>My IP:</strong> All intellectual property related to the CIAF and LCM frameworks, 
                    methods, and software remains the sole property of Cognitive Insight™.
                  </p>
                  <p className="text-indigo-100">
                    <strong>Your IP:</strong> Any organizational data, feedback, or documentation you contribute 
                    remains your property.
                  </p>
                  <div className="text-indigo-100">
                    <p className="font-semibold mb-2">Feedback Usage:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• I may use your feedback to improve CIAF + LCM</li>
                      <li>• You do not gain ownership of my IP</li>
                      <li>• I do not claim ownership of your data or processes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Data Handling */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-indigo-400" />
                5. Data Handling
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <ul className="text-indigo-100 space-y-3">
                  <li>
                    <strong>Primary Approach:</strong> The pilot will primarily use synthetic or simulated data 
                    to avoid exposure of sensitive information.
                  </li>
                  <li>
                    <strong>Real Data (if used):</strong> If real or organizational data is used, both parties 
                    agree to handle it securely, in compliance with applicable laws and regulations 
                    (e.g., GDPR, HIPAA, CCPA).
                  </li>
                  <li>
                    <strong>Data Protection:</strong> I will not share your data with third parties.
                  </li>
                  <li>
                    <strong>Pilot Workspace:</strong> A role-based Pilot Workspace will be used for coordination, 
                    artifact exchange, and activity logging.
                  </li>
                </ul>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Non-Commercial Nature */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Non-Commercial Nature</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <ul className="text-indigo-100 space-y-2">
                  <li>• This pilot is provided free of charge and is intended for research, evaluation, and collaboration only</li>
                  <li>• Participation does not create a commercial service, license, or warranty of fitness for production use</li>
                    <li>• Neither party is obligated to enter into future commercial agreements</li>
                    
                </ul>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Term & Termination */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-indigo-400" />
                7. Term & Termination
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <ul className="text-indigo-100 space-y-2">
                  <li>• This Agreement begins upon your acceptance and continues until the conclusion of the pilot program</li>
                  <li>• Either party may terminate this Agreement at any time with written notice</li>
                  <li>• Upon termination, both parties must return or delete confidential materials received from the other party</li>
                </ul>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Liability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-indigo-400" />
                8. Liability
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100">
                    The pilot is exploratory and provided ‘as is.’ I do not warrant that the framework is free from errors, complete, or fit for production use.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100">
                  I operate from Oklahoma, United States, and this Agreement is governed under Oklahoma law.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-indigo-400" />
                10. Contact Information
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  For questions about this Agreement or the pilot program, contact me at:
                </p>
                <p className="text-indigo-100">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:insight@cognitiveinsight.ai" className="text-indigo-200 underline">
                    insight@cognitiveinsight.ai
                  </a>
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Acceptance */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-indigo-400" />
                Acceptance
              </h2>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100">
                  By submitting a pilot application or participating in the pilot program, you acknowledge 
                  that you have read, understood, and agree to the terms of this Agreement.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/pilot-request')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Apply for a Collaborative Pilot Role
              </Button>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/privacy')}
                  className="text-indigo-200 hover:text-white"
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="text-indigo-200 hover:text-white"
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
