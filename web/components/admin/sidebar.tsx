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
      {/* Mobile admin navigation tabs */}
      <div className="block md:hidden -mx-4 px-4 overflow-x-auto scrollbar-none border-b border-brand-primary/10 pb-3">
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "bg-brand-primary/5 text-brand-text/70 hover:bg-brand-primary/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24">
          <p className="font-display text-lg font-bold text-brand-primary">
            Admin
          </p>

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
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-brand-text/70 hover:bg-brand-primary/5 hover:text-brand-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <AdminSignOut />
        </div>
      </div>
    </aside>
  </>
);
}