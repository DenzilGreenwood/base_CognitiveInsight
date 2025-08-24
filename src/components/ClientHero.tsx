"use client";

import { useState } from "react";
import { Handshake, Activity, ArrowRight, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ModernEarlyAccessForm from "@/components/ModernEarlyAccessForm";

export default function ClientHero() {
  const [showEarly, setShowEarly] = useState(false);

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <motion.h1 
          initial={{opacity:0, y:8}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.4}} 
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Turn Confusion into <span className="text-indigo-400">Cryptographic Clarity</span>
        </motion.h1>
        <div className="text-slate-300/90 max-w-prose">
          An audit layer for AI systems that issues verifiable, tamper-evident receipts—without logging everything.
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition" 
            onClick={()=>setShowEarly(true)}
          >
            Request Early Access
          </button>
          <a 
            href="/demo" 
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition inline-flex items-center gap-2"
          >
            <Sparkles className="size-4" />
            Launch Live Demo
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      <motion.div 
        initial={{opacity:0, y:8}} 
        animate={{opacity:1, y:0}} 
        transition={{delay:0.1, duration:0.4}} 
        className="rounded-2xl p-6 bg-white/5 ring-1 ring-white/10"
      >
        <div className="grid grid-cols-3 gap-6">
          <Metric icon={<Activity className="size-5" />} title="Cost Reduction" value="90%" note="Selective proofs" />
          <Metric icon={<FileText className="size-5" />} title="Audit-Ready" value="99.9%" note="Crypto integrity" />
          <Metric icon={<Handshake className="size-5" />} title="Faster Reg." value="1000×" note="No eager logging" />
        </div>
      </motion.div>

      {showEarly && (
        <div className="md:col-span-2">
          <ModernEarlyAccessForm onClose={() => setShowEarly(false)} />
        </div>
      )}
    </div>
  );
}

function Metric({icon, title, value, note}:{icon: React.ReactNode; title:string; value:string; note:string}) {
  return (
    <div className="bg-slate-900/40 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-300">{icon}<span className="text-sm">{title}</span></div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
      <div className="text-xs text-slate-400">{note}</div>
    </div>
  );
}
