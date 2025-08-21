'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Link as LinkIcon,
  Lock,
  Receipt,
  Landmark,
  Building2,
  Activity,
  GaugeCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Database,
  GitBranch,
  TimerReset,
  Vote,
  Handshake,
} from 'lucide-react';

/**
 * CognitiveInsight.ai — Bridge Builder Landing Page (Single File)
 * ---------------------------------------------------------------
 * • Stack: React + Tailwind (single-file component)
 * • Purpose: Serve as your bridge-building homepage without revealing patent IP.
 * • Sections: Hero, Social Proof, Your Story, Problem, Solution (CIAF + LCM),
 *   Stakeholders, Demo (simulated), White Paper (form), CTA, Footer
 * • Note: Keep the headline "Turn Confusion into Cryptographic Clarity" as requested.
 */

/** Simple UI primitives (Tailwind only) */
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}> = ({ children, onClick, as = 'button', href, variant = 'primary', className = '' }) => {
  const base =
    'inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles: Record<string, string> = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-400 dark:focus:ring-indigo-600',
    secondary:
      'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 focus:ring-indigo-200',
    ghost:
      'bg-transparent text-indigo-100 hover:text-white hover:bg-white/10 focus:ring-white/30',
  };
  if (as === 'a' && href) {
    return (
      <a className={`${base} ${styles[variant]} ${className}`} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-lg ${className}`}>{children}</div>
);

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${className}`}>{children}</span>
);

const SectionHeader: React.FC<{ kicker?: string; title: string; subtitle?: string }> = ({ kicker, title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center space-y-3">
    {kicker && (
      <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">{kicker}</p>
    )}
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-indigo-100/90 text-base md:text-lg">{subtitle}</p>
    )}
  </div>
);

/** Utility */
const formatPercent = (n: number) => `${Math.round(n)}%`;

