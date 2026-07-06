"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import WeightChart from "@/components/WeightChart";
import WeightForm from "@/components/WeightForm";
import WeightTable from "@/components/WeightTable";
import HeightForm from "@/components/HeightForm";

interface Entry {
  id: string;
  date: string;
  weight_kg: number;
  notes: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/weight");
    if (!res.ok) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setEntries(data);
  }, [router]);

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUsername(data.username);
      setHeightCm(data.height_cm);
      await fetchEntries();
      setLoading(false);
    }

    init();
  }, [router, fetchEntries]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar username={username ?? ""} />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">Track your weight progress</p>
        </div>

        <StatsCards entries={entries} heightCm={heightCm} />

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Trend</h3>
          <WeightChart entries={entries} heightCm={heightCm} />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Add entry
              </h3>
              <WeightForm onAdded={fetchEntries} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Your height
              </h3>
              <HeightForm
                heightCm={heightCm}
                onSaved={(cm) => setHeightCm(cm)}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Recent entries
              </h3>
              <WeightTable entries={entries} onDeleted={fetchEntries} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
