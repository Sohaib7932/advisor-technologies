import type { Metadata } from "next";
import { HeroFacts, PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FloodCard } from "@/components/ui/flood-card";
import { clients, type IconName } from "@/lib/content";
import { ClientLogo } from "@/components/ui/client-logo";

export const metadata: Metadata = {
  title: "Our Clients",
  description:
    "Advisor Technologies serves federal ministries, authorities, utilities, law enforcement academies, NGOs and private enterprises across Islamabad, Rawalpindi and Karachi.",
};

/** Group the client list by sector so the page reads as a portfolio, not a list. */
const grouped = clients.reduce<Record<string, typeof clients>>(
  (accumulator, client) => {
    (accumulator[client.sector] ??= []).push(client);
    return accumulator;
  },
  {},
);

const sectorOrder = Object.keys(grouped).sort(
  (a, b) => grouped[b].length - grouped[a].length || a.localeCompare(b),
);

const reasons: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Procurement-ready",
    body: "Documentation, NTN and STN registration and pricing prepared to public-sector tender standards.",
    icon: "notebook",
  },
  {
    title: "Single point of contact",
    body: "Equipment, installation, civil works and after-sales service handled under one contract.",
    icon: "handshake",
  },
  {
    title: "Nationwide delivery",
    body: "Active supply contracts from Islamabad and Rawalpindi through to Karachi.",
    icon: "package",
  },
];

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients"
        title={
          <>
            Serving Pakistan&rsquo;s
            <span className="text-navy-400"> public institutions</span>
          </>
        }
        image="/images/security-accesscontrol.png"
        lead={`${clients.length} ministries, authorities, utilities, academies and enterprises rely on Advisor Technologies for supply, installation and maintenance.`}
        aside={
          <HeroFacts
            label="Our client base"
            facts={[
              { value: `${clients.length}+`, label: "Institutional clients" },
              {
                value: grouped["Federal Ministry"]?.length ?? 0,
                label: "Federal ministries",
              },
              { value: sectorOrder.length, label: "Sectors served" },
              { value: 2, label: "Cities of operation" },
            ]}
          />
        }
      />

      {/* Full list, grouped by sector */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="The full list"
            align="left"
            title={
              <>
                Institutions we have{" "}
                <span className="text-navy-500">supplied and served</span>
              </>
            }
            lead="A cross-section of federal ministries, civic authorities, law enforcement academies, utilities, welfare bodies and private enterprises."
          />

          <div className="mt-14 space-y-12">
            {sectorOrder.map((sector, sectorIndex) => (
              <div key={sector}>
                <Reveal className="flex items-center gap-4">
                  <h3 className="font-display text-lg font-semibold text-navy-900">
                    {sector}
                  </h3>
                  <span className="h-px flex-1 bg-linear-to-r from-navy-900/15 to-transparent" />
                  <span className="grid min-w-8 place-items-center rounded-full bg-navy-950 px-2 py-1 font-display text-xs font-semibold text-white tabular-nums">
                    {String(grouped[sector].length).padStart(2, "0")}
                  </span>
                </Reveal>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[sector].map((client, index) => {
                    return (
                      <Reveal
                        as="li"
                        key={client.name}
                        delay={Math.min(index * 50 + sectorIndex * 20, 300)}
                      >
                        <div className="group flex h-full items-center gap-4 rounded-2xl bg-surface p-4 shadow-soft ring-1 ring-navy-900/6 transition-[translate,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift">
                          <ClientLogo
                            client={client}
                            sizes="64px"
                            className="size-16 rounded-2xl shadow-soft transition-transform duration-500 ease-out-soft group-hover:scale-105"
                          />
                          <span className="min-w-0">
                            <span className="block text-[0.9375rem] leading-snug font-medium text-navy-900">
                              {client.name}
                            </span>
                            <span className="mt-1 block text-xs text-graphite-500">
                              {client.sector}
                            </span>
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why institutions choose us */}
      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Why institutions choose us"
            lead="Practical reasons we are a straightforward supplier to work with, from tender through to handover."
            title={
              <>
                Built for how{" "}
                <span className="text-navy-500">institutions buy</span>
              </>
            }
          />
          <ul className="mt-14 grid gap-3 md:grid-cols-3 lg:gap-4">
            {reasons.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 90}>
                <FloodCard
                  index={index}
                  icon={item.icon}
                  title={item.title}
                  body={item.body}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Cta
        title="Add your organisation to the list"
        body="We are registered, experienced with government procurement and ready to respond to your next tender or purchase order."
      />
    </>
  );
}
