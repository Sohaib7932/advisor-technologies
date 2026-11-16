import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CardDeck } from "@/components/ui/card-deck";
import { CountUp } from "@/components/ui/count-up";
import { Button } from "@/components/ui/button";
import { Check, Icon } from "@/components/ui/icons";
import { Render3D } from "@/components/three/render-3d";
import { sectors, stats } from "@/lib/content";
import { cn } from "@/lib/utils";

/** From the company profile (aboutParagraphs[1] in content.ts). */
const AGENT_SCOPE = [
  "Branded machinery & equipment",
  "Office & computer stationery",
  "All kinds of furniture",
  "Repair & maintenance of machinery, transport, buildings and roads",
  "Import & export",
];

/**
 * About (ref 1's stats panel, ref 3's bento). An ice panel: statement and
 * button on the left, a staggered cluster of floating stat cards with the
 * glass bar-chart render on the right. Below, a bento of the three facts the
 * company stands on.
 */
export function About() {
  return (
    <>
      <Section id="about" tone="ice" className="overflow-hidden">
        <div aria-hidden className="rings top-1/2 right-[-12%] w-[70%] -translate-y-1/2 [--ring-c:rgb(47_92_196/0.14)]" />
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <Eyebrow>About us</Eyebrow>
              <h2 className="mt-5 text-h2 text-fg">
                Built on trust. <Accent>Delivered with quality.</Accent>
              </h2>
              <p className="mt-6 max-w-md text-lead text-fg-muted">
                Exclusive territory agents for world-class industrial manufacturing brands in the Pakistan market,
                focused on high quality brands and international standards of after-sales service.
              </p>
              <Button href="/about" className="mt-9">
                More about us
              </Button>
            </Reveal>

            {/* Two staggered columns of stat cards (each column floats as one,
                so cards never overlap) and the glass chart in its own column. */}
            <div className="grid grid-cols-2 items-center gap-4 sm:gap-5 lg:col-span-7 lg:grid-cols-[1fr_1fr_0.95fr]">
              {[0, 1].map((col) => (
                <ul
                  key={col}
                  className={cn("bob flex flex-col gap-4 sm:gap-5", col === 0 && "lg:mt-16")}
                  style={{ "--bob-delay": `${col * -3}s` } as React.CSSProperties}
                >
                  {stats
                    .filter((_, i) => i % 2 === col)
                    .map((stat) => (
                      <li key={stat.label} className="card rounded-[1.5rem] p-5 sm:p-6">
                        <CountUp value={stat.value} className="block font-display text-[clamp(2rem,1.4rem+2vw,2.75rem)] leading-none font-bold tracking-tight text-navy tabular-nums" />
                        <p className="mt-3 text-sm font-semibold text-navy">{stat.label}</p>
                        <p className="mt-1.5 hidden text-[0.8125rem] leading-relaxed text-text-3 sm:block">{stat.detail}</p>
                      </li>
                    ))}
                </ul>
              ))}
              <Render3D name="chart" alt="" float className="hidden scale-125 lg:block" sizes="24vw" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Bento: the facts the company stands on */}
      <section aria-label="What we stand on" className="frame pt-6 pb-(--section-y)">
        <Container>
          <CardDeck className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-5">
            <article data-card data-theme="dark" className="relative isolate flex min-h-0 flex-col overflow-hidden rounded-card bg-navy p-6 sm:p-8 lg:col-span-4 lg:row-span-2">
              <div aria-hidden className="rings -right-24 -bottom-24 w-[22rem]" />
              <Eyebrow>Exclusive territory agent</Eyebrow>
              <h3 className="mt-6 text-h3 text-white">World-class industrial brands, represented in Pakistan</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">
                Advisor Technologies acts as exclusive territory agent to a number of world-class industrial manufacturing
                brands for the Pakistan market.
              </p>
              {/* What we supply, in the company profile's own words */}
              <ul className="mt-6 grid gap-2.5 text-sm text-white">
                {AGENT_SCOPE.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sky/20 text-sky">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-fg-muted">
                A recognised brand within Pakistan which stands for{" "}
                <span className="font-semibold text-white">quality and reliability</span>.
              </p>
              <Button href="/about" variant="secondary" size="sm" className="mt-8 self-start lg:mt-auto">
                Our story
              </Button>
            </article>

            <article data-card className="relative isolate min-h-[17rem] overflow-hidden rounded-card sm:min-h-[22rem] lg:col-span-5 lg:row-span-2">
              <Image src="/images/photos/about.webp" alt="" fill sizes="(max-width: 1024px) 100vw, 42vw" className="-z-10 object-cover" />
              <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-navy/90 via-navy/30 to-transparent" />
              <div className="flex h-full flex-col justify-end p-6 sm:p-7">
                <p className="text-xs font-semibold tracking-[0.08em] text-white uppercase">Sectors we serve</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <li key={sector} className="rounded-full bg-navy-950/70 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20">
                      {sector}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article data-card className="relative isolate flex flex-col overflow-hidden rounded-card bg-ice p-6 ring-1 ring-steel/12 lg:col-span-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-white text-steel shadow-card">
                <Icon name="shield" className="size-5" />
              </span>
              <h3 className="mt-6 text-h4 text-navy">International after-sales standards</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                High quality brands backed by international standards of after-sales service, from installation through
                maintenance and spares.
              </p>
            </article>

            <article data-card data-tilt-host className="card relative isolate flex flex-col overflow-hidden p-6 lg:col-span-3">
              <h3 className="text-h4 text-navy">Government of Pakistan supply contracts</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                We hold a number of supply contracts across Pakistan, notably with different projects of the Government of
                Pakistan.
              </p>
              <Render3D name="banner-clients" className="-mx-2 mt-auto -mb-4 pt-3" sizes="22vw" />
            </article>
          </CardDeck>
        </Container>
      </section>
    </>
  );
}
