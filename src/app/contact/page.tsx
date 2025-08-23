"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  User, 
  Building2,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  name: string;
  email: string;
  organization: string;
  subject: string;
  category: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    subject: "",
    category: "",
    message: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact-page'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Redirect to thank you page after a short delay
        setTimeout(() => {
          router.push('/thank-you?type=contact');
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to submit contact form');
      }
    } catch (error) {
      console.error('Contact form error:', error);
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
            <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
            <p className="text-indigo-200 mb-6">
              Thank you for reaching out to us. We'll get back to you within 24 hours.
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
      
      <div className="container mx-auto px-6 py-16 max-w-6xl">
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
              Contact Us
            </h1>
            <p className="text-indigo-200 text-lg">
              Get in touch with our team. We're here to help you understand how 
              Cognitive Insight™ can provide verifiable AI assurance for your organization.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Email */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-indigo-400 mt-1 mr-4" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Email Us</h3>
                      <p className="text-indigo-200 text-sm mb-2">
                        For general inquiries and support
                      </p>
                      <a 
                        href="mailto:insight@cognitiveinsight.ai" 
                        className="text-indigo-300 hover:text-indigo-200 underline"
                      >
                        insight@cognitiveinsight.ai
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-indigo-400 mt-1 mr-4" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Response Time</h3>
                      <p className="text-indigo-200 text-sm mb-2">
                        We typically respond within
                      </p>
                      <p className="text-indigo-300 font-medium">24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-indigo-400 mt-1 mr-4" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Location</h3>
                      <p className="text-indigo-200 text-sm mb-2">
                        Based in United States
                      </p>
                      <p className="text-indigo-300 text-sm">
                        Supporting global organizations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <MessageSquare className="w-6 h-6 text-indigo-400 mt-1 mr-4" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Get Support</h3>
                      <p className="text-indigo-200 text-sm mb-2">
                        Technical questions and pilot program inquiries
                      </p>
                      <p className="text-indigo-300 text-sm">
                        Use the form to get detailed assistance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-4">
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
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Organization and Category Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Organization Field */}
                      <div className="space-y-2">
                        <Label htmlFor="organization" className="text-white flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          Organization (Optional)
                        </Label>
                        <Input
                          id="organization"
                          type="text"
                          value={formData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Enter your organization"
                        />
                      </div>

                      {/* Category Field */}
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white">
                          Inquiry Type
                        </Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-white text-black">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="pilot">Pilot Program</SelectItem>
                            <SelectItem value="technical">Technical Questions</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="media">Media & Press</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">
                        Subject (Optional)
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Brief subject line"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[150px]"
                        placeholder="Tell us about your inquiry, requirements, or how we can help you..."
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm">{errors.message}</p>
                      )}
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
                        <strong>Privacy Notice:</strong> By submitting this form, you consent to Cognitive Insight 
                        processing your information to respond to your inquiry. We never share personal data with 
                        third parties. Read our{" "}
                        <a href="/privacy" className="text-indigo-300 underline hover:text-indigo-200">
                          Privacy Policy
                        </a>{" "}
                        for more details.
                      </p>
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
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* FAQ */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">What is Cognitive Insight™?</h4>
                  <p className="text-indigo-200 text-sm">
                    Cognitive Insight™ is a verifiable AI assurance platform that provides cryptographic 
                    proof of AI system integrity and compliance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">How can I join the pilot program?</h4>
                  <p className="text-indigo-200 text-sm">
                    Contact us through this form or visit our{" "}
                    <a href="/pilot-request" className="text-indigo-300 underline">pilot request page</a> 
                    {" "}to apply directly.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Do you provide technical support?</h4>
                  <p className="text-indigo-200 text-sm">
                    Yes, we provide comprehensive technical support for pilot program participants 
                    and enterprise customers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="/pilot-request" 
                  className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="font-semibold text-white">Pilot Program</div>
                  <div className="text-indigo-200 text-sm">Apply for early access</div>
                </a>
                <a 
                  href="/#whitepaper" 
                  className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="font-semibold text-white">White Paper</div>
                  <div className="text-indigo-200 text-sm">Download our research</div>
                </a>
                <a 
                  href="/privacy" 
                  className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="font-semibold text-white">Privacy Policy</div>
                  <div className="text-indigo-200 text-sm">Learn about data protection</div>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-indigo-300 text-sm">
              For urgent matters, please email us directly at{" "}
              <a href="mailto:insight@cognitiveinsight.ai" className="text-indigo-200 underline">
                insight@cognitiveinsight.ai
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
