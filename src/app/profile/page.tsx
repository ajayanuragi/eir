"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ruler, Scale, User, Settings, Target, Lock, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeightForm from "@/components/HeightForm";
import MeasurementForm from "@/components/MeasurementForm";
import MeasurementTable from "@/components/MeasurementTable";

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [goalWeight, setGoalWeightLocal] = useState<number | null>(null);
  const [unitPref, setUnitPref] = useState("kg");
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Goal weight form
  const [goalInput, setGoalInput] = useState("");
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalError, setGoalError] = useState("");

  // Unit toggle
  const [unitSaving, setUnitSaving] = useState(false);

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  function fetchData() {
    Promise.all([
      fetch("/api/me"),
      fetch("/api/weight"),
      fetch("/api/measurements"),
    ]).then(async ([meRes, weightRes, measRes]) => {
      if (!meRes.ok || !weightRes.ok) {
        router.push("/login");
        return;
      }
      const me = await meRes.json();
      const entries = await weightRes.json();
      const meas = await measRes.json();

      setUsername(me.username);
      setHeightCm(me.height_cm);
      setGoalWeightLocal(me.goal_weight_kg);
      setUnitPref(me.unit_preference);
      setGoalInput(me.goal_weight_kg !== null ? String(me.goal_weight_kg) : "");
      setMeasurements(meas);

      const sorted = [...entries].sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setCurrentWeight(sorted[0]?.weight_kg ?? null);
      setLoading(false);
    });
  }

  useEffect(() => { fetchData() }, []);

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    setGoalSaving(true);
    setGoalError("");
    const val = goalInput === "" ? null : parseFloat(goalInput);
    if (val !== null && (isNaN(val) || val < 20 || val > 500)) {
      setGoalError("Enter a valid weight (20–500 kg)");
      setGoalSaving(false);
      return;
    }
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal_weight_kg: val }),
    });
    if (!res.ok) {
      setGoalError("Failed to save");
    } else {
      setGoalWeightLocal(val);
    }
    setGoalSaving(false);
  }

  async function saveUnit(u: string) {
    setUnitSaving(true);
    await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unit_preference: u }),
    });
    setUnitPref(u);
    setUnitSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwSaving(true);
    setPwError("");
    setPwSuccess("");
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
    });
    if (!res.ok) {
      const data = await res.json();
      setPwError(data.error || "Failed to change password");
    } else {
      setPwSuccess("Password updated");
      setCurrentPw("");
      setNewPw("");
    }
    setPwSaving(false);
  }

  const displayWeight = (kg: number) =>
    unitPref === "lbs" ? `${(kg * 2.20462).toFixed(1)} lbs` : `${kg} kg`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-600 border-t-transparent" />
          <p className="text-sm text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Navbar username={username} />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-sm">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Profile</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Your stats and settings</p>
          </div>
        </div>

        {/* User card */}
        <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm">
              <User size={28} />
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{username}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Member</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--card-border)] p-5 shadow-sm" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm">
                <Scale size={18} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Current weight</p>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {currentWeight !== null ? displayWeight(currentWeight) : "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] p-5 shadow-sm" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-sm">
                <Ruler size={18} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Height</p>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {heightCm !== null ? `${heightCm} cm` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Goal weight */}
          <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-orange-600" />
              <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Goal weight</h3>
            </div>
            <form onSubmit={saveGoal} className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="20"
                max="500"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder={unitPref === "lbs" ? "165" : "75"}
                className="flex-1 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                style={{ color: "var(--foreground)" }}
              />
              <button
                type="submit"
                disabled={goalSaving}
                className="rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-orange-500 hover:to-orange-400 disabled:opacity-50"
              >
                {goalSaving ? "..." : "Set"}
              </button>
            </form>
            {goalError && <p className="mt-2 text-xs text-red-500">{goalError}</p>}
            {goalWeight !== null && (
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Target: {displayWeight(goalWeight)}
                {currentWeight !== null && (
                  <span>
                    {" "}— {currentWeight <= goalWeight
                      ? `${(goalWeight - currentWeight).toFixed(1)} kg to gain`
                      : `${(currentWeight - goalWeight).toFixed(1)} kg to lose`
                    }
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Unit preference */}
          <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw size={16} className="text-orange-600" />
              <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Units</h3>
            </div>
            <div className="flex gap-2">
              {["kg", "lbs"].map((u) => (
                <button
                  key={u}
                  onClick={() => saveUnit(u)}
                  disabled={unitSaving || unitPref === u}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    unitPref === u
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                      : "border border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--muted-bg)]"
                  }`}
                >
                  {u === "kg" ? "Metric (kg)" : "Imperial (lbs)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Height update */}
        <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Ruler size={16} className="text-orange-600" />
            <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Update height</h3>
          </div>
          <HeightForm heightCm={heightCm} onSaved={(cm) => setHeightCm(cm)} />
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-orange-600" />
              <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Change password</h3>
            </div>
            <form onSubmit={changePassword} className="space-y-3">
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Current password"
                required
                className="block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                style={{ color: "var(--foreground)" }}
              />
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="New password (6+ characters)"
                required
                minLength={6}
                className="block w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                style={{ color: "var(--foreground)" }}
              />
              {pwError && <p className="text-xs text-red-500">{pwError}</p>}
              {pwSuccess && <p className="text-xs text-emerald-600">{pwSuccess}</p>}
              <button
                type="submit"
                disabled={pwSaving}
                className="rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-500 hover:to-orange-400 disabled:opacity-50"
              >
                {pwSaving ? "Updating..." : "Update password"}
              </button>
            </form>
        </div>

        {/* Body measurements */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>Add measurements</h3>
            <MeasurementForm onAdded={fetchData} />
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] p-6 shadow-sm" style={{ background: "var(--card)" }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>Measurement history</h3>
            <MeasurementTable entries={measurements} onDeleted={fetchData} />
          </div>
        </div>
      </main>
    </div>
  );
}
