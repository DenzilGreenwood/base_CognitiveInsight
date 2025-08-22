// src/components/StaticEarlyAccessForm.tsx
"use client";

import { useState } from "react";

export default function StaticEarlyAccessForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // For static deployment, you can:
      // 1. Use a third-party service like Formspree, Netlify Forms, or EmailJS
      // 2. Create a mailto link
      // 3. Store in localStorage for later export
      
      // Option 1: EmailJS (client-side email service)
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        await (window as any).emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            email,
            name,
            useCase,
            timestamp: new Date().toISOString()
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );
      } else {
        // Option 2: Store locally and provide download option
        const leads = JSON.parse(localStorage.getItem('earlyAccessLeads') || '[]');
        leads.push({
          email,
          name,
          useCase,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('earlyAccessLeads', JSON.stringify(leads));
        
        // Option 3: Open email client
        const subject = encodeURIComponent('Early Access Request - Cognitive Insight');
        const body = encodeURIComponent(`
Early Access Request Details:

Email: ${email}
Name: ${name || 'Not provided'}
Use Case: ${useCase || 'Not provided'}
Timestamp: ${new Date().toISOString()}

Please respond with early access information.
        `);
        
        // Fallback: mailto link
        setTimeout(() => {
          window.open(`mailto:insight@cognitiveinsight.com?subject=${subject}&body=${body}`);
        }, 1000);
      }

      setStatus("ok");
      setEmail("");
      setName("");
      setUseCase("");
    } catch (error) {
      console.error('Submission error:', error);
      setStatus("err");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="grid md:grid-cols-3 gap-4">
        <input 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          type="email" 
          placeholder="Email" 
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400" 
        />
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Name (optional)" 
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400" 
        />
        <input 
          value={useCase} 
          onChange={e => setUseCase(e.target.value)} 
          placeholder="Use case (optional)" 
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400" 
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button 
          disabled={status === "loading"} 
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
        <button 
          type="button" 
          onClick={onClose} 
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          Close
        </button>
        {status === "ok" && <span className="text-green-400">Thanks—we'll be in touch via email.</span>}
        {status === "err" && <span className="text-rose-400">Opening email client as fallback.</span>}
      </div>
      
      {/* Admin export option (hidden) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          onClick={() => {
            const leads = localStorage.getItem('earlyAccessLeads');
            if (leads) {
              const blob = new Blob([leads], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'early-access-leads.json';
              a.click();
            }
          }}
          className="mt-2 text-xs text-slate-400 hover:text-white"
        >
          Export Leads (Dev)
        </button>
      )}
    </form>
  );
}
