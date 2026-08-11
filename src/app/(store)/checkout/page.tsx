"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tag, CreditCard, Truck, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/config";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, hydrated } = useCart();
  const razorpayConfigured = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const discount = coupon?.discount || 0;
  const afterDiscount = Math.max(0, cartTotal - discount);
  const shipping = useMemo(() => (afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE), [afterDiscount]);
  const total = afterDiscount + shipping;

  if (!hydrated) return <div className="container-px py-24 text-center text-neutral-400">Loading…</div>;
  if (cart.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-display text-2xl text-neutral-100">Your cart is empty</h1>
        <Link href="/shop" className="btn-gold mt-6">Shop Now</Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    setCouponMsg("");
    if (!couponInput.trim()) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput, subtotal: cartTotal }),
    }).then((r) => r.json());
    if (res.valid) {
      setCoupon({ code: res.code, discount: res.discount });
      setCouponMsg(res.message);
    } else {
      setCoupon(null);
      setCouponMsg(res.message || "Invalid coupon");
    }
  };

  const placeOrder = async () => {
    setError("");
    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in your name, phone and address.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: cart.map((i) => ({ productId: i.productId, size: i.size, color: i.color, qty: i.qty })),
        customer: form,
        couponCode: coupon?.code || "",
        paymentMethod,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/thank-you?order=${data.order.orderId}`);
        return;
      }

      // Razorpay flow
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error("Could not load payment gateway. Try COD.");
      const rzp = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: "Perfect Fit",
        description: `Order ${data.order.orderId}`,
        order_id: data.razorpay.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#C8A04A" },
        handler: async (response: RazorpayResponse) => {
          const verify = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }).then((r) => r.json());
          if (verify.success) {
            clearCart();
            router.push(`/thank-you?order=${verify.orderId}`);
          } else {
            setError("Payment verification failed. Please contact support.");
            setSubmitting(false);
          }
        },
      });
      rzp.open();
      setSubmitting(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof form, label: string, opts: { required?: boolean; type?: string } = {}) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label} {opts.required && <span className="text-gold">*</span>}
      </label>
      <input
        type={opts.type || "text"}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="input-field"
      />
    </div>
  );

  return (
    <div className="container-px py-10">
      <h1 className="mb-8 font-display text-3xl text-neutral-50">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl text-neutral-100">Shipping Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Full Name", { required: true })}
              {field("phone", "Phone", { required: true })}
              {field("email", "Email", { type: "email" })}
              {field("pincode", "Pincode")}
              <div className="sm:col-span-2">{field("address", "Address", { required: true })}</div>
              {field("city", "City")}
              {field("state", "State")}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl text-neutral-100">Payment Method</h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition ${
                  paymentMethod === "cod" ? "border-gold bg-gold/5" : "border-neutral-700"
                }`}
              >
                <Truck className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-medium text-neutral-100">Cash on Delivery</p>
                  <p className="text-xs text-neutral-500">Pay when your order arrives.</p>
                </div>
                {paymentMethod === "cod" && <CheckCircle2 className="ml-auto h-5 w-5 text-gold" />}
              </button>

              <button
                onClick={() => razorpayConfigured && setPaymentMethod("razorpay")}
                disabled={!razorpayConfigured}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition disabled:opacity-50 ${
                  paymentMethod === "razorpay" ? "border-gold bg-gold/5" : "border-neutral-700"
                }`}
              >
                <CreditCard className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-medium text-neutral-100">Pay Online (Razorpay)</p>
                  <p className="text-xs text-neutral-500">
                    {razorpayConfigured ? "Cards, UPI, netbanking & wallets." : "Not configured yet — add Razorpay keys."}
                  </p>
                </div>
                {paymentMethod === "razorpay" && <CheckCircle2 className="ml-auto h-5 w-5 text-gold" />}
              </button>
            </div>
          </div>
        </div>

        <div className="h-fit card p-6">
          <h2 className="font-display text-xl text-neutral-100">Order Summary</h2>
          <div className="mt-4 max-h-52 space-y-3 overflow-y-auto">
            {cart.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="flex items-center gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image || "/logo.png"} alt={i.name} className="h-12 w-10 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-neutral-200">{i.name}</p>
                  <p className="text-xs text-neutral-500">Qty {i.qty}{i.size ? ` · ${i.size}` : ""}</p>
                </div>
                <span className="text-neutral-300">{formatINR(i.price * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="input-field !py-2 pl-9"
              />
            </div>
            <button onClick={applyCoupon} className="btn-outline !px-4 !py-2 !text-xs">Apply</button>
          </div>
          {couponMsg && <p className={`mt-2 text-xs ${coupon ? "text-green-400" : "text-red-400"}`}>{couponMsg}</p>}

          <div className="mt-4 space-y-2 border-t border-neutral-800 pt-4 text-sm">
            <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span className="text-neutral-200">{formatINR(cartTotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatINR(discount)}</span></div>}
            <div className="flex justify-between text-neutral-400"><span>Shipping</span><span className="text-neutral-200">{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
            <div className="flex justify-between border-t border-neutral-800 pt-2 text-base font-semibold"><span className="text-neutral-100">Total</span><span className="text-gold">{formatINR(total)}</span></div>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}

          <button onClick={placeOrder} disabled={submitting} className="btn-gold mt-5 w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Processing…" : paymentMethod === "cod" ? "Place Order" : `Pay ${formatINR(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
