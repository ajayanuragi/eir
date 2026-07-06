import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          eir
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Track your weight, visualize your progress, reach your goals.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
