import * as React from "react";
import { AlertTriangle, GitBranch, TimerReset, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ icon, title, description }) => (
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

interface ProblemSectionProps {
  className?: string;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ className }) => {
  const problems = [
    {
      icon: <AlertTriangle className="w-12 h-12 text-amber-300" />,
      title: "Descriptive ≠ Verifiable",
      description: "Model and system cards describe intent, but auditors need independent, tamper-evident proof."
    },
    {
      icon: <GitBranch className="w-12 h-12 text-indigo-300" />,
      title: "Lineage Without Integrity",
      description: "OpenLineage tracks events; without cryptographic anchoring, evidence can be disputed."
    },
    {
      icon: <TimerReset className="w-12 h-12 text-fuchsia-300" />,
      title: "Proof at Production Speed",
      description: "zkML is powerful but often heavy; we need scalable verification paths for live systems."
    },
    {
      icon: <Lock className="w-12 h-12 text-green-300" />,
      title: "Access Control Gaps",
      description: "Without robust access controls, sensitive data can be exposed or misused."
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-6xl", className)}>
      <SectionHeader
        kicker="Problem"
        title="AI Produces Outputs Faster Than We Can Prove Integrity"
        subtitle="Logs are descriptive. Audits need cryptographic evidence and independence."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {problems.map((problem, index) => (
          <ProblemCard
            key={index}
            icon={problem.icon}
            title={problem.title}
            description={problem.description}
          />
        ))}
      </div>
    </section>
  );
};

export { ProblemSection };
