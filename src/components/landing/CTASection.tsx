"use client";

import * as React from "react";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { firebaseFunctions } from "@/lib/firebase-functions";

interface CTASectionProps {
  handlePilot?: () => void;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ handlePilot, className }) => {
  const [showPilotForm, setShowPilotForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    organization: "",
    pilotScope: ""
  });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePilotRequest = () => {
    if (handlePilot) {
      handlePilot();
    } else {
      setShowPilotForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await firebaseFunctions.submitPilotRequest({
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        description: `Pilot Request - ${formData.organization}: ${formData.pilotScope}`,
        source: "cta-section"
      });

      if (result.success) {
        setMessage("Thank you! I'll reach out to schedule a scoping conversation.");
        setStatus("success");
        
        // Clear form and close after delay
        setFormData({ name: "", email: "", organization: "", pilotScope: "" });
        setTimeout(() => {
          setShowPilotForm(false);
          setStatus("idle");
        }, 3000);
      } else {
        setMessage(result.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (error: any) {
      console.error("Pilot request error:", error);
      setMessage(error.message || "Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-24 max-w-5xl", className)}>
      <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-r from-indigo-700/40 to-fuchsia-700/30 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_10%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-extrabold">Be Part of the Bridge</h3>
          <p className="text-indigo-100/90 mt-2 max-w-3xl">
            I'm convening regulators, auditors, and AI providers to pilot verifiable AI assurance in real deployments.
            Join as a design partner, pilot participant, or standards collaborator.
          </p>
          
          {!showPilotForm ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Button 
                onClick={handlePilotRequest}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3"
              >
                <Handshake className="w-4 h-4" /> Request Pilot
              </Button>
              <Button 
                variant="outline" 
                onClick={scrollToTop}
                className="bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3"
              >
                <ArrowRight className="w-4 h-4" /> Back to Top
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Request Pilot Program Access</h4>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pilot-name" className="block text-sm text-indigo-200">Name *</Label>
                  <Input 
                    id="pilot-name"
                    required 
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={status === "loading"}
                    className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                    placeholder="Your name" 
                  />
                </div>
                <div>
                  <Label htmlFor="pilot-email" className="block text-sm text-indigo-200">Email *</Label>
                  <Input 
                    id="pilot-email"
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={status === "loading"}
                    className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                    placeholder="your@organization.com" 
                  />
                </div>
                <div>
                  <Label htmlFor="pilot-org" className="block text-sm text-indigo-200">Organization *</Label>
                  <Input 
                    id="pilot-org"
                    required
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                    disabled={status === "loading"}
                    className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                    placeholder="Company/Agency name" 
                  />
                </div>
                <div>
                  <Label htmlFor="pilot-scope" className="block text-sm text-indigo-200">Pilot Scope</Label>
                  <Input 
                    id="pilot-scope"
                    value={formData.pilotScope}
                    onChange={(e) => handleInputChange("pilotScope", e.target.value)}
                    disabled={status === "loading"}
                    className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0 disabled:opacity-50" 
                    placeholder="e.g., LLM audit, compliance check" 
                  />
                </div>
                
                <div className="md:col-span-2 flex items-center gap-3 pt-2">
                  <Button 
                    type="submit"
                    disabled={status === "loading" || !formData.email.trim() || !formData.name.trim()}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3 disabled:opacity-50"
                  >
                    <Handshake className="w-4 h-4" />
                    {status === "loading" ? "Submitting..." : "Submit Pilot Request"}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setShowPilotForm(false)}
                    disabled={status === "loading"}
                    variant="outline"
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-2xl px-5 py-3 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="md:col-span-2 mt-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                    <p className="text-green-300 text-sm">✅ {message}</p>
                  </div>
                )}
                
                {status === "error" && (
                  <div className="md:col-span-2 mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                    <p className="text-red-300 text-sm">❌ {message}</p>
                  </div>
                )}

                {/* GDPR Disclaimer */}
                <div className="md:col-span-2 text-xs text-indigo-300/70">
                  <p>
                    <strong>Privacy Notice:</strong> Your contact information is stored only for pilot program communication 
                    and can be deleted on request.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { CTASection };
