"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";
import { useCallback } from "react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    // If there is no meaningful history, go home
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.35),transparent_60%)]" />
        <div className="container mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl">
          <div className="flex flex-col items-center text-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-red-500/20 text-red-200 border border-red-400/20">
              <Search className="w-3.5 h-3.5" /> Page Not Found • 404 Error
            </span>

            <div className="text-center">
              <div className="text-8xl md:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300 mb-4">
                404
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                Page Not Found
              </h1>
            </div>

            <p className="max-w-2xl text-indigo-100/90 text-lg">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              Let's get you back on track.
            </p>

            {/* Primary actions */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {/* Use Link so it works even without JS */}
              <Link
                href="/"
                prefetch={true}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-400 dark:focus:ring-indigo-600"
                aria-label="Go to Homepage"
              >
                <Home className="w-4 h-4" /> Go Home
              </Link>

              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 focus:ring-indigo-200"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>

              {/* Keep a test button if you want */}
              {/* <button ...>Test Click</button> */}
            </div>

            {/* Helpful links */}
            <div className="mt-12 pt-8 border-t border-indigo-400/20">
              <p className="text-indigo-100/70 text-sm mb-4">Looking for something specific? Try these pages:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  href="/demo"
                  prefetch={false}
                  className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 border border-indigo-400/20"
                  aria-label="Go to Demo"
                >
                  <Sparkles className="w-3 h-3" /> Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
