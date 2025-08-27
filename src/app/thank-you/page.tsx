"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, FileText, Rocket } from 'lucide-react';
import { Suspense } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') || 'general';

  const getContent = () => {
    switch (type) {
      case 'pilot':
        return {
          icon: <Rocket className="w-16 h-16 text-indigo-400 mx-auto mb-6" />,
          title: "Pilot Request Submitted!",
          description: "Thank you for your interest in my pilot program. I'll reach out within 24-48 hours to schedule a scoping conversation to discuss your specific requirements and use case.",
          email: "You should receive a confirmation email shortly with next steps."
        };
      case 'whitepaper':
        return {
          icon: <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-6" />,
          title: "White Paper Request Received!",
          description: "Thank you for your interest in my white paper. I'll send you the document along with additional resources that might be relevant to your use case.",
          email: "Please check your email for the white paper and follow-up information."
        };
      case 'contact':
        return {
          icon: <CheckCircle className="w-16 h-16 text-indigo-400 mx-auto mb-6" />,
          title: "Message Sent Successfully!",
          description: "Thank you for contacting me. I've received your message and will respond within 24 hours. I appreciate your interest in Cognitive Insight™.",
          email: "You should receive a confirmation email shortly acknowledging your inquiry."
        };
      default:
        return {
          icon: <CheckCircle className="w-16 h-16 text-indigo-400 mx-auto mb-6" />,
          title: "Thank You!",
          description: "Your request has been submitted successfully. I appreciate your interest in Cognitive Insight™ and will get back to you soon.",
          email: "Please check your email for a confirmation and next steps."
        };
    }
  };

  const content = getContent();

  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="text-center max-w-2xl relative">
        {content.icon}
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
          {content.title}
        </h1>
        
        <p className="text-lg text-indigo-100/90 mb-4">
          {content.description}
        </p>
        
        <p className="text-indigo-200 mb-8">
          {content.email}
        </p>
        
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400">
            Return to Homepage
          </Link>
        </div>
        
        <p className="mt-6 text-sm text-indigo-300/80">
          If you don't receive an email within a few minutes, please check your spam folder or contact me at{" "}
          <a href="mailto:insight@cognitiveinsight.ai" className="text-indigo-200 underline">
            insight@cognitiveinsight.ai
          </a>
        </p>
      </div>
    </main>
  );
}
