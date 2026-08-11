"use client";

import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, hydrated } = useCart();

  if (!hydrated) return <div className="container-px py-24 text-center text-neutral-400">Loading…</div>;

  if (wishlist.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <Heart className="mx-auto h-14 w-14 text-neutral-700" />
        <h1 className="mt-6 font-display text-2xl text-neutral-100">Your wishlist is empty</h1>
        <p className="mt-2 text-neutral-400">Save your favourite pieces to find them here later.</p>
        <Link href="/shop" className="btn-gold mt-8">Browse the Collection</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="mb-8 font-display text-3xl text-neutral-50">My Wishlist</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((item) => (
          <div key={item.productId} className="card overflow-hidden">
            <div className="relative aspect-[3/4] bg-ink-muted">
              <Link href={`/product/${item.productId}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image || "/logo.png"} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <button
                onClick={() => toggleWishlist(item)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-neutral-300 hover:text-red-400"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <Link href={`/product/${item.productId}`}>
                <h3 className="truncate font-display text-base text-neutral-100 hover:text-gold">{item.name}</h3>
              </Link>
              <p className="mt-1 font-semibold text-gold">{formatINR(item.price)}</p>
              <button
                onClick={() => addToCart({ productId: item.productId, name: item.name, image: item.image, price: item.price, qty: 1 })}
                className="btn-gold mt-3 w-full !py-2 !text-xs"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
