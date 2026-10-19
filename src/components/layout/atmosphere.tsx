"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ATMOSPHERE, TONES, type Tone } from "@/lib/atmosphere";

const TONE_KEYS = Object.keys(TONES) as Tone[];

/**
 * The fixed global background behind every page: the tone layers cross-fade
 * as `[data-tone]` sections pass the middle of the screen, a soft glow orb
 * drifts with scroll, and grain and a dot grid sit over everything. Only
 * opacity and transform change. It is a fixed element with transforms, not
 * background-attachment: fixed (which breaks on iOS).
 */
export function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const layers = Object.fromEntries(
        TONE_KEYS.map((tone) => [tone, root.current!.querySelector<HTMLElement>(`[data-layer="${tone}"]`)!]),
      ) as Record<Tone, HTMLElement>;
      const orb = root.current!.querySelector<HTMLElement>("[data-orb]")!;
      let sections: { tone: Tone; top: number; bottom: number }[] = [];

      const measure = () => {
        sections = gsap.utils.toArray<HTMLElement>("[data-tone]").map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            tone: (el.dataset.tone as Tone) in TONES ? (el.dataset.tone as Tone) : "base",
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
          };
        });
      };

      const blend = ATMOSPHERE.toneBlend;
      const update = () => {
        const probe = window.scrollY + window.innerHeight * 0.5;
        const weights: Record<Tone, number> = { deep: 0, base: 0, steel: 0, charcoal: 0 };
        let total = 0;
        for (const s of sections) {
          // 1 inside the section, ramping linearly across each boundary.
          const w = Math.min(1, Math.max(0, Math.min((probe - s.top) / blend + 0.5, (s.bottom - probe) / blend + 0.5)));
          weights[s.tone] += w;
          total += w;
        }
        if (total === 0) weights.base = total = 1;
        TONE_KEYS.forEach((tone) => {
          layers[tone].style.opacity = String(weights[tone] / total);
        });
      };

      measure();
      update();
      const tracker = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: update,
        onRefresh: () => {
          measure();
          update();
        },
      });

      // The orb drifts down and sideways across the whole page.
      const mm = gsap.matchMedia();
      mm.add(`${MOTION.ok} and (min-width: 768px)`, () => {
        gsap.fromTo(
          orb,
          { yPercent: -ATMOSPHERE.parallax.orb / 2, xPercent: -18 },
          {
            yPercent: ATMOSPHERE.parallax.orb / 2,
            xPercent: 18,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 1.5 },
          },
        );
      });

      // Aurora fields animate only while their section is on screen.
      const auroras = gsap.utils.toArray<HTMLElement>(".aurora").map((el) =>
        ScrollTrigger.create({ trigger: el.parentElement, start: "top bottom", end: "bottom top", toggleClass: { targets: el, className: "is-live" } }),
      );

      // Section depth: image plates and glow layers drift at different speeds.
      mm.add(`${MOTION.ok} and (min-width: 1024px)`, () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount =
            el.dataset.parallax === "glow" ? ATMOSPHERE.parallax.glow : ATMOSPHERE.parallax.plate;
          gsap.fromTo(
            el,
            { yPercent: -amount / 2 },
            {
              yPercent: amount / 2,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });

      return () => {
        tracker.kill();
        auroras.forEach((trigger) => trigger.kill());
      };
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-bg-deep"
    >
      {TONE_KEYS.map((tone) => (
        <div
          key={tone}
          data-layer={tone}
          className="absolute inset-0 opacity-0 will-change-[opacity]"
          style={{ backgroundImage: TONES[tone] }}
        />
      ))}

      {/* Drifting glow orb: the room's light, following the reader down */}
      <div
        data-orb
        className="absolute top-[10%] left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: ATMOSPHERE.glow.size,
          height: ATMOSPHERE.glow.size,
          background: `radial-gradient(closest-side, rgb(${ATMOSPHERE.glow.color} / ${0.22 * ATMOSPHERE.glow.strength}), transparent)`,
        }}
      />

      {/* Faint blueprint dot grid, fading toward the edges */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgb(243_246_250/0.9)_1px,transparent_1.2px)] bg-size-[28px_28px] mask-[radial-gradient(75%_70%_at_50%_45%,black,transparent_85%)]"
        style={{ opacity: ATMOSPHERE.texture.grid }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0"
        style={{
          opacity: ATMOSPHERE.texture.grain,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
