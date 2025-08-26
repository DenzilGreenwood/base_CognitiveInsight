"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button"      
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  name: string;
  email: string;
  organization: string;
  pilotScope: string;
  useCase: string;
  agreementAccepted: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  organization?: string;
  agreementAccepted?: string;
}

export default function PilotRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    pilotScope: "",
    useCase: "",
    agreementAccepted: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!formData.agreementAccepted) {
      newErrors.agreementAccepted = "You must agree to the Pilot Collaboration Agreement";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      const response = await fetch('/api/pilot-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'pilot-request-page'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Redirect to thank you page after a short delay
        setTimeout(() => {
          router.push('/thank-you?type=pilot');
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to submit pilot request');
      }
    } catch (error) {
      console.error('Pilot request error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-6 py-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Request Submitted Successfully!</h1>
            <p className="text-indigo-200 mb-6">
              Thank you for your interest in the pilot program. I'll reach out within 24-48 hours 
              to schedule a scoping conversation.
            </p>
            <p className="text-sm text-indigo-300">Redirecting you to confirmation page...</p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 py-16 max-w-2xl">
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
            
            <h1 className="text-4xl font-bold mb-4">
              Apply for a Collaborative Pilot Role
            </h1>
            <p className="text-indigo-200 text-lg">
              A limited 2025 program to co-design verifiable AI auditability with regulators, auditors, and AI teams.
            </p>
          </div>

          {/* Who We're Inviting Section */}
          <div className="mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 text-center">Who We're Inviting</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <h3 className="font-semibold text-white mb-2">Regulators</h3>
                    <p className="text-blue-200 text-sm">Observer & Standards Guide. Help define what counts as verifiable evidence and ensure alignment with regulatory intent.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-400/20">
                    <h3 className="font-semibold text-white mb-2">Auditors & Compliance Teams</h3>
                    <p className="text-green-200 text-sm">Evaluator & Process Integrator. Test capsules in assurance workflows and validate their value for audits.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/20">
                    <h3 className="font-semibold text-white mb-2">AI / IT / ML Teams</h3>
                    <p className="text-purple-200 text-sm">Builder & Validator. Implement and stress-test capsule generation in real pipelines.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20">
                    <h3 className="font-semibold text-white mb-2">Together</h3>
                    <p className="text-indigo-200 text-sm">Co-Creators of the Standard. Share findings across groups to refine CIAF + LCM into a trusted framework.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Pilot Program Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Business Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter your business email"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Organization Field */}
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-white flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Organization *
                  </Label>
                  <Input
                    id="organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter your organization name"
                  />
                  {errors.organization && (
                    <p className="text-red-400 text-sm">{errors.organization}</p>
                  )}
                </div>

                {/* Pilot Scope Field */}
                <div className="space-y-2">
                  <Label htmlFor="pilotScope" className="text-white flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Your Role & Context (Optional)
                  </Label>
                  <Textarea
                    id="pilotScope"
                    value={formData.pilotScope}
                    onChange={(e) => handleInputChange('pilotScope', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                    placeholder="Regulator, Auditor, AI/IT/ML, or Other - please describe your role and context..."
                  />
                </div>

                {/* Use Case Field */}
                <div className="space-y-2">
                  <Label htmlFor="useCase" className="text-white">
                    How Can We Collaborate? (Optional)
                  </Label>
                  <Textarea
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => handleInputChange('useCase', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                    placeholder="What expertise, challenges, or requirements would you bring to a collaborative pilot? What outcomes would define success in your domain?"
                  />
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Privacy Notice */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                  <p className="text-sm text-indigo-200">
                    <strong>Privacy Notice:</strong> By submitting this form, you consent to Cognitive Insight™ 
                    processing your information to evaluate pilot program fit and provide program updates. 
                    Your information will only be used for pilot evaluation and communication. I never share personal data with third parties.
                  </p>
                </div>

                {/* Agreement Acceptance */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreementAccepted"
                      checked={formData.agreementAccepted}
                      onCheckedChange={(checked) => handleInputChange('agreementAccepted', checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="agreementAccepted" className="text-white text-sm cursor-pointer">
                        I have read and agree to the{" "}
                        <a 
                          href="/partnership-agreement" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-200 underline hover:text-indigo-100"
                        >
                          Pilot Collaboration Agreement
                        </a>
                        {" "}*
                      </Label>
                      {errors.agreementAccepted && (
                        <p className="text-red-400 text-sm mt-1">{errors.agreementAccepted}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Apply for Pilot Role'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Partnership Agreement Notice */}
          <div className="mt-6 text-center">
            <div className="bg-white/5 border-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-indigo-200 text-sm">
                <strong>Before applying:</strong> Please review the{" "}
                <a 
                  href="/partnership-agreement" 
                  className="text-indigo-100 underline hover:text-indigo-50"
                >
                  Pilot Collaboration Agreement
                </a>
                {" "}to understand the terms of our collaborative partnership.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-indigo-300 text-sm">
              Questions before applying? Reach out directly at{" "}
              <a href="mailto:insight@cognitiveinsight.ai" className="text-indigo-200 underline">
                insight@cognitiveinsight.ai
              </a>
              {" "}— I personally review each inquiry.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
