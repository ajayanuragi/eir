"use client";

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

export default function WeightChart({ entries }: { entries: Entry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const data = sorted.map((e) => ({
    date: format(parseISO(e.date), "MMM d"),
    weight: e.weight_kg,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-400">
        No entries yet — add your first weight above
      </div>
    );
  }

  const min = Math.floor(Math.min(...data.map((d) => d.weight)) - 2);
  const max = Math.ceil(Math.max(...data.map((d) => d.weight)) + 2);

  return (
    <div className="h-80 w-full">
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
            tickFormatter={(v) => `${v} kg`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`${value} kg`, "Weight"]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#ea580c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
