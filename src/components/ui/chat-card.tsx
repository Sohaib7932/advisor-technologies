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
 * is a quarter of the way into view (once, not scrubbed). Reduced motion or
 * no JavaScript: every bubble is simply shown.
 */
export function ChatCard({
  lines,
  className,
  caption,
}: {
  lines: ChatLine[];
  className?: string;
  /** Small label above the conversation. */
  caption?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const bubbles = gsap.utils.toArray<HTMLElement>("[data-bubble]");
        gsap.set(bubbles, { autoAlpha: 0, y: 14, scale: 0.92 });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 75%",
          once: true,
          onEnter: () =>
            gsap.to(bubbles, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.6)",
              stagger: 0.55,
            }),
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("flex flex-col gap-2.5", className)}>
      {caption && <p className="eyebrow mb-1 text-fg-subtle">{caption}</p>}
      {lines.map((line, i) => (
        <div
          key={i}
          data-bubble
          className={cn(
            "motion-hide max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-snug shadow-soft",
            line.from === "us"
              ? "self-start rounded-bl-md bg-white text-brand-deep ring-1 ring-line"
              : "self-end rounded-br-md bg-glow text-brand-deep",
          )}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
