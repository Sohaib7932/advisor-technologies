"use client";

import { useRef } from "react";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icons";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/content";

/**
 * Four steps joined by a line that draws itself as the section scrolls by:
 * horizontal on wide screens, vertical on narrow ones. Each node lights up
 * as the line reaches it.
 */
export function Process() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: MOTION.ok, wide: "(min-width: 1024px)" },
        ({ conditions }) => {
          if (!conditions?.motion) return;
          const wide = Boolean(conditions.wide);
          const nodes = gsap.utils.toArray<HTMLElement>("[data-node]");
          const steps = gsap.utils.toArray<HTMLElement>("[data-step]");

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              end: wide ? "bottom 70%" : "bottom 55%",
              scrub: 0.8,
            },
          });
          tl.fromTo(
            "[data-line]",
            wide ? { scaleX: 0 } : { scaleY: 0 },
            wide ? { scaleX: 1, duration: steps.length } : { scaleY: 1, duration: steps.length },
            0,
          );
          steps.forEach((step, i) => {
            tl.fromTo(step, { autoAlpha: 0.25, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, i * 0.95)
              .fromTo(
                nodes[i],
                { backgroundColor: "#1b1f26", color: "#8c98a8", boxShadow: "0 0 0 0 rgba(91,163,208,0)" },
                {
                  backgroundColor: "#5ba3d0",
                  color: "#1b1f26",
                  boxShadow: "0 0 0 6px rgba(91,163,208,0.15), 0 0 28px rgba(91,163,208,0.6)",
                  duration: 0.3,
                },
                i * 0.95 + 0.1,
              );
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <Section id="process" tone="navy">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          align="center"
          title={
            <>
              From first consultation to{" "}
              <span className="text-glow">long-term service</span>
            </>
          }
          lead="A predictable four-stage route that fits public-sector procurement as comfortably as a private purchase order."
        />

        <div ref={root} className="relative mt-16">
          {/* Track and the line that draws along it */}
          <span
            aria-hidden
            className="absolute top-7 bottom-7 left-7 w-px bg-white/10 lg:top-7 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto"
          />
          <span
            aria-hidden
            data-line
            className="absolute top-7 bottom-7 left-7 w-px origin-top bg-glow shadow-[0_0_12px_rgb(91_163_208/0.8)] lg:top-7 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto lg:origin-left"
          />

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step) => (
              <li
                key={step.step}
                data-step
                className="flex gap-6 lg:flex-col lg:items-center lg:text-center"
              >
                <span
                  data-node
                  className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-glow text-bg ring-1 ring-glow/40"
                >
                  <Icon name={step.icon} className="size-5.5" />
                </span>
                <div className="pt-2 lg:pt-6">
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-glow">
                    STEP {step.step}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-fg uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-fg-muted lg:mx-auto">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
