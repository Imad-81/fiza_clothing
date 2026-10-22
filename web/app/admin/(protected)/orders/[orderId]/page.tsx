import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  getTimeline,
  adminStatusLabel,
  statusBadgeColor,
} from "@/lib/order-status";
import { OrderDetailClient } from "./order-detail-client";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order #${orderId.slice(-8)}`,
    description: "View and update order — Style By Fiza admin.",
    robots: { index: false, follow: false },
  };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          size: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const initialData = {
    id: order.id,
    userId: order.userId,
    userEmail: order.user?.email ?? null,
    userName: order.user?.name ?? null,
    total: order.total,
    status: order.status,
    statusLabel: adminStatusLabel(order.status),
    badgeColor: statusBadgeColor(order.status),
    timeline: getTimeline(order.status),
    address: order.address,
    paymentMethod: order.paymentMethod,
    paymentId: order.paymentId,
    paymentProof: order.paymentProof,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      product: item.product,
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-gold hover:bg-brand-primary/5 min-h-[36px]"
      >
        <span aria-hidden>&larr;</span> Back to orders
      </Link>
      <OrderDetailClient initialData={initialData} />
    </div>
  );
}