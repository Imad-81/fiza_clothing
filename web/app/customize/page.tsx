import type { Metadata } from "next";
import BriefBuilder from "@/components/customize/brief-builder";
import { bespokeServiceJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Customize — House of Aarovi",
  description:
    "Design and order bespoke ethnic wear handcrafted to your exact specifications. Choose silhouettes, necklines, sleeves, fabrics, and embroidery.",
  openGraph: {
    title: "Bespoke Customization — House of Aarovi",
    description:
      "Design and order bespoke ethnic wear handcrafted to your exact specifications.",
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
