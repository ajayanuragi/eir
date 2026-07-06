"use client";

import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";

interface Measurement {
  id: string;
  date: string;
  waist_cm: number | null;
  hip_cm: number | null;
  chest_cm: number | null;
  thigh_cm: number | null;
  arm_cm: number | null;
  notes: string | null;
}

export default function MeasurementTable({
  entries,
  onDeleted,
}: {
  entries: Measurement[];
  onDeleted: () => void;
}) {
  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/measurements/${id}`, { method: "DELETE" });
    if (res.ok) onDeleted();
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-[var(--muted)]">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>No measurements yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--card-border)]">
      <table className="min-w-full divide-y divide-[var(--card-border)]">
        <thead className="bg-[var(--muted-bg)]">
          <tr>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Date</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Waist</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Hip</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Chest</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] hidden sm:table-cell">Thigh</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] hidden sm:table-cell">Arm</th>
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--card-border)]" style={{ background: "var(--card)" }}>
          {entries.map((entry) => (
            <tr key={entry.id} className="transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
              <td className="whitespace-nowrap px-3 py-2.5 text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {format(parseISO(entry.date), "MMM d, yyyy")}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-sm" style={{ color: "var(--foreground)" }}>
                {entry.waist_cm !== null ? `${entry.waist_cm} cm` : "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-sm" style={{ color: "var(--foreground)" }}>
                {entry.hip_cm !== null ? `${entry.hip_cm} cm` : "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-sm" style={{ color: "var(--foreground)" }}>
                {entry.chest_cm !== null ? `${entry.chest_cm} cm` : "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-sm hidden sm:table-cell" style={{ color: "var(--foreground)" }}>
                {entry.thigh_cm !== null ? `${entry.thigh_cm} cm` : "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-sm hidden sm:table-cell" style={{ color: "var(--foreground)" }}>
                {entry.arm_cm !== null ? `${entry.arm_cm} cm` : "—"}
              </td>
              <td className="px-3 py-2.5 text-right">
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
