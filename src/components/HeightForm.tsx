"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

type Unit = "cm" | "in" | "ftin";

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
  const [feet, setFeet] = useState(() => {
    if (heightCm === null) return "";
    return String(Math.floor(heightCm / 2.54 / 12));
  });
  const [inches, setInches] = useState(() => {
    if (heightCm === null) return "";
    return String(Math.round((heightCm / 2.54) % 12));
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function switchUnit(u: Unit) {
    setUnit(u);
    setError("");

    if (u === "cm" && heightCm !== null) {
      setValue(String(heightCm));
    } else if (u === "in" && heightCm !== null) {
      setValue((heightCm / 2.54).toFixed(1));
    } else if (u === "ftin" && heightCm !== null) {
      const totalIn = heightCm / 2.54;
      setFeet(String(Math.floor(totalIn / 12)));
      setInches(String(Math.round(totalIn % 12)));
    }
  }

  function toCm(): number | null {
    if (unit === "cm") {
      const n = parseFloat(value);
      if (isNaN(n) || n <= 0) return null;
      return n;
    }
    if (unit === "in") {
      const n = parseFloat(value);
      if (isNaN(n) || n <= 0) return null;
      return Math.round(n * 2.54 * 10) / 10;
    }
    const f = parseInt(feet);
    const i = parseFloat(inches);
    if (isNaN(f) || f < 0 || isNaN(i) || i < 0) return null;
    return Math.round((f * 12 + i) * 2.54 * 10) / 10;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const cm = toCm();
    if (cm === null || cm < 50 || cm > 300) {
      setError("Enter a valid height");
      setSaving(false);
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block text-xs font-medium text-slate-500">Height</label>

      {unit === "ftin" ? (
        <div className="flex items-end gap-2">
          <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500">
            <input
              type="number"
              min="0"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
              placeholder="5"
              className="w-16 px-3 py-2 text-sm text-center outline-none"
            />
            <span className="flex items-center px-1.5 text-sm text-slate-400 bg-slate-50 border-l border-slate-300">
              ft
            </span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
              placeholder="6"
              className="w-16 px-3 py-2 text-sm text-center outline-none border-l border-slate-300"
            />
            <span className="flex items-center px-1.5 text-sm text-slate-400 bg-slate-50 border-l border-slate-300">
              in
            </span>
          </div>
          <select
            value={unit}
            onChange={(e) => switchUnit(e.target.value as Unit)}
            className="rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-600 outline-none cursor-pointer"
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
            <option value="ftin">ft/in</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
          >
            <Ruler size={14} />
            {saving ? "..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500">
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
              onChange={(e) => switchUnit(e.target.value as Unit)}
              className="bg-slate-50 px-2 text-sm text-slate-600 border-l border-slate-300 outline-none cursor-pointer"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
              <option value="ftin">ft/in</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
          >
            <Ruler size={14} />
            {saving ? "..." : "Save"}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
