import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, Phone } from "@/components/ui/icons";
import { addressLines, footerNav, site } from "@/lib/site";

/**
 * Footer: an inset dark panel on the frame. A top band (brand, one line
 * about the company, and the quote and call buttons), a tight grid of
 * contact details and the three link groups, then registration chips and
 * the copyright line.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" className="panel relative isolate mt-6 mb-(--inset) overflow-hidden bg-ink text-fg-muted">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-20 -z-10 aspect-square w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(47_92_196/0.35),transparent)]" />
      <div className="px-(--gutter) pt-12 pb-8 md:pt-14">
        {/* Top band */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/" className="inline-flex shrink-0 items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-white">
                <Image src="/logos/logo-without-text-removebg.webp" alt="" width={52} height={52} className="size-9 object-contain" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-white">Advisor</span>{" "}
                <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.22em] text-fg-subtle uppercase">Technologies</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed sm:border-l sm:border-white/10 sm:pl-6">
              Exclusive territory agents for world-class industrial brands, delivering supply, installation, integration
              and after-sales service to institutions across Pakistan.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/contact#enquiry">Get a Quote</Button>
            <Button href={`tel:${site.contact.phoneHref}`} variant="secondary">
              {site.contact.phone}
            </Button>
          </div>
        </div>

        {/* Details and links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          <ul className="col-span-2 space-y-3.5 text-sm sm:col-span-3 lg:col-span-5">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sky" />
              <address className="not-italic">{addressLines.join(", ")}</address>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sky" />
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-sky" />
              <span>
                {site.hours.weekdays} · {site.hours.saturday}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sky" />
              <a href={`tel:${site.contact.phoneHref}`} className="transition-colors hover:text-white">
                {site.contact.phone}
              </a>
            </li>
          </ul>

          {footerNav.map((group) => (
            <nav key={group.title} aria-labelledby={`footer-${group.title}`} className="lg:col-span-2 lg:first-of-type:col-start-7">
              <h2 id={`footer-${group.title}`} className="text-xs font-semibold tracking-[0.08em] text-white uppercase">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Registration and legal */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-xs md:flex-row md:items-center md:justify-between">
          <dl className="flex flex-wrap gap-2">
            {[
              ["NTN", site.registration.ntn],
              ["STN", site.registration.stn],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center gap-2 rounded-full bg-white/6 px-3.5 py-1.5 ring-1 ring-white/10">
                <dt className="text-fg-subtle">{label}</dt>
                <dd className="font-semibold text-white tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-1.5 text-fg-subtle sm:flex-row sm:items-center sm:gap-4">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
            <p>
              Created by{" "}
              <a
                href="https://corefinity.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline-offset-4 transition-colors hover:text-sky hover:underline"
              >
                Corefinity Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
