import * as React from "react";
import { HardDriveDownload, Timer, ShieldCheck } from "lucide-react";

/**
 * KPI Metrics for Cognitive Insight™
 * - Visual stat cards with icons + compact progress bars
 * - Accessible labels; responsive grid
 * - Drop into any dark section; Tailwind required
 */

type MetricsProps = {
  storageSavedPct?: number;   // e.g., 85
  verifyMs?: number;          // e.g., 150
  alignment?: string;         // e.g., "NIST • ISO • EU AI Act"
};

export default function MetricsKPI({
  storageSavedPct = 85,
  verifyMs = 150,
  alignment = "NIST • ISO • EU AI Act",
}: MetricsProps) {
  const safePct = Math.max(0, Math.min(100, storageSavedPct));
  // Normalize verification to a 0–100 bar (lower ms = better).
  // Adjust these bounds to your narrative.
  const verifyMin = 20;
  const verifyMax = 500;
  const clampedMs = Math.max(verifyMin, Math.min(verifyMax, verifyMs));
  const verifyScore = 100 - Math.round(((clampedMs - verifyMin) / (verifyMax - verifyMin)) * 100); // higher = better

  return (
    <section
      aria-label="Key Performance Indicators"
      className="w-full max-w-5xl mx-auto"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Storage Savings */}
        <StatCard
          title="Storage Savings"
          value={`~${safePct}%`}
          icon={<HardDriveDownload className="w-5 h-5" />}
          barPct={safePct}
          barLabel={`${safePct}% reduction vs raw logs`}
        >
          <p className="text-xs text-indigo-200/80">
            Long-term: capsules only (commitments + metadata).
          </p>
        </StatCard>

        {/* Verification Latency */}
        <StatCard
          title="Verification"
          value={`~${verifyMs} ms`}
          icon={<Timer className="w-5 h-5" />}
          barPct={verifyScore}
          barLabel={`Relative performance score`}
        >
          <p className="text-xs text-indigo-200/80">
            Simulated; scales with proof depth & cache conditions.
          </p>
        </StatCard>

        {/* Alignment */}
        <StatCard
          title="Alignment"
          value={alignment}
          icon={<ShieldCheck className="w-5 h-5" />}
          noBar
        >
          <p className="text-xs text-indigo-200/80">
            Independent, cryptographic verification for assurance workflows.
          </p>
        </StatCard>

        {/* Privacy */}
        <StatCard
          title="Privacy"
          value="No model/data exposure"
          icon={<ShieldCheck className="w-5 h-5" />}
          noBar
        >
          <p className="text-xs text-indigo-200/80">
            Verifiable claims without releasing sensitive artifacts.
          </p>
        </StatCard>
      </div>

      <p className="text-[11px] text-indigo-300/70 mt-3">
        *Performance metrics based on internal simulations; results vary by workload and configuration.
      </p>
    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
  barPct,
  barLabel,
  noBar = false,
  children,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  barPct?: number;
  barLabel?: string;
  noBar?: boolean;
  children?: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, barPct ?? 0));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-indigo-200">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
            {icon}
          </span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-base font-semibold text-white text-right">
          {value}
        </div>
      </div>

      {!noBar && (
        <div className="mt-3" aria-label={barLabel}>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-[width] duration-500"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="mt-1 text-[11px] text-indigo-300/80">{barLabel}</div>
        </div>
      )}

      <div className="mt-2">{children}</div>
    </div>
  );
}
