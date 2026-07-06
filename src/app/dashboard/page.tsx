"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Download, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import WeightChart from "@/components/WeightChart";
import WeightForm from "@/components/WeightForm";
import WeightTable from "@/components/WeightTable";
import { useMaybeUser } from "@/components/UserProvider";
import { useFetch } from "@/lib/use-fetch";

interface Entry {
  id: string;
  date: string;
  weight_kg: number;
  notes: string | null;
}

type DateRange = 7 | 30 | 90 | 0;

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useMaybeUser();
  const [dateRange, setDateRange] = useState<DateRange>(0);

  const fetchEntries = async () => {
    const res = await fetch("/api/weight");
    if (!res.ok) { router.push("/login"); throw new Error("Unauthorized"); }
    return res.json() as Promise<Entry[]>;
  };

  const { data: entries, loading: entriesLoading, refetch } = useFetch<Entry[]>(
    user ? "entries" : null,
    fetchEntries,
  );

  const filtered = useMemo(() => {
    if (!entries || dateRange === 0) return entries ?? [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - dateRange);
    return entries.filter((e) => new Date(e.date) >= cutoff);
  }, [entries, dateRange]);

  function exportCSV() {
    if (!entries) return;
    const header = "Date,Weight (kg),Notes\n";
    const rows = entries
      .map((e) => `${e.date},${e.weight_kg},"${(e.notes ?? "").replace(/"/g, '""')}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eir-weights-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if ((userLoading || (entriesLoading && !entries)) && !entries) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-600 border-t-transparent" />
          <p className="text-sm text-(--muted)">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const ranges: { label: string; value: DateRange }[] = [
    { label: "All", value: 0 },
    { label: "90d", value: 90 },
    { label: "30d", value: 30 },
    { label: "7d", value: 7 },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Navbar username={user!.username} />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Dashboard</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Track your weight progress</p>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--card-border)] px-3.5 py-2 text-sm font-medium transition-all hover:bg-[var(--muted-bg)]"
            style={{ color: "var(--muted)", background: "var(--card)" }}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        <StatsCards
          entries={entries ?? []}
          heightCm={user!.height_cm}
          goalWeight={user!.goal_weight_kg}
          unitPref={user!.unit_preference}
        />

        <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
          <WeightChart entries={filtered} heightCm={user!.height_cm} goalWeight={user!.goal_weight_kg} />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
              <h3 className="mb-5 text-base font-semibold" style={{ color: "var(--foreground)" }}>Add entry</h3>
              <WeightForm onAdded={() => refetch()} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Recent entries</h3>
                <div className="flex items-center gap-1">
                  <Calendar size={13} className="text-[var(--muted)]" />
                  {ranges.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setDateRange(r.value)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        dateRange === r.value
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                          : "text-[var(--muted)] hover:bg-[var(--muted-bg)]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <WeightTable entries={filtered} onDeleted={() => refetch()} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
