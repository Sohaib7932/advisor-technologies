"use client";

/**
 * Single place GSAP is configured. Import gsap / ScrollTrigger / useGSAP from
 * here so plugins are always registered before use.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One motion language across the site.
gsap.defaults({ ease: "power3.out", duration: 0.9 });

/** Media query keys shared by every gsap.matchMedia() call. */
export const MOTION = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  mobile: "(max-width: 767px)",
  desktop: "(min-width: 768px)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
