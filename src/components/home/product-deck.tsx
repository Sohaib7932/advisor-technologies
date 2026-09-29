"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, Icon } from "@/components/ui/icons";
import type { IconName, Product } from "@/lib/content";
import { cn } from "@/lib/utils";

export type DeckCard = {
  category: string;
  icon: IconName;
  /** Photograph filling the card. */
  image: string;
  items: Product[];
};

/** How long each card holds the front before the next one comes forward. */
const CYCLE_MS = 2000;

/** Where each depth sits in the fan: up and to the right, shrinking back. */
const DEPTHS = [
  "translate-x-0 translate-y-0 scale-100 opacity-100",
  "translate-x-[7%] -translate-y-[10%] scale-[0.94] opacity-100",
  "translate-x-[14%] -translate-y-[20%] scale-[0.88] opacity-100",
  // Parking spot for the card that just left the front: it slides further
  // up and back as it fades, then re-enters the fan from behind.
  "translate-x-[20%] -translate-y-[30%] scale-[0.82] opacity-0",
];

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * A fanned stack of catalogue cards. The front card cycles to the back every
 * CYCLE_MS. The progress line along the front card's bottom edge is the
 * timer: when its CSS animation ends the next card comes forward, so the
 * bar and the cycle can never drift apart. It only runs while the deck is on
 * screen, holds while the cards are hovered or focused, and is off under
 * reduced motion.
 * Only the front card is interactive; the cards behind it are inert.
 */
export function ProductDeck({ cards }: { cards: DeckCard[] }) {
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const count = cards.length;
  const go = (step: number) => setFront((current) => (current + step + count) % count);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused;

  return (
    <div ref={rootRef}>
      {/* Room above and to the right for the fanned cards */}
      <div
        className="relative pt-[18%] pr-[16%]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative aspect-[16/11] sm:aspect-[16/10]">
          {cards.map((card, index) => {
            const depth = (index - front + count) % count;
            const isFront = depth === 0;

            return (
              <article
                key={card.category}
                aria-hidden={!isFront}
                inert={!isFront}
                onClick={isFront ? undefined : () => setFront(index)}
                style={{ zIndex: count - depth }}
                className={cn(
                  "absolute inset-0 origin-top-right overflow-hidden rounded-[1.25rem] bg-navy-900 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/20 transition-[translate,scale,opacity,filter] duration-700 ease-out-soft sm:rounded-[1.75rem]",
                  DEPTHS[Math.min(depth, DEPTHS.length - 1)],
                  depth === 1 && "brightness-[0.9]",
                  depth >= 2 && "brightness-[0.78]",
                  !isFront && "cursor-pointer",
                )}
              >
                <DeckCardFace card={card} index={index} total={count} />
                {isFront && !reducedMotion && (
                  <span
                    key={front}
                    aria-hidden
                    onAnimationEnd={() => go(1)}
                    className="hero-progress absolute inset-x-0 bottom-0 h-1 origin-left bg-linear-to-r from-navy-400 to-sky-400"
                    style={{
                      animationDuration: `${CYCLE_MS}ms`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between gap-4 pr-[16%]">
        <span className="font-display text-sm text-white/60 tabular-nums sm:hidden lg:inline xl:hidden">
          <span className="text-white">{cards[front].category}</span>
        </span>
        <div className="hidden flex-wrap gap-1.5 sm:flex lg:hidden xl:flex" role="tablist" aria-label="Product categories">
          {cards.map((card, index) => (
            <button
              key={card.category}
              type="button"
              role="tab"
              aria-selected={index === front}
              onClick={() => setFront(index)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300",
                index === front
                  ? "bg-white text-navy-900"
                  : "text-white/55 ring-1 ring-white/15 hover:text-white hover:ring-white/35",
              )}
            >
              {card.category}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous category"
            className="grid size-10 place-items-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-navy-900"
          >
            <ArrowRight className="size-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next category"
            className="grid size-10 place-items-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-navy-900"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DeckCardFace({ card, index, total }: { card: DeckCard; index: number; total: number }) {
  return (
    <div className="relative flex h-full flex-col p-4 text-white sm:p-6 xl:p-8">
      <Image
        src={card.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 45vw"
        className="object-cover"
      />
      {/* Dark from the bottom so the copy reads over any photograph */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/45 to-navy-950/10"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-md">
            <Icon name={card.icon} className="size-4" />
          </span>
          <span className="font-display text-xs font-medium tracking-widest text-white/80 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </span>
        <span className="rounded-full bg-white/15 px-3.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase ring-1 ring-white/30 backdrop-blur-md">
          {card.items.length} product {card.items.length === 1 ? "line" : "lines"}
        </span>
      </div>

      <h3 className="relative mt-auto max-w-[14ch] font-display text-xl leading-[1.05] font-semibold sm:text-3xl lg:text-2xl xl:text-4xl">
        {card.category}
      </h3>
      <ul className="relative mt-4 hidden max-w-[80%] flex-wrap gap-1.5 sm:flex lg:hidden xl:flex">
        {card.items.map((item) => (
          <li
            key={item.id}
            className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur-md"
          >
            {item.title}
          </li>
        ))}
      </ul>
      {card.items.length === 1 && (
        <p className="relative mt-3 hidden max-w-[60%] text-sm leading-relaxed text-white/75 sm:block lg:hidden xl:block">
          {card.items[0].body}
        </p>
      )}
      <Link
        href="/products"
        className="group relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-navy-900 transition-transform duration-300 hover:-translate-y-0.5 sm:mt-5 sm:px-4 sm:py-2 sm:text-sm"
      >
        View in catalogue
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}
