import { Container, Section, type SectionTone } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { CardDeck, DeckCard, IconArt } from "@/components/ui/card-deck";
import { Icon } from "@/components/ui/icons";
import { objectiveParagraphs, principles } from "@/lib/content";

const TONES = ["navy", "light", "ice", "light"] as const;

/** Objective and the four principles as a 2x2 bento that opens on enter. */
export function Principles({ id = "principles", tone = "white" }: { id?: string; tone?: SectionTone }) {
  return (
    <Section id={id} tone={tone} aria-labelledby={`${id}-title`}>
      <Container>
        <SectionHeading
          id={`${id}-title`}
          eyebrow="Objective & principles"
          title={
            <>
              Complete solutions, <Accent>not just a delivery note</Accent>
            </>
          }
          lead={objectiveParagraphs[1]}
        />
        <CardDeck as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:gap-5">
          {principles.map((principle, i) => (
            <DeckCard
              key={principle.title}
              as="li"
              tone={TONES[i]}
              className="md:flex-row"
              artClassName="h-24 sm:h-32 md:h-auto md:w-44 md:shrink-0 md:[&_[data-illus]]:items-center md:[&_[data-illus]]:pt-0"
              bodyClassName="md:py-8 md:pl-0"
              art={
                <IconArt>
                  <Icon name={principle.icon} className="size-6" />
                </IconArt>
              }
            >
              <span className="font-display text-xs font-semibold text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-h3 text-fg">{principle.title}</h3>
              <p className="mt-3 text-[0.9375rem] font-semibold leading-snug text-fg">{principle.short}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
            </DeckCard>
          ))}
        </CardDeck>
      </Container>
    </Section>
  );
}
