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
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}> = ({ children, onClick, as = 'button', href, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const base =
    'inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
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
    <button type={type} disabled={disabled} className={`${base} ${styles[variant]} ${className}`} onClick={onClick}>
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
  
  // constants & state
  const STORAGE_SAVINGS = 0.90;
  const [cacheWarm, setCacheWarm] = useState(true);
  const [persistExpanded, setPersistExpanded] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [simResult, setSimResult] = useState<null | {
    capsules: number;
    anchorRoot: string;
    retrievalMs: number;
    verified: boolean;
    proofSample?: { leaf: string; path: string[] };
  }>(null);
  const TEMP_WORKSPACE_ENABLED = true;
  const [showPilotModal, setShowPilotModal] = useState(false);
  const [busy, setBusy] = useState(false);


  // helper to POST JSON
  async function postJSON<T>(url: string, body: any): Promise<T> {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async function submitPilot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      orgRole: String(fd.get("orgRole") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
      preferredTime: String(fd.get("preferredTime") || "").trim(),
      type: "pilot",                // or "demo" if you add a separate button
      source: "cta_be_part_bridge"  // helpful for analytics
    };
    try {
      await postJSON("/api/leads", payload);
      // send them to calendar booking
      window.location.href = "/thank-you?next=/book";
    } catch (err:any) {
      alert("Could not submit: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateAndVerify() {
    try {
      setIsWorking(true);
      setSimResult(null);

      // 1) GENERATE (simulate capsules + anchor)
      const gen = await postJSON<{
        capsules: number;
        anchorRoot: string;
        proofSample: { leaf: string; path: string[] };
      }>("/api/sim/generate", {
        datasetGB: dataset,
        auditRatio,
        cacheWarm,
        persistExpanded,
      });

      // 2) VERIFY (check sample proof against anchor)
      const v = await postJSON<{ verified: boolean; retrievalMs: number }>(
        "/api/sim/verify",
        {
          anchorRoot: gen.anchorRoot,
          proofSample: gen.proofSample,
          cacheWarm,
        }
      );

      setSimResult({
        capsules: gen.capsules,
        anchorRoot: gen.anchorRoot,
        retrievalMs: v.retrievalMs,
        verified: v.verified,
        proofSample: gen.proofSample,
      });
    } catch (e) {
      alert("Simulation error: " + (e as Error).message);
    } finally {
      setIsWorking(false);
    }
  }

  const submitLead = (type: string) => {
     setShowPilotModal(true);
  }

  async function submitWhitepaperLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      orgRole: String(formData.get("orgRole") || "").trim(),
      type: "whitepaper"
    };
  
    const r = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  
    const data = await r.json();
    if (data.ok) {
      // show success UI
      alert("Thanks! We’ll email the white paper shortly.");
      form.reset();
    } else {
      alert("There was a problem submitting your request. Please try again.");
    }
  }

  const handlePilot = () => {
    setShowPilotModal(true);
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
              Cognitive Insight™ bridges regulators, auditors, and AI providers with
              cryptographically verifiable auditability. We connect policy, assurance, 
              and engineering—without exposing sensitive models or data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button onClick={handlePilot}>
                <Handshake className="w-4 h-4" /> Request Pilot
              </Button>
              <Button variant="secondary" onClick={() => document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })}>
                <Activity className="w-4 h-4" /> Explore Demo
              </Button>
              <Button variant="ghost" onClick={() => document.querySelector('#whitepaper-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <FileText className="w-4 h-4" /> Request White Paper <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 w-full max-w-3xl">
              {[
                { label: 'Storage Savings', value: `~${formatPercent(STORAGE_SAVINGS * 100)}` },
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
          subtitle="Founded by a compliance professional and data scientist, Cognitive Insight™ is built to bridge technical, policy, and assurance communities — making verifiable AI practical."
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
                  Cryptographically verifiable receipts covering training runs, inference logs, system configurations, and compliance checkpoints.
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
                  Generate capsules on demand for the events that matter. Our tests show a ≈{formatPercent(STORAGE_SAVINGS * 100)} reduction in long-term storage (capsules-only mode; expanded evidence optional & policy-dependent).
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
      <section id="demo" className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <SectionHeader
          kicker="Demo"
          title="Interactive Simulation (Demonstration Only)"
          subtitle="Results are simulated for illustration; actual performance varies by workload and environment."
        />
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="dataset" className="text-sm text-indigo-200">Dataset Size (GB)</label>
                <input
                  id="dataset"
                  aria-label="Dataset size in gigabytes"
                  type="range"
                  min={10}
                  max={10000}
                  step={10}
                  value={dataset}
                  onChange={(e) => setDataset(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <p className="text-indigo-100 mt-1">{dataset.toLocaleString()} GB</p>
              </div>
              <div>
                <label htmlFor="auditRatio" className="text-sm text-indigo-200">
                  Audit Ratio (%)
                </label>
                <input
                  id="auditRatio"
                  aria-label="Audit ratio percentage"
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={auditRatio}
                  onChange={(e) => setAuditRatio(parseInt(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
                <p className="text-indigo-100 mt-1">
                  {auditRatio}% of events → proof capsules
                </p>
              </div>
              <div>
                <label htmlFor="cacheMode" className="text-sm text-indigo-200">Cache Mode</label>
                <select
                  id="cacheMode"
                  aria-label="Cache mode"
                  className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => setCacheWarm(e.target.value === "warm")}
                >
                  <option value="warm">Warm (cached)</option>
                  <option value="cold">Cold (no cache)</option>
                </select>
              </div>
            </div>

            {/* Derived metrics */}
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <p className="text-sm text-indigo-200/90">Baseline Size</p>
                <p className="text-2xl font-bold">{dataset.toLocaleString()} GB</p>
              </Card>
              <Card>
                <p className="text-sm text-indigo-200/90">Persistent Audit Footprint</p>
                <p className="text-2xl font-bold">
                  {(dataset * (1 - STORAGE_SAVINGS)).toLocaleString()} GB
                </p>
                <p className="text-xs text-indigo-300/80">
                  ≈ {formatPercent(STORAGE_SAVINGS * 100)} reduction (capsules only)
                </p>
              </Card>
              <Card>
                <p className="text-sm text-indigo-200/90">Retrieval Time</p>
                <p className="text-2xl font-bold">
                  ≈ {cacheWarm ? estimatedRetrievalMs : Math.round(estimatedRetrievalMs * 3)} ms
                </p>
                <p className="text-xs text-indigo-300/80">
                  Warm vs cold cache, simulated
                </p>
              </Card>
              <Card>
                <p className="text-sm text-indigo-200/90">Capsules Generated*</p>
                <p className="text-2xl font-bold">
                  {Math.round(auditRatio * 125).toLocaleString()}
                </p>
                <p className="text-xs text-indigo-300/80">*Illustrative count</p>
              </Card>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-6">
              <Card>
                <p className="text-sm text-indigo-200/90">Temporary Audit Workspace</p>
                <p className="text-2xl font-bold">
                  {TEMP_WORKSPACE_ENABLED
                    ? Math.round(dataset * Math.min(0.1, auditRatio / 100)).toLocaleString() + " GB"
                    : "0 GB"}
                </p>
                <p className="text-xs text-indigo-300/80">
                  Only used if artifacts are materialized during verification; not persisted.
                </p>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-200/90">Persist expanded evidence</span>
                  <input
                    type="checkbox"
                    aria-label="Persist expanded evidence"
                    className="h-5 w-5 accent-indigo-500"
                    onChange={(e) => setPersistExpanded(e.target.checked)}
                  />
                </div>
                <p className="text-xs text-indigo-300/80 mt-2">
                  When ON, long-term storage will include expanded evidence bundles (policy-dependent).
                </p>
              </Card>
            </div>

            <p className="text-xs text-indigo-300/80 mt-3">
              No real data processed in this demo. Patent-pending; cryptographic implementations withheld.
            </p>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleGenerateAndVerify} className={isWorking ? "opacity-60 cursor-not-allowed" : ""} disabled={isWorking}>
                <Activity className="w-4 h-4" />
                {isWorking ? "Working…" : "Generate & Verify"}
              </Button>
              <Button variant="secondary" onClick={() => submitLead("pilot")}>
                <ShieldCheck className="w-4 h-4" /> Run a Real Pilot
              </Button>
            </div>
            {simResult && (
              <div className="mt-4 text-sm text-indigo-100 space-y-1">
                <div>Anchor Root: <span className="font-mono break-all">{simResult.anchorRoot}</span></div>
                <div>Verification: <span className={simResult.verified ? "text-emerald-300" : "text-rose-300"}>
                  {simResult.verified ? "Verified" : "Mismatch"}
                </span></div>
                <div>Retrieval Time (sim): ~{simResult.retrievalMs} ms</div>
              </div>
            )}
          </Card>

          <Card>
            <ol className="space-y-4" aria-label="Capsule lifecycle steps">
              {[
                { label: "Generate", icon: <Database className="w-4 h-4" /> },
                { label: "Select", icon: <CheckCircle2 className="w-4 h-4" /> },
                { label: "Infer", icon: <Activity className="w-4 h-4" /> },
                { label: "Capsule", icon: <Receipt className="w-4 h-4" /> },
                { label: "Verify", icon: <ShieldCheck className="w-4 h-4" /> },
              ].map((s, i) => (
                <li key={s.label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    {s.icon}
                  </span>
                  <span className="text-indigo-100">
                    {i + 1}. {s.label}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 text-sm text-indigo-200/90">
             Verification may occur client-side (WebCrypto) or server-side, depending on assurance requirements. Persistent storage remains capsules unless expanded evidence is explicitly persisted.
            </div>
          </Card>
        </div>
      </section>

      {/* WHITE PAPER ACCESS */}
      <section id="whitepaper-form" className="container mx-auto px-6 py-16 md:py-20 max-w-4xl">
        <SectionHeader
          kicker="White Paper"
          title="Deeper Dive Without Giving Away the IP"
          subtitle="Get the high-level design, standard alignment, and pilot options."
        />
        <Card className="mt-8">
          <form
            className="grid sm:grid-cols-2 gap-4"
            onSubmit={submitWhitepaperLead}
          >
            <div>
              <label className="block text-sm text-indigo-200">Name</label>
              <input name="name" required className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm text-indigo-200">Email</label>
              <input name="email" type="email" required className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="jane@org.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-indigo-200">Organization & Role</label>
              <input name="orgRole" className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Regulator, Auditor, or AI Company" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <Button type="submit">
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
              <Button onClick={() => setShowPilotModal(true)}>
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
      {showPilotModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-0">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6 animate-in zoom-in-95">
            <h4 className="text-xl font-semibold text-white">Request a Pilot / Demo</h4>
            <p className="text-indigo-200/80 text-sm mt-1">
              Tell us a bit about your use case. We’ll email you a booking link right away.
            </p>
            <form className="mt-4 space-y-3" onSubmit={submitPilot}>
              <input name="name" required placeholder="Name" className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <input name="email" type="email" required placeholder="Work Email" className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <input name="orgRole" placeholder="Organization & Role" className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <input name="preferredTime" placeholder="Preferred time window (e.g., Tue 1–4pm CT)" className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <textarea name="notes" rows={3} placeholder="What do you want to see? (e.g., model lifecycle proof, privacy constraints, regulator view)"
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "Submitting…" : "Send & Get Calendar Link"}
                </Button>
                <Button variant="secondary" onClick={() => setShowPilotModal(false)} type="button">Cancel</Button>
              </div>
              <p className="text-xs text-indigo-300/80">We’ll never share your info. Patent-pending; demo is simulated.</p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
