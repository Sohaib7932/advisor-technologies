import { Suspense } from "react";
import { Container, Section } from "@/components/ui/container";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ChatCard } from "@/components/ui/chat-card";
import { Clock, Mail, MapPin, Phone } from "@/components/ui/icons";
import { ContactForm } from "./contact-form";
import { addressLines, site } from "@/lib/site";

const mapQuery = encodeURIComponent(`${site.contact.address.line2}, ${site.contact.address.city}, ${site.contact.address.country}`);
const directionsHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

/**
 * Contact (ref 2): a navy panel. Heading, short copy and a few chat bubbles
 * on the left; the enquiry form on a white card on the right (its submit
 * logic lives in ContactForm). Below: call, email, office and hours cards
 * and a light-styled map. Shared by the home page and /contact.
 */
export function ContactSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <Section id="enquiry" className="overflow-hidden">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Contact us</Eyebrow>
            <Heading className="mt-5 text-h2 text-navy">
              Let&rsquo;s discuss <Accent>your requirement</Accent>
            </Heading>
            <p className="mt-6 max-w-md text-lead text-fg-muted">
              Send us a specification, a bill of quantities or a tender reference and our team will respond with a
              documented technical and commercial proposal.
            </p>
            {/* The conversation, on its own light card */}
            <div className="mt-10 max-w-md rounded-card bg-mist p-5 ring-1 ring-line sm:p-6">
              <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
                <span className="relative grid size-10 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                  AT
                  <span aria-hidden className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-mist" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-navy">How an enquiry goes</span>
                  <span className="block text-xs text-text-3">{site.hours.weekdays}</span>
                </span>
              </div>
              <ChatCard
              lines={[
                { from: "you", text: "I have a BOQ to price." },
                { from: "us", text: "Send it with the form, or email it to us." },
                { from: "us", text: "We reply with a documented technical proposal and a transparent quotation." },
              ]}
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="card relative overflow-hidden p-6 sm:p-10">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-navy via-steel to-sky" />
              <h3 className="text-h3 text-navy">Tell us what you need</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">The more detail you share, the more precise our quotation.</p>
              <div className="mt-8">
                <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-mist" />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Details and map */}
        <div data-theme="light" className="mt-12 grid gap-4 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            <DetailCard icon={<Phone className="size-5" />} label="Call us" href={`tel:${site.contact.phoneHref}`}>
              {site.contact.phone}
            </DetailCard>
            <DetailCard icon={<Mail className="size-5" />} label="Email us" href={`mailto:${site.contact.email}`}>
              <span className="break-all">{site.contact.email}</span>
            </DetailCard>
            <div id="office" className="card scroll-mt-32 p-6">
              <IconTile>
                <MapPin className="size-5" />
              </IconTile>
              <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-text-3 uppercase">Visit our office</p>
              <address className="mt-2 text-[0.9375rem] leading-relaxed text-navy not-italic">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="btn-link mt-3">
                <span>Get directions</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </a>
            </div>
            <div className="card p-6">
              <IconTile>
                <Clock className="size-5" />
              </IconTile>
              <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-text-3 uppercase">Office hours</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy">
                {site.hours.weekdays}
                <span className="block">{site.hours.saturday}</span>
                <span className="mt-1 block text-sm text-text-3">Closed on Sunday and public holidays</span>
              </p>
            </div>
          </div>
          <div className="card relative min-h-80 overflow-hidden lg:col-span-6">
            <iframe
              src={mapEmbed}
              title={`Map: ${site.contact.address.line2}, ${site.contact.address.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full [filter:grayscale(0.6)_contrast(0.95)_brightness(1.03)]"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function IconTile({ children }: { children: React.ReactNode }) {
  return <span className="grid size-11 place-items-center rounded-2xl bg-ice text-steel">{children}</span>;
}

function DetailCard({ icon, label, href, children }: { icon: React.ReactNode; label: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group card flex flex-col p-6 transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover">
      <IconTile>{icon}</IconTile>
      <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-text-3 uppercase">{label}</p>
      <p className="mt-2 text-[0.9375rem] font-semibold text-navy">{children}</p>
      <span className="btn-link mt-3 text-sm">
        <span>{label}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}
