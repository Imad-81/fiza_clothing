"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  images: string[];
  sizes: string[];
  inStock: boolean;
  stock: number;
  featured: boolean;
  category: string;
  createdAt: string;
}

interface ProductListClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialQuery?: string;
}

export function ProductListClient({
  initialProducts,
  initialTotal,
  initialQuery = "",
}: ProductListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialQuery);

  const limit = 20;

  const fetchProducts = useCallback(
    async (q: string, p: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        params.set("page", String(p));
        params.set("limit", String(limit));

        const res = await fetch(`/api/admin/products?${params}`);
        const json = await res.json();

        if (json.success) {
          setProducts(json.data.products);
          setTotal(json.data.pagination.total);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(search, 1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotal((prev) => prev - 1);
        router.refresh();
      } else {
        alert(json?.message || "Failed to delete product. Please try again.");
      }
    } catch {
      alert("Network error while deleting product.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mt-6 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or category…"
            className="w-full rounded-lg border border-brand-primary/15 bg-brand-bg pl-9 pr-4 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-gold min-h-[42px]"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-brand-text/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-primary/90 disabled:opacity-60 min-h-[42px]"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      {/* Mobile Card List (< md) */}
      <div className="block md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-brand-primary/15 bg-white p-4 transition-all hover:border-brand-gold shadow-2xs"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div
                onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                className="relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-brand-primary/15 bg-brand-bg"
              >
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-brand-text/30">
                    No img
                  </div>
                )}
              </div>

              {/* Title, Category & Price */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="cursor-pointer font-display text-sm font-bold text-brand-primary line-clamp-2 hover:text-brand-gold transition-colors"
                  >
                    {product.name}
                  </h3>
                  {product.featured && (
                    <span className="shrink-0 text-brand-gold text-xs" title="Featured product">
                      ★
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-brand-primary">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.compareAt && (
                    <span className="text-brand-text/40 line-through text-[11px]">
                      ₹{product.compareAt.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="rounded bg-brand-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-brand-text/70">
                    {product.category}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-2 text-xs">
                  {product.inStock ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-brand-primary/10 pt-2.5">
              <Link
                href={`/shop/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-gold hover:underline py-1"
              >
                <span>View on Store</span>
                <span aria-hidden>&rarr;</span>
              </Link>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="inline-flex items-center rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary shadow-2xs transition-colors hover:border-brand-gold hover:bg-brand-primary/5 min-h-[34px]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id, product.name)}
                  className="inline-flex items-center rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 min-h-[34px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="rounded-xl border border-brand-primary/15 bg-brand-bg p-8 text-center text-sm text-brand-text/50">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Desktop Table (>= md) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-brand-primary/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-primary/15 bg-brand-primary/5">
              <th className="px-4 py-3 font-semibold text-brand-primary">Image</th>
              <th className="px-4 py-3 font-semibold text-brand-primary">Name</th>
              <th className="px-4 py-3 font-semibold text-brand-primary">Category</th>
              <th className="px-4 py-3 font-semibold text-brand-primary">Price</th>
              <th className="px-4 py-3 font-semibold text-brand-primary">Stock</th>
              <th className="px-4 py-3 font-semibold text-brand-primary">Status</th>
              <th className="px-4 py-3 font-semibold text-brand-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-brand-primary/5 transition-colors hover:bg-brand-primary/[0.02]"
              >
                <td className="px-4 py-3">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-lg bg-brand-primary/10" />
                  )}
                </td>
                <td className="max-w-[220px] truncate px-4 py-3">
                  <span className="font-semibold text-brand-text block truncate">
                    {product.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Link
                      href={`/shop/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-brand-gold hover:underline"
                    >
                      /shop/{product.slug} ↗
                    </Link>
                    {product.featured && (
                      <span className="text-[10px] text-brand-gold font-semibold">★ Featured</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-text/80 text-xs">
                  {product.category}
                </td>
                <td className="px-4 py-3 font-semibold text-brand-primary">
                  ₹{product.price.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-brand-text/80">{product.stock}</td>
                <td className="px-4 py-3">
                  {product.inStock ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary shadow-2xs transition-colors hover:border-brand-gold hover:bg-brand-primary/5"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-brand-text/40">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => p - 1);
              fetchProducts(search, page - 1);
            }}
            className="rounded-lg border border-brand-primary/15 bg-white px-4 py-2 text-xs font-semibold text-brand-text/70 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-30 min-h-[38px]"
          >
            &larr; Previous
          </button>
          <span className="text-xs font-medium text-brand-text/60">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => p + 1);
              fetchProducts(search, page + 1);
            }}
            className="rounded-lg border border-brand-primary/15 bg-white px-4 py-2 text-xs font-semibold text-brand-text/70 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-30 min-h-[38px]"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}