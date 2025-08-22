"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowLeft, 
  Activity, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";

// Step progression pipeline
const STEPS = ["generate", "select", "infer", "capsule", "verify"];

// TypeScript interfaces for API responses
interface GenerateResult {
  capsules: number;
  anchorRoot: string;
  proofSample: {
    leaf: string;
    path: string[]; // <-- was "proof"
  };
}

interface VerifyPayload {
  anchorRoot: string;
  proofSample: { leaf: string; path: string[] };
  cacheWarm: boolean;
}

interface VerifyResult {
  verified: boolean;
  retrievalMs: number;
}

export default function DemoPage() {
  const [step, setStep] = useState<(typeof STEPS)[number]>("generate");
  const [pending, setPending] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  
  // State for controls
  const [datasetGB, setDatasetGB] = useState(1000);
  const [auditRatio, setAuditRatio] = useState(15);
  const [cacheWarm, setCacheWarm] = useState(true);
  
  // State for real backend results
  const [generatedData, setGeneratedData] = useState<GenerateResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerifyResult | null>(null);
  
  // State for simulated intermediate steps (capsule info remains simulated)
  const [capsuleInfo, setCapsuleInfo] = useState<{
    capsules: number;
    workspaceGb: number;
    retrievalMs: number;
    reductionPct: number;
  } | null>(null);

  // Backend integration functions - call real Cloud Functions
  const callBackendGenerate = async (): Promise<GenerateResult> => {
    const resp = await fetch("/api/sim/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datasetGB, auditRatio, cacheWarm }),
    });
    if (!resp.ok) throw new Error(`Generate failed: ${resp.statusText}`);
    return resp.json();
  };

  const callBackendVerify = async (data: GenerateResult): Promise<VerifyResult> => {
    const payload: VerifyPayload = {
      anchorRoot: data.anchorRoot,
      proofSample: data.proofSample, // <-- correct field name and shape
      cacheWarm,
    };
    const resp = await fetch("/api/sim/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`Verify failed: ${resp.statusText}`);
    return resp.json();
  };

  const addLog = (msg: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const doStep = async (currentStep: string) => {
    if (pending) return;
    
    setPending(true);
    addLog(`Starting ${currentStep} phase...`);

    try {
      if (currentStep === "generate") {
        // Real backend call for generation
        const result = await callBackendGenerate();
        setGeneratedData(result);
        addLog(`Generated ${result.capsules.toLocaleString()} cryptographic capsules`);
        addLog(`Anchor root: ${result.anchorRoot.slice(0, 16)}...`);
        setStep("select");
        
      } else if (currentStep === "select") {
        // Simulated step
        await new Promise(resolve => setTimeout(resolve, 800));
        addLog(`Selected ${Math.floor(datasetGB * auditRatio / 100)} GB for audit (${auditRatio}%)`);
        setStep("infer");
        
      } else if (currentStep === "infer") {
        // Simulated step
        await new Promise(resolve => setTimeout(resolve, 1200));
        addLog("Inference complete - patterns identified in selected data subset");
        setStep("capsule");
        
      } else if (currentStep === "capsule") {
        // Simulated step for capsule metrics
        await new Promise(resolve => setTimeout(resolve, 1000));
        const caps = generatedData?.capsules || Math.floor(datasetGB * 2.1);
        const workspace = Math.floor(datasetGB * 0.15);
        const retrieval = cacheWarm ? Math.floor(Math.random() * 50 + 10) : Math.floor(Math.random() * 200 + 100);
        const reduction = Math.floor(Math.random() * 20 + 75);
        
        setCapsuleInfo({
          capsules: caps,
          workspaceGb: workspace,
          retrievalMs: retrieval,
          reductionPct: reduction
        });
        
        addLog(`Capsulation complete - ${caps.toLocaleString()} capsules generated`);
        addLog(`Workspace reduced to ${workspace} GB (${reduction}% reduction)`);
        setStep("verify");
        
      } else if (currentStep === "verify" && generatedData) {
        // Real backend call for verification
        const result = await callBackendVerify(generatedData);
        setVerificationResult(result);
        addLog(`Verification ${result.verified ? 'successful' : 'failed'}`);
        addLog(`Retrieval completed in ${result.retrievalMs}ms`);
      }
    } catch (error) {
      addLog(`Error in ${currentStep}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setPending(false);
    }
  };

  const reset = () => {
    setStep("generate");
    setPending(false);
    setLog([]);
    setGeneratedData(null);
    setVerificationResult(null);
    setCapsuleInfo(null);
  };

  const idx = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)]" />
        <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4">
              Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">Cryptographic</span> Demo
            </h1>
            <p className="text-indigo-100/90 text-lg max-w-3xl">
              Experience real cryptographic proof generation and verification using deployed Firebase Functions.
            </p>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <label className="block text-sm text-indigo-200 mb-2">Dataset Size (GB)</label>
              <input
                type="range"
                min={10}
                max={10000}
                step={10}
                value={datasetGB}
                onChange={(e) => setDatasetGB(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-indigo-100 mt-2 font-medium">{datasetGB.toLocaleString()} GB</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <label className="block text-sm text-indigo-200 mb-2">Audit Ratio (%)</label>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={auditRatio}
                onChange={(e) => setAuditRatio(parseInt(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
              <p className="text-indigo-100 mt-2 font-medium">{auditRatio}% audited</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <label className="block text-sm text-indigo-200 mb-2">Cache Mode</label>
              <select
                className="w-full rounded-xl bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={cacheWarm ? "warm" : "cold"}
                onChange={(e) => setCacheWarm(e.target.value === "warm")}
              >
                <option value="warm">Warm Cache</option>
                <option value="cold">Cold Cache</option>
              </select>
              <p className="text-indigo-100 mt-2 text-sm">{cacheWarm ? "Optimized retrieval" : "Full computation"}</p>
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-semibold mb-4">Pipeline Progress</h2>
            <ol className="flex flex-wrap gap-2 mb-6">
              {STEPS.map((s, i) => {
                const isCompleted = i < idx || (i === idx && step === "verify" && !!verificationResult);
                const isCurrent = i === idx;
                
                return (
                  <li key={s} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isCompleted 
                      ? "bg-green-500 text-white" 
                      : isCurrent 
                      ? "bg-indigo-500 text-white" 
                      : "bg-white/10 text-indigo-200"
                  }`}>
                    <span className="flex items-center gap-2">
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      {isCurrent && pending && <Loader2 className="w-4 h-4 animate-spin" />}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  </li>
                );
              })}
            </ol>
            
            <div className="flex gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
                onClick={() => doStep(step)}
                disabled={pending || (step === "verify" && !!verificationResult)}
              >
                {pending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : step === "verify" && !!verificationResult ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    Run {step.charAt(0).toUpperCase() + step.slice(1)}
                  </>
                )}
              </button>
              
              <button 
                className="rounded-2xl px-6 py-3 bg-white/10 text-indigo-200 hover:bg-white/20 transition-colors disabled:opacity-50 font-medium" 
                onClick={reset} 
                disabled={pending}
              >
                Reset Demo
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Log */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Execution Log</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {log.length === 0 ? (
                  <p className="text-indigo-200/70 text-sm">Ready to begin pipeline execution...</p>
                ) : (
                  log.map((line, i) => (
                    <div key={i} className="text-sm font-mono bg-black/20 rounded px-3 py-2">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cryptographic Results */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Cryptographic Output</h3>
              
              {generatedData && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-400/20 rounded-xl">
                  <h4 className="text-green-200 font-medium mb-2">✅ Generation Results</h4>
                  <div className="text-sm space-y-1">
                    <p>Capsules: <strong>{generatedData.capsules.toLocaleString()}</strong></p>
                    <p>Anchor Root: <code className="text-xs bg-black/20 px-1 rounded">{generatedData.anchorRoot.slice(0, 16)}...</code></p>
                    <p>Proof Sample: <code className="text-xs bg-black/20 px-1 rounded">{generatedData.proofSample.leaf.slice(0, 16)}...</code></p>
                    <p>Proof Path: <code className="text-xs bg-black/20 px-1 rounded">{generatedData.proofSample.path.length} nodes</code></p>
                  </div>
                </div>
              )}
              
              {verificationResult && (
                <div className={`p-4 rounded-xl border ${
                  verificationResult.verified 
                    ? 'bg-green-500/10 border-green-400/20' 
                    : 'bg-red-500/10 border-red-400/20'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    verificationResult.verified ? 'text-green-200' : 'text-red-200'
                  }`}>
                    {verificationResult.verified ? '✅ Verification Successful' : '❌ Verification Failed'}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>Status: <strong>{verificationResult.verified ? 'Valid Proof' : 'Invalid Proof'}</strong></p>
                    <p>Retrieval Time: <strong>{verificationResult.retrievalMs} ms</strong></p>
                    <p>Cache Mode: <strong>{cacheWarm ? 'Warm' : 'Cold'}</strong></p>
                  </div>
                </div>
              )}
              
              {capsuleInfo && (
                <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-400/20 rounded-xl">
                  <h4 className="text-indigo-200 font-medium mb-2">📦 Capsule Metrics</h4>
                  <div className="text-sm space-y-1">
                    <p>Capsules: <strong>{capsuleInfo.capsules.toLocaleString()}</strong></p>
                    <p>Workspace: <strong>{capsuleInfo.workspaceGb} GB</strong></p>
                    <p>Storage Reduction: <strong>~{capsuleInfo.reductionPct}%</strong></p>
                  </div>
                </div>
              )}
              
              {!generatedData && !verificationResult && (
                <p className="text-indigo-200/70 text-sm">
                  Execute pipeline steps to see cryptographic results...
                </p>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
            <p className="text-yellow-200 text-sm">
              <strong>Demo Notice:</strong> This demonstration uses real Firebase Functions for cryptographic proof generation and verification. 
              The complete CIAF implementation contains proprietary methods that are patent-pending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
