import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Render3D } from "@/components/three/render-3d";

/**
 * Closing call to action: a navy panel with the glass bar-chart cluster
 * render on the right and the primary button.
 */
export function Cta({
  title = "Have a requirement or a tender in hand?",
  body = "Send us the specification and we will come back with a documented technical proposal and a transparent commercial quotation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section tone="navy" pad={false} className="mt-6 overflow-hidden" aria-label="Get a quote">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-[-6%] aspect-square w-[50%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(47_92_196/0.5),transparent)]" />
        <div className="rings top-1/2 right-[2%] w-[38%] -translate-y-1/2" />
      </div>
      <Container>
        <div data-tilt-host className="grid items-center gap-6 py-14 md:py-16 lg:grid-cols-12 lg:gap-10 lg:py-10">
          <Reveal className="lg:col-span-7">
            <h2 className="text-h2 text-white">{title}</h2>
            <p className="mt-5 max-w-xl text-lead text-fg-muted">{body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact#enquiry">Get a Quote</Button>
              <Button href="/services" variant="secondary">
                Explore our services
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md">
            <Render3D name="cta" float sizes="(max-width: 1024px) 70vw, 32vw" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
