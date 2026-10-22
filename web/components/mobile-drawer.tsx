"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

const defaultWomenSubcategories = [
  { label: "Kurtis", href: "/shop/kurtis" },
  { label: "Kurti-Sets", href: "/shop/kurti-sets" },
  { label: "Anarkalis", href: "/shop/anarkalis" },
  { label: "Lehengas", href: "/shop/lehengas" },
  { label: "Sheraras", href: "/shop/sheraras" },
];

const defaultMenSubcategories = [
  { label: "Kurtas", href: "/shop/kurtas" },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  womenSubcategories?: { label: string; href: string }[];
  menSubcategories?: { label: string; href: string }[];
}

export default function MobileDrawer({
  open,
  onClose,
  womenSubcategories = defaultWomenSubcategories,
  menSubcategories = defaultMenSubcategories,
}: MobileDrawerProps) {
  const mounted = useIsMounted();
  const drawerRef = useFocusTrap(open);
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  const handleSignOut = useCallback(() => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          onClose();
          router.push("/");
          router.refresh();
        },
      },
    });
  }, [onClose, router]);

  // Comprehensive iOS Safari & Android scroll lock
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleExpanded = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${
        open ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-brand-bg shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header with Safe Area Padding */}
        <div className="flex items-center justify-between border-b border-brand-primary/10 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <Link href="/" onClick={handleLinkClick} className="flex items-center min-h-[44px]">
            <img src="/fiza-logo.png" alt="Style By Fiza" className="h-10 w-auto object-contain" />
          </Link>
          <button
            onClick={onClose}
            data-autofocus="true"
            className="flex h-11 w-11 items-center justify-center rounded-md text-brand-text transition-colors hover:text-brand-gold"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <ul className="space-y-1">
            {/* Home */}
            <li>
              <Link
                href="/"
                onClick={handleLinkClick}
                className="block rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-brand-text transition-colors hover:bg-brand-primary/5"
              >
                Home
              </Link>
            </li>

            {/* Collections section */}
            <li className="pt-4">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Collections
              </p>
            </li>

            {/* Women accordion */}
            <li>
              <button
                onClick={() => toggleExpanded("women")}
                aria-expanded={expanded.has("women")}
                aria-controls="mobile-women-panel"
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-brand-text transition-colors hover:bg-brand-primary/5"
              >
                Women
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded.has("women") ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id="mobile-women-panel"
                role="region"
                aria-labelledby="mobile-women-btn"
                className={`overflow-hidden transition-all duration-200 ${
                  expanded.has("women")
                    ? "max-h-60 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 space-y-1 pb-2 pt-1">
                  {womenSubcategories.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={handleLinkClick}
                      className="block rounded-md px-3 py-2 text-sm text-brand-text/70 transition-colors hover:bg-brand-primary/5 hover:text-brand-text"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Men accordion */}
            <li>
              <button
                onClick={() => toggleExpanded("men")}
                aria-expanded={expanded.has("men")}
                aria-controls="mobile-men-panel"
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-brand-text transition-colors hover:bg-brand-primary/5"
              >
                Men
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded.has("men") ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id="mobile-men-panel"
                role="region"
                aria-labelledby="mobile-men-btn"
                className={`overflow-hidden transition-all duration-200 ${
                  expanded.has("men")
                    ? "max-h-60 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 space-y-1 pb-2 pt-1">
                  {menSubcategories.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={handleLinkClick}
                      className="block rounded-md px-3 py-2 text-sm text-brand-text/70 transition-colors hover:bg-brand-primary/5 hover:text-brand-text"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Static pages */}
            <li className="pt-4">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Pages
              </p>
            </li>
            <li>
              <Link
                href="/about"
                onClick={handleLinkClick}
                className="block rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-brand-text transition-colors hover:bg-brand-primary/5"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/customize"
                onClick={handleLinkClick}
                className="block rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-brand-text transition-colors hover:bg-brand-primary/5"
              >
                Customize
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={handleLinkClick}
                className="block rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-brand-text transition-colors hover:bg-brand-primary/5"
              >
                Contact
              </Link>
            </li>

            {/* Account section */}
            <li className="pt-4">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Account
              </p>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href={`/profile/${session.user.id}`}
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-primary/5"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-primary/5"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-brand-text transition-colors hover:bg-brand-primary/5"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/sign-in"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-primary/5"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-primary/5"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}
