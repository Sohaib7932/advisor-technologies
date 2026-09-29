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
    <section className="px-2 pb-2 sm:px-3 sm:pb-3">
      <Reveal className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-900 sm:rounded-hero">
        {/* Surface gradient first: it is what shows until the WebGL layer
            loads, and the fallback if it never does. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(160deg,#061426_0%,#0f3a66_52%,#050b14_100%)]"
        />
        <div aria-hidden className="absolute inset-0">
          <GhostFibersBackground
            lineColor={palette.deepNavy}
            glowColor={palette.cyan}
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
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-navy-950/90 via-navy-950/55 to-navy-950/20"
        />

        <Container className="relative py-20 md:py-24 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="text-headline text-white">{title}</h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-navy-200">
                {body}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/contact#enquiry" variant="light" size="lg" withArrow>
                  Request a quote
                </Button>
                <Button
                  href="/services"
                  size="lg"
                  className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/18"
                >
                  Explore our services
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="group flex items-center gap-4 rounded-2xl bg-white/8 p-4 ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/14"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white">
                      <Phone className="size-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-navy-300">
                        Call us
                      </span>
                      <span className="mt-0.5 block font-medium text-white">
                        {site.contact.phone}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="group flex items-center gap-4 rounded-2xl bg-white/8 p-4 ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/14"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white">
                      <Mail className="size-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-navy-300">
                        Email us
                      </span>
                      <span className="mt-0.5 block truncate font-medium text-white">
                        {site.contact.email}
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Reveal>
    </section>
  );
}
