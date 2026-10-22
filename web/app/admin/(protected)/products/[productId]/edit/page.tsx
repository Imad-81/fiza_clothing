import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../product-form";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit a product — Style By Fiza admin.",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { productId } = await params;

  const product = await prisma.product.findFirst({
    where: { id: productId, deletedAt: null },
  });

  if (!product) {
    notFound();
  }

  const initialData = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: String(product.price),
    compareAt: product.compareAt ? String(product.compareAt) : "",
    category: product.category,
    subCategory: product.subCategory,
    sizes: product.sizes,
    stock: String(product.stock),
    featured: product.featured,
    images: product.images,
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-gold hover:bg-brand-primary/5 min-h-[36px]"
        >
          <span aria-hidden>&larr;</span> Back to products
        </Link>
        <Link
          href={`/shop/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-gold hover:underline min-h-[36px]"
        >
          <span>View on Store</span>
          <span aria-hidden>↗</span>
        </Link>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
        Edit Product
      </h1>
      <p className="mt-1 text-sm text-brand-text/60 truncate">{product.name}</p>
      <ProductForm mode="edit" initialData={initialData} productId={productId} />
    </div>
  );
}