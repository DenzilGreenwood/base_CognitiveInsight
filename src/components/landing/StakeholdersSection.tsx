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
  role?: string;
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({ icon, title, description, accent, role }) => (
  <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg hover:border-white/20 transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-3 rounded-2xl ${accent}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <p className="text-indigo-100/90 mt-2 mb-3">{description}</p>
          {role && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30">
              <span className="text-indigo-200 text-sm font-medium">Pilot Role: {role}</span>
            </div>
          )}
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
      description: "Help guide whether capsules meet the intent of regulations like the NIST AI RMF, ISO/IEC 42001, and the EU AI Act. Review capsule evidence against regulatory requirements and provide input on sufficiency for conformity and monitoring.",
      accent: "bg-blue-500/20",
      role: "Observer & Standards Guide"
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-white" />,
      title: "For Auditors & Compliance Teams", 
      description: "Evaluate capsules in real audit workflows and provide feedback on efficiency and assurance value. Test integration with SOC, ISO, SEC, or HIPAA processes. Validate storage savings and verification speed.",
      accent: "bg-green-500/20",
      role: "Evaluator & Process Integrator"
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      title: "For AI / IT / ML Teams",
      description: "Implement capsule generation inside training and inference pipelines to test performance in real environments. Stress-test Lazy Capsule Materialization under real workloads. Explore how capsules can capture lineage, bias checks, and provenance.",
      accent: "bg-purple-500/20",
      role: "Builder & Validator"
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-6xl", className)}>
      <SectionHeader 
        kicker="Bridge" 
        title="Built for Every Side of the Table" 
        subtitle="I've developed Cognitive Insight™ as a framework in progress. It's not finished — it needs collaboration to become something regulators, auditors, and AI teams can all trust."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {stakeholders.map((stakeholder, index) => (
          <StakeholderCard
            key={index}
            icon={stakeholder.icon}
            title={stakeholder.title}
            description={stakeholder.description}
            accent={stakeholder.accent}
            role={stakeholder.role}
          />
        ))}
      </div>
      
      {/* Together Section */}
      <div className="mt-12">
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-white text-xl mb-4">Together</h3>
              <p className="text-indigo-100/90 mb-4 max-w-3xl mx-auto">
                Bridge perspectives that have often been siloed. Regulators, auditors, and AI builders collaborate to define the first shared framework for verifiable AI audit evidence. Share findings across groups. Refine CIAF + LCM into a trusted standard.
              </p>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30">
                <span className="text-indigo-200 text-sm font-medium">Pilot Role: Co-Creators of the Standard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Collaborative Pilot CTA */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30">
          <h3 className="text-xl font-bold text-white">Ready to Shape the Future Together?</h3>
          <p className="text-indigo-200/80 text-sm max-w-md">
            I'm opening a limited number of collaborative pilot roles in 2025. This isn't just a test — it's a co-design effort with regulators, auditors, and AI teams to ensure verifiable auditability works in practice.
          </p>
          <a
            href="/pilot-request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Apply for a Pilot Role
          </a>
        </div>
      </div>
    </section>
  );
};

export { StakeholdersSection };
