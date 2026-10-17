import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { GhostFibersBackground } from "@/components/backgrounds/lazy-backgrounds";
import { palette } from "@/components/backgrounds/palette";

export function Cta({
  title = "Have a requirement or a tender in hand?",
  body = "Send us the specification and we will come back with a documented technical proposal and a transparent commercial quotation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    // Sits in the same content column as the sections above, so its edges
    // line up with their cards rather than running to the screen edge.
    <section className="pb-16 md:pb-24">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-panel bg-brand-deep ring-1 ring-white/8">
          {/* Surface gradient first: it is what shows until the WebGL layer
            loads, and the fallback if it never does. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(160deg,#14213a_0%,#2a4161_52%,#1b1f26_100%)]"
          />
          <div aria-hidden className="absolute inset-0">
            <GhostFibersBackground
              lineColor={palette.deepNavy}
              glowColor={palette.glow}
              layers={6}
              scale={1.4}
              speed={0.14}
              twist={0.12}
              lineSharpness={14}
              glowIntensity={1.2}
              brightness={1.5}
              vignette={0.7}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-deep/95 via-brand-deep/60 to-brand-deep/20"
          />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.08] font-bold text-fg uppercase">
                  {title}
                </h2>
                <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-fg-muted">
                  {body}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/contact#enquiry" withArrow>
                    Get a Quote
                  </Button>
                  <Button href="/services" variant="ghost">
                    Explore our services
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 lg:col-start-8">
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`tel:${site.contact.phoneHref}`}
                      className="group flex items-center gap-4 rounded-2xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur-sm transition-[background-color,box-shadow] hover:bg-white/10 hover:shadow-glow"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-glow text-bg">
                        <Phone className="size-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-fg-subtle">
                          Call us
                        </span>
                        <span className="mt-0.5 block font-semibold text-fg">
                          {site.contact.phone}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="group flex items-center gap-4 rounded-2xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur-sm transition-[background-color,box-shadow] hover:bg-white/10 hover:shadow-glow"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-glow text-bg">
                        <Mail className="size-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-fg-subtle">
                          Email us
                        </span>
                        <span className="mt-0.5 block truncate font-semibold text-fg">
                          {site.contact.email}
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
