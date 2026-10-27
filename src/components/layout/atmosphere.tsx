"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ATMOSPHERE, TONES, type Tone } from "@/lib/atmosphere";

const TONE_KEYS = Object.keys(TONES) as Tone[];

/**
 * The fixed page background: flat tones (white, mist, pale steel) that
 * cross-fade as `[data-tone]` sections pass the middle of the screen. Only
 * opacity changes; no orbs, grain or animated gradients. A fixed element,
 * not background-attachment: fixed (which breaks on iOS).
 */
export function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const layers = Object.fromEntries(
        TONE_KEYS.map((tone) => [tone, root.current!.querySelector<HTMLElement>(`[data-layer="${tone}"]`)!]),
      ) as Record<Tone, HTMLElement>;
      let sections: { tone: Tone; top: number; bottom: number }[] = [];

      const measure = () => {
        sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).map((el) => {
          const rect = el.getBoundingClientRect();
          const tone = el.dataset.tone as Tone;
          return {
            tone: tone in TONES ? tone : "base",
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
      return () => tracker.kill();
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 -z-50 bg-bg">
      {TONE_KEYS.map((tone) => (
        <div
          key={tone}
          data-layer={tone}
          className="absolute inset-0 opacity-0 will-change-[opacity]"
          style={{ background: TONES[tone] }}
        />
      ))}
    </div>
  );
}
