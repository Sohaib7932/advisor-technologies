/**
 * Motion system: the one place to tune easing, durations, staggers and the
 * reusable GSAP patterns. Pair with the CSS easing tokens in globals.css
 * (--ease-out-expo, --ease-settle), which mirror these curves.
 *
 * Rules: transform and opacity only; gsap.matchMedia around every pattern;
 * prefers-reduced-motion = static final state; nothing scrubbed except the
 * "How we work" line; no pins on phones.
 */
"use client";

import { gsap, MOTION, ScrollTrigger } from "./gsap";

export const EASE = {
  out: "expo.out",
  soft: "power3.out",
  settle: "back.out(1.1)",
  inOut: "power2.inOut",
} as const;

export const DUR = { fast: 0.6, base: 0.9, slow: 1.2 } as const;
export const STAGGER = { tight: 0.06, base: 0.09, loose: 0.12 } as const;

/** Where on-enter reveals fire: the target's top at 85% of the viewport. */
export const START = "top 85%";

/** Card-stack open on enter (once). Read by CardDeck. */
export const CARD = {
  start: "top 78%",
  rest: { scale: 0.92, rotate: 3.5, opacity: 0.35, gather: 0.82, tuck: 48 },
  open: { duration: 1, stagger: 0.1, ease: EASE.settle },
  illustration: { y: 34, duration: 0.8, delay: 0.25, ease: EASE.soft },
  touchPlay: 0.7,
} as const;

/** Floating pill navbar: when it appears and how it moves. */
export const NAV = {
  showAfter: 80,
  /** Below this the pill never hides, even while scrolling down. */
  hideAfter: 520,
  morph: 0.4,
} as const;

export { gsap, MOTION, ScrollTrigger };
