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

  const data = sorted.map((e) => ({
    date: format(parseISO(e.date), "MMM d"),
    weight: e.weight_kg,
    bmi: heightCm ? parseFloat((e.weight_kg / divisor).toFixed(1)) : 0,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-400">
        No entries yet — add your first weight above
      </div>
    );
  }

  const key = mode === "weight" ? "weight" : "bmi";
  const values = data.map((d) => d[key]);
  const min = Math.floor(Math.min(...values) - 2);
  const max = Math.ceil(Math.max(...values) + 2);
  const suffix = mode === "weight" ? " kg" : "";

  const latestBmi = data.length > 0 ? data[data.length - 1].bmi : 0;
  const bmiColor =
    mode === "weight"
      ? "#ea580c"
      : latestBmi < 18.5
        ? "#2563eb"
        : latestBmi < 25
          ? "#059669"
          : latestBmi < 30
            ? "#d97706"
            : "#dc2626";

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        <button
          onClick={() => setMode("weight")}
          className={`rounded-lg px-3 py-1 text-xs font-medium ${
            mode === "weight"
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          Weight
        </button>
        {hasHeight && (
          <button
            onClick={() => setMode("bmi")}
            className={`rounded-lg px-3 py-1 text-xs font-medium ${
              mode === "bmi"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            BMI
          </button>
        )}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              domain={[min, max]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}${suffix}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value) => [
                `${value}${mode === "bmi" ? "" : " kg"}`,
                mode === "weight" ? "Weight" : "BMI",
              ]}
            />
            <Line
              type="monotone"
              dataKey={key}
              stroke={bmiColor}
              strokeWidth={2}
              dot={{ fill: bmiColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: bmiColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
