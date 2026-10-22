import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "New Product",
  description: "Create a new product — Style By Fiza admin.",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-gold hover:bg-brand-primary/5 min-h-[36px]"
      >
        <span aria-hidden>&larr;</span> Back to products
      </Link>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
        New Product
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}