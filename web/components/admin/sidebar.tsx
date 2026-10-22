"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSignOut } from "@/components/admin/admin-sign-out";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Bespoke", href: "/admin/customize" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ userEmail }: { userEmail: string | undefined }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile admin header and navigation */}
      <div className="block md:hidden border-b border-brand-primary/10 pb-3 space-y-3">
        {/* Top bar with Admin Title, Store Link, and Sign Out */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-brand-primary tracking-tight">
                Admin Panel
              </span>
              <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                PRO
              </span>
            </div>
            {userEmail && (
              <p className="truncate text-[11px] text-brand-text/50 max-w-[180px]">
                {userEmail}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-brand-primary/15 bg-white px-2.5 py-1.5 text-xs font-medium text-brand-text/70 transition-colors hover:border-brand-primary hover:text-brand-primary"
              title="Open customer storefront in new tab"
            >
              <span>Store</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <div className="rounded-lg border border-red-200/60 bg-red-50/50 px-2.5 py-1 text-xs">
              <AdminSignOut className="text-xs font-semibold text-red-600 hover:text-red-700 block" />
            </div>
          </div>
        </div>

        {/* Horizontal scrollable navigation tabs */}
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max py-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] ${
                    isActive
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-brand-primary/5 text-brand-text/70 hover:bg-brand-primary/10 active:bg-brand-primary/15"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-bold text-brand-primary">
              Admin
            </p>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-brand-gold hover:underline"
              title="View storefront"
            >
              View Store &rarr;
            </Link>
          </div>

          {userEmail && (
            <p className="mt-1 truncate text-xs text-brand-text/50">{userEmail}</p>
          )}

          <nav className="mt-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-semibold"
                      : "text-brand-text/70 hover:bg-brand-primary/5 hover:text-brand-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-brand-primary/10">
            <AdminSignOut />
          </div>
        </div>
      </aside>
    </>
  );
}