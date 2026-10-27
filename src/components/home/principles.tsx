import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { CardDeck, DeckCard, IconArt } from "@/components/ui/card-deck";
import { Icon } from "@/components/ui/icons";
import { principles } from "@/lib/content";

/**
 * Objective and the four principles: the statement and a photo on the left,
 * the principles as a deck of cards on the right that opens once in view.
 */
export function Principles() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-title"
      data-tone="base"
      className="relative isolate py-16 md:py-24 xl:py-28"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>Objective &amp; principles</Eyebrow>
              <h2 id="principles-title" className="mt-5 text-headline font-bold text-fg uppercase">
                Complete solutions, <span className="text-accent">not just a delivery note</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted">
                Our objective is to serve customers in both the public and
                private sector, covering production, trade, banks, government
                institutions and NGOs, with everything from network design and
                hardware supply through to service and training.
              </p>
              <div className="relative mt-8 hidden aspect-16/10 overflow-hidden rounded-panel ring-1 ring-line lg:block">
                <Image
                  src="/images/photos/corridor.webp"
                  alt="A bright, modern office corridor"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <CardDeck as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
            {principles.map((principle, i) => (
              <DeckCard
                key={principle.title}
                as="li"
                tone={i === 1 ? "navy" : "light"}
                artClassName="h-28"
                art={
                  <IconArt>
                    <Icon name={principle.icon} className="size-6" />
                  </IconArt>
                }
              >
                <span className="font-display text-xs font-semibold tracking-[0.2em] text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-xl leading-none font-bold text-fg uppercase">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-snug text-fg">{principle.short}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
              </DeckCard>
            ))}
          </CardDeck>
        </div>
      </Container>
    </section>
  );
}
