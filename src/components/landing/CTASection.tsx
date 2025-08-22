import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoHandlers } from "./types";

interface CTASectionProps {
  handlers: DemoHandlers;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ handlers, className }) => {
  const { handlePilot } = handlers;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-24 max-w-5xl", className)}>
      <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-r from-indigo-700/40 to-fuchsia-700/30 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_10%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-extrabold">Be Part of the Bridge</h3>
          <p className="text-indigo-100/90 mt-2 max-w-3xl">
            We're convening regulators, auditors, and AI providers to pilot verifiable AI assurance in real deployments.
            Join as a design partner, pilot participant, or standards collaborator.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              onClick={handlePilot}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3"
            >
              <HandshakeIcon /> Request Pilot
            </Button>
            <Button 
              variant="outline" 
              onClick={scrollToTop}
              className="bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3"
            >
              <ArrowRight className="w-4 h-4" /> Back to Top
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Inline icon for handshake */
function HandshakeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-12 h-12"
    >
      <path d="M8 11l4 4 4-4" />
      <path d="M2 8h5l5-4 5 4h5" />
    </svg>
  );
}

export { CTASection };
