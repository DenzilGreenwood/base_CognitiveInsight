import * as React from "react";
import { 
  Gavel, 
  ClipboardCheck, 
  Building2, 
  ShieldCheck 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface StakeholderCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({ icon, title, description, accent }) => (
  <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg hover:border-white/20 transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-3 rounded-2xl ${accent}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <p className="text-indigo-100/90 mt-2">{description}</p>
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
      icon: <Gavel className="w-8 h-8 text-white" />,
      title: "For Regulators",
      description: "Independent, cryptographic verification aligned to NIST AI RMF, ISO/IEC 42001, and the EU AI Act's conformity assessment and post-market monitoring.",
      accent: "bg-blue-500/20"
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-white" />,
      title: "For Auditors", 
      description: "Turn reports into verifiable proof capsules. Reduce storage and verification friction while increasing confidence with clients and oversight bodies.",
      accent: "bg-green-500/20"
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      title: "For AI Companies",
      description: "Demonstrate compliance claims without exposing IP. Build trust with buyers, auditors, and regulators using cryptographic evidence, not promises.",
      accent: "bg-purple-500/20"
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
            accent={stakeholder.accent}
          />
        ))}
      </div>
      
      {/* Pilot Program CTA */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30">
          <h3 className="text-xl font-bold text-white">Ready to Bridge the Gap?</h3>
          <p className="text-indigo-200/80 text-sm max-w-md">
            Join my exclusive pilot program to implement verifiable AI auditability in your organization.
          </p>
          <a
            href="/pilot-request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Request Pilot Program
          </a>
        </div>
      </div>
    </section>
  );
};

export { StakeholdersSection };
