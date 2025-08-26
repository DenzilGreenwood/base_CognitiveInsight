import * as React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
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
            Cognitive Insight™ brings <strong>regulators</strong>, <strong>auditors</strong>, and{" "}
            <strong>AI companies</strong> together to co-create a verifiable foundation for AI auditability. 
            I bridge policy, assurance, and engineering—without exposing sensitive models or data.
          </p> 
          <p>
          </p>        
        </div>
      </section>
  );
};

export { HeroSection };
