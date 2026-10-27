import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ChatCard } from "@/components/ui/chat-card";
import { Mail, Phone } from "@/components/ui/icons";
import { site } from "@/lib/site";

/**
 * Closing call to action: a deep-navy anchor card (one of the two dark
 * anchors, with the footer). Copy and buttons on the left, a short
 * conversation on the right that plays in when the card comes into view.
 */
export function Cta({
  title = "Have a requirement or a tender in hand?",
  body = "Send us the specification and we will come back with a documented technical proposal and a transparent commercial quotation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section data-theme="dark" className="pb-16 md:pb-24">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-panel bg-brand-deep bg-[linear-gradient(140deg,#14213a_0%,#1b2b47_60%,#223655_100%)] ring-1 ring-white/8">

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
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

              <div className="lg:col-span-5">
                <ChatCard
                  lines={[
                    { from: "you", text: "Need a quote?" },
                    { from: "us", text: "Tell us what you need: a specification, a BOQ or a tender reference." },
                    { from: "us", text: "We reply with a documented technical and commercial proposal." },
                    {
                      from: "us",
                      text: (
                        <span className="flex flex-wrap gap-x-4 gap-y-1">
                          <a href={`tel:${site.contact.phoneHref}`} className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
                            <Phone className="size-4" /> {site.contact.phone}
                          </a>
                          <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
                            <Mail className="size-4" /> Email us
                          </a>
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
