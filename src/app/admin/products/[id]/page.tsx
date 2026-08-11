"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { ProductJSON } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductJSON | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminShell title="Edit Product">
      {loading ? (
        <div className="card p-10 text-center text-neutral-400">Loading…</div>
      ) : product ? (
        <ProductForm product={product} />
      ) : (
        <div className="card p-10 text-center text-neutral-400">Product not found.</div>
      )}
    </AdminShell>
  );
}
