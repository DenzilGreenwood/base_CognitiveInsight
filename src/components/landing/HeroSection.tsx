import * as React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  handleWhitePaper: () => void;
  handlePilot: () => void;
  estimatedRetrievalMs: number;
  className?: string;
}

interface StatsCardProps {
  label: string;
  value: string;
  index?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 0.9 }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
    whileHover={{ 
      scale: 1.0,
      transition: { duration: 0.2 }
    }}
  >
    <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-indigo-200/80">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const HeroSection: React.FC<HeroSectionProps> = ({ 
  handleWhitePaper, 
  handlePilot,
  estimatedRetrievalMs, 
  className 
}) => {
  const statsData = [
    { label: "Storage Savings", value: "~85%" },
    { label: "Verification", value: `~${estimatedRetrievalMs}ms` },
    { label: "Alignment", value: "NIST • ISO • EU AI Act" },
    { label: "Privacy", value: "No model/data exposure" },
  ];

  return (
    <section className={cn("relative overflow-hidden", className)}>
        <div className="flex flex-col items-center text-center gap-6">
          <Badge className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5" /> Patent-pending • Privacy-first • Verifiable
          </Badge>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
          >
            Turn Confusion into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">
              Cryptographic Clarity
            </span>
          </motion.h1>
          
          <p className="max-w-3xl text-indigo-100/90 text-lg">
            Cognitive Insight™ connects <strong>regulators</strong>, <strong>auditors</strong>, and{" "}
            <strong>AI companies</strong> with cryptographically verifiable auditability. I bridge policy, 
            assurance, and engineering—without exposing sensitive models or data.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button 
              onClick={handleWhitePaper}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3"
            >
              <FileText className="w-4 h-4" /> Request White Paper
            </Button>
            <Button 
              variant="ghost" 
              onClick={handlePilot}
              data-pilot-button
              className="bg-transparent text-indigo-100 hover:text-white hover:bg-white/10 rounded-2xl px-5 py-3"
            >
              <HandshakeIcon /> Request Pilot <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-1 pt-8 w-full max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {statsData.map((item, index) => (
              <StatsCard 
                key={item.label} 
                label={item.label} 
                value={item.value} 
                index={index}
              />
            ))}
          </motion.div>
          
          <motion.p 
            className="text-xs text-indigo-300/60 mt-4 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            * Performance metrics based on internal simulations; results vary by workload and configuration.
          </motion.p>
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
      className="w-4 h-4"
    >
      <path d="M8 11l4 4 4-4" />
      <path d="M2 8h5l5-4 5 4h5" />
    </svg>
  );
}

export { HeroSection };
