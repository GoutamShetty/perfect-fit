"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { ProductJSON } from "@/lib/types";

const CATEGORIES = ["All", "Shirts", "Suits", "T-Shirts", "Accessories"];
const SORTS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price.selling", label: "Price: Low to High" },
  { value: "-price.selling", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

function ShopInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ProductJSON[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("search") || "");
  const [sort, setSort] = useState("-createdAt");

  const category = params.get("category") || "All";

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category !== "All") qs.set("category", category);
    if (sort) qs.set("sort", sort);
    fetch(`/api/products?${qs.toString()}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const setCategory = (c: string) => {
    const qs = new URLSearchParams(params.toString());
    if (c === "All") qs.delete("category");
    else qs.set("category", c);
    router.push(`/shop?${qs.toString()}`);
  };

  return (
    <div className="container-px py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-neutral-50">The Collection</h1>
        <p className="mt-2 text-sm text-neutral-400">Premium apparel, tailored to perfection.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                category === c
                  ? "border-gold bg-gold text-ink"
                  : "border-neutral-700 text-neutral-300 hover:border-gold hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field !py-2 pl-9"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field !py-2 cursor-pointer appearance-none pl-9 pr-8"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card aspect-[3/4] animate-pulse bg-ink-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center text-neutral-400">
          <p className="text-lg">No products found.</p>
          <p className="mt-2 text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-px py-20 text-center text-neutral-400">Loading…</div>}>
      <ShopInner />
    </Suspense>
  );
}
