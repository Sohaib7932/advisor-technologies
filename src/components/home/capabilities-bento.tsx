import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Icon } from "@/components/ui/icons";
import { serviceEffects } from "@/components/backgrounds/service-effects";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Bento grid of the six activity-scope divisions: one feature tile, one tall
 * tile and four supporting tiles on a 6-column desktop grid.
 */
const layout = [
  "md:col-span-4 md:row-span-2", // Plant & machinery, feature tile
  "md:col-span-2 md:row-span-2", // IT & networks, tall tile
  "md:col-span-2", // ─┐ each pair fills the 6-column row
  "md:col-span-4", // ─┘
  "md:col-span-4", // ─┐
  "md:col-span-2", // ─┘
];

export function CapabilitiesBento() {
  return (
    <Section id="capabilities" tone="surface">
      <Container>
        <SectionHeading
          eyebrow="Activity scope"
          lead="Six divisions under one contract, so a single purchase order can cover equipment, installation and the years of service that follow."
          title={
            <>
              Everything an institution needs to{" "}
              <span className="text-navy-500">equip, connect and maintain</span>{" "}
              its operations
            </>
          }
          action={
            <Button href="/services" variant="secondary" withArrow>
              View all services
            </Button>
          }
        />

        <div className="mt-14 grid gap-3 md:auto-rows-60 md:grid-cols-6 md:gap-4">
          {services.map((service, index) => {
            const isFeature = index === 0;
            const isTall = index === 1;
            const withImage = isFeature || isTall;
            const effect = serviceEffects[service.id];

            return (
              <Reveal
                key={service.id}
                delay={index * 70}
                className={cn(layout[index], "min-w-0")}
              >
                <Link
                  href={`/services#${service.id}`}
                  className={cn(
                    "group relative isolate flex h-full min-h-60 flex-col overflow-hidden rounded-card bg-navy-950 p-6 text-white shadow-soft transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift sm:p-7",
                    withImage
                      ? "justify-end"
                      : "justify-start gap-5 md:justify-between md:gap-0",
                  )}
                >
                  {withImage && (
                    <>
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
                        className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/45 to-navy-950/5"
                      />
                    </>
                  )}

                  {effect && (
                    <>
                      <div
                        aria-hidden
                        className={cn("absolute inset-0 -z-10", effect.surface)}
                      />
                      <div aria-hidden className="absolute inset-0 -z-10">
                        {effect.background}
                      </div>
                      {/* Scrim: keeps the copy legible over the brightest
                          frames without flattening the effect. */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-navy-950/85 via-navy-950/25 to-navy-950/10"
                      />
                    </>
                  )}

                  <span className="relative inline-flex h-16 w-11 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-navy-900">
                    <Icon name={service.icon} className="size-5" />
                  </span>

                  <div className={cn("relative", withImage && "mt-5")}>
                    <h3
                      className={cn(
                        "font-display font-semibold tracking-tight text-white",
                        isFeature ? "text-2xl sm:text-3xl" : "text-xl",
                      )}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={cn(
                        "mt-2.5 text-sm leading-relaxed text-white/70",
                        isFeature ? "max-w-md" : "max-w-xs",
                      )}
                    >
                      {isFeature || isTall ? service.body : service.short}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                      Explore
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
