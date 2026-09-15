import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { clients } from "@/lib/content";

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

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Valued clients"
        title={
          <>
            Serving Pakistan&rsquo;s
            <span className="text-navy-400"> public institutions</span>
          </>
        }
        lead={`${clients.length} ministries, authorities, utilities, academies and enterprises rely on Advisor Technologies for supply, installation and maintenance.`}
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
                  <span className="h-px flex-1 bg-navy-900/10" />
                  <span className="text-sm tabular-nums text-graphite-400">
                    {String(grouped[sector].length).padStart(2, "0")}
                  </span>
                </Reveal>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[sector].map((client, index) => (
                    <Reveal
                      as="li"
                      key={client.name}
                      delay={Math.min(index * 50 + sectorIndex * 20, 300)}
                      className="group flex items-center gap-3.5 rounded-2xl bg-surface p-5 ring-1 ring-navy-900/6 transition-all duration-400 ease-out-soft hover:-translate-y-0.5 hover:shadow-soft hover:ring-navy-900/15"
                    >
                      <span
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-600/10 font-display text-sm font-bold text-navy-700 transition-colors duration-300 group-hover:bg-navy-600 group-hover:text-white"
                      >
                        {initials(client.name)}
                      </span>
                      <span className="min-w-0 text-[0.9375rem] leading-snug font-medium text-navy-900">
                        {client.name}
                      </span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why institutions choose us */}
      <Section tone="dark" className="py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow tone="light">Why institutions choose us</Eyebrow>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
              {[
                {
                  title: "Procurement-ready",
                  body: "Documentation, NTN and STN registration and pricing prepared to public-sector tender standards.",
                },
                {
                  title: "Single point of contact",
                  body: "Equipment, installation, civil works and after-sales service handled under one contract.",
                },
                {
                  title: "Nationwide delivery",
                  body: "Active supply contracts from Islamabad and Rawalpindi through to Karachi.",
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 90}>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-300">
                    {item.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Cta
        title="Add your organisation to the list"
        body="We are registered, experienced with government procurement and ready to respond to your next tender or purchase order."
      />
    </>
  );
}

/** Two-letter monogram used in place of a client logo. */
function initials(name: string) {
  const words = name
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !/^(the|and|of|for)$/i.test(word));
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}
