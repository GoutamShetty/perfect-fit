"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderView from "@/components/OrderView";
import { OrderJSON } from "@/lib/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderJSON | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container-px py-24 text-center text-neutral-400">Loading…</div>;

  if (!order) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-display text-2xl text-neutral-100">Order not found</h1>
        <Link href="/track-order" className="btn-outline mt-6">Track an Order</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <div className="mx-auto max-w-2xl">
        <OrderView order={order} />
        <div className="mt-6 text-center">
          <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
