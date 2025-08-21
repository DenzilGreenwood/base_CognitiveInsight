"use client";

import { useState, useTransition } from "react";
import { runDemoStep } from "@/app/actions";

type Step = "generate" | "select" | "infer" | "capsule" | "verify";

const STEPS: Step[] = ["generate", "select", "infer", "capsule", "verify"];

export default function DemoPage() {
  const [step, setStep] = useState<Step>("generate");
  const [log, setLog] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [capsuleInfo, setCapsuleInfo] = useState<any>(null);

  const doStep = (s: Step) => {
    startTransition(async () => {
      const res = await runDemoStep(s, capsuleInfo);
      if (!res.ok) {
        setLog((l) => [...l, `❌ ${s}: ${res.error ?? "error"}`]);
        return;
      }
      setLog((l) => [...l, `✅ ${s}`]);

      if (s === "capsule" && res.info) setCapsuleInfo(res.info);
      if ((res as any).next) setStep((res as any).next);
    });
  };

  const reset = () => {
    setStep("generate");
    setLog([]);
    setCapsuleInfo(null);
  };

  const idx = STEPS.indexOf(step);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Mini-Model Audit Demo</h1>
      <p className="text-gray-600">
        Simulated pipeline: Generate → Select → Infer → Capsule → Verify
      </p>

      <ol className="my-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li key={s}
              className={`rounded-full px-3 py-1 text-sm ${i <= idx ? "bg-black text-white" : "bg-gray-200"}`}>
            {s}
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        <button
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          onClick={() => doStep(step)}
          disabled={pending || step === "verify"}
        >
          {pending ? "Working…" : step === "verify" ? "Done" : "Generate & Verify"}
        </button>
        <button className="rounded-lg border px-4 py-2" onClick={reset} disabled={pending}>
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">Status</h3>
          <ul className="space-y-1 text-sm">
            {log.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">Capsule Output (simulated)</h3>
          {!capsuleInfo ? (
            <p className="text-sm text-gray-600">Run through “capsule” to see details.</p>
          ) : (
            <ul className="text-sm">
              <li>Capsules generated: <b>{capsuleInfo.capsules}</b> <span className="text-xs text-gray-500">(illustrative)</span></li>
              <li>Temporary workspace: <b>{capsuleInfo.workspaceGb} GB</b></li>
              <li>Retrieval time: <b>≈ {capsuleInfo.retrievalMs} ms</b></li>
              <li>Estimated reduction: <b>≈ {capsuleInfo.reductionPct}%</b> (capsules only)</li>
            </ul>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        No real data processed. Patent-pending; cryptographic implementations withheld.
      </p>
    </div>
  );
}
