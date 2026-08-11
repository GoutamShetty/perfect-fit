"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { ProductJSON } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: ProductJSON }) {
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useCart();
  const image = product.images?.[0] || "/logo.png";
  const discount =
    product.price.mrp > product.price.selling
      ? Math.round(((product.price.mrp - product.price.selling) / product.price.mrp) * 100)
      : 0;
  const wished = hydrated && isWishlisted(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group card overflow-hidden"
    >
      <Link href={`/product/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-ink-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold text-gold">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500">{product.category}</p>
          <Link href={`/product/${product._id}`}>
            <h3 className="truncate font-display text-base text-neutral-100 transition hover:text-gold">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-semibold text-gold">{formatINR(product.price.selling)}</span>
            {discount > 0 && (
              <span className="text-xs text-neutral-500 line-through">{formatINR(product.price.mrp)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={() =>
            addToCart({
              productId: product._id,
              name: product.name,
              slug: product.slug,
              image,
              price: product.price.selling,
              size: product.sizes?.[0],
              qty: 1,
            })
          }
          className="btn-gold flex-1 !px-3 !py-2 !text-xs"
        >
          <ShoppingBag className="h-4 w-4" /> Add
        </button>
        <button
          onClick={() =>
            toggleWishlist({
              productId: product._id,
              name: product.name,
              image,
              price: product.price.selling,
            })
          }
          aria-label="Toggle wishlist"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
            wished ? "border-gold bg-gold text-ink" : "border-neutral-700 text-neutral-300 hover:border-gold hover:text-gold"
          }`}
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}
