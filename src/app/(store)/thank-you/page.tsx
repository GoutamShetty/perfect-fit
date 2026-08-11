"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Copy } from "lucide-react";
import { motion } from "framer-motion";

function ThankYouInner() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";

  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <CheckCircle2 className="h-20 w-20 text-gold" />
      </motion.div>
      <h1 className="mt-6 font-display text-3xl text-neutral-50">Thank You for Your Order!</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        Your order has been placed successfully. We&apos;ll send you updates as it makes its way to you.
      </p>

      {orderId && (
        <div className="mt-6 flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5">
          <Package className="h-4 w-4 text-gold" />
          <span className="text-sm text-neutral-300">Order ID:</span>
          <span className="font-mono text-sm font-semibold text-gold">{orderId}</span>
          <button
            onClick={() => navigator.clipboard?.writeText(orderId)}
            className="text-neutral-500 hover:text-gold"
            aria-label="Copy order ID"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {orderId && <Link href={`/order/${orderId}`} className="btn-gold">View Order</Link>}
        <Link href="/track-order" className="btn-outline">Track Order</Link>
        <Link href="/shop" className="text-sm text-neutral-400 hover:text-gold">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="container-px py-24 text-center text-neutral-400">Loading…</div>}>
      <ThankYouInner />
    </Suspense>
  );
}
