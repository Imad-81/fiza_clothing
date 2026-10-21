export interface JsonLdBreadcrumbItem {
  name: string;
  url: string;
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Style By Fiza",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    image: `${siteUrl}/opengraph-image`,
    telephone: "+91 7032678048",
    email: "styleby.fiza@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/styleby.fiza",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 7032678048",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function breadcrumbJsonLd(items: JsonLdBreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(
  product: {
    name: string;
    description: string;
    price: number;
    images: string[];
    inStock: boolean;
  },
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${siteUrl}${img.startsWith("/") ? "" : "/"}${img}`,
    ),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function bespokeServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bespoke Wear Customization",
    provider: {
      "@type": "ClothingStore",
      name: "Style By Fiza",
    },
    description:
      "Commission custom, made-to-order clothing — choose your garment, neckline, sleeves, fabric, and styling.",
    serviceType: "Bespoke Tailoring & Customization",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "/customize",
    },
  };
}
