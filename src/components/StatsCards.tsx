"use client";

import { TrendingDown, TrendingUp, Scale, Heart } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  weight_kg: number;
}

export default function StatsCards({
  entries,
  heightCm,
}: {
  entries: Entry[];
  heightCm: number | null;
}) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const latest = sorted[sorted.length - 1]?.weight_kg ?? null;
  const first = sorted[0]?.weight_kg ?? null;
  const diff = latest !== null && first !== null ? (latest - first).toFixed(1) : null;

  const bmi =
    latest !== null && heightCm !== null
      ? (latest / ((heightCm / 100) * (heightCm / 100))).toFixed(1)
      : null;

  const bmiColor =
    bmi !== null
      ? parseFloat(bmi) < 18.5
        ? "text-blue-600"
        : parseFloat(bmi) < 25
          ? "text-emerald-600"
          : parseFloat(bmi) < 30
            ? "text-amber-600"
            : "text-red-600"
      : "";

  const bmiBg =
    bmi !== null
      ? parseFloat(bmi) < 18.5
        ? "bg-blue-100"
        : parseFloat(bmi) < 25
          ? "bg-emerald-100"
          : parseFloat(bmi) < 30
            ? "bg-amber-100"
            : "bg-red-100"
      : "bg-slate-100";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Scale size={20} className="text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Current</p>
            <p className="text-xl font-bold text-slate-900">
              {latest !== null ? `${latest} kg` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              diff !== null && parseFloat(diff) <= 0
                ? "bg-emerald-100"
                : "bg-amber-100"
            }`}
          >
            {diff !== null && parseFloat(diff) <= 0 ? (
              <TrendingDown size={20} className="text-emerald-600" />
            ) : (
              <TrendingUp size={20} className="text-amber-600" />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Change</p>
            <p className="text-xl font-bold text-slate-900">
              {diff !== null ? `${diff} kg` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bmiBg}`}>
            <Heart size={20} className={bmiColor} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">BMI</p>
            <p className={`text-xl font-bold ${bmiColor}`}>
              {bmi !== null ? bmi : heightCm === null ? "—" : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Scale size={20} className="text-slate-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Entries</p>
            <p className="text-xl font-bold text-slate-900">{entries.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
