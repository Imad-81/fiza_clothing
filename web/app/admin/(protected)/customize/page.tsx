import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMIZATION_STATUSES,
  statusLabel,
  statusBadgeColor,
} from "@/lib/customize/status";
import { getOptionLabel } from "@/lib/customize/taxonomy";

export const metadata: Metadata = {
  title: "Bespoke Requests",
  description: "Manage customisation requests — Style By Fiza admin.",
  robots: { index: false, follow: false },
};

export default async function AdminCustomizeListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;

  const where: Record<string, unknown> = {};
  if (statusFilter && CUSTOMIZATION_STATUSES.includes(statusFilter as (typeof CUSTOMIZATION_STATUSES)[number])) {
    where.status = statusFilter;
  }

  const requests = await prisma.customizationRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { email: true, name: true } },
      _count: { select: { media: true } },
    },
  });

  const allStatus = await prisma.customizationRequest.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const statusCounts: Record<string, number> = {};
  for (const s of allStatus) {
    statusCounts[s.status] = s._count.status;
  }

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
          Bespoke Briefs
        </h1>
        <p className="mt-1 text-sm text-brand-text/60">
          {requests.length} brief{requests.length !== 1 ? "s" : ""}
          {statusFilter ? ` — ${statusLabel(statusFilter)}` : ""}
        </p>
      </div>

      {/* Filter Tabs (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
        <Link
          href="/admin/customize"
          className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
            !statusFilter
              ? "bg-brand-primary text-white shadow-xs"
              : "bg-brand-primary/5 text-brand-text/70 hover:bg-brand-primary/10"
          }`}
        >
          All ({requests.length})
        </Link>
        {CUSTOMIZATION_STATUSES.map((s) => {
          const active = statusFilter === s;
          const count = statusCounts[s] ?? 0;
          return (
            <Link
              key={s}
              href={`/admin/customize?status=${encodeURIComponent(s)}`}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                active
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-brand-primary/5 text-brand-text/70 hover:bg-brand-primary/10"
              }`}
            >
              {statusLabel(s)} ({count})
            </Link>
          );
        })}
      </div>

      {/* Mobile Card List (< md) */}
      <div className="block md:hidden space-y-3">
        {requests.map((r) => (
          <Link
            key={r.id}
            href={`/admin/customize/${r.id}`}
            className="block rounded-xl border border-brand-primary/15 bg-white p-4 transition-all hover:border-brand-gold active:scale-[0.99] shadow-2xs"
          >
            {/* Header: ID + Status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono text-xs font-bold text-brand-primary">
                  #{r.id.slice(-8)}
                </span>
                <span className="text-[11px] text-brand-text/50">
                  · {formatDate(r.createdAt.toISOString())}
                </span>
              </div>
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeColor(
                  r.status,
                )}`}
              >
                {statusLabel(r.status)}
              </span>
            </div>

            {/* Garment Title */}
            <div className="mt-2.5">
              <h3 className="font-display text-base font-bold text-brand-primary">
                {getOptionLabel("garment", r.garment) ?? r.garment}
              </h3>
              <p className="text-xs text-brand-text/60 truncate mt-0.5">
                {r.user?.email || "Unknown customer"}
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-brand-text/70 border-t border-brand-primary/10 pt-2.5">
              {r.occasion && (
                <span className="rounded bg-brand-primary/5 px-2 py-0.5 text-[11px]">
                  Occasion: {getOptionLabel("occasion", r.occasion) ?? r.occasion}
                </span>
              )}
              {r.budgetTier && (
                <span className="rounded bg-brand-primary/5 px-2 py-0.5 text-[11px]">
                  Budget: {getOptionLabel("budget", r.budgetTier) ?? r.budgetTier}
                </span>
              )}
              {r._count.media > 0 && (
                <span className="rounded bg-brand-gold/15 px-2 py-0.5 text-[11px] font-semibold text-brand-gold">
                  📷 {r._count.media} photo{r._count.media !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Action */}
            <div className="mt-3 pt-2 border-t border-brand-primary/5">
              <span className="w-full inline-flex items-center justify-center rounded-lg bg-brand-primary/10 py-2 text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors min-h-[38px]">
                View Brief Details &rarr;
              </span>
            </div>
          </Link>
        ))}

        {requests.length === 0 && (
          <div className="rounded-xl border border-brand-primary/15 bg-brand-bg p-8 text-center text-sm text-brand-text/50">
            No briefs found for this filter.
          </div>
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-brand-primary/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-primary/10 bg-brand-primary/5 text-left">
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Brief
              </th>
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Customer
              </th>
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Garment
              </th>
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Occasion
              </th>
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Budget
              </th>
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Status
              </th>
              <th className="px-4 py-3 font-semibold text-brand-primary">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-brand-text/40"
                >
                  No briefs found.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-brand-primary/5 transition-colors hover:bg-brand-bg/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customize/${r.id}`}
                      className="font-mono text-xs font-bold text-brand-primary underline-offset-2 hover:underline"
                    >
                      {r.id.slice(-8)}
                    </Link>
                    {r._count.media > 0 && (
                      <span className="ml-1.5 rounded bg-brand-gold/15 px-1 py-0.5 text-[10px] font-semibold text-brand-gold">
                        +{r._count.media}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-text/70 text-xs">
                    {r.user?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-text">
                    {getOptionLabel("garment", r.garment) ?? r.garment}
                  </td>
                  <td className="px-4 py-3 text-brand-text/60 text-xs">
                    {r.occasion
                      ? (getOptionLabel("occasion", r.occasion) ?? r.occasion)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-text/60 text-xs">
                    {r.budgetTier
                      ? (getOptionLabel("budget", r.budgetTier) ?? r.budgetTier)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeColor(
                        r.status,
                      )}`}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-text/40">
                    {formatDate(r.createdAt.toISOString())}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
