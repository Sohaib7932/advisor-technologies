import type { Metadata } from "next";
import Image from "next/image";
import { HeroFacts, PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Values } from "@/components/home/values";
import { Principles } from "@/components/home/principles";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";
import {
  aboutParagraphs,
  sectors,
  stats,
} from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Advisor Technologies is an Islamabad-based exclusive territory agent for world-class industrial manufacturing brands, serving government and private-sector clients across Pakistan.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            A recognised name for{" "}
            <span className="text-glow">quality and reliability</span> in
            Pakistan
          </>
        }
        lead="Exclusive territory agents to a number of world-class industrial manufacturing brands, focused on delivering high quality brands alongside international standards of after-sales service."
        aside={
          <HeroFacts
            label="At a glance"
            facts={stats.map((stat) => ({ value: stat.value, label: stat.label }))}
          />
        }
      />

      {/* Story */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              {/* Layered photographs: the plant floor, with the network room
                  inset over its corner and a floating credential. */}
              <div className="relative pr-10 pb-14 sm:pr-16 sm:pb-20">
                <div className="group/photo relative aspect-4/5 overflow-hidden rounded-panel shadow-lift">
                  <Image
                    src="/images/plant-machinery-furniture.png"
                    alt="Plant, machinery and office furniture supplied by Advisor Technologies"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover/photo:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-navy-950/60 via-transparent to-transparent"
                  />
                </div>
                <div className="absolute right-0 bottom-0 w-[52%] overflow-hidden rounded-card shadow-float ring-6 ring-canvas">
                  <div className="relative aspect-4/3">
                    <Image
                      src="/images/it-consultancy.png"
                      alt="Network and server installation"
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute top-6 -left-2 flex items-center gap-3 glass rounded-2xl py-3 pr-5 pl-3 shadow-float ring-1 ring-glow/30 sm:-left-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-glow text-bg">
                    <Icon name="shield" className="size-5" />
                  </span>
                  <span className="text-sm leading-tight font-semibold text-fg">
                    Exclusive territory
                    <span className="block text-xs font-medium text-fg-subtle">
                      agents in Pakistan
                    </span>
                  </span>
                </div>
              </div>

              {/* Registration details */}
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "NTN", value: site.registration.ntn },
                  { label: "STN", value: site.registration.stn },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-2xl bg-navy-950 p-4 text-white shadow-soft sm:p-5"
                  >
                    <dt className="eyebrow text-fg-subtle">{item.label}</dt>
                    <dd className="mt-2 font-display text-[0.9375rem] font-semibold break-all tabular-nums sm:text-lg">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <Eyebrow>Our story</Eyebrow>
                <h2 className="mt-5 text-headline font-bold text-fg uppercase">
                  Built to serve industry
                  <span className="block text-glow">
                    across the Pakistan market
                  </span>
                </h2>
              </Reveal>

              <div className="mt-8 space-y-6">
                {aboutParagraphs.map((paragraph, index) => (
                  <Reveal key={index} delay={index * 70}>
                    <p
                      className={cn(
                        "leading-relaxed",
                        index === 0
                          ? "text-lg font-medium text-fg"
                          : "text-base text-fg-muted",
                      )}
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={240} className="mt-10">
                <Eyebrow>Sectors served</Eyebrow>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <li
                      key={sector}
                      className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-fg shadow-soft ring-1 ring-white/10 transition-colors duration-300 hover:bg-navy-950 hover:text-white"
                    >
                      {sector}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Values />
      <Principles />

      <Cta
        title="Let's talk about your requirement"
        body="Whether it is a single purchase order or a multi-site rollout, our team will scope it, price it and stand behind it."
      />
    </>
  );
}
