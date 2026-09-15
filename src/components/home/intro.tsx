import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { stats } from "@/lib/content";

export function Intro() {
  return (
    <Section className="pb-14 md:pb-16 lg:pb-20">
      <Container>
        {/* Label left, statement right: the opening beat of the page */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>Who we are</Eyebrow>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-graphite-600">
              Exclusive territory agents for world-class industrial
              manufacturing brands in the Pakistan market.
            </p>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-8">
            <p className="text-title font-display font-medium text-ink sm:text-[2rem] sm:leading-[1.18]">
              From federal ministries to private enterprise, we deliver branded
              machinery, IT infrastructure and general order supplies
              <span className="text-graphite-400">
                , installed, commissioned and maintained to international
                standards of after-sales service.
              </span>
            </p>
          </Reveal>
        </div>

        {/* Figures */}
        <div className="mt-16 grid gap-x-8 gap-y-10 border-t border-navy-900/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70}>
              <p className="font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-bold tracking-tight text-navy-800">
                {stat.value}
              </p>
              <p className="mt-3 font-display text-base font-semibold text-ink">
                {stat.label}
              </p>
              <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-graphite-500">
                {stat.detail}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
