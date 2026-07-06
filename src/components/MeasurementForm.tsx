"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface MeasurementFormProps {
  onAdded: () => void;
}

const fields = [
  { key: "waist_cm", label: "Waist (cm)", placeholder: "80" },
  { key: "hip_cm", label: "Hip (cm)", placeholder: "95" },
  { key: "chest_cm", label: "Chest (cm)", placeholder: "100" },
  { key: "thigh_cm", label: "Thigh (cm)", placeholder: "55" },
  { key: "arm_cm", label: "Arm (cm)", placeholder: "35" },
] as const;

export default function MeasurementForm({ onAdded }: MeasurementFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body: Record<string, unknown> = { date, notes };
    for (const { key } of fields) {
      const v = values[key];
      body[key] = v && v !== "" ? parseFloat(v) : null;
    }

    fetch("/api/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        setValues({});
        setNotes("");
        setDate(new Date().toISOString().split("T")[0]);
        onAdded();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
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

      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              {label}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
              placeholder={placeholder}
              className="mt-1.5 block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              style={{ color: "var(--foreground)" }}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          Notes <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Post-workout"
          className="mt-1.5 block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          style={{ color: "var(--foreground)" }}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-600 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <Plus size={16} />
        {loading ? "Saving..." : "Add measurements"}
      </button>
    </form>
  );
}
