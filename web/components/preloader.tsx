"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/animations";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const container = containerRef.current;
      const wordmark = wordmarkRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const rule = ruleRef.current;

      if (!container || prefersReducedMotion()) {
        setHidden(true);
        return;
      }

      // Split only the title header, not the subtitle or container,
      // preventing broken character wrapping on the subtitle
      const chars = title ? SplitText.create(title, { type: "chars" }) : null;

      const tl = gsap.timeline({
        onComplete: () => {
          setHidden(true);
          chars?.revert();
        },
      });

      // 1. Reveal title letters with an elegant stagger
      if (chars) {
        gsap.set(chars.chars, { y: 40, opacity: 0 });
        tl.to(
          chars.chars,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.04,
            ease: "power3.out",
          },
          0,
        );
      }

      // 2. Reveal subtitle smoothly as a cohesive element
      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 15 });
        tl.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          0.4,
        );
      }

      // 3. Expand accent rule line
      if (rule) {
        tl.to(
          rule,
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          0.5,
        );
      }

      // 4. Stay on screen: give visitor ~1.3s dwell time to comfortably read and appreciate the brand lockup
      const exitStartTime = 2.4;

      // Allow clicks to pass through as exit transition begins
      tl.set(container, { pointerEvents: "none" }, exitStartTime);

      // 5. Elegant exit: wordmark floats up slightly while fading out
      if (wordmark) {
        tl.to(
          wordmark,
          {
            opacity: 0,
            y: -18,
            duration: 0.5,
            ease: "power2.inOut",
          },
          exitStartTime,
        );
      }

      // 6. Smooth curtain reveal
      tl.to(
        container,
        {
          scaleY: 0,
          duration: 0.8,
          ease: "power4.inOut",
        },
        exitStartTime + 0.15,
      );

      return () => {
        chars?.revert();
      };
    },
    [],
  );

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-brand-espresso"
      style={{ transformOrigin: "bottom center" }}
      aria-hidden="true"
    >
      <div ref={wordmarkRef} className="text-center px-4">
        <h2
          ref={titleRef}
          className="font-hero text-[clamp(1.75rem,6vw,4.5rem)] font-bold leading-none tracking-[0.14em] text-brand-ivory whitespace-nowrap"
        >
          STYLE BY FIZA
        </h2>
        <p
          ref={subtitleRef}
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-brand-gold-light/80"
        >
          Online Ready to Wear
        </p>
        <div
          ref={ruleRef}
          className="mx-auto mt-3 h-px w-16 origin-center scale-x-0 bg-brand-gold-light/60"
        />
      </div>
    </div>
  );
}
