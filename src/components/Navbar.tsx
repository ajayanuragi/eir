"use client";

import { useRouter } from "next/navigation";

export default function Navbar({ username }: { username: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-orange-600">eir</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{username}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
