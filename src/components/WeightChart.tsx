"use client";

import { useState, useMemo } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { format, parseISO } from "date-fns";

interface Entry {
  id: string;
  date: string;
  weight_kg: number;
}

export default function WeightChart({
  entries,
  heightCm,
}: {
  entries: Entry[];
  heightCm: number | null;
}) {
  const [mode, setMode] = useState<"weight" | "bmi">("weight");
  const hasHeight = heightCm !== null && heightCm > 0;

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const divisor = heightCm ? (heightCm / 100) * (heightCm / 100) : 1;

  const data = useMemo(() => {
    const values = sorted.map((e) => ({
      date: format(parseISO(e.date), "MMM d"),
      weight: e.weight_kg,
      bmi: heightCm ? parseFloat((e.weight_kg / divisor).toFixed(1)) : 0,
    }));

    const window = 7;
    return values.map((d, i) => {
      const slice = values.slice(Math.max(0, i - window + 1), i + 1);
      const avg = slice.reduce((s, v) => s + (mode === "weight" ? v.weight : v.bmi), 0) / slice.length;
      return { ...d, avg: parseFloat(avg.toFixed(1)) };
    });
  }, [sorted, heightCm, divisor, mode]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--card-border)] text-sm text-[var(--muted)]">
        <p>No entries yet — add your first weight above</p>
      </div>
    );
  }

  if (data.length === 1) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--card-border)] text-sm text-[var(--muted)]">
        <p>Add one more entry to see your trend</p>
      </div>
    );
  }

  const key = mode === "weight" ? "weight" : "bmi";
  const values = data.map((d) => d[key]);
  const min = Math.floor(Math.min(...values) - 2);
  const max = Math.ceil(Math.max(...values) + 2);
  const suffix = mode === "weight" ? " kg" : "";

  const latestBmi = data.length > 0 ? data[data.length - 1].bmi : 0;
  const isBmiMode = mode === "bmi";
  const lineColor = isBmiMode
    ? latestBmi < 18.5
      ? "#2563eb"
      : latestBmi < 25
        ? "#059669"
        : latestBmi < 30
          ? "#d97706"
          : "#dc2626"
    : "#ea580c";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 shadow-lg">
        <p className="mb-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {p.dataKey === "avg" ? "Avg: " : ""}{p.value}{p.dataKey === "bmi" ? "" : " kg"}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        <button
          onClick={() => setMode("weight")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            mode === "weight"
              ? "bg-orange-100 text-orange-700 shadow-sm dark:bg-orange-900/40 dark:text-orange-300"
              : "bg-[var(--muted-bg)] text-[var(--muted)] hover:opacity-80"
          }`}
        >
          Weight
        </button>
        {hasHeight && (
          <button
            onClick={() => setMode("bmi")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === "bmi"
                ? "bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-[var(--muted-bg)] text-[var(--muted)] hover:opacity-80"
            }`}
          >
            BMI
          </button>
        )}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--card-border)" }}
              dy={8}
            />
            <YAxis
              domain={[min, max]}
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}${suffix}`}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={key}
              stroke={lineColor}
              strokeWidth={2.5}
              fill="url(#colorFill)"
              dot={{ fill: lineColor, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: lineColor, strokeWidth: 2, stroke: "#fff" }}
            />
            {data.length >= 7 && (
              <Line
                type="monotone"
                dataKey="avg"
                stroke={lineColor}
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                activeDot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {data.length >= 7 && (
        <p className="text-[11px] text-[var(--muted)] text-center">
          Dashed line: 7-entry moving average
        </p>
      )}
    </div>
  );
}
