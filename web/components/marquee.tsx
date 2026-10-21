"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/animations";

const items = [
  "Curated Ready to Wear",
  "Pan-India express delivery",
  "Easy 7-day returns",
  "Chic new drops every week",
  "Effortless everyday elegance",
];

function TrackLine({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#2B1D20]"
        >
          <span className="px-6">{item}</span>
          <span className="text-[#96544C]">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !trackRef.current) return;

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 35,
        repeat: -1,
        ease: "none",
      });

      const el = trackRef.current.parentElement;
      if (el) {
        el.addEventListener("mouseenter", () => tween.timeScale(0.2));
        el.addEventListener("mouseleave", () => tween.timeScale(1));
      }

      return () => {
        tween.kill();
      };
    },
    [],
  );

  return (
    <div className="relative overflow-hidden border-y border-[#D6A6A0] bg-[#E5C0BA] py-3.5 texture-grain shadow-xs">
      <div ref={trackRef} className="flex w-max">
        <TrackLine />
        <TrackLine ariaHidden />
      </div>
    </div>
  );
}
