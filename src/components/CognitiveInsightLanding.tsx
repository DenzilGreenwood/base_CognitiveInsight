import React, { useMemo, useState } from "react";
import {
  HeroSection,
  YourStorySection,
  ProblemSection,
  SolutionSection,
  StakeholdersSection,
  DemoSection,
  WhitePaperSection,
  CTASection,
  Footer,
  type SimulationState,
  type DemoHandlers,
} from "@/components/landing";

/**
 * CognitiveInsight.ai — Bridge Builder Landing Page (Modular)
 * ---------------------------------------------------------------
 * • Stack: React + Tailwind (modular components)
 * • Purpose: Serve as your bridge-building homepage without revealing patent IP.
 * • Sections: Hero, Social Proof, Your Story, Problem, Solution (CIAF + LCM),
 *   Stakeholders, Demo (simulated), White Paper (form), CTA, Footer
 * • Note: Keep the headline "Turn Confusion into Cryptographic Clarity" as requested.
 */

export default function CognitiveInsightLanding() {
  const [dataset, setDataset] = useState(1000); // Changed to match DemoSection range (10-10000 GB)
  const [auditRatio, setAuditRatio] = useState(10);
  const storageSaved = useMemo(() => 85, []);

  const estimatedRetrievalMs = useMemo(() => {
    // playful heuristic: lower latency with higher audit ratio up to a point (simulated)
    const base = 45; // ms
    const factor = Math.max(1, 100 / (auditRatio + 20));
    return Math.round(base * factor);
  }, [auditRatio]);

  const simulationState: SimulationState = {
    dataset,
    auditRatio,
    storageSaved,
    estimatedRetrievalMs,
  };

  const handlers: DemoHandlers = {
    handleWhitePaper: () => {
      // Scroll to WhitePaper section
      const element = document.querySelector('[data-section="whitepaper"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(
          "Thanks! We'll share the white paper via email after a quick intro call. (In production, this button routes to your form or CRM.)"
        );
      }
    },
    handleDemo: () => {
      // Scroll to Demo section
      const element = document.querySelector('[data-section="demo"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/demo';
      }
    },
    handlePilot: () => {
      alert(
        "Thanks for your interest in a pilot! We'll follow up to schedule a scoping conversation."
      );
    },
  };

  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)]" />
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl">
        {/* Sections */}
        <HeroSection 
          handlers={handlers} 
          estimatedRetrievalMs={estimatedRetrievalMs} 
        />
        
        <YourStorySection />
        
        <ProblemSection />
        
        <SolutionSection storageSaved={storageSaved} />
        
        <StakeholdersSection />
        
        <DemoSection
          data-section="demo"
          simulation={simulationState}
          onDatasetChange={setDataset}
          onAuditRatioChange={setAuditRatio}
          handlers={handlers}
        />
        
        <WhitePaperSection data-section="whitepaper" />
        
        <CTASection handlers={handlers} />
        
        <Footer />
      </div>
    </main>
  );
}
