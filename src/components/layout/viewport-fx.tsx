"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";

/**
 * One client component for the site-wide, per-element effects, so the
 * elements themselves stay server components:
 *
 *  - `.reveal`: one IntersectionObserver adds `reveal-in` once (reveals
 *    on the current route only; rescans after navigation and streaming).
 *  - `[data-marquee]`: CSS marquees run only while on screen.
 *  - `[data-magnetic]`: buttons lean up to 6px toward a fine pointer
 *    (gsap.quickTo, transform only, created lazily on first hover).
 *  - ScrollTrigger.refresh once, debounced, after fonts and images settle.
 *  - Marks <html data-js> so the CSS failsafe (content shown after 3s if
 *    scripts never start) stands down.
 */
export function ViewportFx() {
  const pathname = usePathname();

  // Once per app: flags, refresh scheduling, magnetic buttons.
  useEffect(() => {
    document.documentElement.dataset.js = "";
    ScrollTrigger.config({ ignoreMobileResize: true });

    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    // Magnetic buttons: delegated, fine pointers only, no per-button setup.
    const fine = window.matchMedia(`${MOTION.ok} and (hover: hover) and (pointer: fine)`);
    const movers = new WeakMap<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();
    const clamp = gsap.utils.clamp(-6, 6);
    let active: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (!fine.matches) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (active && active !== el) {
        const m = movers.get(active);
        m?.x(0);
        m?.y(0);
      }
      active = el;
      if (!el) return;
      let m = movers.get(el);
      if (!m) {
        m = {
          x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
        };
        movers.set(el, m);
      }
      const r = el.getBoundingClientRect();
      m.x(clamp((e.clientX - r.left - r.width / 2) * 0.12));
      m.y(clamp((e.clientY - r.top - r.height / 2) * 0.25));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Per route: reveals and marquees.
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("reveal-in");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    const marquee = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.toggleAttribute("data-running", entry.isIntersecting);
    });

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(".reveal:not(.reveal-in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        reveal.observe(el);
      });
      document.querySelectorAll("[data-marquee]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        marquee.observe(el);
      });
    };
    scan();
    // Content that streams in after hydration.
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      reveal.disconnect();
      marquee.disconnect();
    };
  }, [pathname]);

  return null;
}
