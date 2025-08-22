import * as React from "react";
import { Landmark, Building2, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface StakeholderCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({ icon, title, description }) => (
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

interface StakeholdersSectionProps {
  className?: string;
}

const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({ className }) => {
  const stakeholders = [
    {
      icon: <Landmark className="w-12 h-12 text-indigo-300" />,
      title: "For Regulators",
      description: "Independent, cryptographic verification aligned to NIST AI RMF, ISO/IEC 42001, and the EU AI Act's conformity assessment and post-market monitoring."
    },
    {
      icon: <Building2 className="w-12 h-12 text-indigo-300" />,
      title: "For Auditors",
      description: "Turn reports into verifiable proof capsules. Reduce storage and verification friction while increasing confidence with clients and oversight bodies."
    },
    {
      icon: <LinkIcon className="w-12 h-12 text-indigo-300" />,
      title: "For AI Companies",
      description: "Demonstrate compliance claims without exposing IP. Build trust with buyers, auditors, and regulators using cryptographic evidence, not promises."
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-6xl", className)}>
      <SectionHeader 
        kicker="Bridge" 
        title="Built for Every Side of the Table" 
      />
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {stakeholders.map((stakeholder, index) => (
          <StakeholderCard
            key={index}
            icon={stakeholder.icon}
            title={stakeholder.title}
            description={stakeholder.description}
          />
        ))}
      </div>
    </section>
  );
};

export { StakeholdersSection };
