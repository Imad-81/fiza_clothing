import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Style By Fiza admin dashboard.",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    outOfStock,
    categories,
    totalOrders,
    openOrders,
    totalBriefs,
  ] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null, inStock: false } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({
      where: { status: { notIn: ["delivered", "cancelled"] } },
    }),
    prisma.customizationRequest.count(),
  ]);

  const stats = [
    { label: "Total Products", value: totalProducts, href: "/admin/products" },
    { label: "Out of Stock", value: outOfStock, href: "/admin/products" },
    { label: "Total Orders", value: totalOrders, href: "/admin/orders" },
    { label: "Open Orders", value: openOrders, href: "/admin/orders" },
    { label: "Categories", value: categories, href: "/admin/categories" },
    { label: "Bespoke Briefs", value: totalBriefs, href: "/admin/customize" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
            Dashboard
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-brand-text/60">
            Welcome to the Style By Fiza administration portal.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-brand-primary/90"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-white px-3.5 py-2 text-xs font-semibold text-brand-primary shadow-xs transition-colors hover:border-brand-gold hover:bg-brand-primary/5"
          >
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/orders"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors ${
              openOrders > 0
                ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                : "border-brand-primary/20 bg-white text-brand-primary hover:bg-brand-primary/5"
            }`}
          >
            <span>Orders ({openOrders} open)</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-brand-primary/15 bg-brand-bg p-4 transition-all hover:border-brand-gold hover:shadow-xs"
          >
            <p className="text-xs font-medium text-brand-text/60 truncate group-hover:text-brand-primary">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-brand-primary">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Section Quick Access Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/products"
          className="group rounded-xl border border-brand-primary/15 bg-brand-bg p-5 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-primary group-hover:text-brand-gold transition-colors">
              Products Catalog
            </h2>
            <span className="text-brand-text/30 group-hover:text-brand-gold transition-colors">&rarr;</span>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">
            {totalProducts} active products · {outOfStock} out of stock
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="group rounded-xl border border-brand-primary/15 bg-brand-bg p-5 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-primary group-hover:text-brand-gold transition-colors">
              Categories Manager
            </h2>
            <span className="text-brand-text/30 group-hover:text-brand-gold transition-colors">&rarr;</span>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">
            {categories} customizable categories for women & men
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="group rounded-xl border border-brand-primary/15 bg-brand-bg p-5 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-primary group-hover:text-brand-gold transition-colors">
              Customer Orders
            </h2>
            <span className="text-brand-text/30 group-hover:text-brand-gold transition-colors">&rarr;</span>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">
            {totalOrders} total orders · {openOrders} awaiting delivery
          </p>
        </Link>

        <Link
          href="/admin/customize"
          className="group rounded-xl border border-brand-primary/15 bg-brand-bg p-5 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-primary group-hover:text-brand-gold transition-colors">
              Bespoke Customization
            </h2>
            <span className="text-brand-text/30 group-hover:text-brand-gold transition-colors">&rarr;</span>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">
            {totalBriefs} custom bridal and couture briefs submitted
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="group rounded-xl border border-brand-primary/15 bg-brand-bg p-5 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-primary group-hover:text-brand-gold transition-colors">
              Store & Payment Settings
            </h2>
            <span className="text-brand-text/30 group-hover:text-brand-gold transition-colors">&rarr;</span>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">
            Configure UPI QR code, merchant ID, and checkout text
          </p>
        </Link>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-dashed border-brand-primary/20 bg-brand-bg/50 p-5 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-primary group-hover:text-brand-gold transition-colors">
              Live Storefront
            </h2>
            <span className="text-brand-text/30 group-hover:text-brand-gold transition-colors">↗</span>
          </div>
          <p className="mt-1 text-xs text-brand-text/60">
            Preview the public store as seen by customers
          </p>
        </Link>
      </div>
    </div>
  );
}