"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Mail, FileText, Database, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  const router = useRouter();

  const lastUpdated = "August 23, 2025";

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
              <Shield className="w-8 h-8 text-indigo-400 mr-3" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-indigo-200 text-lg mb-2">
              Your privacy is fundamental to my mission of building trustworthy AI systems.
            </p>
            <p className="text-indigo-300 text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Privacy Overview Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Privacy at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-indigo-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">What I Collect</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Contact information you provide</li>
                    <li>• Website usage analytics</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">How I Protect You</h4>
                  <ul className="text-sm space-y-1">
                    <li>• GDPR & CCPA compliant</li>
                    <li>• End-to-end encryption</li>
                    <li>• No third-party data sharing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-indigo-400" />
                Introduction
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  Cognitive Insight™ ("I," "my," or "the platform") is committed to protecting your privacy and maintaining 
                  the highest standards of data security. This Privacy Policy explains how I collect, use, protect, 
                  and share information when you use the verifiable AI assurance platform and related services.
                </p>
                <p className="text-indigo-100">
                  As the founder focused on AI transparency and cryptographic verification, I apply the same 
                  principles of trust and verifiability to my own data practices.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-indigo-400" />
                Information I Collect
              </h2>
              <div className="space-y-4">
                
                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">Information You Provide Directly</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li><strong>Contact Information:</strong> Name, email address, organization, when you submit forms or request information</li>
                    <li><strong>Pilot Program Data:</strong> Use case descriptions, technical requirements, and organizational details for pilot evaluations</li>
                    <li><strong>Communications:</strong> Content of emails, support requests, and feedback you send to us</li>
                    <li><strong>Professional Information:</strong> Job title, company size, industry, and relevant technical background when provided</li>
                  </ul>
                </div>

                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">Information Collected Automatically</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li><strong>Usage Analytics:</strong> Pages visited, time spent, click patterns (via Google Analytics)</li>
                    <li><strong>Technical Information:</strong> IP address, browser type, device information, operating system</li>
                    <li><strong>Performance Data:</strong> Page load times, error logs, and system performance metrics</li>
                  </ul>
                </div>

                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">Information I Do NOT Collect</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li>• Social Security numbers or government identification</li>
                    <li>• Financial information or payment data</li>
                    <li>• Biometric data or facial recognition information</li>
                    <li>• Personal conversations or private communications outside the platform</li>
                    <li>• Sensitive personal data without explicit consent</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-indigo-400" />
                How I Use Your Information
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Service Delivery</h3>
                    <ul className="text-indigo-100 space-y-1 text-sm">
                      <li>• Respond to your inquiries and requests</li>
                      <li>• Evaluate pilot program applications</li>
                      <li>• Provide technical support and assistance</li>
                      <li>• Deliver white papers and educational content</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Communication</h3>
                    <ul className="text-indigo-100 space-y-1 text-sm">
                      <li>• Send you requested information and updates</li>
                      <li>• Notify you about service changes or improvements</li>
                      <li>• Provide relevant industry insights and research</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Platform Improvement</h3>
                    <ul className="text-indigo-100 space-y-1 text-sm">
                      <li>• Analyze usage patterns to improve the platform</li>
                      <li>• Identify and fix technical issues</li>
                      <li>• Develop new features based on user needs</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Legal Compliance</h3>
                    <ul className="text-indigo-100 space-y-1 text-sm">
                      <li>• Comply with applicable laws and regulations</li>
                      <li>• Protect against fraud and security threats</li>
                      <li>• Enforce the terms of service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-indigo-400" />
                Data Protection & Security
              </h2>
              <div className="space-y-4">
                
                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">Technical Safeguards</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-indigo-100 text-sm">
                    <div>
                      <ul className="space-y-1">
                        <li>• End-to-end encryption for data transmission</li>
                        <li>• Encrypted storage using industry-standard protocols</li>
                        <li>• Regular security audits and penetration testing</li>
                        <li>• Multi-factor authentication for system access</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li>• Role-based access controls and data segmentation</li>
                        <li>• Automated threat detection and monitoring</li>
                        <li>• Regular data backups with secure recovery procedures</li>
                        <li>• GDPR and CCPA compliant data handling</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold text-white mb-3">Organizational Measures</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li><strong>Professional Standards:</strong> I maintain strict privacy and security protocols</li>
                    <li><strong>Data Minimization:</strong> I collect only the information necessary for the services</li>
                    <li><strong>Retention Limits:</strong> Personal data is retained only as long as necessary for business purposes</li>
                    <li><strong>Incident Response:</strong> Comprehensive procedures for detecting and responding to data breaches</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Privacy Rights</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <div className="grid md:grid-cols-2 gap-6 text-indigo-100">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Access & Control</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a portable format</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Communication Preferences</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                      <li><strong>Object:</strong> Object to certain processing activities</li>
                      <li><strong>Restrict:</strong> Limit how I use your information</li>
                      <li><strong>Consent:</strong> Withdraw consent for specific data uses</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <p className="text-indigo-200 text-sm">
                    <strong>Exercising Your Rights:</strong> To exercise any of these rights, contact me at{" "}
                    <a href="mailto:privacy@cognitiveinsight.ai" className="text-indigo-100 underline">
                      privacy@cognitiveinsight.ai
                    </a>
                    . I will respond within 30 days of receiving your request.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Third Parties */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  We use carefully selected third-party services to enhance our platform. Each service is 
                  evaluated for privacy compliance and data security:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Google Analytics</h3>
                    <p className="text-indigo-100 text-sm">
                      Used for website analytics and performance monitoring. Data is anonymized and aggregated. 
                      You can opt-out using browser settings or Google's opt-out tools.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">SendGrid</h3>
                    <p className="text-indigo-100 text-sm">
                      Email delivery service for transactional emails and communications. 
                      Data is transmitted securely and used only for email delivery.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Firebase</h3>
                    <p className="text-indigo-100 text-sm">
                      Google Cloud infrastructure for secure data storage and application hosting. 
                      All data is encrypted in transit and at rest.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  Your data may be processed and stored in the United States and other countries where we 
                  or our service providers operate. We ensure appropriate safeguards are in place:
                </p>
                <ul className="text-indigo-100 space-y-2">
                  <li>• Standard Contractual Clauses (SCCs) for EU data transfers</li>
                  <li>• Adequate country determinations where available</li>
                  <li>• Additional security measures for sensitive data</li>
                  <li>• Regular compliance assessments for international transfers</li>
                </ul>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100">
                  Our services are not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you believe we have collected 
                  information from a child under 13, please contact us immediately so we can delete 
                  such information.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our practices, 
                  technology, or legal requirements. We will:
                </p>
                <ul className="text-indigo-100 space-y-2 mb-4">
                  <li>• Post the updated policy on our website</li>
                  <li>• Update the "Last Modified" date</li>
                  <li>• Notify you of material changes via email</li>
                  <li>• Provide a clear summary of changes made</li>
                </ul>
                <p className="text-indigo-100">
                  Your continued use of our services after any updates constitutes acceptance of the revised policy.
                </p>
              </div>
            </section>

            <Separator className="bg-white/10" />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-indigo-400" />
                Contact Us
              </h2>
              <div className="bg-white/5 border-white/10 rounded-lg p-6 backdrop-blur">
                <p className="text-indigo-100 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-indigo-100">
                  <p><strong>Email:</strong> <a href="mailto:privacy@cognitiveinsight.ai" className="text-indigo-200 underline">privacy@cognitiveinsight.ai</a></p>
                  <p><strong>General Inquiries:</strong> <a href="mailto:insight@cognitiveinsight.ai" className="text-indigo-200 underline">insight@cognitiveinsight.ai</a></p>
                  <p><strong>Data Protection Officer:</strong> Available upon request</p>
                </div>
                <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <p className="text-indigo-200 text-sm">
                    <strong>EU Residents:</strong> You have the right to lodge a complaint with your local 
                    data protection authority if you believe your privacy rights have been violated.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Return to Homepage
              </Button>
              <p className="text-indigo-300 text-sm text-center">
                Questions about privacy? Contact us at{" "}
                <a href="mailto:privacy@cognitiveinsight.ai" className="text-indigo-200 underline">
                  privacy@cognitiveinsight.ai
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
