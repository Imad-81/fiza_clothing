import { Suspense } from "react";
import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductListClient } from "./product-list-client";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products — Style By Fiza admin.",
  robots: { index: false, follow: false },
};

interface AdminProductsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const { q } = await searchParams;
  const search = q?.trim();

  const where: Prisma.ProductWhereInput = { deletedAt: null };
  if (search && search.length >= 2) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { subCategory: { contains: search, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.product.count({ where }),
  ]);

  type RawProduct = typeof rows extends (infer U)[] ? U : never;
  const products = rows.map((p: RawProduct) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAt: p.compareAt,
    images: p.images,
    category: p.category,
    subCategory: p.subCategory,
    sizes: p.sizes,
    inStock: p.inStock,
    stock: p.stock,
    featured: p.featured,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-primary">
            Products
          </h1>
          <p className="mt-1 text-sm text-brand-text/60">{total} total</p>
        </div>
        <a
          href="/admin/products/new"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90"
        >
          Add Product
        </a>
      </div>

      <Suspense fallback={<div className="mt-6 p-8 text-center text-sm text-brand-text/60">Loading products…</div>}>
        <ProductListClient
          key={search ?? "all"}
          initialProducts={products}
          initialTotal={total}
          initialQuery={search ?? ""}
        />
      </Suspense>
    </div>
  );
}