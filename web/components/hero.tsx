"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  isTouchDevice,
  EASINGS,
} from "@/lib/animations";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mastheadRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaExploreRef = useRef<HTMLAnchorElement>(null);
  const ctaCustomRef = useRef<HTMLAnchorElement>(null);

  const rm = prefersReducedMotion();
  const touch = isTouchDevice();

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const lineEls = q(".hero-line-inner");
      const sub = q(".hero-sub");
      const ctaE = ctaExploreRef.current;
      const ctaC = ctaCustomRef.current;
      const mast = mastheadRef.current;

      if (rm) {
        gsap.set(lineEls, { yPercent: 0 });
        gsap.set(sub, { opacity: 1, y: 0 });
        gsap.set([ctaE, ctaC], { opacity: 1, y: 0 });
        if (mast) gsap.set(mast, { opacity: 1 });
        return;
      }

      gsap.set(lineEls, { yPercent: 110 });
      gsap.set(sub, { opacity: 0, y: 20 });
      gsap.set([ctaE, ctaC], { opacity: 0, y: 16 });
      if (mast) gsap.set(mast, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: EASINGS.expo } });

      tl.to(lineEls, {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.16,
        ease: EASINGS.soft,
      }, 0.15);

      tl.to(sub, {
        opacity: 1,
        y: 0,
        duration: 0.75,
      }, 0.5);

      tl.to([ctaE, ctaC], {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
      }, 0.65);

      if (mast) {
        tl.to(mast, {
          opacity: 1,
          duration: 1.6,
          ease: EASINGS.expo,
        }, 0.55);
      }

      /* ── Parallax on scroll ── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (backdropRef.current) {
            gsap.to(backdropRef.current, { y: p * -60, duration: 0 });
          }
          if (contentRef.current) {
            gsap.to(contentRef.current, {
              y: p * -50,
              opacity: 1 - p * 1.3,
              duration: 0,
            });
          }
        },
      });

      /* ── Magnetic CTAs (desktop only) ── */
      if (!touch) {
        const magnet = (el: HTMLElement | null) => {
          if (!el) return;
          const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: EASINGS.soft });
          const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: EASINGS.soft });
          el.addEventListener("mousemove", (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
          });
          el.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
          });
        };
        magnet(ctaE);
        magnet(ctaC);
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-brand-espresso texture-grain-dark"
    >
      {/* Ambient editorial atmosphere (replaces video) */}
      <div ref={backdropRef} className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {/* Soft radial ambient glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/4 h-[38rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/15 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-brand-primary/40 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-20 bottom-10 h-96 w-96 rounded-full bg-brand-gold-light/10 blur-[100px]"
        />
        {/* Subtle geometric framing lines */}
        <div className="absolute inset-x-8 top-12 border-t border-brand-gold/15" />
        <div className="absolute inset-x-8 bottom-12 border-b border-brand-gold/15" />
      </div>

      {/* Cinematic scrim gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-espresso/90 via-brand-espresso/60 to-brand-espresso" />

      {/* Giant cropped masthead watermark */}
      <span
        ref={mastheadRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-[18%] select-none text-center font-hero text-[clamp(2.75rem,9.5vw,10.5rem)] font-bold leading-none tracking-[0.12em] text-transparent opacity-0 whitespace-nowrap"
        style={{ WebkitTextStroke: "1px rgba(224, 168, 166, 0.22)" }}
      >
        STYLE BY FIZA
      </span>

      {/* Center content */}
      <div ref={contentRef} className="relative z-20 mx-auto max-w-5xl px-6 pb-28 pt-8 text-center sm:px-8">
        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold-light/25 bg-brand-gold/10 px-4 py-1.5 backdrop-blur-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-brand-gold-light">
            ✦&nbsp;&nbsp;Online Ready to Wear&nbsp;&nbsp;✦
          </span>
        </div>

        <h1 className="font-hero text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[1.02] text-white">
          <div className="overflow-hidden pb-1">
            <span className="hero-line-inner block">Effortless Style,</span>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="hero-line-inner block font-serif italic text-brand-gold-light">
              Ready to Wear
            </span>
          </div>
        </h1>

        <p className="hero-sub mx-auto mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-white/85 opacity-0 sm:text-xl">
          Curated contemporary fashion designed for modern silhouettes — from
          everyday statement edits to festive occasion wear.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            ref={ctaExploreRef}
            href="/shop/kurtis"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-9 font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-primary opacity-0 transition-all duration-300 hover:bg-brand-gold-light hover:text-brand-dark sm:w-auto"
          >
            Explore Collection
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            ref={ctaCustomRef}
            href="/shop/collection"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/35 px-9 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 hover:border-brand-gold-light hover:text-brand-gold-light sm:w-auto"
          >
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  );
}
