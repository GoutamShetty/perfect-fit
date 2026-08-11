"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { ProductJSON } from "@/lib/types";
import { formatINR } from "@/lib/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductJSON[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/products?all=true&sort=-createdAt")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x._id !== id));
    setDeleting(null);
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminShell title="Products">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="input-field !py-2 pl-9" />
        </div>
        <Link href="/admin/products/new" className="btn-gold !py-2">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-neutral-400">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-neutral-400">No products yet. Add your first product.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-neutral-800/60 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images?.[0] || "/logo.png"} alt="" className="h-12 w-10 rounded object-cover" />
                        <span className="font-medium text-neutral-100">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-400">{p.category}</td>
                    <td className="p-4 text-gold">{formatINR(p.price.selling)}</td>
                    <td className="p-4 text-neutral-400">{p.stock}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${p.isActive ? "bg-green-500/10 text-green-400" : "bg-neutral-700/40 text-neutral-400"}`}>
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${p._id}`} className="rounded-lg border border-neutral-700 p-2 text-neutral-300 hover:border-gold hover:text-gold" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => remove(p._id)} disabled={deleting === p._id} className="rounded-lg border border-neutral-700 p-2 text-neutral-300 hover:border-red-400 hover:text-red-400" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
