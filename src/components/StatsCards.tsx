"use client";

import { TrendingDown, TrendingUp, Scale, Heart, Flame, Target } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  weight_kg: number;
}

export default function StatsCards({
  entries,
  heightCm,
  goalWeight,
  unitPref = "kg",
}: {
  entries: Entry[];
  heightCm: number | null;
  goalWeight?: number | null;
  unitPref?: string;
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

  const bmiGrad =
    bmi !== null
      ? parseFloat(bmi) < 18.5
        ? "from-blue-500 to-blue-600"
        : parseFloat(bmi) < 25
          ? "from-emerald-500 to-emerald-600"
          : parseFloat(bmi) < 30
            ? "from-amber-500 to-amber-600"
            : "from-red-500 to-red-600"
      : "from-slate-400 to-slate-500";

  const bmiLabel =
    bmi !== null
      ? parseFloat(bmi) < 18.5
        ? "Underweight"
        : parseFloat(bmi) < 25
          ? "Healthy"
          : parseFloat(bmi) < 30
            ? "Overweight"
            : "Obese"
      : null;

  // Streak
  const dates = [...new Set(entries.map((e) => e.date))].sort().reverse();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const d = new Date(dates[i]);
    if (
      d.getFullYear() === expected.getFullYear() &&
      d.getMonth() === expected.getMonth() &&
      d.getDate() === expected.getDate()
    ) {
      streak++;
    } else {
      break;
    }
  }

  // Goal progress
  const goalProgress =
    latest !== null && goalWeight != null
      ? latest <= goalWeight ? 100 : Math.min(Math.round((1 - (latest - goalWeight) / latest) * 100), 100)
      : null;

  const display = (kg: number) =>
    unitPref === "lbs" ? `${(kg * 2.20462).toFixed(1)} lbs` : `${kg} kg`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* Current weight */}
      <div className="group rounded-xl border border-[var(--card-border)] p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm">
            <Scale size={18} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Current</p>
            <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              {latest !== null ? display(latest) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Change */}
      <div className="group rounded-xl border border-[var(--card-border)] p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-sm ${
              diff !== null && parseFloat(diff) <= 0
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                : "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
            }`}
          >
            {diff !== null && parseFloat(diff) <= 0 ? (
              <TrendingDown size={18} />
            ) : (
              <TrendingUp size={18} />
            )}
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Change</p>
            <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              {diff !== null ? `${diff} kg` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* BMI */}
      <div className="group rounded-xl border border-[var(--card-border)] p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${bmiGrad} text-white shadow-sm`}>
            <Heart size={18} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>BMI</p>
            <p className={`text-xl font-bold ${bmiColor}`}>
              {bmi !== null ? bmi : "—"}
            </p>
            {bmiLabel && (
              <p className={`text-[11px] font-medium ${bmiColor}`}>{bmiLabel}</p>
            )}
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="group rounded-xl border border-[var(--card-border)] p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-sm">
            <Flame size={18} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Streak</p>
            <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              {streak > 0 ? `${streak} day${streak !== 1 ? "s" : ""}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Goal progress */}
      <div className="group rounded-xl border border-[var(--card-border)] p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-sm">
            <Target size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              {goalWeight !== null ? "Goal" : "Entries"}
            </p>
              {goalWeight != null ? (
              <>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {goalProgress !== null ? `${goalProgress}%` : "—"}
                </p>
                {goalProgress !== null && (
                  <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--muted-bg)]">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-orange-500 transition-all"
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{entries.length}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
