import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { Icon } from "@/components/ui/icons";
import { ScrollHighlight } from "@/components/ui/scroll-highlight";
import { stats, type IconName } from "@/lib/content";
import { cn } from "@/lib/utils";

/** One icon per figure, in the same order as `stats`. */
const statIcons: IconName[] = ["handshake", "machinery", "package", "office"];

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
            <Button
              href="/about"
              variant="secondary"
              withArrow
              className="mt-7"
            >
              More about us
            </Button>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-8">
            <ScrollHighlight
              className="font-display text-[clamp(1.375rem,0.9rem+1.3vw,2.125rem)] leading-[1.2] font-medium"
              segments={[
                {
                  text: "From federal ministries to private enterprise, we deliver branded machinery, IT infrastructure and general order supplies,",
                  litClass: "data-lit:text-ink",
                },
                {
                  text: " installed, commissioned and maintained to international standards of after-sales service.",
                  litClass: "data-lit:text-navy-500",
                },
              ]}
            />
          </Reveal>
        </div>

        {/* Figures */}
        <ul className="mt-16 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat, index) => {
            const featured = index === 0;

            return (
              <Reveal as="li" key={stat.label} delay={index * 90}>
                <div
                  className={cn(
                    "group relative isolate flex h-full flex-col overflow-hidden rounded-card p-6 transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 sm:p-7",
                    featured
                      ? "bg-navy-950 text-white shadow-lift hover:shadow-float"
                      : "bg-surface shadow-soft ring-1 ring-navy-900/6 hover:shadow-lift",
                  )}
                >
                  {featured && (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_100%_0%,rgb(31_107_255/0.45),transparent_65%)]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_75%)] bg-size-[18px_18px] opacity-15"
                      />
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-12 w-9 items-center justify-center rounded-full ring-1 transition-transform duration-500 ease-out-soft group-hover:-rotate-6",
                        featured
                          ? "bg-white/10 text-white ring-white/20"
                          : "bg-navy-600/8 text-navy-700 ring-navy-900/8",
                      )}
                    >
                      <Icon name={statIcons[index]} className="size-4.5" />
                    </span>
                    <span
                      className={cn(
                        "font-display text-xs font-medium tracking-widest tabular-nums",
                        featured ? "text-navy-300" : "text-graphite-400",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <CountUp
                    value={stat.value}
                    className={cn(
                      "mt-8 block font-display text-[clamp(2.5rem,1rem+3vw,4rem)] leading-none font-bold tracking-tight tabular-nums",
                      featured ? "text-white" : "text-navy-800",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-4 font-display text-base font-semibold",
                      featured ? "text-white" : "text-ink",
                    )}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed",
                      featured ? "text-navy-200" : "text-graphite-500",
                    )}
                  >
                    {stat.detail}
                  </p>

                  {/* Accent rule that draws across on hover */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-out-soft group-hover:scale-x-100",
                      featured
                        ? "bg-linear-to-r from-sky-300 to-white"
                        : "bg-linear-to-r from-navy-400 to-navy-700",
                    )}
                  />
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
