import type { Metadata } from "next";
import SuccessClient from "./success-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been placed successfully at House of Aarovi.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
