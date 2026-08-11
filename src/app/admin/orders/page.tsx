"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { OrderJSON } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { ChevronDown, ChevronUp } from "lucide-react";

const STATUSES = ["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const NEXT_STATUS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderJSON[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = (status: string) => {
    setLoading(true);
    const qs = status !== "All" ? `?status=${status}` : "";
    fetch(`/api/admin/orders${qs}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(filter), [filter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    }
  };

  const statusColor = (s: string) =>
    ({
      PENDING: "bg-yellow-500/10 text-yellow-400",
      CONFIRMED: "bg-blue-500/10 text-blue-400",
      SHIPPED: "bg-purple-500/10 text-purple-400",
      DELIVERED: "bg-green-500/10 text-green-400",
      CANCELLED: "bg-red-500/10 text-red-400",
    }[s] || "bg-neutral-700/40 text-neutral-300");

  return (
    <AdminShell title="Orders">
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
              filter === s ? "border-gold bg-gold text-ink" : "border-neutral-700 text-neutral-300 hover:border-gold"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-10 text-center text-neutral-400">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center text-neutral-400">No orders found.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="card overflow-hidden">
              <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-gold">{o.orderId}</span>
                  <span className="text-sm text-neutral-300">{o.customer.name}</span>
                  <span className="hidden text-xs text-neutral-500 sm:inline">{new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-100">{formatINR(o.amount)}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${statusColor(o.status)}`}>{o.status}</span>
                  {expanded === o._id ? <ChevronUp className="h-4 w-4 text-neutral-500" /> : <ChevronDown className="h-4 w-4 text-neutral-500" />}
                </div>
              </button>

              {expanded === o._id && (
                <div className="border-t border-neutral-800 p-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-xs uppercase tracking-wider text-neutral-500">Items</h4>
                      <div className="space-y-2">
                        {o.items.map((it, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={it.image || "/logo.png"} alt="" className="h-10 w-8 rounded object-cover" />
                            <span className="flex-1 text-neutral-300">{it.name} × {it.qty}{it.size ? ` (${it.size})` : ""}</span>
                            <span className="text-neutral-400">{formatINR(it.price * it.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs uppercase tracking-wider text-neutral-500">Customer</h4>
                      <p className="text-sm text-neutral-300">{o.customer.name} · {o.customer.phone}</p>
                      <p className="text-sm text-neutral-400">{o.customer.address}{o.customer.city ? `, ${o.customer.city}` : ""} {o.customer.pincode}</p>
                      <p className="mt-2 text-xs text-neutral-500">
                        Payment: {o.paymentMethod === "cod" ? "COD" : "Online"} · {o.paymentStatus}
                        {o.couponCode ? ` · Coupon ${o.couponCode}` : ""}
                      </p>
                      <div className="mt-3">
                        <label className="mb-1 block text-xs text-neutral-500">Update Status</label>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className="input-field !py-2 cursor-pointer"
                        >
                          {NEXT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
