import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { principles } from "@/lib/content";

export function Principles() {
  return (
    <Section tone="dark" id="principles">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Statement */}
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="light">Objective &amp; principles</Eyebrow>
            <h2 className="mt-6 text-headline text-white">
              Complete solutions,{" "}
              <span className="block text-navy-400">
                not just a delivery note
              </span>
            </h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-navy-200">
              Our objective is to serve customers in both the public and private
              sector, covering production, trade, banks, government
              institutions and NGOs, with everything from network design and
              hardware supply through to service and training.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-300">
              Qualified employees across plant &amp; machinery, civil
              engineering, mechanical engineering, software and communications
              make that possible.
            </p>
            <Button href="/about" variant="light" className="mt-9" withArrow>
              More about us
            </Button>
          </Reveal>

          {/* Image with the four principles overlapping its lower edge */}
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <div className="relative aspect-16/10 overflow-hidden rounded-panel sm:aspect-2/1 lg:aspect-16/10">
              <Image
                src="/images/operations.svg"
                alt="Advisor Technologies engineers on site"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/20 to-transparent"
              />
            </div>

            {/* Pulled up so the grid overlaps the photograph. `relative` keeps
                it above the positioned image container. */}
            <ul className="relative -mt-10 grid gap-2.5 px-3 sm:-mt-14 sm:grid-cols-2 sm:px-5">
              {principles.map((principle, index) => (
                <Reveal
                  as="li"
                  key={principle.title}
                  delay={200 + index * 80}
                  className="flex gap-3.5 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-white/50 backdrop-blur-xl"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy-600/10 text-navy-700">
                    <Icon name={principle.icon} className="size-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[0.9375rem] font-semibold text-navy-900">
                      {principle.title}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-graphite-600">
                      {principle.short}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
