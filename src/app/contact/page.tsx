import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/shared/contact-form";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "@/components/ui/icons";
import { addressLines, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Advisor Technologies at ${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city}. Email ${site.contact.email} or call ${site.contact.phone}.`,
};

const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.contact.address.line2}, ${site.contact.address.city}, ${site.contact.address.country}`,
)}`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&rsquo;s discuss
            <span className="text-navy-400"> your requirement</span>
          </>
        }
        lead="Send us a specification, a bill of quantities or a tender reference and our team will respond with a documented technical and commercial proposal."
        aside={
          <div className="rounded-[1.75rem] bg-navy-950/45 p-2 shadow-float ring-1 ring-white/15 backdrop-blur-xl">
            <p className="eyebrow px-4 pt-3 pb-3 text-[0.6875rem] text-navy-200">
              Talk to us directly
            </p>
            <div className="flex flex-col gap-1">
              <HeroAction
                icon={<Phone className="size-4.5" />}
                label="Call us"
                value={site.contact.phone}
                href={`tel:${site.contact.phoneHref}`}
              />
              <HeroAction
                icon={<Mail className="size-4.5" />}
                label="Email us"
                value={site.contact.email}
                href={`mailto:${site.contact.email}`}
              />
              <HeroAction
                icon={<MapPin className="size-4.5" />}
                label="Visit us"
                value={site.contact.address.city}
                href="#office"
              />
            </div>
          </div>
        }
      />

      <Section id="enquiry">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Form */}
            <Reveal className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-panel bg-surface p-6 shadow-lift ring-1 ring-navy-900/6 sm:p-10">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-navy-950 via-navy-500 to-sky-400"
                />
                <Eyebrow>Enquiry form</Eyebrow>
                <h2 className="mt-4 text-title font-semibold text-ink">
                  Tell us what you need
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">
                  The more detail you share, the more precise our quotation.
                </p>

                <div className="mt-8">
                  <Suspense
                    fallback={
                      <div className="h-96 animate-pulse rounded-2xl bg-canvas" />
                    }
                  >
                    <ContactForm />
                  </Suspense>
                </div>
              </div>
            </Reveal>

            {/* Details */}
            <div className="flex flex-col gap-3 lg:col-span-5">
              <Reveal delay={100} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <ContactCard
                  icon={<Phone className="size-5" />}
                  label="Call us"
                  value={site.contact.phone}
                  href={`tel:${site.contact.phoneHref}`}
                />
                <ContactCard
                  icon={<Mail className="size-5" />}
                  label="Email us"
                  value={site.contact.email}
                  href={`mailto:${site.contact.email}`}
                />
              </Reveal>

              <Reveal delay={160}>
                <div className="flex gap-4 rounded-card bg-surface p-6 shadow-soft ring-1 ring-navy-900/6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-950 text-white">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <p className="eyebrow text-graphite-400">Office hours</p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-900">
                      {site.hours.weekdays}
                      <span className="block">{site.hours.saturday}</span>
                      <span className="mt-1 block text-sm text-graphite-500">
                        Closed on Sunday and public holidays
                      </span>
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Office: address, directions and registration */}
              <Reveal delay={220}>
                <div
                  id="office"
                  className="relative isolate scroll-mt-32 overflow-hidden rounded-card bg-navy-950 p-7 text-white shadow-lift"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_100%_0%,rgb(31_107_255/0.4),transparent_65%)]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] mask-[linear-gradient(to_left,black,transparent_75%)] bg-size-[18px_18px] opacity-15"
                  />
                  {/* Location ping */}
                  <span aria-hidden className="absolute top-8 right-8 grid size-12 place-items-center">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400/30" />
                    <span className="relative grid size-10 place-items-center rounded-full bg-white text-navy-950 shadow-lift">
                      <MapPin className="size-5" />
                    </span>
                  </span>

                  <p className="eyebrow text-navy-300">Visit our office</p>
                  <address className="mt-4 max-w-[70%] text-[0.9375rem] leading-relaxed text-white not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>

                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-navy-900 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Get directions
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-5 text-xs">
                    <div>
                      <dt className="text-navy-300">NTN</dt>
                      <dd className="mt-0.5 font-display text-sm font-semibold tabular-nums">
                        {site.registration.ntn}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-navy-300">STN</dt>
                      <dd className="mt-0.5 font-display text-sm font-semibold tabular-nums">
                        {site.registration.stn}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function HeroAction({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3.5 rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-white/10"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors duration-300 group-hover:bg-white group-hover:text-navy-900">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-white/55">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-medium text-white">
          {value}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
    </a>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-card bg-surface p-6 shadow-soft ring-1 ring-navy-900/6 transition-[translate,box-shadow] duration-400 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-950 text-white transition-transform duration-500 ease-out-soft group-hover:-rotate-6">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="eyebrow block text-graphite-400">{label}</span>
        <span className="mt-1.5 block truncate text-[0.9375rem] font-medium text-navy-900">
          {value}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-graphite-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy-900" />
    </a>
  );
}
