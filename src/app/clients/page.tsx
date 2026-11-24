import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FloodCard } from "@/components/ui/flood-card";
import { clients, type IconName } from "@/lib/content";
import { ClientLogo } from "@/components/ui/client-logo";

export const metadata: Metadata = {
  alternates: { canonical: "/clients" },
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
        render="banner-clients"
        title={
          <>
            Serving Pakistan&rsquo;s <Accent>public institutions</Accent>
          </>
        }
        lead={`${clients.length} ministries, authorities, utilities, academies and enterprises rely on Advisor Technologies for supply, installation and maintenance.`}
        facts={[
          { value: `${clients.length}+`, label: "Institutional clients" },
          { value: grouped["Federal Ministry"]?.length ?? 0, label: "Federal ministries" },
          { value: sectorOrder.length, label: "Sectors served" },
        ]}
      />

      {/* Full list, grouped by sector */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="The full list"
            align="left"
            title={
              <>
                Institutions we have <Accent>supplied and served</Accent>
              </>
            }
            lead="A cross-section of federal ministries, civic authorities, law enforcement academies, utilities, welfare bodies and private enterprises."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {sectorOrder.map((sector, sectorIndex) => (
              <div key={sector} className="rounded-card bg-mist p-5 sm:p-7">
                <Reveal className="flex items-center gap-4">
                  <h3 className="text-h4 text-navy">{sector}</h3>
                  <span className="h-px flex-1 bg-steel/15" />
                  <span className="grid min-w-8 place-items-center rounded-full bg-navy px-2 py-1 font-display text-xs font-semibold text-white tabular-nums">
                    {String(grouped[sector].length).padStart(2, "0")}
                  </span>
                </Reveal>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {grouped[sector].map((client, index) => {
                    return (
                      <Reveal
                        as="li"
                        key={client.name}
                        delay={Math.min(index * 50 + sectorIndex * 20, 300)}
                      >
                        <div className="group flex h-full items-center gap-4 rounded-[1.25rem] bg-white p-3.5 ring-1 ring-line transition-[translate] duration-500 ease-out-expo hover:-translate-y-0.5 lift">
                          <ClientLogo
                            client={client}
                            sizes="64px"
                            className="size-14 rounded-2xl ring-1 ring-line transition-transform duration-500 ease-out-expo group-hover:-rotate-6"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm leading-snug font-semibold text-navy">
                              {client.name}
                            </span>
                            <span className="mt-1 block text-xs text-text-3">
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
      <Section tone="ice">
        <Container>
          <SectionHeading
            eyebrow="Why institutions choose us"
            lead="Practical reasons we are a straightforward supplier to work with, from tender through to handover."
            title={
              <>
                Built for how <Accent>institutions buy</Accent>
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
