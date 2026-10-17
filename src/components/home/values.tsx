import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup } from "@/components/ui/reveal-group";
import { GlowCard } from "@/components/ui/glow-card";
import { Icon } from "@/components/ui/icons";
import { values } from "@/lib/content";

/** Core values as glowing icon cards. */
export function Values() {
  return (
    <Section id="values" tone="navy">
      <Container>
        <SectionHeading
          eyebrow="Core values"
          align="center"
          title={
            <>
              The standards we <span className="text-glow">hold ourselves to</span>
            </>
          }
          lead="Four commitments that shape how every order, installation and service call is handled."
        />

        <RevealGroup as="ul" className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {values.map((value, index) => (
            <li key={value.title} data-reveal className="motion-hide">
              <GlowCard className="flex flex-col p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  {/* Icon with a halo that blooms on hover */}
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-brand text-fg ring-1 ring-glow/30 transition-shadow duration-500 group-hover/glow:shadow-glow">
                    <Icon name={value.icon} className="size-6" />
                  </span>
                  <span className="font-display text-5xl leading-none font-bold text-white/6 transition-colors duration-500 group-hover/glow:text-glow/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-10 font-display text-xl font-bold tracking-wide text-fg uppercase">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {value.blurb}
                </p>
              </GlowCard>
            </li>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
