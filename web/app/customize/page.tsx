import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BriefBuilder from "@/components/customize/brief-builder";
import { bespokeServiceJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Customize — Style By Fiza",
  description:
    "Design and order bespoke wear handcrafted to your exact specifications. Choose silhouettes, necklines, sleeves, fabrics, and styling.",
  openGraph: {
    title: "Bespoke Customization — Style By Fiza",
    description:
      "Design and order bespoke wear handcrafted to your exact specifications.",
    type: "website",
  },
};

// Feature temporarily removed from customer-facing frontend; preserved for future use.
const ENABLE_CUSTOMIZE_FRONTEND = false;

export default function CustomizePage() {
  if (!ENABLE_CUSTOMIZE_FRONTEND) {
    redirect("/shop/collection");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bespokeServiceJsonLd()) }}
      />
      <BriefBuilder />
    </>
  );
}
