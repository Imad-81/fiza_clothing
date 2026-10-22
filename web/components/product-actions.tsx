"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { addToCart, usePendingCart } from "@/lib/stores/cart";
import {
  addToLocalCart,
} from "@/lib/stores/local-cart";
import {
  useWishlistIds,
  toggleWishlist,
  usePendingToggle,
} from "@/lib/stores/wishlist";
import SizeChartModal from "./size-chart-modal";

interface ProductActionsProps {
  productId: string;
  sizes: string[];
  inStock: boolean;
}

export default function ProductActions({
  productId,
  sizes,
  inStock,
}: ProductActionsProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const sizeSelectorRef = useRef<HTMLDivElement>(null);

  const pending = usePendingCart();
  const wishlistIds = useWishlistIds();
  const wishlistPending = usePendingToggle();
  const wishlisted = wishlistIds.has(productId);

  const { data: session } = authClient.useSession();
  const loggedIn = !!session;

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!selectedSize || pending) return;

    if (!loggedIn) {
      addToLocalCart({
        productId,
        size: selectedSize,
        quantity,
        product: { id: productId, name: "", slug: "", price: 0, images: [] },
      });
      router.push(`/product/${productId}?added=1`);
      setAddedMsg(true);
      setTimeout(() => setAddedMsg(false), 2000);
      return;
    }

    const result = await addToCart(productId, selectedSize, quantity);
    if (result === "unauthorized") {
      router.push(
        `/sign-in?callbackURL=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    if (result === "ok") {
      setAddedMsg(true);
      setTimeout(() => setAddedMsg(false), 2000);
    }
  }, [productId, selectedSize, quantity, pending, router, loggedIn]);

  const handleWishlist = useCallback(async () => {
    if (wishlistPending === productId) return;
    const result = await toggleWishlist(productId);
    if (result === "unauthorized") {
      router.push(
        `/sign-in?callbackURL=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  }, [productId, wishlistPending, router]);

  const disabled = !inStock || !selectedSize || pending;

  return (
    <div className="space-y-6">
      {!inStock && (
        <div className="inline-block rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          Out of Stock
        </div>
      )}

      {/* Size selector */}
      <div ref={sizeSelectorRef}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-brand-text">Size</h3>
          <button
            onClick={() => setSizeChartOpen(true)}
            aria-haspopup="dialog"
            className="text-xs font-medium text-brand-gold underline-offset-2 hover:underline"
          >
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = selectedSize === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedSize(active ? null : s)}
                disabled={!inStock}
                aria-pressed={active}
                className={`flex h-11 w-12 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  active
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-brand-primary/15 bg-white text-brand-text hover:border-brand-gold"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-brand-text">Quantity</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-primary/15 bg-white text-brand-text transition-colors hover:border-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="flex h-10 w-14 items-center justify-center rounded-lg border border-brand-primary/15 bg-white text-sm font-medium text-brand-text">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-primary/15 bg-white text-brand-text transition-colors hover:border-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        ref={btnRef}
        onClick={handleAddToCart}
        disabled={disabled}
        className={`w-full rounded-lg py-3 text-sm font-semibold transition-all ${
          disabled
            ? "cursor-not-allowed bg-brand-primary/30 text-white/60"
            : "bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-[0.98]"
        }`}
      >
        {pending ? "Adding…" : addedMsg ? "Added to Cart!" : "Add to Cart"}
      </button>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        disabled={wishlistPending === productId}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-primary/15 bg-white py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-gold disabled:opacity-50"
      >
        <svg
          className={`h-5 w-5 ${
            wishlisted
              ? "fill-red-500 text-red-500"
              : "fill-none text-brand-text/60"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>

      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />

      {/* Mobile Sticky Add to Cart Bar */}
      {inStock && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-primary/10 bg-white/95 backdrop-blur-md px-4 py-3 shadow-xl transition-all duration-300 lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] ${
            showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => sizeSelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-brand-bg px-3.5 py-2 text-xs font-semibold text-brand-primary"
            >
              <span>{selectedSize ? `Size: ${selectedSize}` : "Select Size"}</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (!selectedSize) {
                  sizeSelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                } else {
                  handleAddToCart();
                }
              }}
              disabled={pending}
              className="flex-1 min-h-[44px] rounded-lg bg-brand-primary py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/90 disabled:opacity-60"
            >
              {pending ? "Adding…" : addedMsg ? "Added to Cart!" : selectedSize ? "Add to Cart" : "Choose Size & Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
