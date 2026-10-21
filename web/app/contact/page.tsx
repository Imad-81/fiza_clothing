import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Style By Fiza. Call, email, or message us. We're here to help with any questions or orders.",
  openGraph: {
    title: "Contact Us | Style By Fiza",
    description:
      "Get in touch with Style By Fiza. Call, email, or message us.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
