"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/lib/content";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

/** From the company objective in content.ts (objectiveParagraphs). */
const ROUTE: { title: string; body: string; icon: IconName }[] = [
  { title: "Supply", body: "Hardware, software and equipment", icon: "package" },
  { title: "Installation", body: "Network design and fitting", icon: "wrench" },
  { title: "Service", body: "Support and training", icon: "handshake" },
];

/**
 * One contract, three stages. On entering view (once): the cards rise in
 * one after another, the connecting line draws across behind them and each
 * icon pops as the line reaches it. On hover a card lifts and its icon
 * tile turns navy. Reduced motion: the final state.
 */
export function RouteSteps() {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-step]");
        const tiles = gsap.utils.toArray<HTMLElement>("[data-step-icon]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          defaults: { ease: "expo.out" },
        });
        tl.from(cards, { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.14 }, 0)
          .from("[data-step-line]", { scaleX: 0, duration: 1.1, ease: "power2.inOut" }, 0.15)
          .from(tiles, { scale: 0.4, rotate: -25, duration: 0.7, ease: "back.out(1.8)", stagger: 0.18 }, 0.3);
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative mt-8 grid grid-cols-3 gap-2.5 sm:gap-3">
      {/* Line joining the three icon tiles */}
      <span aria-hidden className="absolute top-[2.35rem] right-[16%] left-[16%] h-px bg-steel/15 sm:top-[2.6rem]" />
      <span aria-hidden data-step-line className="absolute top-[2.35rem] right-[16%] left-[16%] h-px origin-left bg-steel sm:top-[2.6rem]" />
      {ROUTE.map((step, i) => (
        <li
          key={step.title}
          data-step
          className="group relative flex flex-col items-center rounded-[1.25rem] bg-white px-2.5 pt-4 pb-4 text-center shadow-card ring-1 ring-line transition-[translate] duration-500 ease-out-expo hover:-translate-y-1 lift sm:px-4 sm:pt-5"
        >
          <span
            data-step-icon
            className="relative z-10 grid size-10 place-items-center rounded-2xl bg-ice text-steel ring-4 ring-white transition-[background-color,color,rotate] duration-500 ease-out-expo group-hover:-rotate-6 group-hover:bg-navy group-hover:text-sky sm:size-11"
          >
            <Icon name={step.icon} className="size-4.5 sm:size-5" />
          </span>
          <span className="mt-3 font-display text-xs font-bold text-steel tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-sm font-semibold text-navy sm:text-[0.9375rem]">{step.title}</span>
          <span className="mt-1 text-xs leading-snug text-text-3">{step.body}</span>
        </li>
      ))}
    </ol>
  );
}
