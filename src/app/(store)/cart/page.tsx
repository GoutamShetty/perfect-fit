"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/config";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal, hydrated } = useCart();

  if (!hydrated) return <div className="container-px py-24 text-center text-neutral-400">Loading…</div>;

  if (cart.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-neutral-700" />
        <h1 className="mt-6 font-display text-2xl text-neutral-100">Your cart is empty</h1>
        <p className="mt-2 text-neutral-400">Discover our latest collection and find your perfect fit.</p>
        <Link href="/shop" className="btn-gold mt-8">Continue Shopping</Link>
      </div>
    );
  }

  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <div className="container-px py-10">
      <h1 className="mb-8 font-display text-3xl text-neutral-50">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="card flex gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image || "/logo.png"} alt={item.name} className="h-24 w-20 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base text-neutral-100">{item.name}</h3>
                    {item.size && <p className="text-xs text-neutral-500">Size: {item.size}{item.color ? ` · ${item.color}` : ""}</p>}
                  </div>
                  <button onClick={() => removeFromCart(item.productId, item.size)} className="text-neutral-500 hover:text-red-400" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.size, item.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 hover:border-gold" aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.size, item.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 hover:border-gold" aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-gold">{formatINR(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit card p-6">
          <h2 className="font-display text-xl text-neutral-100">Order Summary</h2>
          {remaining > 0 ? (
            <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold">
              Add {formatINR(remaining)} more for FREE shipping!
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold">You&apos;ve unlocked free shipping!</p>
          )}
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="text-neutral-200">{formatINR(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span>
              <span className="text-neutral-200">{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-3 text-base font-semibold">
              <span className="text-neutral-100">Total</span>
              <span className="text-gold">{formatINR(cartTotal + shipping)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-gold mt-6 w-full">
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-neutral-400 hover:text-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
