"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface WeightFormProps {
  onAdded: () => void;
}

export default function WeightForm({ onAdded }: WeightFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, weight_kg: weight, notes }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save entry");
      setLoading(false);
      return;
    }

    setWeight("");
    setNotes("");
    setDate(new Date().toISOString().split("T")[0]);
    setLoading(false);
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1.5 block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            style={{ color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            placeholder="75.5"
            className="mt-1.5 block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Notes <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Feeling good, post-workout"
          className="mt-1.5 block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          style={{ color: "var(--foreground)" }}
        />
      </div>

      {error && (
        <p className="rounded-xl border px-3.5 py-2.5 text-sm bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <Plus size={16} />
        {loading ? "Saving..." : "Add entry"}
      </button>
    </form>
  );
}
