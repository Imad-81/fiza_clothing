import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with House of Aarovi. Call, email, or visit us in Hyderabad. We're here to help with any questions or concerns.",
  openGraph: {
    title: "Contact Us | House of Aarovi",
    description:
      "Get in touch with House of Aarovi. Call, email, or visit us in Hyderabad.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
