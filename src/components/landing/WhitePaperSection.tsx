"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { firebaseFunctions } from "@/lib/firebase-functions";

interface WhitePaperSectionProps {
  className?: string;
}

const WhitePaperSection: React.FC<WhitePaperSectionProps> = ({ className }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    organization: ""
  });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await firebaseFunctions.requestWhitePaper({
        name: formData.name.trim() || undefined,
        email: formData.email.trim(),
        company: formData.organization.trim() || undefined,
        intent: `White Paper Request - ${formData.organization}`
      });

      if (result.ok) {
        setMessage("Thank you for your interest in collaborating on verifiable AI auditability. Each submission is reviewed to ensure mutual fit. If there&apos;s alignment, you&apos;ll receive the white paper and partnership details by email. This is about co-designing solutions—please review the material and, if it resonates, let&apos;s explore how we can work together to shape the future of AI compliance.");
        setStatus("success");
        
        // Clear form
        setFormData({ name: "", email: "", organization: "" });
      } else {
        setMessage("Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (error: unknown) {
      console.error("White paper request error:", error);
      const errorMessage = error instanceof Error ? error.message : "Network error. Please check your connection and try again.";
      setMessage(errorMessage);
      setStatus("error");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-4xl", className)}>
      <SectionHeader
        kicker="White Paper"
        title="Explore Collaborative Opportunities"
        subtitle="Get the high-level design, standard alignment, and pilot partnership options."
      />
      
      <div className="mt-12 grid md:grid-cols-2 gap-8 items-start">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold">What You'll Get</h3>
            </div>
            
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>Technical architecture for cryptographic commitment proofs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>Integration pathways with emerging AI governance standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>Pilot collaboration framework and partnership opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>Timeline for implementation and compliance readiness</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  className="bg-slate-900/50 border-slate-600 focus:border-indigo-500"
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="bg-slate-900/50 border-slate-600 focus:border-indigo-500"
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium">
                  Organization
                </Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                  placeholder="Your organization"
                  className="bg-slate-900/50 border-slate-600 focus:border-indigo-500"
                  disabled={status === "loading"}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={status === "loading" || !formData.email.trim()}
              >
                {status === "loading" ? "Requesting..." : "Request White Paper"}
              </Button>

              {status === "success" && (
                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <p className="text-green-300 text-sm">{message}</p>
                </div>
              )}

              {status === "error" && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-red-300 text-sm">{message}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { WhitePaperSection };
