import { Suspense } from "react";
import { Container, Section } from "@/components/ui/container";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { sectionImage } from "@/lib/section-images";
import { Eyebrow } from "@/components/ui/section-heading";
import { RevealGroup } from "@/components/ui/reveal-group";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "@/components/ui/icons";
import { ContactForm } from "./contact-form";
import { addressLines, site } from "@/lib/site";

const mapQuery = encodeURIComponent(
  `${site.contact.address.line2}, ${site.contact.address.city}, ${site.contact.address.country}`,
);
const directionsHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

/**
 * Contact block shared by the home page and /contact: a large heading, the
 * enquiry form (its submit logic lives in ContactForm), contact details and
 * an embedded map of the office.
 */
export function ContactSection({ showHeading = true }: { showHeading?: boolean }) {
  return (
    // The room again, dimmed under a scrim so the form stays easy to read.
    // On /contact it follows the page banner directly, so it starts tighter.
    <Section
      id="enquiry"
      tone="deep"
      divider={showHeading}
      backdrop={<SectionBackdrop src={sectionImage("contact")} plateOpacity={0.55} details={["scrim", "glow-tl"]} />}
      className={showHeading ? "overflow-hidden" : "overflow-hidden pt-10 md:pt-14 xl:pt-16"}
    >
      <Container>
        {showHeading && (
          <div className="max-w-4xl">
            <Eyebrow>Contact us</Eyebrow>
            <h2 className="mt-5 text-display font-bold text-fg uppercase">
              Let&rsquo;s discuss{" "}
              <span className="text-glow">your requirement</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              Send us a specification, a bill of quantities or a tender
              reference and our team will respond with a documented technical
              and commercial proposal.
            </p>
          </div>
        )}

        <RevealGroup
          className={
            showHeading
              ? "mt-14 grid gap-4 lg:grid-cols-12"
              : "grid gap-4 lg:grid-cols-12"
          }
        >
          {/* Form */}
          <div data-reveal className="motion-hide lg:col-span-7">
            <div className="card-surface relative overflow-hidden rounded-panel p-6 sm:p-10">
              <span
                aria-hidden
                className="glow-line absolute inset-x-0 top-0"
              />
              <h3 className="font-display text-title font-bold text-fg uppercase">
                Tell us what you need
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                The more detail you share, the more precise our quotation.
              </p>
              <div className="mt-8">
                <Suspense
                  fallback={<div className="h-96 animate-pulse rounded-2xl bg-white/5" />}
                >
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Details and map */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div data-reveal className="motion-hide grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <DetailLink
                icon={<Phone className="size-5" />}
                label="Call us"
                value={site.contact.phone}
                href={`tel:${site.contact.phoneHref}`}
              />
              <DetailLink
                icon={<Mail className="size-5" />}
                label="Email us"
                value={site.contact.email}
                href={`mailto:${site.contact.email}`}
              />
            </div>

            <div data-reveal id="office" className="motion-hide card-surface scroll-mt-32 overflow-hidden rounded-card">
              <div className="flex gap-4 p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-glow/15 text-glow ring-1 ring-glow/30">
                  <MapPin className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="eyebrow text-fg-subtle">Visit our office</p>
                  <address className="mt-2 text-[0.9375rem] leading-relaxed text-fg not-italic">
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
                    className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-glow hover:text-fg"
                  >
                    Get directions
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
              {/* Fixed-ratio frame: the map loads lazily without shifting layout */}
              <div className="relative aspect-16/10 border-t border-white/8 bg-surface-2">
                <iframe
                  src={mapEmbed}
                  title={`Map: ${site.contact.address.line2}, ${site.contact.address.city}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full [filter:grayscale(1)_invert(0.9)_hue-rotate(180deg)_contrast(0.9)_brightness(0.95)]"
                />
              </div>
            </div>

            <div data-reveal className="motion-hide card-surface flex gap-4 rounded-card p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-glow/15 text-glow ring-1 ring-glow/30">
                <Clock className="size-5" />
              </span>
              <div>
                <p className="eyebrow text-fg-subtle">Office hours</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg">
                  {site.hours.weekdays}
                  <span className="block">{site.hours.saturday}</span>
                  <span className="mt-1 block text-sm text-fg-subtle">
                    Closed on Sunday and public holidays
                  </span>
                </p>
              </div>
            </div>
          </div>
        </RevealGroup>
      </Container>
    </Section>
  );
}

function DetailLink({
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
      className="group card-surface flex items-center gap-4 rounded-card p-6 transition-[translate,box-shadow] duration-400 ease-out-soft hover:-translate-y-0.5 hover:shadow-glow"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-glow text-bg">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="eyebrow block text-fg-subtle">{label}</span>
        <span className="mt-1.5 block truncate text-[0.9375rem] font-semibold text-fg">
          {value}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-fg-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-glow" />
    </a>
  );
}
