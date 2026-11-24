"use client";

import { useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CARD as M } from "@/lib/motion";

/**
 * A group of cards that rests as a loose, tucked stack and deals itself out
 * once, with a staggered spring, when it is about a quarter into view (not
 * scrubbed). Each card's illustration then rises. On touch screens, where
 * there is no hover, each card's icon plays its hover motion once instead.
 *
 * Cards are any descendants marked `data-card`; an optional `data-progress`
 * element is drawn across as the cards open. Reduced motion or no
 * JavaScript: the final layout.
 */
export function CardDeck({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const deck = root.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const art = gsap.utils.toArray<HTMLElement>("[data-illus]");
        const progress = deck.querySelector<HTMLElement>("[data-progress]");
        if (!cards.length) return;

        // Gather each card toward the deck's centre, so the group reads as a
        // stack. A tall single column only tucks down a little instead.
        const box = deck.getBoundingClientRect();
        const tall = box.height > window.innerHeight * 1.1;
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        // All reads first, then all writes: no forced layout per card.
        const rects = cards.map((card) => card.getBoundingClientRect());
        cards.forEach((card, i) => {
          const r = rects[i];
          gsap.set(card, {
            x: tall ? 0 : (cx - (r.left + r.width / 2)) * M.rest.gather,
            y: tall ? M.rest.tuck : (cy - (r.top + r.height / 2)) * M.rest.gather,
            rotate: (i % 2 ? -1 : 1) * M.rest.rotate * (tall ? 0.4 : 1),
            scale: M.rest.scale,
            autoAlpha: M.rest.opacity,
            zIndex: cards.length - i,
          });
        });
        if (art.length) gsap.set(art, { y: M.illustration.y, autoAlpha: 0 });
        if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

        const touch = window.matchMedia("(hover: none)").matches;
        ScrollTrigger.create({
          trigger: deck,
          start: M.start,
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(cards, {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              duration: M.open.duration,
              ease: M.open.ease,
              stagger: M.open.stagger,
              clearProps: "transform,zIndex",
            });
            if (art.length) tl.to(
              art,
              {
                y: 0,
                autoAlpha: 1,
                duration: M.illustration.duration,
                ease: M.illustration.ease,
                stagger: M.open.stagger,
              },
              M.illustration.delay,
            );
            if (progress) {
              tl.to(
                progress,
                { scaleX: 1, ease: "power2.inOut", duration: M.open.duration + M.open.stagger * cards.length },
                0,
              );
            }
            if (touch) {
              cards.forEach((card, i) =>
                tl.call(() => card.setAttribute("data-live", ""), [], M.touchPlay + i * M.open.stagger),
              );
            }
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
