import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";
import { processSteps, type IconName } from "@/lib/content";

/** One icon per stage, in the same order as `processSteps`. */
const stepIcons: IconName[] = ["handshake", "notebook", "package", "wrench"];

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

        <ol className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.step} delay={index * 90}>
              <div className="group relative isolate flex h-full flex-col overflow-hidden rounded-card bg-surface p-7 shadow-soft ring-1 ring-navy-900/6 transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift">
                {/* Wash that rises from the bottom on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-linear-to-t from-navy-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-full bg-navy-950 text-white shadow-soft transition-transform duration-500 ease-out-soft group-hover:-rotate-6">
                    <Icon name={stepIcons[index]} className="size-5" />
                  </span>
                  <span
                    aria-hidden
                    className="font-display text-6xl leading-none font-bold text-navy-900/5 transition-colors duration-500 group-hover:text-navy-600/15"
                  >
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">
                  {step.body}
                </p>

                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-navy-400 to-navy-700 transition-transform duration-700 ease-out-soft group-hover:scale-x-100"
                />
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
