import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 selection:bg-indigo-600/40 selection:text-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Thank You!
        </h1>
        <p className="mt-4 text-lg text-indigo-100/90">
          Your request has been submitted. Please check your email for a confirmation and a link to book a meeting.
        </p>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400">
            Return to Homepage
          </Link>
        </div>
        <p className="mt-6 text-sm text-indigo-300/80">
          If you don&apos;t receive an email within a few minutes, please check your spam folder or contact us directly.
        </p>
      </div>
    </main>
  );
}
