import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <Section id="process">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          align="left"
          title={
            <>
              From first consultation to{" "}
              <span className="text-navy-500">long-term service</span>
            </>
          }
          lead="A predictable four-stage route that fits public-sector procurement as comfortably as a private purchase order."
        />

        <ol className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.step}
              delay={index * 80}
              className="group relative flex flex-col rounded-card bg-surface p-7 ring-1 ring-navy-900/6 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
            >
              <span
                aria-hidden
                className="font-display text-5xl leading-none font-bold text-navy-900/10 transition-colors duration-500 group-hover:text-navy-600/25"
              >
                {step.step}
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
