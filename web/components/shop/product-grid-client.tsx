"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product-card";
import FilterSidebar from "./filter-sidebar";
import SortDropdown from "./sort-dropdown";
import FilterChips from "./filter-chips";
import type { CategorySelect, ProductCardSelect } from "@/lib/queries/products";
import type { PaginationMeta } from "@/lib/types";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

interface ProductGridClientProps {
  basePath: string;
  title: string;
  description?: string | null;
  initialProducts: ProductCardSelect[];
  initialPagination: PaginationMeta;
  categories: CategorySelect[];
  fixedParams?: Record<string, string>;
}

export default function ProductGridClient({
  basePath,
  title,
  description,
  initialProducts,
  initialPagination,
  categories,
  fixedParams,
}: ProductGridClientProps) {
  const mounted = useIsMounted();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductCardSelect[]>(initialProducts);
  const [pagination, setPagination] =
    useState<PaginationMeta>(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const gender = searchParams.get("gender");
  const catParam = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const activeFilterCount = [
    gender,
    ...(catParam ? catParam.split(",").filter(Boolean) : []),
    minPrice,
    maxPrice,
    inStock === "true" ? "stock" : null,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!mobileFiltersOpen) return;
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
  }, [mobileFiltersOpen]);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(fixedParams ?? {})) {
        params.set(key, value);
      }
      params.set("page", String(currentPage + 1));
      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setProducts((prev) => [...prev, ...(json.data as ProductCardSelect[])]);
        setPagination(json.pagination);
        setCurrentPage((prev) => prev + 1);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [searchParams, currentPage, fixedParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold text-brand-primary sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1 text-xs text-brand-text/60 sm:mt-2 sm:text-sm">
          {pagination.total} {pagination.total === 1 ? "product" : "products"} found
        </p>
        {description && (
          <p className="mt-2.5 max-w-2xl text-sm text-brand-text/75 sm:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <Suspense>
        <FilterChips categories={categories} basePath={basePath} />
      </Suspense>

      <div className="sticky top-16 z-30 -mx-4 mb-4 flex items-center justify-between border-y border-brand-primary/10 bg-brand-bg/95 px-4 py-2.5 backdrop-blur-md sm:mx-0 sm:mb-6 sm:border-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none lg:mb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-brand-primary/15 bg-white px-4 py-2 text-sm font-medium text-brand-text shadow-xs transition-colors hover:border-brand-gold lg:hidden"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M6 12h12M10 20h4"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="ml-auto">
          <SortDropdown basePath={basePath} />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">
            <Suspense>
              <FilterSidebar categories={categories} basePath={basePath} />
            </Suspense>
          </div>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-primary/15 py-20 text-center">
              <p className="text-lg font-medium text-brand-text">
                No products found
              </p>
              <p className="mt-2 text-sm text-brand-text/60">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {pagination.hasNextPage && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="min-h-[44px] rounded-lg border border-brand-primary/15 bg-white px-6 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore ? "Loading…" : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[105] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-brand-bg shadow-2xl pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between border-b border-brand-primary/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-brand-primary">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-md text-brand-text/60 hover:text-brand-text"
                aria-label="Close filters"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-5">
              <Suspense>
                <FilterSidebar
                  categories={categories}
                  basePath={basePath}
                  onNavigate={() => setMobileFiltersOpen(false)}
                />
              </Suspense>
            </div>
            <div className="border-t border-brand-primary/10 bg-white p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-brand-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}