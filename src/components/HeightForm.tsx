"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

type Unit = "cm" | "in";

export default function HeightForm({
  heightCm,
  onSaved,
}: {
  heightCm: number | null;
  onSaved: (heightCm: number) => void;
}) {
  const [unit, setUnit] = useState<Unit>("cm");
  const [value, setValue] = useState(() => {
    if (heightCm === null) return "";
    return unit === "cm" ? String(heightCm) : (heightCm / 2.54).toFixed(1);
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleUnit(u: Unit) {
    setUnit(u);
    if (value) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setValue(
          u === "cm"
            ? String(Math.round(num * 2.54))
            : (num / 2.54).toFixed(1),
        );
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid height");
      setSaving(false);
      return;
    }

    const cm = unit === "cm" ? num : Math.round(num * 2.54 * 10) / 10;

    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ height_cm: cm }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save");
      setSaving(false);
      return;
    }

    setSaving(false);
    onSaved(cm);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Height
        </label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500">
          <input
            type="number"
            step="0.1"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={unit === "cm" ? "175" : "69"}
            className="flex-1 px-3 py-2 text-sm outline-none"
          />
          <select
            value={unit}
            onChange={(e) => toggleUnit(e.target.value as Unit)}
            className="bg-slate-50 px-2 text-sm text-slate-600 border-l border-slate-300 outline-none cursor-pointer"
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
      >
        <Ruler size={14} />
        {saving ? "..." : "Save"}
      </button>
    </form>
  );
}
