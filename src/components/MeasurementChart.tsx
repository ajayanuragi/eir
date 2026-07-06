"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface Measurement {
  id: string;
  date: string;
  waist_cm: number | null;
  hip_cm: number | null;
  chest_cm: number | null;
  thigh_cm: number | null;
  arm_cm: number | null;
}

const MEASURES = [
  { key: "waist_cm", label: "Waist", color: "#ea580c" },
  { key: "hip_cm", label: "Hip", color: "#2563eb" },
  { key: "chest_cm", label: "Chest", color: "#059669" },
  { key: "thigh_cm", label: "Thigh", color: "#d97706" },
  { key: "arm_cm", label: "Arm", color: "#dc2626" },
] as const;

export default function MeasurementChart({
  entries,
}: {
  entries: Measurement[];
}) {
  const [selected, setSelected] = useState<string[]>(["waist_cm", "hip_cm"]);

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const data = sorted.map((e) => ({
    date: format(parseISO(e.date), "MMM d"),
    waist_cm: e.waist_cm,
    hip_cm: e.hip_cm,
    chest_cm: e.chest_cm,
    thigh_cm: e.thigh_cm,
    arm_cm: e.arm_cm,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-[var(--card-border)] text-sm text-[var(--muted)]">
        Add measurements to see trends
      </div>
    );
  }

  function toggle(key: string) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 shadow-lg">
        <p className="mb-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            <span style={{ color: p.color }}>{p.name}:</span> {p.value} cm
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {MEASURES.map((m) => (
          <button
            key={m.key}
            onClick={() => toggle(m.key)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              selected.includes(m.key)
                ? "shadow-sm"
                : "bg-[var(--muted-bg)] text-[var(--muted)] hover:opacity-80"
            }`}
            style={{
              backgroundColor: selected.includes(m.key) ? `${m.color}20` : undefined,
              color: selected.includes(m.key) ? m.color : undefined,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--card-border)" }}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            {MEASURES.filter((m) => selected.includes(m.key)).map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={{ fill: m.color, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: m.color, strokeWidth: 2, stroke: "#fff" }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
