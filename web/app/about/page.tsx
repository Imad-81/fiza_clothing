import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind Style By Fiza — chic, contemporary ready-to-wear fashion designed for effortless elegance.",
  openGraph: {
    title: "About Us | Style By Fiza",
    description:
      "Discover the story behind Style By Fiza — chic, contemporary ready-to-wear fashion designed for effortless elegance.",
  },
};

const values = [
  {
    title: "Curated Style",
    description:
      "Every piece is thoughtfully selected to celebrate effortless chic, flattering silhouettes, and modern flair.",
  },
  {
    title: "Ready to Wear",
    description:
      "Designed for real life and effortless styling — versatile, comfortable, and ready for every moment.",
  },
  {
    title: "Quality & Comfort",
    description:
      "We prioritize premium fabrics, flattering fits, and meticulous finishing so you feel confident all day.",
  },
  {
    title: "Modern Wardrobe",
    description:
      "Boutique fashion that seamlessly bridges everyday casual sophistication and standout festive looks.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-4xl font-bold text-brand-primary sm:text-5xl">
        About Style By Fiza
      </h1>

      <section className="mt-10">
        <p className="text-lg leading-relaxed text-brand-text/80">
          Style By Fiza brings chic, contemporary ready-to-wear fashion designed for
          effortless elegance. We believe that great style should be accessible,
          empowering, and seamlessly suited to your everyday life.
        </p>
        <p className="mt-4 text-base leading-relaxed text-brand-text/70">
          From vibrant casual kurtis to intricately styled festive ensembles, our curated
          edits celebrate versatility and modern femininity. Each collection is carefully
          chosen with attention to cut, fabric, and detail, ensuring you always step out
          looking and feeling extraordinary.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold text-brand-primary">
          Our Mission
        </h2>
        <p className="mt-4 text-base leading-relaxed text-brand-text/70">
          To bring modern women effortlessly stylish, ready-to-wear clothing that blends
          timeless grace with on-trend silhouettes — delivered straight to your door with
          uncompromised quality and care.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold text-brand-primary">
          Our Values
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-brand-primary/10 bg-white p-6"
            >
              <h3 className="font-display text-lg font-bold text-brand-primary">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-text/70">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
