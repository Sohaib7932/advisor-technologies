import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { Process } from "@/components/home/process";
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
        eyebrow="Activity scope"
        title={
          <>
            Six divisions,
            <span className="text-navy-400"> one accountable partner</span>
          </>
        }
        lead="From heavy plant and institutional furniture through to networks, surveillance, printing and civil works, delivered, installed and maintained by qualified engineers."
      />

      {/* Quick index */}
      <Container className="relative -mt-8 sm:-mt-10">
        <Reveal className="grid gap-2 rounded-panel bg-surface p-3 shadow-lift ring-1 ring-navy-900/8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors hover:bg-canvas"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy-600/10 text-navy-600 transition-colors group-hover:bg-navy-600 group-hover:text-white">
                <Icon name={service.icon} className="size-4.5" />
              </span>
              <span className="min-w-0 text-sm font-medium text-navy-900">
                {service.title}
              </span>
            </a>
          ))}
        </Reveal>
      </Container>

      {/* Detailed divisions, alternating sides */}
      <Section className="pt-16 md:pt-20 lg:pt-24">
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
                    <div className="relative aspect-4/3 overflow-hidden rounded-panel bg-navy-950">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent"
                      />
                      <span
                        aria-hidden
                        className="absolute top-5 left-5 font-display text-sm font-semibold tracking-widest text-white/60"
                      >
                        {String(index + 1).padStart(2, "0")}
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
                    <span className="flex size-12 items-center justify-center rounded-xl bg-navy-600 text-white">
                      <Icon name={service.icon} className="size-5.5" />
                    </span>
                    <Eyebrow className="mt-6">{service.short}</Eyebrow>
                    <h2 className="mt-4 text-title font-semibold text-ink">
                      {service.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-graphite-600">
                      {service.body}
                    </p>

                    <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                      {service.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-sm text-navy-900"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-navy-500" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <Button
                      href={`/contact?requirement=${encodeURIComponent(service.title)}#enquiry`}
                      variant="secondary"
                      className="mt-8"
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
