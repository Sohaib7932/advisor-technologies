import type { Metadata } from "next";
import Image from "next/image";
import { HeroFacts, PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { PrincipleCard } from "@/components/home/principle-card";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FloodCard } from "@/components/ui/flood-card";
import { Icon } from "@/components/ui/icons";
import {
  aboutParagraphs,
  objectiveParagraphs,
  principles,
  sectors,
  stats,
  values,
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
            <span className="text-navy-400">quality and reliability</span> in
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
                <div className="absolute top-6 -left-2 flex items-center gap-3 rounded-2xl bg-white/90 py-3 pr-5 pl-3 shadow-lift ring-1 ring-navy-900/8 backdrop-blur-md sm:-left-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-navy-950 text-white">
                    <Icon name="shield" className="size-5" />
                  </span>
                  <span className="text-sm leading-tight font-semibold text-navy-900">
                    Exclusive territory
                    <span className="block text-xs font-medium text-graphite-500">
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
                    <dt className="eyebrow text-navy-300">{item.label}</dt>
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
                <h2 className="mt-5 text-headline text-ink">
                  Built to serve industry
                  <span className="block text-navy-500">
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
                          ? "text-lg font-medium text-navy-900"
                          : "text-base text-graphite-600",
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
                      className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-navy-800 shadow-soft ring-1 ring-navy-900/8 transition-colors duration-300 hover:bg-navy-950 hover:text-white"
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

      {/* Objective & principles */}
      <Section
        id="principles"
        tone="dark"
        className="relative isolate overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_30%,rgb(42_68_104/0.55),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(35%_45%_at_0%_100%,rgb(31_107_255/0.16),transparent_70%)]"
        />
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow tone="light">Objective</Eyebrow>
              <h2 className="mt-5 text-headline text-white">
                Complete solutions,
                <span className="block text-navy-400">end to end</span>
              </h2>
              <div className="mt-8 space-y-5">
                {objectiveParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={cn(
                      "leading-relaxed",
                      index === 0
                        ? "text-lg text-navy-100"
                        : "text-base text-navy-300",
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {principles.map((principle, index) => (
                <Reveal as="li" key={principle.title} delay={index * 90}>
                  <PrincipleCard
                    index={index}
                    title={principle.title}
                    body={principle.body}
                    icon={principle.icon}
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section id="values" tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Our values"
            lead="Four commitments that shape how every order, installation and service call is handled."
            title={
              <>
                The standards we hold
                <span className="text-navy-500"> ourselves to</span>
              </>
            }
          />

          <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 80}>
                <FloodCard
                  index={index}
                  icon={value.icon}
                  title={value.title}
                  body={value.blurb}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Cta
        title="Let's talk about your requirement"
        body="Whether it is a single purchase order or a multi-site rollout, our team will scope it, price it and stand behind it."
      />
    </>
  );
}
