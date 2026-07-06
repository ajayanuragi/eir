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
      <p className="py-8 text-center text-sm text-slate-400">
        No entries recorded yet
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Weight
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
              Notes
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                {format(parseISO(entry.date), "MMM d, yyyy")}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                {entry.weight_kg} kg
              </td>
              <td className="hidden max-w-[200px] truncate px-4 py-3 text-sm text-slate-500 sm:table-cell">
                {entry.notes || "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
