"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { ProductJSON } from "@/lib/types";

const CATEGORIES = ["Shirts", "Suits", "T-Shirts", "Accessories"];

type FormState = {
  name: string;
  description: string;
  mrp: string;
  selling: string;
  category: string;
  sizes: string;
  colors: string;
  stock: string;
  badge: string;
  featured: boolean;
  isActive: boolean;
  images: string[];
};

export default function ProductForm({ product }: { product?: ProductJSON }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: product?.name || "",
    description: product?.description || "",
    mrp: product?.price.mrp?.toString() || "",
    selling: product?.price.selling?.toString() || "",
    category: product?.category || "Shirts",
    sizes: product?.sizes?.join(", ") || "S, M, L, XL",
    colors: product?.colors?.join(", ") || "",
    stock: product?.stock?.toString() || "100",
    badge: product?.badge || "",
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
    images: product?.images || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.selling) {
      setError("Name and selling price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: { mrp: Number(form.mrp) || Number(form.selling), selling: Number(form.selling) },
      category: form.category,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock) || 0,
      badge: form.badge,
      featured: form.featured,
      isActive: form.isActive,
      images: form.images,
    };
    try {
      const res = await fetch(product ? `/api/products/${product._id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <div className="card space-y-4 p-6">
        <h2 className="font-display text-lg text-neutral-100">Basic Information</h2>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Product Name *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="input-field resize-none" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">MRP (₹)</label>
            <input type="number" value={form.mrp} onChange={(e) => set("mrp", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Selling Price (₹) *</label>
            <input type="number" value={form.selling} onChange={(e) => set("selling", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input-field cursor-pointer">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Badge (e.g. New, Bestseller)</label>
            <input value={form.badge} onChange={(e) => set("badge", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Sizes (comma separated)</label>
            <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Colors (comma separated)</label>
            <input value={form.colors} onChange={(e) => set("colors", e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-gold" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 accent-gold" />
            Active (visible in store)
          </label>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-lg text-neutral-100">Images</h2>
        <ImageUploader images={form.images} onChange={(imgs) => set("images", imgs)} />
      </div>

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : product ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
