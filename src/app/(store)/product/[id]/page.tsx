"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag, Share2, Truck, RefreshCw, ShieldCheck, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ProductJSON } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useCart();
  const [product, setProduct] = useState<ProductJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) {
          setProduct(d.product);
          setSize(d.product.sizes?.[0] || "");
          setColor(d.product.colors?.[0] || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container-px py-24 text-center text-neutral-400">Loading…</div>;
  }
  if (!product) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-display text-2xl text-neutral-100">Product not found</h1>
        <Link href="/shop" className="btn-outline mt-6">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/logo.png"];
  const discount =
    product.price.mrp > product.price.selling
      ? Math.round(((product.price.mrp - product.price.selling) / product.price.mrp) * 100)
      : 0;
  const wished = hydrated && isWishlisted(product._id);

  const doAdd = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: images[0],
      price: product.price.selling,
      size,
      color,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => {
    doAdd();
    router.push("/cart");
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `Check out ${product.name}`, url });
      } catch {
        /* cancelled */
      }
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="container-px py-8">
      <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-gold">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] overflow-hidden rounded-2xl border border-neutral-800 bg-ink-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
          </motion.div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border ${
                    activeImg === i ? "border-gold" : "border-neutral-800"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl text-neutral-50 sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-gold">{formatINR(product.price.selling)}</span>
            {discount > 0 && (
              <>
                <span className="text-neutral-500 line-through">{formatINR(product.price.mrp)}</span>
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold">-{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-neutral-400">{product.description || "Premium quality apparel, tailored to perfection."}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-neutral-300">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm transition ${
                      size === s ? "border-gold bg-gold text-ink" : "border-neutral-700 text-neutral-300 hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-neutral-300">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      color === c ? "border-gold bg-gold text-ink" : "border-neutral-700 text-neutral-300 hover:border-gold"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={doAdd} className="btn-gold flex-1">
              <ShoppingBag className="h-4 w-4" /> {added ? "Added!" : "Add to Cart"}
            </button>
            <button onClick={buyNow} className="btn-outline flex-1">Buy Now</button>
            <button
              onClick={() =>
                toggleWishlist({ productId: product._id, name: product.name, image: images[0], price: product.price.selling })
              }
              aria-label="Wishlist"
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                wished ? "border-gold bg-gold text-ink" : "border-neutral-700 text-neutral-300 hover:border-gold hover:text-gold"
              }`}
            >
              <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={share}
              aria-label="Share"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition hover:border-gold hover:text-gold"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-neutral-800 pt-6">
            {[
              { icon: Truck, label: "Fast Delivery" },
              { icon: RefreshCw, label: "Easy Returns" },
              { icon: ShieldCheck, label: "Secure Payment" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon className="h-5 w-5 text-gold" />
                <span className="text-[11px] text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
