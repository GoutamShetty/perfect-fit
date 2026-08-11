import { OrderJSON } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { Check, Package, Truck, Home, Clock, XCircle } from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: Check },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Home },
];

export default function OrderView({ order }: { order: OrderJSON }) {
  const cancelled = order.status === "CANCELLED";
  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Order</p>
          <p className="font-mono text-lg font-semibold text-gold">{order.orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
          <p className="text-sm text-neutral-300">
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"} · {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Status timeline */}
      {cancelled ? (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          <XCircle className="h-5 w-5" /> This order was cancelled.
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-between">
          {STEPS.map((step, i) => {
            const done = i <= currentIdx;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && <div className={`h-0.5 flex-1 ${i <= currentIdx ? "bg-gold" : "bg-neutral-800"}`} />}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                      done ? "border-gold bg-gold text-ink" : "border-neutral-700 text-neutral-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? "bg-gold" : "bg-neutral-800"}`} />}
                </div>
                <span className={`mt-2 text-[11px] ${done ? "text-gold" : "text-neutral-500"}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Items */}
      <div className="mt-6 space-y-3">
        {order.items.map((it, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image || "/logo.png"} alt={it.name} className="h-14 w-12 rounded object-cover" />
            <div className="flex-1">
              <p className="text-sm text-neutral-100">{it.name}</p>
              <p className="text-xs text-neutral-500">Qty {it.qty}{it.size ? ` · ${it.size}` : ""}</p>
            </div>
            <span className="text-sm text-neutral-300">{formatINR(it.price * it.qty)}</span>
          </div>
        ))}
      </div>

      {/* Totals + address */}
      <div className="mt-6 grid gap-6 border-t border-neutral-800 pt-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-neutral-300">
            <Package className="h-4 w-4 text-gold" /> Shipping To
          </h4>
          <p className="text-sm text-neutral-400">{order.customer.name}</p>
          <p className="text-sm text-neutral-400">{order.customer.phone}</p>
          <p className="text-sm text-neutral-400">
            {order.customer.address}
            {order.customer.city ? `, ${order.customer.city}` : ""}
            {order.customer.state ? `, ${order.customer.state}` : ""}
            {order.customer.pincode ? ` - ${order.customer.pincode}` : ""}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>}
          <div className="flex justify-between text-neutral-400"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
          <div className="flex justify-between border-t border-neutral-800 pt-2 font-semibold"><span className="text-neutral-100">Total</span><span className="text-gold">{formatINR(order.amount)}</span></div>
        </div>
      </div>
    </div>
  );
}
