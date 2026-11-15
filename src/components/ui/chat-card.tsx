"use client";

import { useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type ChatLine = {
  from: "us" | "you";
  text: React.ReactNode;
};

/**
 * A short conversation whose bubbles pop in one after another when the card
 * comes into view (once, not scrubbed). Works on light and dark panels.
 * Reduced motion or no JavaScript: every bubble is simply shown.
 */
export function ChatCard({ lines, className, caption }: { lines: ChatLine[]; className?: string; caption?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const bubbles = gsap.utils.toArray<HTMLElement>("[data-bubble]");
        gsap.set(bubbles, { autoAlpha: 0, y: 14, scale: 0.94 });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(bubbles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.1)", stagger: 0.45 }),
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("flex flex-col gap-2.5", className)}>
      {caption && <p className="mb-1 text-xs font-semibold tracking-[0.08em] text-fg-subtle uppercase">{caption}</p>}
      {lines.map((line, i) => (
        <div
          key={i}
          data-bubble
          className={cn(
            "motion-hide max-w-[88%] px-4 py-3 text-[0.9375rem] leading-snug",
            line.from === "us"
              ? "self-start rounded-[1.25rem] rounded-bl-md bg-white text-navy shadow-card"
              : "self-end rounded-[1.25rem] rounded-br-md bg-sky text-ink",
          )}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
