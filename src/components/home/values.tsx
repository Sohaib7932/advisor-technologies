import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CardDeck, DeckCard, IconArt } from "@/components/ui/card-deck";
import { Icon } from "@/components/ui/icons";
import { values } from "@/lib/content";

/**
 * Core values: the page's one navy band. White cards deal out of a stack
 * when the band comes into view; hovering one sets its icon in motion.
 */
export function Values() {
  return (
    <section
      id="values"
      data-theme="dark"
      className="relative isolate overflow-hidden bg-brand-deep py-16 md:py-24 xl:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Core values"
          align="center"
          title={
            <>
              The standards we <span className="text-led">hold ourselves to</span>
            </>
          }
          lead="Four commitments that shape how every order, installation and service call is handled."
        />

        <CardDeck as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <DeckCard
              key={value.title}
              as="li"
              artClassName="h-28"
              art={
                <IconArt>
                  <Icon name={value.icon} className="size-6" />
                </IconArt>
              }
            >
              <span className="font-display text-xs font-semibold tracking-[0.2em] text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold tracking-wide text-fg uppercase">{value.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{value.blurb}</p>
            </DeckCard>
          ))}
        </CardDeck>
      </Container>
    </section>
  );
}
