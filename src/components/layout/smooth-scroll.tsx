"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position always agree on the same frame. Skipped entirely when the
 * visitor prefers reduced motion, leaving native scrolling untouched.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    // We restore position ourselves on route changes (below).
    window.history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ duration: 1.1, anchors: { offset: -96 } });
    lenis.current = instance;
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // New page: start at the very top. Next resets the window, but Lenis keeps
  // the previous page's scroll target and would glide back toward it, so it
  // is reset too. Links to an anchor (#enquiry, …) are left to land there.
  useEffect(() => {
    if (!window.location.hash) {
      lenis.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    // Pinned sections on the new page measure from the top.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}
