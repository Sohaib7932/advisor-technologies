import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/shared/contact-form";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Clock, Mail, MapPin, Phone } from "@/components/ui/icons";
import { addressLines, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Advisor Technologies at ${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city}. Email ${site.contact.email} or call ${site.contact.phone}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Contact us"
        image="/images/contact.svg"
        title={
          <>
            Let&rsquo;s discuss
            <span className="text-navy-400"> your requirement</span>
          </>
        }
        lead="Send us a specification, a bill of quantities or a tender reference and our team will respond with a documented technical and commercial proposal."
      />

      <Section id="enquiry">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Form */}
            <Reveal className="lg:col-span-7">
              <div className="rounded-panel bg-surface p-6 shadow-soft ring-1 ring-navy-900/6 sm:p-9">
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
            <div className="lg:col-span-5">
              <Reveal delay={100} className="space-y-3">
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
                <div
                  id="office"
                  className="scroll-mt-32 rounded-card bg-surface p-6 ring-1 ring-navy-900/6"
                >
                  <div className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-600/10 text-navy-600">
                      <MapPin className="size-5" />
                    </span>
                    <div>
                      <p className="eyebrow text-graphite-400">Visit us</p>
                      <address className="mt-2 text-[0.9375rem] leading-relaxed text-navy-900 not-italic">
                        {addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    </div>
                  </div>
                </div>
                <div className="rounded-card bg-surface p-6 ring-1 ring-navy-900/6">
                  <div className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-600/10 text-navy-600">
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
                </div>
              </Reveal>

              {/* Registration + location visual */}
              <Reveal delay={180} className="mt-3">
                <div className="relative aspect-16/10 overflow-hidden rounded-card bg-navy-950">
                  <Image
                    src="/images/contact.svg"
                    alt="Royal Inn Plaza, F-8 Markaz, Islamabad"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-navy-950/80 to-transparent"
                  />
                  <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/80">
                    <span>
                      NTN{" "}
                      <span className="font-medium text-white">
                        {site.registration.ntn}
                      </span>
                    </span>
                    <span>
                      STN{" "}
                      <span className="font-medium text-white">
                        {site.registration.stn}
                      </span>
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
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
      className="group flex items-center gap-4 rounded-card bg-surface p-6 ring-1 ring-navy-900/6 transition-all duration-400 ease-out-soft hover:-translate-y-0.5 hover:shadow-soft hover:ring-navy-600/25"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-600/10 text-navy-600 transition-colors duration-300 group-hover:bg-navy-600 group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="eyebrow block text-graphite-400">{label}</span>
        <span className="mt-1.5 block truncate text-[0.9375rem] font-medium text-navy-900">
          {value}
        </span>
      </span>
    </a>
  );
}
