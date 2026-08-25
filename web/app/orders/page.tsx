import { Suspense } from "react";
import type { Metadata } from "next";
import OrdersClient from "./orders-client";
import OrdersLoading from "./loading";

export const metadata: Metadata = {
  title: "My Orders & Customizations — House of Aarovi",
  description:
    "View your House of Aarovi order history and track bespoke customization requests.",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrdersClient />
    </Suspense>
  );
}

