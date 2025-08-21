"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import { Handshake, Activity, ArrowRight, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [showEarly, setShowEarly] = useState(false);

  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)]" />
        <div className="container mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl">
          <div className="flex flex-col items-center text-center gap-6">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-indigo-500/20 text-indigo-200 border border-indigo-400/20`}>
              <Sparkles className="w-3.5 h-3.5" /> Patent-pending • Privacy-first • Verifiable
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
            >
              Turn Confusion into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">Cryptographic Clarity</span>
            </motion.h1>
            <p className="max-w-3xl text-indigo-100/90 text-lg">
              Founded by a compliance professional and data scientist, Cognitive Insight™ is built to bridge technical, policy, and assurance communities — making verifiable AI practical.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-400 dark:focus:ring-indigo-600"
                onClick={() => setShowEarly(true)}
                aria-label="Request Early Access"
              >
                <Handshake className="w-4 h-4" /> Request Early Access
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 focus:ring-indigo-200"
                onClick={() => router.push("/demo")}
                aria-label="Launch Live Demo"
              >
                <Activity className="w-4 h-4" /> Launch Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {showEarly && (
        <EarlyAccessForm
          defaultSource="landing"
          onDone={() => setShowEarly(false)}
        />
      )}
    </main>
  );
}
