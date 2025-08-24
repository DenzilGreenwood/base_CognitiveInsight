"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeroSection,
  YourStorySection,
  ProblemSolutionSection,
  StakeholdersSection,
  Footer,
   type SimulationState,
} from "@/components/landing";
import MetricsKPI from "./landing/MetricsKPI";

/**
 * CognitiveInsight.ai — Bridge Builder Landing Page (Modular)
 * ---------------------------------------------------------------
 * • Stack: React + Tailwind (modular components)
 * • Purpose: Serve as your bridge-building homepage without revealing patent IP.
 * • Sections: Hero, Social Proof, Your Story, Problem, Solution (CIAF + LCM),
 *   Stakeholders, Footer
 * • Note: Keep the headline "Turn Confusion into Cryptographic Clarity" as requested.
 */

export default function CognitiveInsightLanding() {
  const router = useRouter();
  const [auditRatio, setAuditRatio] = useState(10);
  const storageSaved = useMemo(() => 85, []);

  const estimatedRetrievalMs = useMemo(() => {
    // playful heuristic: lower latency with higher audit ratio up to a point (simulated)
    const base = 45; // ms
    const factor = Math.max(1, 100 / (auditRatio + 20));
    return Math.round(base * factor);
  }, [auditRatio]);

  return (
    <main className="relative min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)] pointer-events-none -z-10" />
      <div className="relative container mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl">
        {/* Sections */}
        <HeroSection
          estimatedRetrievalMs={estimatedRetrievalMs}
          className=""
        />

        <MetricsKPI
          storageSavedPct={85}
          verifyMs={150}
          alignment="NIST • ISO • EU AI Act"
        />
        
        <YourStorySection />
        
        <ProblemSolutionSection storageSaved={storageSaved} />
        
        <StakeholdersSection />
        
        <Footer />
      </div>
    </main>
  );
}
