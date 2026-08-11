"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import OrderView from "@/components/OrderView";
import { OrderJSON } from "@/lib/types";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderJSON | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center font-display text-3xl text-neutral-50">Track Your Order</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">Enter your order ID and phone number to see the latest status.</p>

        <form onSubmit={track} className="card mt-8 space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Order ID</label>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="PF-XXXXXX" className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Registered phone" className="input-field" />
          </div>
          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Searching…" : "Track Order"}
          </button>
        </form>

        {order && (
          <div className="mt-8">
            <OrderView order={order} />
          </div>
        )}
      </div>
    </div>
  );
}
