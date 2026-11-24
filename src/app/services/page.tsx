import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Process } from "@/components/home/process";
import { DIVISION_RENDER } from "@/components/home/activity-scope";
import { Render3D } from "@/components/three/render-3d";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Check, Icon } from "@/components/ui/icons";
import { clients, products, services } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Services",
  description:
    "Supply and installation of plant & machinery and furniture, IT consultancy and network solutions, computing and office equipment, security and access control, printing, and repair & maintenance works across Pakistan.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        render="banner-services"
        title={
          <>
            Six divisions, <Accent>one accountable partner</Accent>
          </>
        }
        lead="From heavy plant and institutional furniture through to networks, surveillance, printing and civil works, delivered, installed and maintained by qualified engineers."
        facts={[
          { value: services.length, label: "Divisions" },
          { value: `${products.length}+`, label: "Product categories" },
          { value: `${clients.length}+`, label: "Institutional clients" },
        ]}
      />

      {/* The divisions, alternating sides */}
      <Section>
        <Container>
          <div className="space-y-24 md:space-y-32">
            {services.map((service, index) => {
              const flipped = index % 2 === 1;
              return (
                <article key={service.id} id={service.id} className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
                  <Reveal className={cn("lg:col-span-6", flipped ? "lg:order-2 lg:col-start-7" : "lg:col-start-1")}>
                    <div data-tilt-host className="relative pb-10">
                      <div className="relative isolate aspect-4/3 overflow-hidden rounded-panel bg-navy shadow-card">
                        <Image src={service.image} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="-z-10 object-cover" />
                        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-navy/70 via-transparent to-transparent" />
                        <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-navy-950/70 py-1.5 pr-4 pl-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
                          <span className="grid size-7 place-items-center rounded-full bg-white text-navy">
                            <Icon name={service.icon} className="size-3.5" />
                          </span>
                          {service.short}
                        </span>
                      </div>
                      <Render3D
                        name={DIVISION_RENDER[service.id]}
                        sizes="(max-width: 1024px) 40vw, 18vw"
                        className={cn("absolute bottom-0 w-[38%] max-w-60 drop-shadow-[0_24px_30px_rgb(11_22_38/0.25)]", flipped ? "-left-4" : "-right-4")}
                      />
                    </div>
                  </Reveal>

                  <Reveal delay={100} className={cn("lg:col-span-5", flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
                    <Eyebrow>Division {String(index + 1).padStart(2, "0")}</Eyebrow>
                    <h2 className="mt-5 text-h2 text-navy">{service.title}</h2>
                    <p className="mt-6 text-lead text-text-2">{service.body}</p>
                    <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 rounded-[1.25rem] bg-mist p-3.5 text-sm font-medium text-navy ring-1 ring-line">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-navy text-sky">
                            <Check className="size-3" />
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <Button href={`/contact?requirement=${encodeURIComponent(service.title)}#enquiry`} className="mt-9">
                      Enquire about this
                    </Button>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Process />

      <Cta
        title="Tell us what you need supplied, installed or repaired"
        body="Share your specification, drawings or tender documents and our engineers will respond with a costed, documented proposal."
      />
    </>
  );
}
