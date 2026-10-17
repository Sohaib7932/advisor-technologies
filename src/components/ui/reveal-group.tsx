"use client";

import { useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Staggers every `[data-reveal]` descendant into view as it scrolls in,
 * batching items that enter together so a row lands as one gesture
 * (ScrollTrigger.batch). Give revealed items the `motion-hide` class so they
 * don't flash before the animation takes over. Reduced motion: no-op.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
  y = 36,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
  /** Distance each item rises, in px. */
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        gsap.set(items, { autoAlpha: 0, y, scale: 0.98 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.09,
              overwrite: true,
            }),
        });
      });
      mm.add(MOTION.reduced, () => {
        gsap.set("[data-reveal]", { autoAlpha: 1 });
      });
    },
    { scope: ref },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}
