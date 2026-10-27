import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { CardDeck, DeckCard } from "@/components/ui/card-deck";
import { ArrowUpRight } from "@/components/ui/icons";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

/** The studio product that stands in for each division on its card. */
const ILLUSTRATION: Record<string, string> = {
  "plant-machinery": "chair",
  "it-networks": "rack",
  computing: "laptop",
  "security-systems": "cctv",
  printing: "printer",
  maintenance: "gear",
};

/** Bento spans on the 12-column desktop grid, with two navy cards set diagonally. */
const SPAN = [
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-5",
];
const NAVY = new Set([1, 4]);

/**
 * The six divisions as a dealt-out deck of cards: they rest tucked together
 * and open once when the section comes into view, while the numbered
 * progress line above draws across. Hovering a card lifts its product.
 */
export function ActivityScope() {
  return (
    <section
      id="activity-scope"
      aria-labelledby="activity-scope-title"
      data-tone="steel"
      className="relative isolate overflow-hidden py-16 md:py-24"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Activity scope</Eyebrow>
            <h2 id="activity-scope-title" className="mt-5 text-headline font-bold text-fg uppercase">
              Six divisions, <span className="text-accent">one contract</span>
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted lg:col-span-5 lg:justify-self-end">
            A single purchase order can cover equipment, installation and the
            years of service that follow.
          </p>
        </div>

        <CardDeck className="mt-10 md:mt-12">
          {/* Progress line: one tick per division, drawn as the deck opens */}
          <div aria-hidden className="relative mb-6 hidden md:block">
            <div className="absolute top-1/2 right-0 left-0 h-px bg-line" />
            <div data-progress className="absolute top-1/2 right-0 left-0 h-px bg-accent" />
            <ol className="relative flex justify-between">
              {services.map((service, i) => (
                <li
                  key={service.id}
                  className="grid size-7 place-items-center rounded-full bg-white font-display text-[0.6875rem] font-bold text-accent tabular-nums ring-1 ring-line"
                >
                  {String(i + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
            {services.map((service, i) => {
              const navy = NAVY.has(i);
              return (
                <DeckCard
                  key={service.id}
                  as="li"
                  tone={navy ? "navy" : "light"}
                  className={SPAN[i]}
                  illustration={`/images/illustrations/${ILLUSTRATION[service.id]}.webp`}
                >
                  <span className="text-xs font-medium text-fg-subtle">
                    <span className={cn("font-display font-bold tabular-nums", navy ? "text-led" : "text-accent")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden> · </span>
                    {service.short}
                  </span>
                  <h3 className="mt-2.5 font-display text-lg leading-tight font-bold text-fg uppercase">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-fg-muted">{service.body}</p>
                  <Link
                    href={`/services#${service.id}`}
                    className={cn(
                      "mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold after:absolute after:inset-0 after:rounded-card",
                      navy ? "text-white" : "text-accent",
                    )}
                  >
                    Explore this division
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                  </Link>
                </DeckCard>
              );
            })}
          </ul>
        </CardDeck>
      </Container>
    </section>
  );
}
