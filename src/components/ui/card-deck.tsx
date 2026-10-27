"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CARD_MOTION as M } from "@/lib/card-motion";
import { cn } from "@/lib/utils";

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
        cards.forEach((card, i) => {
          const r = card.getBoundingClientRect();
          gsap.set(card, {
            x: tall ? 0 : (cx - (r.left + r.width / 2)) * M.rest.gather,
            y: tall ? M.rest.tuck : (cy - (r.top + r.height / 2)) * M.rest.gather,
            rotate: (i % 2 ? -1 : 1) * M.rest.rotate * (tall ? 0.4 : 1),
            scale: M.rest.scale,
            autoAlpha: M.rest.opacity,
            zIndex: cards.length - i,
          });
        });
        gsap.set(art, { y: M.illustration.y, autoAlpha: 0 });
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
            tl.to(
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

/**
 * One card in a deck. On hover (desktop) it lifts, its gradient shifts and
 * its art moves: an illustration lifts and tilts toward the pointer, an icon
 * tile springs and its rings ripple out. `tone="navy"` is the deep
 * navy-to-steel variant with white text.
 */
export function DeckCard({
  children,
  illustration,
  illustrationAlt = "",
  art,
  tone = "light",
  className,
  bodyClassName,
  artClassName,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  illustration?: string;
  illustrationAlt?: string;
  /** Custom art in place of an illustration image (rises the same way). */
  art?: React.ReactNode;
  tone?: "light" | "navy";
  className?: string;
  bodyClassName?: string;
  artClassName?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--tilt-x", `${(-py * M.tilt).toFixed(2)}deg`);
    ref.current.style.setProperty("--tilt-y", `${(px * M.tilt).toFixed(2)}deg`);
  };
  const onLeave = () => {
    ref.current?.style.removeProperty("--tilt-x");
    ref.current?.style.removeProperty("--tilt-y");
  };

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-card
      data-tone-card={tone}
      data-theme={tone === "navy" ? "dark" : "light"}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("deck-card group/card relative isolate flex flex-col rounded-card", className)}
    >
      {(illustration || art) && (
        <div className={cn("relative h-36 shrink-0", artClassName)}>
          <div data-illus className="absolute inset-0 flex items-end justify-center pt-6">
            {illustration ? (
              <Image
                src={illustration}
                alt={illustrationAlt}
                width={320}
                height={320}
                sizes="200px"
                className="deck-card-art h-full w-auto max-w-[70%] object-contain object-bottom"
              />
            ) : (
              <div className="deck-card-art">{art}</div>
            )}
          </div>
        </div>
      )}
      <div className={cn("relative flex flex-1 flex-col p-6 pt-5", bodyClassName)}>{children}</div>
    </Tag>
  );
}

/** Art for cards without a product illustration: the icon on a tile, framed
 *  by a fine ring and a dashed orbit (drawn, not glowing). They move on
 *  hover; see `.icon-art` in globals.css. */
export function IconArt({ children }: { children: React.ReactNode }) {
  return (
    <div className="icon-art relative grid size-22 place-items-center">
      <span aria-hidden className="icon-ripple absolute inset-0 rounded-full ring-1 ring-accent/25" />
      <span aria-hidden className="icon-orbit absolute inset-0 rounded-full border border-dashed border-accent/30" />
      <span className="icon-tile relative grid size-12 place-items-center rounded-2xl bg-brand text-white shadow-lift">
        <span className="icon-glyph grid place-items-center">{children}</span>
      </span>
    </div>
  );
}
