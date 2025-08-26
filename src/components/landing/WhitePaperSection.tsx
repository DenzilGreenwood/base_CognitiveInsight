"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

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
      const response = await fetch("/api/white-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          useCase: `White Paper Request - ${formData.organization}`,
          source: "white-paper"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setMessage("Thank you for your request. Each submission is reviewed to ensure relevance. If approved, you’ll receive the white paper and pilot details by email. This is a collaborative process—please review the material and, if it aligns, let’s consider a pilot partnership to shape the future direction together.");
      setStatus("success");
      
      // Clear form
      setFormData({ name: "", email: "", organization: "" });

    } catch (error) {
      console.error("White paper request error:", error);
      setMessage("Network error. Please check your connection and try again.");
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
        title="Deeper Dive Without Giving Away the IP"
        subtitle="Get the high-level design, standard alignment, and pilot options."
      />
    
      <Card className="mt-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
        <CardContent className="p-6">
            <div className="p-4">
            <p>
              Please provide your details below to request access.            
            </p>
            <p className="sm:col-span-2 mt-4 text-sm text-indigo-300/70">
              White papers are shared selectively with interested regulators, auditors, and AI partners to ensure alignment and constructive feedback.
            </p>

          </div>
          <form className="grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="block text-sm text-indigo-200">Name</Label>
              <Input 
                id="name"
                required 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={status === "loading"}
                className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                placeholder="Jane Doe" 
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm text-indigo-200">Email</Label>
              <Input 
                id="email"
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={status === "loading"}
                className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                placeholder="jane@org.com" 
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="organization" className="block text-sm text-indigo-200">Organization & Role</Label>
              <Input 
                id="organization"
                value={formData.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                disabled={status === "loading"}
                className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                placeholder="Regulator, Auditor, or AI Company" 
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <Button 
                type="submit"
                disabled={status === "loading" || !formData.email.trim()}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" /> 
                {status === "loading" ? "Submitting..." : "Request White Paper"}
              </Button>
              <p className="text-sm text-indigo-300/80">By requesting this white paper, you agree to our terms and conditions.</p>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="sm:col-span-2 mt-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                <p className="text-green-300 text-sm">✅ {message}</p>
              </div>
            )}
            
            {status === "error" && (
              <div className="sm:col-span-2 mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                <p className="text-red-300 text-sm">❌ {message}</p>
              </div>
            )}

            {/* GDPR Disclaimer */}
            <div className="sm:col-span-2 mt-4 text-xs text-indigo-300/70">
              <p>
                <strong>Privacy Notice:</strong> Your name and email are stored only to provide updates on Cognitive Insight™ 
                and can be deleted on request. 
              </p>
              <p><strong> Important Notice:</strong> The white paper provides a high-level overview for regulators, compliance professionals, and AI teams. It <strong>does not include</strong> cryptographic implementations.</p>
              
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export { WhitePaperSection };
