import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { ProductGrid } from "@/components/shared/product-grid";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { products } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Plant & machinery, computer systems, servers, networking, satellite communications, printing and multifunction devices, monitors, temporary office setups, web services and general order supplies.",
};

const assurances = [
  {
    title: "Branded, not generic",
    body: "We act as exclusive territory agents for world-class manufacturers, so what arrives is genuine and warranty-backed.",
  },
  {
    title: "Installed and commissioned",
    body: "Supply is only half the job. Our engineers fix, configure and hand over a working system.",
  },
  {
    title: "Supported after handover",
    body: "International standards of after-sales service, maintenance visits and spares availability.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product line"
        title={
          <>
            A catalogue built for
            <span className="text-navy-400"> procurement</span>
          </>
        }
        lead={`${products.length} categories spanning infrastructure, IT hardware, connectivity and general order supply, all available on a single purchase order.`}
      />

      <Section>
        <Container>
          <ProductGrid />
        </Container>
      </Section>

      {/* Assurances */}
      <Section tone="surface" className="py-16 md:py-20 lg:py-24">
        <Container>
          <Reveal>
            <Eyebrow>What comes with every order</Eyebrow>
          </Reveal>
          <ul className="mt-10 grid gap-3 md:grid-cols-3">
            {assurances.map((item, index) => (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 80}
                className="rounded-card bg-canvas p-7 ring-1 ring-navy-900/8"
              >
                <span
                  aria-hidden
                  className="font-display text-sm font-semibold tracking-widest text-navy-400"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Cta
        title="Need a quotation against a BOQ or tender?"
        body="Send the bill of quantities and we will price it line by line, with brand options and delivery timelines."
      />
    </>
  );
}