export default function CognitiveInsightLanding() {
  const [dataset, setDataset] = useState(300);
  const [auditRatio, setAuditRatio] = useState(10);
  const storageSaved = useMemo(() => 85, []);

  const handleWhitePaper = () => {
    alert(
      "Thanks! We'll share the white paper via email after a quick intro call. (In production, this button routes to your form or CRM.)"
    );
  };

  const handleDemo = () => {
    alert(
      'Launching Demo Simulation... (In production, route to /demo or open the interactive simulator.)'
    );
  };

  const handlePilot = () => {
    alert(
      "Thanks for your interest in a pilot! We'll follow up to schedule a scoping conversation."
    );
  };

  const estimatedRetrievalMs = useMemo(() => {
    // playful heuristic: lower latency with higher audit ratio up to a point (simulated)
    const base = 45; // ms
    const factor = Math.max(1, 100 / (auditRatio + 20));
    return Math.round(base * factor);
  }, [auditRatio]);

  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)]" />
        <div className="container mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl">
          <div className="flex flex-col items-center text-center gap-6">
            <Badge className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/20">
              <Sparkles className="w-3.5 h-3.5" /> Patent-pending • Privacy-first • Verifiable
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
            >
              Turn Confusion into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">Cryptographic Clarity</span>
            </motion.h1>
            <p className="max-w-3xl text-indigo-100/90 text-lg">
              Cognitive Insight™ connects <strong>regulators</strong>, <strong>auditors</strong>, and <strong>AI companies</strong>
              with cryptographically verifiable auditability. We bridge policy, assurance, and engineering—without exposing
              sensitive models or data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button onClick={handleWhitePaper}>
                <FileText className="w-4 h-4" /> Request White Paper
              </Button>
              <Button variant="secondary" onClick={handleDemo}>
                <Activity className="w-4 h-4" /> Explore Demo
              </Button>
              <Button variant="ghost" onClick={handlePilot}>
                <Handshake className="w-4 h-4" /> Request Pilot <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 w-full max-w-3xl">
              {[
                { label: 'Storage Savings', value: '~85%' },
                { label: 'Verification', value: '~' + estimatedRetrievalMs + 'ms' },
                { label: 'Alignment', value: 'NIST • ISO • EU AI Act' },
                { label: 'Privacy', value: 'No model/data exposure' },
              ].map((item) => (
                <Card key={item.label} className="text-center">
                  <p className="text-sm text-indigo-200/80">{item.label}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YOUR STORY */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <SectionHeader
          kicker="Origin"
          title="From Middle-School Ciphers to Verifiable AI"
          subtitle="A lifelong thread: solving local problems that reveal global opportunity."
        />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">Early Spark</h3>
                <p className="text-indigo-100/90">
                  My first encounter with cryptography was in 5th–6th grade while in LD classes. I could crack codes and
                  solve puzzles without yet seeing the bigger system. That mindset—solve tangibly first—stuck with me.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <Landmark className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">Compliance Fluency</h3>
                <p className="text-indigo-100/90">
                  5.5 years in regulated environments taught me what counts as acceptable evidence, and how to work with
                  regulators and auditors to reach provable outcomes.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <Database className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">Data Science Bridge</h3>
                <p className="text-indigo-100/90">
                  As a Master’s student in Data Science, I translate between engineering, policy, and assurance—enabling
                  practical, measurable governance.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">Discovery → CIAF + LCM</h3>
                <p className="text-indigo-100/90">
                  While encrypting data for an AI support tool, I discovered a scalable way to make AI auditable. That
                  became the Cognitive Insight™ Audit Framework with Lazy Capsule Materialization.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <SectionHeader
          kicker="Problem"
          title="AI Produces Outputs Faster Than We Can Prove Integrity"
          subtitle="Logs are descriptive. Audits need cryptographic evidence and independence."
        />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <AlertTriangle className="w-6 h-6 text-amber-300" />,
              title: 'Descriptive ≠ Verifiable',
              text: 'Model and system cards describe intent, but auditors need independent, tamper-evident proof.',
            },
            {
              icon: <GitBranch className="w-6 h-6 text-indigo-300" />,
              title: 'Lineage Without Integrity',
              text: 'OpenLineage tracks events; without cryptographic anchoring, evidence can be disputed.',
            },
            {
              icon: <TimerReset className="w-6 h-6 text-fuchsia-300" />,
              title: 'Proof at Production Speed',
              text: 'zkML is powerful but often heavy; we need scalable verification paths for live systems.',
            },
          ].map((b, i) => (
            <Card key={i}>
              <div className="flex items-start gap-4">
                {b.icon}
                <div>
                  <h3 className="font-semibold text-white">{b.title}</h3>
                  <p className="text-indigo-100/90">{b.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <SectionHeader
          kicker="Solution"
          title="CIAF + Lazy Capsule Materialization"
          subtitle="Selective, verifiable, privacy-preserving audit capsules anchored with cryptographic chains."
        />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-start gap-4">
              <Receipt className="w-6 h-6 text-emerald-300" />
              <div>
                <h3 className="font-semibold text-white">Proof Capsules</h3>
                <p className="text-indigo-100/90">
                  Tamper-evident receipts for training, inference, configuration, and compliance events. Auditors and
                  regulators can independently verify without accessing sensitive data.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <GaugeCircle className="w-6 h-6 text-sky-300" />
              <div>
                <h3 className="font-semibold text-white">LCM Efficiency</h3>
                <p className="text-indigo-100/90">
                  Generate capsules on demand for the events that matter. Our internal tests show ~{formatPercent(storageSaved)}
                  storage reduction versus eager logging.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
              <div>
                <h3 className="font-semibold text-white">Merkle Anchoring</h3>
                <p className="text-indigo-100/90">
                  Capsules are chained with cryptographic commitments for rapid, trustworthy verification.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">Privacy by Design</h3>
                <p className="text-indigo-100/90">
                  Prove compliance claims without disclosing model weights, prompts, or proprietary data.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* STAKEHOLDERS */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <SectionHeader kicker="Bridge" title="Built for Every Side of the Table" />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-start gap-4">
              <Landmark className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">For Regulators</h3>
                <p className="text-indigo-100/90">
                  Independent, cryptographic verification aligned to NIST AI RMF, ISO/IEC 42001, and the EU AI Act’s
                  conformity assessment and post-market monitoring.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <Building2 className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">For Auditors</h3>
                <p className="text-indigo-100/90">
                  Turn reports into verifiable proof capsules. Reduce storage and verification friction while increasing
                  confidence with clients and oversight bodies.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-4">
              <LinkIcon className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-semibold text-white">For AI Companies</h3>
                <p className="text-indigo-100/90">
                  Demonstrate compliance claims without exposing IP. Build trust with buyers, auditors, and regulators using
                  cryptographic evidence, not promises.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* DEMO (Simulated) */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <SectionHeader
          kicker="Demo"
          title="Interactive Simulation"
          subtitle="Patent-pending demonstration. Cryptographic details are proprietary."
        />
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-indigo-200">Dataset Size</label>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  value={dataset}
                  onChange={(e) => setDataset(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <p className="text-indigo-100 mt-1">{dataset.toLocaleString()} records</p>
              </div>
              <div>
                <label className="text-sm text-indigo-200">Audit Ratio</label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={auditRatio}
                  onChange={(e) => setAuditRatio(parseInt(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
                <p className="text-indigo-100 mt-1">{auditRatio}% of events → proof capsules</p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-6">
              <Card>
                <p className="text-sm text-indigo-200/90">Estimated Storage Saved</p>
                <p className="text-2xl font-bold">≈ {formatPercent(storageSaved)}</p>
              </Card>
              <Card>
                <p className="text-sm text-indigo-200/90">Retrieval Time</p>
                <p className="text-2xl font-bold">≈ {estimatedRetrievalMs} ms</p>
              </Card>
              <Card>
                <p className="text-sm text-indigo-200/90">Capsules Generated*</p>
                <p className="text-2xl font-bold">{Math.round((dataset * auditRatio) / 100).toLocaleString()}</p>
              </Card>
            </div>
            <p className="text-xs text-indigo-300/80 mt-3">*Simulated for illustration. Actual performance varies by workload.</p>
            <div className="mt-6">
              <Button onClick={handleDemo}>
                <Activity className="w-4 h-4" /> Generate & Verify
              </Button>
            </div>
          </Card>
          <Card>
            <ol className="space-y-4">
              {[
                { label: 'Generate', icon: <Database className="w-4 h-4" /> },
                { label: 'Select', icon: <CheckCircle2 className="w-4 h-4" /> },
                { label: 'Infer', icon: <Activity className="w-4 h-4" /> },
                { label: 'Capsule', icon: <Receipt className="w-4 h-4" /> },
                { label: 'Verify', icon: <ShieldCheck className="w-4 h-4" /> },
              ].map((s, i) => (
                <li key={s.label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">{s.icon}</span>
                  <span className="text-indigo-100">{i + 1}. {s.label}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 text-sm text-indigo-200/90">
              This flow simulates CIAF’s capsule lifecycle end-to-end without exposing proprietary cryptographic methods.
            </div>
          </Card>
        </div>
      </section>

      {/* WHITE PAPER ACCESS */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-4xl">
        <SectionHeader
          kicker="White Paper"
          title="Deeper Dive Without Giving Away the IP"
          subtitle="Get the high-level design, standard alignment, and pilot options."
        />
        <Card className="mt-8">
          <form
            className="grid sm:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                'Thanks! We’ll email the white paper after reviewing your request. In production, wire this form to your CRM.'
              );
            }}
          >
            <div>
              <label className="block text-sm text-indigo-200">Name</label>
              <input required className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm text-indigo-200">Email</label>
              <input type="email" required className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="jane@org.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-indigo-200">Organization & Role</label>
              <input className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Regulator, Auditor, or AI Company" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <Button>
                <FileText className="w-4 h-4" /> Request White Paper
              </Button>
              <p className="text-sm text-indigo-300/80">Patent-pending. Cryptographic implementations withheld.</p>
            </div>
          </form>
        </Card>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 md:py-24 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-r from-indigo-700/40 to-fuchsia-700/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_10%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-extrabold">Be Part of the Bridge</h3>
            <p className="text-indigo-100/90 mt-2 max-w-3xl">
              We’re convening regulators, auditors, and AI providers to pilot verifiable AI assurance in real deployments.
              Join as a design partner, pilot participant, or standards collaborator.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handlePilot}>
                <Handshake className="w-4 h-4" /> Request Pilot
              </Button>
              <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <ArrowRight className="w-4 h-4" /> Back to Top
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-white/10">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-indigo-200/80">© {new Date().getFullYear()} Cognitive Insight™ — All rights reserved.</p>
          <div className="flex items-center gap-4 text-indigo-200/80 text-sm">
            <span>Patent-pending • Demo is simulated</span>
            <span className="hidden md:inline">|</span>
            <a className="hover:text-white" href="#">Privacy</a>
            <a className="hover:text-white" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
