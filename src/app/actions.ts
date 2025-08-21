"use server";

import { z } from "zod";
import { db } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(), // e.g., "landing", "whitepaper"
});

export type LeadInput = z.infer<typeof LeadSchema>;

export async function createLead(input: LeadInput) {
  const parsed = LeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", issues: parsed.error.flatten() };
  }
  const data = {
    ...parsed.data,
    createdAt: Timestamp.now(),
    status: "new" as const,
  };
  await db.collection("leads").add(data);
  // Optionally trigger a CF onCreate email; see functions/ below
  return { ok: true };
}

/** Simulated demo pipeline for Generate → Verify with capsule math */
export async function runDemoStep(step: string, payload?: unknown) {
  // In a real setup, accept params and compute outputs or call your backend
  await new Promise((r) => setTimeout(r, 350)); // simulate latency

  switch (step) {
    case "generate":
      return { ok: true, next: "select", info: { datasetGb: 10000, auditRatio: 0.05 } };
    case "select":
      return { ok: true, next: "infer", info: { selection: "stratified-10%" } };
    case "infer":
      return { ok: true, next: "capsule", info: { inferences: 5000 } };
    case "capsule": {
      // toy math consistent with your copy; tune freely
      const { datasetGb = 10000, auditRatio = 0.05 } = (payload as any) ?? {};
      const baseEvents = Math.round(datasetGb * 0.0125); // arbitrary event density
      const audited = Math.max(1, Math.round(baseEvents * auditRatio));
      const capsules = Math.max(1, Math.round(audited / 2)); // illustration
      return {
        ok: true,
        next: "verify",
        info: { capsules, workspaceGb: 500, retrievalMs: 180, reductionPct: 90 },
      };
    }
    case "verify":
      return { ok: true, done: true, info: { verified: true, ms: 30 } };
    default:
      return { ok: false, error: "Unknown step" };
  }
}
