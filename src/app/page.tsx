import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 px-4">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-float rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] animate-float rounded-full bg-orange-600/10 blur-3xl" style={{ animationDelay: "-3s" }} />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-400/5 blur-3xl" />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative w-full max-w-lg text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-2xl shadow-orange-900/30 animate-pulse-glow">
          <span className="text-4xl font-bold text-white">e</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          eir
        </h1>
        <p className="mt-3 text-sm font-semibold tracking-[0.25em] uppercase text-orange-400">
          Weight tracker
        </p>

        {/* Tagline */}
        <p className="mt-5 text-lg leading-relaxed text-slate-300">
          Track your weight, visualize your journey, find your balance.
        </p>

        {/* Quote */}
        <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-slate-700/50 bg-slate-800/50 px-6 py-4 backdrop-blur-sm">
          <p className="text-sm italic leading-relaxed text-slate-400">
            &ldquo;What gets measured gets managed.&rdquo;
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-900/40 active:scale-100"
          >
            Sign in
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-7 py-3.5 text-sm font-semibold text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-slate-500 hover:bg-slate-700/50 active:scale-100"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
