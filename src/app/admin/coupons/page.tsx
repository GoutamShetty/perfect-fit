"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { CouponJSON } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponJSON[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", minCart: "", maxDiscount: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((d) => setCoupons(d.coupons || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.code || !form.value) {
      setError("Code and value are required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minCart: Number(form.minCart) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Failed to create coupon");
      return;
    }
    setForm({ code: "", type: "percent", value: "", minCart: "", maxDiscount: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
    setCoupons((c) => c.filter((x) => x._id !== id));
  };

  return (
    <AdminShell title="Coupons">
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={create} className="card h-fit space-y-4 p-6">
          <h2 className="font-display text-lg text-neutral-100">Create Coupon</h2>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field" placeholder="WELCOME10" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field cursor-pointer">
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Value</label>
            <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">Min Cart (₹)</label>
              <input type="number" value={form.minCart} onChange={(e) => setForm({ ...form, minCart: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">Max Disc (₹)</label>
              <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="input-field" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="btn-gold w-full">
            <Plus className="h-4 w-4" /> {saving ? "Creating…" : "Create Coupon"}
          </button>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="card p-10 text-center text-neutral-400">Loading…</div>
          ) : coupons.length === 0 ? (
            <div className="card p-10 text-center text-neutral-400">No coupons yet.</div>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => (
                <div key={c._id} className="card flex items-center justify-between p-4">
                  <div>
                    <span className="font-mono text-lg font-semibold text-gold">{c.code}</span>
                    <p className="text-xs text-neutral-500">
                      {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                      {c.minCart ? ` · min ₹${c.minCart}` : ""}
                      {c.maxDiscount ? ` · up to ₹${c.maxDiscount}` : ""}
                    </p>
                  </div>
                  <button onClick={() => remove(c._id)} className="rounded-lg border border-neutral-700 p-2 text-neutral-300 hover:border-red-400 hover:text-red-400" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
