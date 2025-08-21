'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Bot, Shield, Save, Clock, Package, Zap } from "lucide-react";
import { CommitmentForm } from "@/components/commitment-form";
import { SimulationEngine } from "@/components/simulation-engine";
import { Logo } from "@/components/icons";

interface SimulationMetrics {
  storageSavings: number;
  retrievalTime: number;
  datasetSize: number;
  auditRatio: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    storageSavings: 90,
    retrievalTime: 25,
    datasetSize: 500,
    auditRatio: 10,
  });
  
  const [capsulesGenerated] = useState(12485);

  const handleMetricsChange = useCallback((newMetrics: SimulationMetrics) => {
    setMetrics(newMetrics);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <a className="flex items-center justify-center" href="#">
          <Logo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">CognitiveInsight</span>
        </a>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Turn Confusion Into Cryptographic Clarity
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Build trust and transparency in AI with privacy-preserving cryptographic receipts.
            </p>
            <div className="mt-6">
              <Button size="lg">Request a Demo</Button>
            </div>
          </div>
        </section>

        {/* Metrics Visualization */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
            <div className="container px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Backed by 5+ years in compliance and current research in AI governance.</h2>
                    <p className="text-muted-foreground mt-2">Real-time metrics from our simulation engine.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Storage Savings</CardTitle>
                            <Save className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-400">{metrics.storageSavings.toFixed(0)}% reduction</div>
                            <p className="text-xs text-muted-foreground">{metrics.datasetSize} GB shrinks to {(metrics.datasetSize * (metrics.auditRatio / 100)).toFixed(0)} GB</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Retrieval Speed</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{metrics.retrievalTime.toFixed(1)} ms</div>
                            <p className="text-xs text-muted-foreground">Instant verification at scale</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Proofs Generated</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{capsulesGenerated.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total tamper-evident receipts created</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center justify-center gap-2"><Zap className="text-primary"/> Try It Yourself</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mt-2">
                Generate and verify simulated audit commitments. No real data required.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <SimulationEngine onMetricsChange={handleMetricsChange} />
              <CommitmentForm />
            </div>
          </div>
        </section>

        {/* Stakeholder Views */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tailored for Every Stakeholder</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mt-2">
                CognitiveInsight provides unique benefits for regulators, auditors, and AI companies.
              </p>
            </div>
            <Tabs defaultValue="regulators" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="regulators">
                  <Shield className="mr-2 h-4 w-4" /> Regulators
                </TabsTrigger>
                <TabsTrigger value="auditors">
                  <BarChart className="mr-2 h-4 w-4" /> Auditors
                </TabsTrigger>
                <TabsTrigger value="companies">
                  <Bot className="mr-2 h-4 w-4" /> AI Companies
                </TabsTrigger>
              </TabsList>
              <TabsContent value="regulators">
                <Card>
                  <CardHeader>
                    <CardTitle>Independent Verification, Standard-Ready Audit Trails</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Gain transparent, immutable audit trails aligned with standards like the EU AI Act without compromising data privacy. Our verifiable receipts offer a clear audit trail, making it easier to enforce standards.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="auditors">
                <Card>
                  <CardHeader>
                    <CardTitle>Reduce Manual Workload, Cryptographic Confidence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Conduct faster reviews with verifiable cryptographic anchors. Verify model training events, data provenance, and configuration changes instantly, without needing access to raw, sensitive datasets.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="companies">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Without Friction, Protect IP & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Proactively demonstrate compliance and build trust. Our platform helps you maintain a verifiable record of your AI governance practices, reducing liability and enhancing your brand reputation, while protecting data privacy and IP.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* White Paper Access */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Dive Deeper</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Request access to our exclusive white paper for pilot program details and standards mapping.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                <Button type="submit">
                  <FileText className="mr-2 h-4 w-4" />
                  Request White Paper
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="text-xs text-muted-foreground">
            <p>&copy; 2024 CognitiveInsight. Patent Pending. All rights reserved.</p>
            <p>For demonstration purposes only. Cryptographic implementations are proprietary.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
