"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
            <span className="text-sm font-bold text-white">e</span>
          </div>
          <span className="text-lg font-bold text-slate-900">eir</span>
        </Link>
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
