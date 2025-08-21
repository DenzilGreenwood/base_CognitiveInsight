'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import EarlyAccessForm from "@/components/EarlyAccessForm";

export default function HomePage() {
  const router = useRouter();
  const [showEarly, setShowEarly] = useState(false);

  return (
    <main className="container mx-auto px-4 py-10">
      {/* … your hero … */}
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">Cognitive Insight</h1>
        <p className="text-lg text-gray-600">Turn Confusion Into Cryptographic Clarity</p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          className="rounded-xl bg-black px-5 py-3 text-white hover:opacity-90"
          onClick={() => setShowEarly(true)}
        >
          Request Early Access
        </button>

        <button
          className="rounded-xl border px-5 py-3 hover:bg-gray-50"
          onClick={() => router.push("/demo")}
        >
          Launch Live Demo
        </button>
      </div>

      {showEarly && <EarlyAccessForm defaultSource="landing" onDone={() => setShowEarly(false)} />}

      {/* … the rest … */}
    </main>
  );
}
