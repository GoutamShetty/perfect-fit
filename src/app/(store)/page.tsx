"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Scissors, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { ProductJSON } from "@/lib/types";

type HomeContent = {
  hero: { title: string; subtitle: string; ctaText: string; ctaLink: string; image?: string };
  marquee: string[];
  story: { title: string; body: string; image?: string };
};

const CATEGORIES = [
  { name: "Shirts", href: "/shop?category=Shirts" },
  { name: "Suits", href: "/shop?category=Suits" },
  { name: "T-Shirts", href: "/shop?category=T-Shirts" },
  { name: "Accessories", href: "/shop?category=Accessories" },
];

export default function HomePage() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [featured, setFeatured] = useState<ProductJSON[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/home-content").then((r) => r.json()).catch(() => ({ content: null })),
      fetch("/api/products?featured=true").then((r) => r.json()).catch(() => ({ products: [] })),
    ]).then(([hc, pr]) => {
      setContent(hc.content);
      let list: ProductJSON[] = pr.products || [];
      if (list.length === 0) {
        fetch("/api/products")
          .then((r) => r.json())
          .then((all) => setFeatured((all.products || []).slice(0, 8)))
          .catch(() => {});
      } else {
        setFeatured(list.slice(0, 8));
      }
      setLoading(false);
    });
  }, []);

  const hero = content?.hero;
  const marquee = content?.marquee?.length
    ? content.marquee
    : ["Made in Karnataka", "Free Shipping over ₹1999", "Premium Fabrics", "Tailored to Perfection"];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-800">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="container-px relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
              <Star className="h-3.5 w-3.5 fill-current" /> Made in Karnataka
            </p>
            <h1 className="font-display text-4xl leading-tight text-neutral-50 sm:text-5xl lg:text-6xl">
              {hero?.title || "Style That Fits."} <span className="gold-text">{!hero && "Confidence That Shows."}</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-400">
              {hero?.subtitle || "Luxury tailored fashion crafted for the modern individual. Premium fabrics, impeccable fit."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={hero?.ctaLink || "/shop"} className="btn-gold">
                {hero?.ctaText || "Shop the Collection"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/track-order" className="btn-outline">
                Track Order
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center"
          >
            <div className="absolute inset-6 rounded-full border border-gold/30" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/10 to-transparent" />
            <Image
              src={hero?.image || "/logo.png"}
              alt="Perfect Fit"
              width={420}
              height={420}
              className="relative z-10 rounded-2xl object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b border-neutral-800 bg-ink-soft py-4">
        <div className="flex animate-[shimmer_none] whitespace-nowrap">
          <div className="flex min-w-full shrink-0 items-center justify-around gap-10 text-sm uppercase tracking-widest text-neutral-400">
            {marquee.concat(marquee).map((m, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-gold">◆</span> {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="container-px py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="group card flex items-center justify-between p-5 transition hover:border-gold"
            >
              <span className="font-display text-lg text-neutral-100 group-hover:text-gold">{c.name}</span>
              <ArrowRight className="h-4 w-4 text-neutral-500 transition group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-px py-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-neutral-50">Featured Collection</h2>
            <p className="mt-2 text-sm text-neutral-400">Handpicked pieces for the season.</p>
          </div>
          <Link href="/shop" className="hidden text-sm font-medium uppercase tracking-wider text-gold hover:underline sm:block">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card aspect-[3/4] animate-pulse bg-ink-muted" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="card p-10 text-center text-neutral-400">
            <p>No products yet. Add products from the admin panel or run the seed script.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Story */}
      <section className="container-px py-16">
        <div className="card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-3xl text-neutral-50">{content?.story.title || "Crafted for the Modern Individual"}</h2>
            <p className="mt-4 leading-relaxed text-neutral-400">
              {content?.story.body ||
                "Perfect Fit is a house of dreamers and makers. Every piece is more than fabric — it is confidence, tailored to you."}
            </p>
            <Link href="/shop" className="btn-outline mt-6">
              Explore the Collection
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Scissors, label: "Tailored Fit" },
              { icon: ShieldCheck, label: "Premium Quality" },
              { icon: Truck, label: "Fast Delivery" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 rounded-xl border border-neutral-800 p-5 text-center">
                <Icon className="h-7 w-7 text-gold" />
                <span className="text-xs uppercase tracking-wider text-neutral-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
