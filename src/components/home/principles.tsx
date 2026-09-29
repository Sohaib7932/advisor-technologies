import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { principles } from "@/lib/content";
import { PrincipleCard } from "./principle-card";

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
          <div className="lg:col-span-6 lg:col-start-7">
            {/* The image and each card reveal on their own. Nesting them
                inside one Reveal stacked two transforms and made the cards
                jolt as the parent was still settling. */}
            <Reveal
              delay={120}
              className="group/image relative aspect-16/10 overflow-hidden rounded-panel sm:aspect-2/1 lg:aspect-16/10"
            >
              <Image
                src="/images/objective-principle.png?v=2"
                alt="Advisor Technologies engineer coordinating industrial operations"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out-soft group-hover/image:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/20 to-transparent transition-opacity duration-500 group-hover/image:opacity-70"
              />
            </Reveal>

            {/* Pulled up so the grid overlaps the photograph. `relative` keeps
                it above the positioned image container. The Reveal only
                fades and lifts; hover motion lives on the card inside it. */}
            <ul className="relative -mt-10 grid gap-3 px-3 sm:-mt-14 sm:grid-cols-2 sm:px-5">
              {principles.map((principle, index) => (
                <Reveal
                  as="li"
                  key={principle.title}
                  delay={260 + index * 90}
                >
                  <PrincipleCard
                    index={index}
                    title={principle.title}
                    body={principle.short}
                    icon={principle.icon}
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
