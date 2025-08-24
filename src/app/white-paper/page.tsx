"use client";

import React from "react";
import { WhitePaperSection } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * White Paper Request Page
 * -----------------------
 * Dedicated page for white paper requests, separated from the main landing page.
 */

export default function WhitePaperPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="relative min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      
      {/* Header with back button */}
      <div className="relative container mx-auto px-6 pt-8">
        <Button 
          onClick={handleBack}
          variant="ghost"
          className="text-indigo-200 hover:text-white hover:bg-white/10 rounded-2xl px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* White Paper Section */}
      <div className="relative">
        <WhitePaperSection />
      </div>
    </main>
  );
}
