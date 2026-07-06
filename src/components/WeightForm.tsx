"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-slate-700">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            placeholder="75.5"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Feeling good, post-workout"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add entry"}
      </button>
    </form>
  );
}
