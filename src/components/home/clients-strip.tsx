import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { ArrowUpRight } from "@/components/ui/icons";
import { clients } from "@/lib/content";

export function ClientsStrip() {
  // Duplicated once so the marquee can loop seamlessly at -50%.
  const track = [...clients, ...clients];

  return (
    <Section tone="surface" className="overflow-hidden py-16 md:py-20 lg:py-24">
      <Container>
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Valued clients</Eyebrow>
            <h2 className="mt-4 text-title font-semibold text-ink">
              Trusted by {clients.length}+ ministries, authorities and
              enterprises
            </h2>
          </div>
          <Link
            href="/clients"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800"
          >
            See the full list
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </Container>

      {/* Full-bleed marquee, faded at both edges */}
      <div className="relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)]">
        <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {track.map((client, index) => (
            <li
              key={`${client.name}-${index}`}
              aria-hidden={index >= clients.length}
              className="flex shrink-0 items-center gap-3 rounded-full bg-canvas px-6 py-3.5 ring-1 ring-navy-900/8"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-navy-400" />
              <span className="text-sm font-medium whitespace-nowrap text-navy-900">
                {client.name}
              </span>
              <span className="text-xs whitespace-nowrap text-graphite-400">
                {client.sector}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
