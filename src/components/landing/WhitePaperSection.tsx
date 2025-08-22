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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Thanks! We'll email the white paper after reviewing your request. In production, wire this form to your CRM."
    );
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
          <form className="grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="block text-sm text-indigo-200">Name</Label>
              <Input 
                id="name"
                required 
                className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0" 
                placeholder="Jane Doe" 
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm text-indigo-200">Email</Label>
              <Input 
                id="email"
                type="email" 
                required 
                className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0" 
                placeholder="jane@org.com" 
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="organization" className="block text-sm text-indigo-200">Organization & Role</Label>
              <Input 
                id="organization"
                className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0" 
                placeholder="Regulator, Auditor, or AI Company" 
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <Button 
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3"
              >
                <FileText className="w-4 h-4" /> Request White Paper
              </Button>
              <p className="text-sm text-indigo-300/80">Patent-pending. Cryptographic implementations withheld.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export { WhitePaperSection };
