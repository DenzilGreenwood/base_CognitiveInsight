import * as React from "react";
import { useMemo, useState } from "react";
import { Activity, Database, CheckCircle2, Receipt, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import type { SimulationState, DemoHandlers } from "./types";

/**
 * DemoSection
 * - Fully dynamic: dataset size + audit ratio influence capsules, storage footprint, and latency
 * - Professional copy clarifies capsules-only persistence vs. temporary expansion during audits
 * - No proprietary crypto details disclosed
 */

type DemoSectionProps = {
  className?: string;
  simulation: SimulationState;
  onDatasetChange: (value: number) => void;
  onAuditRatioChange: (value: number) => void;
  handlers: DemoHandlers;
};

const STORAGE_SAVINGS = 0.90;       // near-constant long-term reduction (capsules vs raw payloads)
const CAPSULE_SIZE_KB = 16;         // avg commitment+metadata+signatures (simulated)
const BASE_DATA_EVENTS = 3;         // ingest, preprocess, split (illustrative)
const BASE_DEPLOY_EVENTS = 3;       // package, deploy, promote (illustrative);

const formatPercent = (n: number) => `${Math.round(n)}%`;

const DemoSection: React.FC<DemoSectionProps> = ({ 
  className, 
  simulation, 
  onDatasetChange, 
  onAuditRatioChange, 
  handlers 
}) => {
  // Use props for controlled state
  const { dataset: datasetGB, auditRatio } = simulation;
  
  // Local state for demo-specific controls
  const [cacheWarm, setCacheWarm] = useState(true);
  const [persistExpanded, setPersistExpanded] = useState(false);
  
  // Demo state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // --- Lifecycle activity model (illustrative, not revealing internals) ---
  // We simulate event volume from data scale + generic training/eval/inference activity.
  // This is intentionally abstract: enough to show dynamics without patent details.
  const trainingEvents = useMemo(() => {
    // grows sublinearly with dataset scale (e.g., more batches/steps as data grows)
    // sqrt curve to avoid explosive growth in the demo
    const steps = Math.round(Math.sqrt(datasetGB) * 120); // illustrative
    const checkpoints = Math.max(5, Math.round(Math.log2(Math.max(2, datasetGB)))); // per-epoch style
    return steps + checkpoints;
  }, [datasetGB]);

  const evaluationEvents = useMemo(() => {
    // periodic validations/evals scale mildly with dataset size
    return Math.max(5, Math.round(Math.log10(Math.max(10, datasetGB)) * 10));
  }, [datasetGB]);

  const testInferenceEvents = useMemo(() => {
    // test/QA inferences increase with data scale
    return Math.round(datasetGB * 2); // illustrative
  }, [datasetGB]);

  const prodInferenceEvents = useMemo(() => {
    // production inferences: much larger driver; tie lightly to data scale for the demo
    return Math.round(datasetGB * 20); // illustrative
  }, [datasetGB]);

  const totalEvents = useMemo(() => {
    return (
      BASE_DATA_EVENTS +
      BASE_DEPLOY_EVENTS +
      trainingEvents +
      evaluationEvents +
      testInferenceEvents +
      prodInferenceEvents
    );
  }, [trainingEvents, evaluationEvents, testInferenceEvents, prodInferenceEvents]);

  const capsules = useMemo(() => {
    // Dynamic capsules proportional to lifecycle activity and selected audit ratio
    return Math.max(1, Math.ceil(totalEvents * (auditRatio / 100)));
  }, [totalEvents, auditRatio]);

  // Persistent footprint = near-constant reduction + tiny per-capsule overhead
  const capsuleOverheadGB = useMemo(() => (capsules * CAPSULE_SIZE_KB) / (1024 * 1024), [capsules]);
  const persistentFootprintGB = useMemo(
    () => datasetGB * (1 - STORAGE_SAVINGS) + capsuleOverheadGB,
    [datasetGB, capsuleOverheadGB]
  );

  // Temporary workspace: only if artifacts are materialized during an audit and persisted by policy
  const tempWorkspaceGB = useMemo(() => {
    if (!persistExpanded) return 0;
    // bound to at most ~10% of dataset, and scaled by audit ratio
    const byRatio = datasetGB * Math.min(0.10, (auditRatio / 100) * 0.5);
    return Math.round(byRatio);
  }, [datasetGB, auditRatio, persistExpanded]);

  // Retrieval latency scales with proof depth (≈ log2(capsules)) and cache mode
  const estimatedRetrievalMs = useMemo(() => {
    const depthPenalty = Math.log2(Math.max(1, capsules));
    const baseWarm = 18 + 1.6 * depthPenalty; // warm cache
    const mult = cacheWarm ? 1 : 3.2;         // cold is slower
    return Math.round(baseWarm * mult);
  }, [capsules, cacheWarm]);

  // CTA handlers for backend integration
  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep("generate");
    setGeneratedData(null);
    setVerificationResult(null);
    
    try {
      // Use direct Cloud Function URL for now since local routing isn't working
      const functionUrl = process.env.NODE_ENV === 'development' 
        ? 'https://us-central1-cognitiveinsight-j7xwb.cloudfunctions.net/simGenerate'
        : '/api/sim/generate';
        
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetGB,
          auditRatio,
          cacheWarm,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Generation result:', data);
      setGeneratedData(data);
      setCurrentStep("generated");
      return data; // <-- return it
    } catch (error) {
      console.error('Generate failed:', error);
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrentStep(null);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async (dataArg?: any) => {
    const payload = dataArg ?? generatedData;
    if (!payload) {
      alert('Please generate capsules first');
      return;
    }
    
    setIsVerifying(true);
    setCurrentStep("verify");
    setVerificationResult(null);
    
    try {
      // Use direct Cloud Function URL for now since local routing isn't working
      const functionUrl = process.env.NODE_ENV === 'development' 
        ? 'https://us-central1-cognitiveinsight-j7xwb.cloudfunctions.net/simVerify'
        : '/api/sim/verify';
        
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anchorRoot: payload.anchorRoot,
          proofSample: payload.proofSample, // <-- use correct field name
          cacheWarm,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Verification result:', data);
      setVerificationResult(data);
      setCurrentStep("verified");
    } catch (error) {
      console.error('Verify failed:', error);
      alert(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrentStep(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGenerateAndVerify = async () => {
    const data = await handleGenerate();
    if (data) await handleVerify(data);
  };

  const handleReset = () => {
    setGeneratedData(null);
    setVerificationResult(null);
    setCurrentStep(null);
  };

  const demoSteps = [
    { label: "Generate", icon: <Database className="w-4 h-4" /> },
    { label: "Select", icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: "Infer", icon: <Activity className="w-4 h-4" /> },
    { label: "Capsule", icon: <Receipt className="w-4 h-4" /> },
    { label: "Verify", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-20 max-w-6xl", className)}>
      <SectionHeader
        kicker="Demo"
        title="Interactive Simulation"
        subtitle="Demonstration only. Methods are proprietary; figures are illustrative."
      />

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        {/* LEFT: Controls + Metrics */}
        <Card className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
          <CardContent className="p-6">
            {/* Controls */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-indigo-200">Dataset Size (GB)</label>
                <input
                  type="range"
                  min={10}
                  max={10000}
                  step={10}
                  value={datasetGB}
                  onChange={(e) => onDatasetChange(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                  aria-label="Dataset size in gigabytes"
                />
                <p className="text-indigo-100 mt-1">{datasetGB.toLocaleString()} GB</p>
              </div>

              <div>
                <label className="text-sm text-indigo-200">Audit Ratio (%)</label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={auditRatio}
                  onChange={(e) => onAuditRatioChange(parseInt(e.target.value))}
                  className="w-full accent-fuchsia-500"
                  aria-label="Audit ratio percentage"
                />
                <p className="text-indigo-100 mt-1">
                  {auditRatio}% of lifecycle events → proof capsules
                </p>
              </div>

              <div>
                <label className="text-sm text-indigo-200">Cache Mode</label>
                <select
                  aria-label="Cache mode"
                  className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={cacheWarm ? "warm" : "cold"}
                  onChange={(e) => setCacheWarm(e.target.value === "warm")}
                >
                  <option value="warm">Warm (cached)</option>
                  <option value="cold">Cold (no cache)</option>
                </select>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid sm:grid-cols-3 gap-6">
              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-indigo-200/90">Persistent Storage Saved</p>
                  <p className="text-2xl font-bold">≈ {formatPercent(STORAGE_SAVINGS * 100)}</p>
                  <p className="text-xs text-indigo-300/80 mt-1">
                    Long-term: capsules only (commitments + metadata)
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-indigo-200/90">Retrieval / Verification</p>
                  <p className="text-2xl font-bold">≈ {estimatedRetrievalMs} ms</p>
                  <p className="text-xs text-indigo-300/80 mt-1">
                    {cacheWarm ? "Warm (cached)" : "Cold (no cache)"} • scales with proof depth
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-indigo-200/90">Capsules Generated*</p>
                  <p className="text-2xl font-bold">{capsules.toLocaleString()}</p>
                  <p className="text-xs text-indigo-300/80 mt-1">
                    *Dynamic—proportional to data, training, evaluation, and inference activity
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed footprints */}
            <div className="mt-4 grid sm:grid-cols-2 gap-6">
              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-indigo-200/90">Persistent Audit Footprint</p>
                  <p className="text-2xl font-bold">
                    {persistentFootprintGB.toLocaleString(undefined, { maximumFractionDigits: 2 })} GB
                  </p>
                  <p className="text-xs text-indigo-300/80 mt-1">
                    Near-constant vs raw logs (capsules only) + small receipt overhead
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-indigo-200/90">Persist expanded evidence</p>
                    <input
                      type="checkbox"
                      aria-label="Persist expanded evidence"
                      className="h-5 w-5 accent-indigo-500"
                      checked={persistExpanded}
                      onChange={(e) => setPersistExpanded(e.target.checked)}
                    />
                  </div>
                  <p className="text-2xl font-bold mt-2">{tempWorkspaceGB.toLocaleString()} GB</p>
                  <p className="text-xs text-indigo-300/80 mt-1">
                    Temporary audit workspace if materialized; not persisted unless policy requires
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimers */}
            <p className="text-xs text-indigo-300/80 mt-3">
              This simulation reflects a capsules-first design: long-term storage keeps compact cryptographic receipts.
              During an audit, evidence may be expanded temporarily for verification; persistent footprint remains unchanged
              unless expanded artifacts are explicitly retained by policy.
            </p>
            <p className="text-[11px] text-indigo-300/70 mt-1">
              Patent-pending. Parameters and methods are intentionally abstracted.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || isVerifying}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-5 py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" /> Generate Capsules
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleVerify}
                disabled={!generatedData || isGenerating || isVerifying}
                variant="outline"
                className="bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Verify Proof
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleGenerateAndVerify}
                disabled={isGenerating || isVerifying}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-2xl px-5 py-3"
              >
                {isGenerating || isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" /> Generate &amp; Verify
                  </>
                )}
              </Button>
              
              {(generatedData || verificationResult) && (
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="bg-transparent text-indigo-100 hover:text-white hover:bg-white/10 rounded-2xl px-5 py-3"
                >
                  Reset Demo
                </Button>
              )}
            </div>

            {/* Results Display */}
            {generatedData && (
              <div className="mt-6 p-4 rounded-2xl bg-green-500/10 border border-green-400/20">
                <h4 className="text-green-200 font-medium mb-2">✅ Generation Complete</h4>
                <div className="text-sm text-green-100/90 space-y-1">
                  <p>Capsules: <strong>{generatedData.capsules?.toLocaleString()}</strong></p>
                  <p>Anchor Root: <code className="text-xs">{generatedData.anchorRoot?.slice(0, 16)}...</code></p>
                  <p>Cache Mode: <strong>{generatedData.cacheWarm ? 'Warm' : 'Cold'}</strong></p>
                </div>
              </div>
            )}

            {verificationResult && (
              <div className={`mt-6 p-4 rounded-2xl ${
                verificationResult.verified 
                  ? 'bg-green-500/10 border border-green-400/20' 
                  : 'bg-red-500/10 border border-red-400/20'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  verificationResult.verified ? 'text-green-200' : 'text-red-200'
                }`}>
                  {verificationResult.verified ? '✅ Verification Successful' : '❌ Verification Failed'}
                </h4>
                <div className={`text-sm space-y-1 ${
                  verificationResult.verified ? 'text-green-100/90' : 'text-red-100/90'
                }`}>
                  <p>Verified: <strong>{verificationResult.verified ? 'Yes' : 'No'}</strong></p>
                  <p>Retrieval Time: <strong>~{verificationResult.retrievalMs} ms</strong></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT: Steps */}
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demo Pipeline</h3>
            <ol className="space-y-4">
              {[
                { key: "generate", label: "Generate", icon: <Database className="w-4 h-4" /> },
                { key: "select", label: "Select", icon: <CheckCircle2 className="w-4 h-4" /> },
                { key: "infer", label: "Infer", icon: <Activity className="w-4 h-4" /> },
                { key: "capsule", label: "Capsule", icon: <Receipt className="w-4 h-4" /> },
                { key: "verify", label: "Verify", icon: <ShieldCheck className="w-4 h-4" /> },
              ].map((step, i) => {
                const isActive = currentStep === step.key;
                const isCompleted = 
                  (step.key === "generate" && generatedData) ||
                  (step.key === "verify" && verificationResult?.verified);
                const isProcessing = 
                  (step.key === "generate" && isGenerating) ||
                  (step.key === "verify" && isVerifying);
                
                return (
                  <li key={step.label} className="flex items-center gap-3">
                    <span 
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        isCompleted 
                          ? "bg-green-500/20 text-green-200 border border-green-400/30" 
                          : isActive || isProcessing
                          ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                          : "bg-white/10 text-white/70"
                      )}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.icon
                      )}
                    </span>
                    <span 
                      className={cn(
                        "transition-colors",
                        isCompleted 
                          ? "text-green-200 font-medium" 
                          : isActive || isProcessing
                          ? "text-indigo-200 font-medium"
                          : "text-indigo-100"
                      )}
                    >
                      {i + 1}. {step.label}
                      {isProcessing && " (Processing...)"}
                      {isCompleted && " ✓"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 text-sm text-indigo-200/90">
              The lifecycle is illustrated at a high level without disclosing implementation details.
              Verification occurs using cryptographic proofs from the backend.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { DemoSection };
