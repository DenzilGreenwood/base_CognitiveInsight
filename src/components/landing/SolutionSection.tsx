import * as React from "react";
import { Receipt, GaugeCircle, ShieldCheck, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ icon, title, description }) => (
  <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-indigo-100/90">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface SolutionSectionProps {
  storageSaved: number;
  className?: string;
}

const formatPercent = (n: number) => `${Math.round(n)}%`;

const SolutionSection: React.FC<SolutionSectionProps> = ({ storageSaved, className }) => {
  const solutions = [
    {
      icon: <Receipt className="w-8 h-8 text-emerald-300" />,
      title: "Proof Capsules",
      description: "Tamper-evident receipts for training, inference, configuration, and compliance events. Auditors and regulators can independently verify without accessing sensitive data."
    },
    {
      icon: <GaugeCircle className="w-8 h-8 text-sky-300" />,
      title: "LCM Efficiency",
      description: `Generate capsules on demand for the events that matter. Our internal tests show ~${formatPercent(storageSaved)} storage reduction versus eager logging.`
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-teal-300" />,
      title: "Capsule Anchoring",
      description: "Capsules are chained with cryptographic commitments for rapid, trustworthy verification."
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-300" />,
      title: "Privacy by Design",
      description: "Prove compliance claims without disclosing model weights, prompts, or proprietary data."
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-6xl", className)}>
      <SectionHeader
        kicker="Solution"
        title="CIAF + Lazy Capsule Materialization"
        subtitle="Selective, verifiable, privacy-preserving audit capsules anchored with cryptographic chains."
      />
      
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30">
        <p className="text-indigo-100/90 text-sm">
          <strong>Beyond encryption & checksums:</strong> Unlike basic encryption or checksums, CIAF capsules provide auditable provenance — who created data, when, and how — not just confidentiality.
        </p>
      </div>
      
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {solutions.map((solution, index) => (
          <SolutionCard
            key={index}
            icon={solution.icon}
            title={solution.title}
            description={solution.description}
          />
        ))}
      </div>
    </section>
  );
};

export { SolutionSection };
