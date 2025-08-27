"use client";

import { useState } from "react";
import { firebaseFunctions } from "@/lib/firebase-functions";

export default function ModernEarlyAccessForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await firebaseFunctions.submitEarlyAccess({
        email: email.trim(),
        name: name.trim() || undefined,
        useCase: useCase.trim() || undefined
      });

      if (result.ok) {
        setSuccessMessage("Thanks—I'll be in touch!");
        setStatus("success");
        
        // Clear form on success
        setEmail("");
        setName("");
        setUseCase("");

        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
        setStatus("error");
      }

    } catch (error: unknown) {
      console.error("Submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "Network error. Please check your connection and try again.";
      setErrorMessage(errorMessage);
      setStatus("error");
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
          placeholder="Email address *" 
          disabled={status === "loading"}
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400 disabled:opacity-50" 
        />
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Your name (optional)" 
          disabled={status === "loading"}
          maxLength={100}
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400 disabled:opacity-50" 
        />
        <input 
          value={useCase} 
          onChange={e => setUseCase(e.target.value)} 
          placeholder="Use case (optional)" 
          disabled={status === "loading"}
          maxLength={500}
          className="px-4 py-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 outline-none text-white placeholder:text-slate-400 disabled:opacity-50" 
        />
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="submit"
            disabled={status === "loading" || !email.trim()} 
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Submitting..." : "Request Early Access"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={status === "loading"}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="mt-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30">
          <p className="text-green-300 text-sm">✅ {successMessage}</p>
          <p className="text-green-400/70 text-xs mt-1">This form will close automatically...</p>
        </div>
      )}
      
      {status === "error" && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
          <p className="text-red-300 text-sm">❌ {errorMessage}</p>
        </div>
      )}

      {/* Help text */}
      <div className="mt-4 text-xs text-slate-400/70">
        <p>* Required field. I&apos;ll never share your email or spam you.</p>
        <p>Questions? Email me at <a href="mailto:insight@cognitiveinsight.com" className="text-indigo-400 hover:text-indigo-300">insight@cognitiveinsight.com</a></p>
      </div>
    </form>
  );
}
