import type { Metadata } from "next";
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

export default function CustomizePage() {
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
