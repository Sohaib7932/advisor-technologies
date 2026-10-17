"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { ArrowUpRight, Check, Icon } from "@/components/ui/icons";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The six divisions as a pinned, scroll-driven sequence on desktop: a
 * vertical timeline fills on the left while each division's panel takes the
 * stage on the right. The markup is a plain vertical list; GSAP only stacks
 * the panels into a stage when it can animate them (desktop, motion on), so
 * mobile, reduced motion and no-JS all read as a simple list.
 */
export function ActivityScope() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION.ok} and (min-width: 1024px)`, () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
        const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
        if (!stage || panels.length < 2) return;

        // Stack the panels in one stage; gsap.matchMedia reverts all of this.
        gsap.set(stage, { position: "relative", height: "min(34rem, 64vh)" });
        gsap.set(panels, { position: "absolute", inset: 0, margin: 0 });
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 90, scale: 1.04 });

        const steps = panels.length - 1;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${steps * window.innerHeight * 0.75}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            snap: { snapTo: 1 / steps, duration: 0.5, ease: "power2.inOut" },
            onUpdate: (self) => setActive(Math.round(self.progress * steps)),
          },
        });

        tl.fromTo("[data-fill]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: steps }, 0);
        panels.forEach((panel, i) => {
          const image = panel.querySelector("[data-parallax]");
          if (image) tl.fromTo(image, { yPercent: -6 }, { yPercent: 6, ease: "none", duration: 1.6 }, Math.max(0, i - 0.6));
          if (i === 0) return;
          tl.to(panels[i - 1], { autoAlpha: 0, y: -70, scale: 0.96 }, i - 1)
            .to(panel, { autoAlpha: 1, y: 0, scale: 1 }, i - 1);
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="activity-scope"
      aria-labelledby="activity-scope-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#1b1f26_0%,#14213a_100%)] py-16 md:py-24 lg:flex lg:min-h-svh lg:items-center lg:py-0"
    >
      <span aria-hidden className="glow-line absolute inset-x-0 top-0" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_75%_50%,rgb(63_109_133/0.25),transparent_70%)]"
      />

      <Container className="lg:pt-24 lg:pb-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Heading and timeline */}
          <div className="lg:col-span-4">
            <Eyebrow>Activity scope</Eyebrow>
            <h2
              id="activity-scope-title"
              className="mt-5 text-headline font-bold text-fg uppercase"
            >
              Six divisions,{" "}
              <span className="text-glow">one contract</span>
            </h2>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
              A single purchase order can cover equipment, installation and the
              years of service that follow.
            </p>

            <ol aria-hidden className="relative mt-10 hidden space-y-1 lg:block">
              <span className="absolute top-3 bottom-3 left-[0.6875rem] w-px bg-white/10" />
              <span
                data-fill
                className="absolute top-3 bottom-3 left-[0.6875rem] w-px origin-top bg-glow shadow-[0_0_10px_rgb(91_163_208/0.8)]"
              />
              {services.map((service, i) => (
                <li
                  key={service.id}
                  className={cn(
                    "relative flex items-center gap-4 py-2 text-sm transition-colors duration-500",
                    i === active ? "text-fg" : "text-fg-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-6 shrink-0 place-items-center rounded-full font-display text-[0.625rem] font-bold ring-1 transition-all duration-500",
                      i <= active
                        ? "bg-glow text-bg ring-glow shadow-glow"
                        : "bg-bg text-fg-subtle ring-white/15",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium">{service.title}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Panels */}
          <div data-stage className="space-y-4 lg:col-span-8">
            {services.map((service, i) => (
              <article
                key={service.id}
                data-panel
                id={`scope-${service.id}`}
                className="card-surface grid overflow-hidden rounded-panel md:grid-cols-2"
              >
                <div className="relative min-h-56 overflow-hidden md:min-h-full">
                  <div data-parallax className="absolute -inset-y-[8%] inset-x-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-brand-deep/80 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-surface/60"
                  />
                  <span className="absolute top-5 left-5 grid size-11 place-items-center rounded-full bg-bg/60 text-glow ring-1 ring-glow/30 backdrop-blur-md">
                    <Icon name={service.icon} className="size-5" />
                  </span>
                </div>

                <div className="flex flex-col p-7 sm:p-9">
                  <span className="font-display text-sm font-semibold tracking-[0.2em] text-glow tabular-nums">
                    {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-[clamp(1.4rem,1rem+1vw,2rem)] leading-[1.1] font-bold text-fg uppercase">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">
                    {service.body}
                  </p>
                  <ul className="mt-6 grid gap-2 text-sm text-fg">
                    {service.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-glow/15 text-glow">
                          <Check className="size-3" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services#${service.id}`}
                    className="group mt-auto inline-flex items-center gap-1.5 self-start pt-7 text-sm font-semibold text-glow hover:text-fg"
                  >
                    Explore this division
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
