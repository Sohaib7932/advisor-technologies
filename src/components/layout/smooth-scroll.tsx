"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scrolling on the one clock: GSAP's ticker drives Lenis, and
 * Lenis reports every scroll to ScrollTrigger, so both always agree on the
 * same frame and there is no second requestAnimationFrame loop. Skipped
 * entirely under reduced motion (native scrolling). Touch devices keep
 * native scrolling (Lenis' default).
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);
  const first = useRef(true);

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

  // New page: start at the very top (Lenis would otherwise glide back toward
  // the previous page's position). Not on the first load: the browser is
  // already at the top, and a scroll + refresh there only forces layout
  // during hydration. Anchor links (#enquiry, …) are left to land.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.location.hash) {
      lenis.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
