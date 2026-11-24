import { Container, Section, type SectionTone } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { CardDeck } from "@/components/ui/card-deck";
import { DeckCard, IconArt } from "@/components/ui/deck-card";
import { Icon } from "@/components/ui/icons";
import { values } from "@/lib/content";

const TONES = ["light", "navy", "light", "ice"] as const;

/**
 * Core values: four cards that rest as a tucked stack and fan out once when
 * the section comes into view. On hover each card lifts and its icon moves.
 */
export function Values({ id = "values", tone = "white" }: { id?: string; tone?: SectionTone }) {
  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeading
          eyebrow="Core values"
          align="center"
          title={
            <>
              The standards we <Accent>hold ourselves to</Accent>
            </>
          }
          lead="Four commitments that shape how every order, installation and service call is handled."
        />
        <CardDeck as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {values.map((value, i) => (
            <DeckCard
              key={value.title}
              as="li"
              tone={TONES[i]}
              artClassName="h-24 sm:h-32"
              art={
                <IconArt>
                  <Icon name={value.icon} className="size-6" />
                </IconArt>
              }
            >
              <span className="font-display text-xs font-semibold text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-h4 text-fg">{value.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{value.blurb}</p>
            </DeckCard>
          ))}
        </CardDeck>
      </Container>
    </Section>
  );
}
