import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CardDeck, DeckCard, IconArt } from "@/components/ui/card-deck";
import { GlowCard } from "@/components/ui/glow-card";
import { CountUp } from "@/components/ui/count-up";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { sectors, stats, type IconName } from "@/lib/content";

const statIcons: IconName[] = ["handshake", "machinery", "package", "office"];

/** "Built on trust" bento: the three facts the company stands on, its
 *  counters and the sectors it serves. */
export function About() {
  return (
    <Section
      id="about"
      tone="base"
     
    >
      <Container>
        <SectionHeading
          eyebrow="About us"
          title={
            <>
              Built on trust.{" "}
              <span className="text-accent">Delivered with quality.</span>
            </>
          }
          lead="Exclusive territory agents for world-class industrial manufacturing brands in the Pakistan market, focused on high quality brands and international standards of after-sales service."
          action={
            <Button href="/about" variant="secondary" withArrow>
              More about us
            </Button>
          }
        />

        <CardDeck className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {/* Feature: exclusive territory agent */}
          <div data-card data-theme="dark" className="md:col-span-2 lg:col-span-7 lg:row-span-2">
            <GlowCard className="flex min-h-[26rem] flex-col justify-end p-7 sm:p-9">
              <Image
                src="/images/photos/about.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="-z-20 object-cover opacity-55 transition-transform duration-1000 ease-out-soft group-hover/glow:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-20 bg-linear-to-t from-brand-deep via-brand-deep/90 to-brand-deep/35"
              />
              <span className="eyebrow text-led">Exclusive territory agent</span>
              <h3 className="mt-4 max-w-lg font-display text-[clamp(1.5rem,1rem+1.6vw,2.4rem)] leading-[1.08] font-bold text-fg uppercase">
                World-class industrial brands, represented in Pakistan
              </h3>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">
                Advisor Technologies acts as exclusive territory agent to a
                number of world-class industrial manufacturing brands for the
                Pakistan market.
              </p>
            </GlowCard>
          </div>

          <FactCard
            icon="shield"
            title="International after-sales standards"
            body="High quality brands backed by international standards of after-sales service, from installation through maintenance and spares."
          />
          <FactCard
            icon="office"
            title="Government of Pakistan supply contracts"
            body="We hold a number of supply contracts across Pakistan, notably with different projects of the Government of Pakistan."
            navy
          />

          {/* Counters */}
          {stats.map((stat, index) => (
            <DeckCard key={stat.label} className="lg:col-span-3" bodyClassName="p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-glow/12 text-accent ring-1 ring-glow/25">
                    <Icon name={statIcons[index]} className="size-4.5" />
                  </span>
                  <span className="font-display text-xs tracking-widest text-fg-subtle tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <CountUp
                  value={stat.value}
                  className="mt-8 block font-display text-[clamp(2.5rem,1.6rem+2vw,3.5rem)] leading-none font-bold tracking-tight text-fg tabular-nums"
                />
                <p className="mt-3 font-display text-sm font-semibold tracking-wide text-fg uppercase">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
                  {stat.detail}
                </p>
            </DeckCard>
          ))}

          {/* Sectors */}
          <div data-card className="deck-card flex flex-col gap-5 rounded-card p-6 sm:p-7 md:col-span-2 lg:col-span-12 lg:flex-row lg:items-center lg:justify-between">
              <span className="eyebrow shrink-0 text-accent">Sectors we serve</span>
              <ul className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <li
                    key={sector}
                    className="rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-fg-muted ring-1 ring-line transition-colors duration-300 hover:bg-bg-raised hover:text-fg hover:ring-glow/40"
                  >
                    {sector}
                  </li>
                ))}
              </ul>
          </div>
        </CardDeck>
      </Container>
    </Section>
  );
}

function FactCard({
  icon,
  title,
  body,
  navy = false,
}: {
  icon: IconName;
  title: string;
  body: string;
  navy?: boolean;
}) {
  return (
    <DeckCard
      tone={navy ? "navy" : "light"}
      className="lg:col-span-5"
      artClassName="h-28"
      art={
        <IconArt>
          <Icon name={icon} className="size-6" />
        </IconArt>
      }
    >
      <h3 className="font-display text-lg leading-tight font-bold text-fg uppercase">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{body}</p>
    </DeckCard>
  );
}
