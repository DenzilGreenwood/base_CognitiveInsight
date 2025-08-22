"use client";

import { useState } from "react";

export default function ModernEarlyAccessForm({ onClose }:{ onClose:()=>void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, useCase })
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setEmail(""); setName(""); setUseCase("");
    } catch {
      setStatus("err");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="grid md:grid-cols-3 gap-4">
        <input 
          required 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          type="email" 
          placeholder="Email" 
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400" 
        />
        <input 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          placeholder="Name (optional)" 
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400" 
        />
        <input 
          value={useCase} 
          onChange={e=>setUseCase(e.target.value)} 
          placeholder="Use case (optional)" 
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400" 
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button 
          disabled={status==="loading"} 
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {status==="loading" ? "Submitting..." : "Submit"}
        </button>
        <button 
          type="button" 
          onClick={onClose} 
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          Close
        </button>
        {status==="ok" && <span className="text-green-400">Thanks—we'll be in touch.</span>}
        {status==="err" && <span className="text-rose-400">Something went wrong. Try again.</span>}
      </div>
    </form>
  );
}
