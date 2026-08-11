"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { KeyRound, Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Failed to change password");
      return;
    }
    setMsg("Password changed successfully.");
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <AdminShell title="Change Password">
      <form onSubmit={submit} className="card max-w-md space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Current Password</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">New Password</label>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Confirm New Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" required />
        </div>
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
        {msg && <p className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">{msg}</p>}
        <button type="submit" disabled={saving} className="btn-gold w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AdminShell>
  );
}
