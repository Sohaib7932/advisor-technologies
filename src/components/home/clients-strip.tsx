import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { ArrowUpRight } from "@/components/ui/icons";
import { clients, type Client } from "@/lib/content";
import { ClientLogo } from "@/components/ui/client-logo";
import { cn } from "@/lib/utils";

/** Figures derived from the client list itself, never typed in by hand. */
const stats = [
  { value: `${clients.length}+`, label: "Institutional clients" },
  {
    value: `${clients.filter((client) => client.sector === "Federal Ministry").length}`,
    label: "Federal ministries",
  },
  {
    value: `${new Set(clients.map((client) => client.sector)).size}`,
    label: "Sectors served",
  },
];

function ClientCard({ client }: { client: Client }) {
  return (
    <>
      <ClientLogo
        client={client}
        sizes="48px"
        className="size-12 rounded-xl shadow-soft transition-transform duration-500 ease-out-soft group-hover/client:-rotate-6"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold whitespace-nowrap text-navy-900">
          {client.name}
        </span>
        <span className="mt-0.5 block text-xs whitespace-nowrap text-graphite-500">
          {client.sector}
        </span>
      </span>
    </>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Client[];
  reverse?: boolean;
}) {
  // Duplicated once so the marquee can loop seamlessly at -50%.
  const track = [...items, ...items];

  return (
    <ul
      className={cn(
        "flex w-max gap-3 hover:[animation-play-state:paused]",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
      )}
    >
      {track.map((client, index) => (
        <li
          key={`${client.name}-${index}`}
          aria-hidden={index >= items.length || undefined}
          className="group/client flex shrink-0 items-center gap-3.5 rounded-2xl bg-canvas py-3 pr-6 pl-3 ring-1 ring-navy-900/6 transition-[background-color,box-shadow,translate] duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-surface hover:shadow-lift hover:ring-navy-900/12"
        >
          <ClientCard client={client} />
        </li>
      ))}
    </ul>
  );
}

export function ClientsStrip() {
  const half = Math.ceil(clients.length / 2);

  return (
    <Section
      tone="surface"
      className="relative isolate overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Faint dot grid, fading out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-navy-900)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-size-[22px_22px] opacity-[0.07]"
      />

      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Valued clients</Eyebrow>
            <h2 className="mt-5 text-headline text-ink">
              Trusted by {clients.length}+ ministries, authorities and{" "}
              <span className="text-navy-500">enterprises across Pakistan</span>
            </h2>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-5">
            <dl className="grid grid-cols-3 divide-x divide-navy-900/10 rounded-2xl bg-canvas py-5 ring-1 ring-navy-900/6">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 text-center sm:px-5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold tracking-tight text-navy-900 tabular-nums sm:text-4xl">
                    {stat.value}
                  </dd>
                  <dd className="mt-1.5 text-[0.6875rem] leading-snug font-medium tracking-wide text-graphite-500 uppercase">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/clients"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800"
            >
              See the full client list
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </Container>

      {/* Two full-bleed rows drifting in opposite directions, faded at both edges */}
      <Reveal
        delay={180}
        className="mt-14 flex flex-col gap-3 mask-[linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)] sm:mask-[linear-gradient(to_right,transparent,black_8rem,black_calc(100%-8rem),transparent)]"
      >
        <MarqueeRow items={clients.slice(0, half)} />
        <MarqueeRow items={clients.slice(half)} reverse />
      </Reveal>
    </Section>
  );
}
