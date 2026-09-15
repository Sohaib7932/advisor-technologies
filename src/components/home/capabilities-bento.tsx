import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Icon } from "@/components/ui/icons";
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

            return (
              <Reveal
                key={service.id}
                delay={index * 60}
                className={cn(layout[index], "min-w-0")}
              >
                <Link
                  href={`/services#${service.id}`}
                  className={cn(
                    "group relative flex h-full min-h-60 flex-col overflow-hidden rounded-card p-6 transition-all duration-500 ease-out-soft hover:-translate-y-1 sm:p-7",
                    withImage
                      ? "justify-end"
                      : "justify-start gap-5 md:justify-between md:gap-0",
                    withImage
                      ? "bg-navy-950 text-white shadow-soft hover:shadow-lift"
                      : "bg-canvas ring-1 ring-navy-900/8 hover:bg-navy-50 hover:ring-navy-900/15",
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

                  <span
                    className={cn(
                      "relative inline-flex h-16 w-11 items-center justify-center rounded-full transition-colors duration-300",
                      withImage
                        ? "bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-sm"
                        : "bg-navy-600/10 text-navy-600 group-hover:bg-navy-600 group-hover:text-white",
                    )}
                  >
                    <Icon name={service.icon} className="size-5" />
                  </span>

                  <div className={cn("relative", withImage && "mt-5")}>
                    <h3
                      className={cn(
                        "font-display font-semibold tracking-tight",
                        isFeature ? "text-2xl sm:text-3xl" : "text-xl",
                        withImage ? "text-white" : "text-ink",
                      )}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={cn(
                        "mt-2.5 text-sm leading-relaxed",
                        isFeature ? "max-w-md" : "max-w-xs",
                        withImage ? "text-white/70" : "text-graphite-600",
                      )}
                    >
                      {isFeature || isTall ? service.body : service.short}
                    </p>

                    <span
                      className={cn(
                        "mt-5 inline-flex items-center gap-1.5 text-sm font-medium",
                        withImage ? "text-white" : "text-navy-600",
                      )}
                    >
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
