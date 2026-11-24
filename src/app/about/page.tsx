import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Values } from "@/components/home/values";
import { Principles } from "@/components/home/principles";
import { Container, Section } from "@/components/ui/container";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";
import { aboutParagraphs, sectors, stats } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "Advisor Technologies is an Islamabad-based exclusive territory agent for world-class industrial manufacturing brands, serving government and private-sector clients across Pakistan.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        render="banner-about"
        title={
          <>
            A recognised name for <Accent>quality and reliability</Accent> in Pakistan
          </>
        }
        lead="Exclusive territory agents to a number of world-class industrial manufacturing brands, focused on delivering high quality brands alongside international standards of after-sales service."
        facts={stats.map((stat) => ({ value: stat.value, label: stat.label }))}
      />

      {/* Story */}
      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              {/* Layered photographs with a floating credential */}
              <div className="relative pr-10 pb-14 sm:pr-16 sm:pb-20">
                <div className="relative aspect-4/5 overflow-hidden rounded-panel shadow-card">
                  <Image
                    src="/images/photos/about.webp"
                    alt="A bright, modern office interior"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute right-0 bottom-0 w-[52%] overflow-hidden rounded-card shadow-card ring-6 ring-white">
                  <div className="relative aspect-4/3">
                    <Image
                      src="/images/photos/it-networks.webp"
                      alt="Network cabling in a server rack"
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute top-6 -left-2 flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3 shadow-card ring-1 ring-line sm:-left-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-navy text-sky">
                    <Icon name="shield" className="size-5" />
                  </span>
                  <span className="text-sm leading-tight font-semibold text-navy">
                    Exclusive territory
                    <span className="block text-xs font-medium text-text-3">agents in Pakistan</span>
                  </span>
                </div>
              </div>

              {/* Registration */}
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "NTN", value: site.registration.ntn },
                  { label: "STN", value: site.registration.stn },
                ].map((item) => (
                  <div key={item.label} className="min-w-0 rounded-[1.25rem] bg-navy p-4 sm:p-5">
                    <dt className="text-xs font-semibold tracking-[0.08em] text-[#9fb1c5] uppercase">{item.label}</dt>
                    <dd className="mt-2 font-display text-[0.9375rem] font-semibold break-all text-white tabular-nums sm:text-lg">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <Eyebrow>Our story</Eyebrow>
                <h2 className="mt-5 text-h2 text-fg">
                  Built to serve industry <Accent>across the Pakistan market</Accent>
                </h2>
              </Reveal>
              <div className="mt-8 space-y-6">
                {aboutParagraphs.map((paragraph, index) => (
                  <Reveal key={index} delay={index * 70}>
                    <p className={cn("leading-relaxed", index === 0 ? "text-lg font-medium text-navy" : "text-base text-text-2")}>{paragraph}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={240} className="mt-10">
                <Eyebrow>Sectors served</Eyebrow>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <li key={sector} className="rounded-full bg-mist px-4 py-2 text-sm font-medium text-navy ring-1 ring-line">
                      {sector}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Values tone="mist" />
      <Principles />

      <Cta
        title="Let's talk about your requirement"
        body="Whether it is a single purchase order or a multi-site rollout, our team will scope it, price it and stand behind it."
      />
    </>
  );
}
