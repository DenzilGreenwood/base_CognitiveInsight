import * as React from "react";
import { Lock, Landmark, Database, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface StoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ icon, title, description }) => (
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

interface YourStorySectionProps {
  className?: string;
}

const YourStorySection: React.FC<YourStorySectionProps> = ({ className }) => {
  const storyItems = [
    {
      icon: <Lock className="w-12 h-12 text-indigo-300" />,
      title: "Early Spark",
      description: "My first encounter with cryptography was in 5th–6th grade while in LD classes. I could crack codes and solve puzzles without yet seeing the bigger system. That mindset—solve tangibly first—stuck with me."
    },
    {
      icon: <Landmark className="w-12 h-12 text-indigo-300" />,
      title: "Compliance Fluency",
      description: "5.5 years in regulated environments taught me what counts as acceptable evidence, and how to work with regulators and auditors to reach provable outcomes."
    },
    {
      icon: <Database className="w-12 h-12 text-indigo-300" />,
      title: "Data Science Bridge",
      description: "As a Master's student in Data Science, I translate between engineering, policy, and assurance—enabling practical, measurable governance."
    },
    {
      icon: <Sparkles className="w-12 h-12 text-indigo-300" />,
      title: "Discovery → CIAF + LCM",
      description: "While encrypting data for an AI support tool, I discovered a scalable approach to AI auditability. This evolved into the Cognitive Insight™ Audit Framework, which includes an efficiency method called Lazy Capsule Materialization (patent-pending)."
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-6xl", className)}>
      <SectionHeader
        kicker="Origin"
        title="From Middle-School Ciphers to Verifiable AI"
        subtitle="A lifelong thread: solving local problems that reveal global opportunity."
      />
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {storyItems.map((item, index) => (
          <StoryCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export { YourStorySection };
