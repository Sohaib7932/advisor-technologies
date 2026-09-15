import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";
import {
  aboutParagraphs,
  objectiveParagraphs,
  principles,
  sectors,
  values,
} from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Advisor Technologies is an Islamabad-based exclusive territory agent for world-class industrial manufacturing brands, serving government and private-sector clients across Pakistan.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow="About us"
        image="/images/team.svg"
        title={
          <>
            A recognised name for{" "}
            <span className="text-navy-400">quality and reliability</span> in
            Pakistan
          </>
        }
        lead="Exclusive territory agents to a number of world-class industrial manufacturing brands, focused on delivering high quality brands alongside international standards of after-sales service."
      />

      {/* Story */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="relative aspect-4/5 overflow-hidden rounded-panel">
                <Image
                  src="/images/about.svg"
                  alt="The Advisor Technologies team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Registration details */}
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface p-5 ring-1 ring-navy-900/8">
                  <dt className="eyebrow text-graphite-400">NTN</dt>
                  <dd className="mt-2 font-display text-lg font-semibold text-navy-900">
                    {site.registration.ntn}
                  </dd>
                </div>
                <div className="rounded-2xl bg-surface p-5 ring-1 ring-navy-900/8">
                  <dt className="eyebrow text-graphite-400">STN</dt>
                  <dd className="mt-2 font-display text-lg font-semibold text-navy-900">
                    {site.registration.stn}
                  </dd>
                </div>
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
                    <p className="text-base leading-relaxed text-graphite-600">
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
                      className="rounded-full bg-navy-900/5 px-4 py-2 text-sm font-medium text-navy-800 ring-1 ring-navy-900/8"
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
              <Reveal
                as="li"
                key={value.title}
                delay={index * 80}
                className="group relative overflow-hidden rounded-card bg-canvas p-7 ring-1 ring-navy-900/8 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:bg-navy-950 hover:shadow-lift"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-navy-600/10 text-navy-600 transition-colors duration-500 group-hover:bg-white/12 group-hover:text-white">
                  <Icon name={value.icon} className="size-5.5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-white">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-graphite-600 transition-colors duration-500 group-hover:text-navy-200">
                  {value.blurb}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Objective & principles */}
      <Section id="principles">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow>Objective</Eyebrow>
                <h2 className="mt-5 text-headline text-ink">
                  Complete solutions,
                  <span className="block text-navy-500">end to end</span>
                </h2>
                <div className="mt-8 space-y-5">
                  {objectiveParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-relaxed text-graphite-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              {principles.map((principle, index) => (
                <Reveal
                  as="li"
                  key={principle.title}
                  delay={index * 80}
                  className="flex flex-col rounded-card bg-surface p-7 shadow-soft ring-1 ring-navy-900/6"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-navy-600 text-white">
                    <Icon name={principle.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">
                    {principle.body}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Cta
        title="Let's talk about your requirement"
        body="Whether it is a single purchase order or a multi-site rollout, our team will scope it, price it and stand behind it."
      />
    </>
  );
}
