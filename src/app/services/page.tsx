import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Process } from "@/components/home/process";
import { HeroDivisions } from "@/components/home/hero-divisions";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Check, Icon } from "@/components/ui/icons";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Supply and installation of plant & machinery and furniture, IT consultancy and network solutions, computing and office equipment, security and access control, printing, and repair & maintenance works across Pakistan.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Six divisions,
            <span className="text-navy-400"> one accountable partner</span>
          </>
        }
        image="/images/repair-maintenance.png"
        lead="From heavy plant and institutional furniture through to networks, surveillance, printing and civil works, delivered, installed and maintained by qualified engineers."
        aside={
          <div className="lg:flex lg:justify-end">
            <HeroDivisions />
          </div>
        }
      />

      {/* Detailed divisions, alternating sides */}
      <Section>
        <Container>
          <div className="space-y-20 md:space-y-28">
            {services.map((service, index) => {
              const flipped = index % 2 === 1;

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="grid scroll-mt-32 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16"
                >
                  <Reveal
                    className={cn(
                      "lg:col-span-6",
                      flipped ? "lg:order-2 lg:col-start-7" : "lg:col-start-1",
                    )}
                  >
                    <div className="group/visual relative isolate aspect-4/3 overflow-hidden rounded-panel bg-navy-950 shadow-lift">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="-z-10 object-cover transition-transform duration-700 ease-out-soft group-hover/visual:scale-105"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-navy-950/75 via-navy-950/10 to-navy-950/20"
                      />

                      <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between">
                        <span className="inline-flex h-14 w-10 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-sm">
                          <Icon name={service.icon} className="size-5" />
                        </span>
                        <span className="font-display text-sm font-semibold tracking-widest text-white/70 tabular-nums">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(services.length).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="pointer-events-none absolute bottom-6 left-6 rounded-full bg-white/12 px-4 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-white uppercase ring-1 ring-white/20 backdrop-blur-sm">
                        {service.short}
                      </span>
                    </div>
                  </Reveal>

                  <Reveal
                    delay={100}
                    className={cn(
                      "lg:col-span-5",
                      flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-8",
                    )}
                  >
                    <Eyebrow>Division {String(index + 1).padStart(2, "0")}</Eyebrow>
                    <h2 className="mt-5 text-headline text-ink">
                      {service.title}
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-graphite-600">
                      {service.body}
                    </p>

                    <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                      {service.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-3 rounded-2xl bg-surface p-3.5 text-sm font-medium text-navy-900 shadow-soft ring-1 ring-navy-900/6"
                        >
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-navy-950 text-white">
                            <Check className="size-3" />
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <Button
                      href={`/contact?requirement=${encodeURIComponent(service.title)}#enquiry`}
                      className="mt-9"
                      withArrow
                    >
                      Enquire about this
                    </Button>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <div className="bg-surface">
        <Process />
      </div>

      <Cta
        title="Tell us what you need supplied, installed or repaired"
        body="Share your specification, drawings or tender documents and our engineers will respond with a costed, documented proposal."
      />
    </>
  );
}
