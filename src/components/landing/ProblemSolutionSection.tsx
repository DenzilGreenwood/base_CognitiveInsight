import * as React from "react";
import { 
  AlertTriangle, 
  GitBranch, 
  TimerReset, 
  Receipt, 
  GaugeCircle, 
  ShieldCheck, 
  Lock,
  ArrowRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ icon, title, description }) => (
  <Card className="rounded-3xl border border-red-400/20 bg-red-500/5 backdrop-blur shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-red-100/80">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SolutionCard: React.FC<SolutionCardProps> = ({ icon, title, description }) => (
  <Card className="rounded-3xl border border-green-400/20 bg-green-500/5 backdrop-blur shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-green-100/80">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ProblemSolutionSectionProps {
  storageSaved: number;
  className?: string;
}

const formatPercent = (n: number) => `${Math.round(n)}%`;

const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = ({ storageSaved, className }) => {
  const problems = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-amber-300" />,
      title: "Descriptive ≠ Verifiable",
      description: "Model and system cards describe intent, but auditors need independent, tamper-evident proof."
    },
    {
      icon: <GitBranch className="w-8 h-8 text-amber-300" />,
      title: "Lineage Without Integrity",
      description: "OpenLineage tracks events; without cryptographic anchoring, evidence can be disputed."
    },
    {
      icon: <TimerReset className="w-8 h-8 text-amber-300" />,
      title: "Proof at Production Speed",
      description: "zkML is powerful but often heavy; we need scalable verification paths for live systems."
    }
  ];

  const solutions = [
    {
      icon: <Receipt className="w-8 h-8 text-emerald-300" />,
      title: "Proof Capsules",
      description: "Tamper-evident receipts for training, inference, configuration, and compliance events."
    },
    {
      icon: <GaugeCircle className="w-8 h-8 text-emerald-300" />,
      title: "LCM Efficiency",
      description: `Generate capsules on demand. Internal tests show ~${formatPercent(storageSaved)} storage reduction.`
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-300" />,
      title: "Merkle Anchoring",
      description: "Capsules are chained with cryptographic commitments for rapid, trustworthy verification."
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-24 max-w-7xl", className)}>
      <SectionHeader
        kicker="The Challenge & Our Answer"
        title="From AI Audit Confusion to Cryptographic Clarity"
        subtitle="Today's compliance is descriptive. Tomorrow's needs to be verifiable."
      />
      
      <div className="mt-16 grid lg:grid-cols-2 gap-16">
        {/* Problem Side */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">The Problem</h3>
          </div>
          <div className="space-y-6">
            {problems.map((problem, index) => (
              <ProblemCard
                key={index}
                icon={problem.icon}
                title={problem.title}
                description={problem.description}
              />
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-red-600/10 border border-red-400/30">
            <p className="text-red-100/90 text-sm">
              <strong>Current state:</strong> AI produces outputs faster than we can prove integrity. 
              Auditors need cryptographic evidence, not just documentation.
            </p>
          </div>
        </div>

        {/* Arrow for larger screens */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <ArrowRight className="w-12 h-12 text-indigo-300" />
            <span className="text-indigo-300 font-semibold">CIAF + LCM</span>
          </div>
        </div>

        {/* Solution Side */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-green-500/20">
              <ShieldCheck className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Solution</h3>
          </div>
          <div className="space-y-6">
            {solutions.map((solution, index) => (
              <SolutionCard
                key={index}
                icon={solution.icon}
                title={solution.title}
                description={solution.description}
              />
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30">
            <p className="text-indigo-100/90 text-sm">
              <strong>Beyond encryption & checksums:</strong> CIAF capsules provide auditable provenance — 
              who created data, when, and how — not just confidentiality.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Arrow */}
      <div className="lg:hidden flex items-center justify-center my-8">
        <div className="flex items-center gap-4">
          <ArrowRight className="w-8 h-8 text-indigo-300 rotate-90" />
          <span className="text-indigo-300 font-semibold">CIAF + LCM</span>
        </div>
      </div>
    </section>
  );
};

export { ProblemSolutionSection };
