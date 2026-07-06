"use client";

import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  weight_kg: number;
  notes: string | null;
}

export default function WeightTable({
  entries,
  onDeleted,
}: {
  entries: Entry[];
  onDeleted: () => void;
}) {
  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;

    const res = await fetch(`/api/weight/${id}`, { method: "DELETE" });
    if (res.ok) onDeleted();
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-sm" style={{ color: "var(--muted)" }}>
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>No entries recorded yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--card-border)]">
      <table className="min-w-full divide-y divide-[var(--card-border)]">
        <thead className="bg-[var(--muted-bg)]">
          <tr>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Date
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Weight
            </th>
            <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:table-cell" style={{ color: "var(--muted)" }}>
              Notes
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--card-border)]" style={{ background: "var(--card)" }}>
          {entries.map((entry) => (
            <tr key={entry.id} className="transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {format(parseISO(entry.date), "MMM d, yyyy")}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {entry.weight_kg} kg
              </td>
              <td className="hidden max-w-[200px] truncate px-4 py-3 text-sm sm:table-cell" style={{ color: "var(--muted)" }}>
                {entry.notes || "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  style={{ color: "var(--muted)" }}
                  title="Delete entry"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
