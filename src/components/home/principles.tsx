"use client";

import Image from "next/image";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { Icon } from "@/components/ui/icons";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { principles } from "@/lib/content";

/**
 * The four principles as a stack of sticky cards. Each card pins below the
 * last; as the next one slides over it, the covered card scales back and dims.
 * Without motion the cards still stack (it is plain CSS sticky), they just
 * don't recede.
 */
export function Principles() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.firstElementChild, {
            scale: 0.92,
            autoAlpha: 0.2,
            transformOrigin: "50% 0%",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 85%",
              end: "top 25%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="principles"
      aria-labelledby="principles-title"
      data-tone="base"
      className="relative isolate py-16 md:py-24 xl:py-32"
    >
      <SectionBackdrop plate="haze" plateOpacity={0.3} details={["aurora", "glow-tl"]} />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Statement, held in place while the cards stack */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Eyebrow>Objective &amp; principles</Eyebrow>
              <h2
                id="principles-title"
                className="mt-5 text-headline font-bold text-fg uppercase"
              >
                Complete solutions,{" "}
                <span className="text-glow">not just a delivery note</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted">
                Our objective is to serve customers in both the public and
                private sector, covering production, trade, banks, government
                institutions and NGOs, with everything from network design and
                hardware supply through to service and training.
              </p>
              <div className="relative mt-8 hidden aspect-16/10 overflow-hidden rounded-panel ring-1 ring-white/10 lg:block">
                <Image
                  src="/images/objective-principle.png"
                  alt="Advisor Technologies engineer coordinating industrial operations"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-bg/70 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stacked cards */}
          <ul className="space-y-6 lg:col-span-7">
            {principles.map((principle, i) => (
              <li
                key={principle.title}
                data-stack-card
                className="sticky"
                style={{ top: `calc(7.5rem + ${i * 1.75}rem)` }}
              >
                <article className="card-surface relative overflow-hidden rounded-panel p-7 will-change-transform sm:p-10">
                  <div
                    aria-hidden
                    className="absolute -top-24 -right-24 size-64 rounded-full bg-glow/15 blur-3xl"
                  />
                  <div className="relative flex items-start justify-between gap-6">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-fg shadow-glow ring-1 ring-glow/40">
                      <Icon name={principle.icon} className="size-6" />
                    </span>
                    <span className="font-display text-[clamp(3rem,2rem+3vw,5rem)] leading-none font-bold text-white/8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="relative mt-10 font-display text-[clamp(1.6rem,1.1rem+1.4vw,2.4rem)] leading-none font-bold text-fg uppercase">
                    {principle.title}
                  </h3>
                  <p className="relative mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                    {principle.body}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
