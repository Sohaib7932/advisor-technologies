"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
 *  - `[data-tilt]`: 3D renders tilt toward a fine pointer; measured once
 *    per hover, one style write per frame, no transform at rest.
 *  - `.bob`: floating renders animate only while on screen.
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

    // Tilt: the host (a card, or the render itself) is measured on enter.
    let tiltHost: HTMLElement | null = null;
    let tiltEl: HTMLElement | null = null;
    let tiltRect: DOMRect | null = null;
    let tiltFrame = 0;
    let px = 0;
    let py = 0;
    const settle = (el: HTMLElement) => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      window.setTimeout(() => {
        if (el !== tiltEl) el.style.transform = "";
      }, 600);
    };
    const onTilt = (e: PointerEvent) => {
      if (!fine.matches) return;
      const target = e.target as Element | null;
      const host = target?.closest<HTMLElement>("[data-tilt-host], [data-tilt]") ?? null;
      if (host !== tiltHost) {
        if (tiltEl) settle(tiltEl);
        tiltHost = host;
        tiltEl = host ? (host.matches("[data-tilt]") ? host : host.querySelector<HTMLElement>("[data-tilt]")) : null;
        tiltRect = host && tiltEl ? host.getBoundingClientRect() : null;
      }
      if (!tiltEl || !tiltRect) return;
      px = (e.clientX - tiltRect.left) / tiltRect.width - 0.5;
      py = (e.clientY - tiltRect.top) / tiltRect.height - 0.5;
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
        tiltFrame = 0;
        if (!tiltEl) return;
        const max = Number(tiltEl.dataset.tilt) || 8;
        tiltEl.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      });
    };
    // Scrolling moves the host under a still pointer: re-measure next time.
    const onScroll = () => {
      tiltRect = tiltHost ? null : tiltRect;
      if (tiltHost) tiltHost = null;
    };
    window.addEventListener("pointermove", onTilt, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(tiltFrame);
      window.removeEventListener("load", refresh);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onTilt);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // From the first in-app navigation on, new pages fade in (globals.css).
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    document.documentElement.dataset.navigated = "";
  }, [pathname]);

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
      document.querySelectorAll("[data-marquee], .bob").forEach((el) => {
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
