"use client";

import { useRef } from "react";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icons";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/content";

/**
 * How we work: four numbered steps in a row (stacked on phones), joined by a
 * line that draws as the section scrolls by. This is the site's only
 * scrubbed animation; each step lights up once as the line reaches it.
 */
export function Process() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION.ok, wide: "(min-width: 1024px)" }, ({ conditions }) => {
        if (!conditions?.motion) return;
        const wide = Boolean(conditions.wide);
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]");
        gsap.fromTo(
          "[data-line]",
          wide ? { scaleX: 0 } : { scaleY: 0 },
          {
            ...(wide ? { scaleX: 1 } : { scaleY: 1 }),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 75%", end: wide ? "bottom 75%" : "bottom 60%", scrub: 0.6 },
          },
        );
        steps.forEach((step, i) => {
          gsap.from(step, {
            y: 24,
            autoAlpha: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 85%", once: true },
          });
          gsap.fromTo(
            nodes[i],
            { backgroundColor: "#ffffff", color: "#2f5cc4" },
            { backgroundColor: "#14213a", color: "#8fb3ff", duration: 0.5, scrollTrigger: { trigger: step, start: wide ? "top 60%" : "top 55%", once: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <Section id="process" tone="ice">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          align="center"
          title={
            <>
              From first consultation to <Accent>long-term service</Accent>
            </>
          }
          lead="A predictable four-stage route that fits public-sector procurement as comfortably as a private purchase order."
        />

        <div ref={root} className="relative mt-16">
          <span aria-hidden className="absolute top-8 bottom-8 left-8 w-px bg-steel/20 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto" />
          <span aria-hidden data-line className="absolute top-8 bottom-8 left-8 w-px origin-top bg-steel lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto lg:origin-left" />
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step) => (
              <li key={step.step} data-step className="flex gap-6 lg:flex-col lg:items-center lg:text-center">
                <span data-node className="relative z-10 grid size-16 shrink-0 place-items-center rounded-full bg-white text-steel shadow-card ring-1 ring-steel/15">
                  <Icon name={step.icon} className="size-6" />
                </span>
                <div className="pt-1 lg:pt-6">
                  <span className="font-display text-sm font-bold text-steel tabular-nums">{step.step}</span>
                  <h3 className="mt-1.5 text-h4 text-navy">{step.title}</h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-text-2 lg:mx-auto">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
