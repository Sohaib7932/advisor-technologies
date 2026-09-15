import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "@/components/ui/icons";
import { addressLines, footerNav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-200">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
                <Image
                  src="/logos/logo-without-text-removebg.webp"
                  alt=""
                  width={52}
                  height={52}
                  className="size-9 object-contain"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  Advisor
                </span>
                <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.2em] text-navy-300 uppercase">
                  Technologies
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-navy-300">
              Exclusive territory agents for world-class industrial brands,
              delivering supply, installation, integration and after-sales
              service to institutions across Pakistan.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-navy-400" />
                <address className="not-italic text-navy-200">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-navy-400" />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-navy-200 transition-colors hover:text-white"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-navy-400" />
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="text-navy-200 transition-colors hover:text-white"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-navy-400" />
                <span className="text-navy-300">
                  {site.hours.weekdays}
                  <span className="block">{site.hours.saturday}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerNav.map((group) => (
              <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
                <h2
                  id={`footer-${group.title}`}
                  className="eyebrow font-sans text-navy-400"
                >
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-navy-200 transition-colors hover:text-white"
                      >
                        {item.label}
                        <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-70" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Registration + legal */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-navy-400">
            <span>
              NTN{" "}
              <span className="font-medium text-navy-200">
                {site.registration.ntn}
              </span>
            </span>
            <span>
              STN{" "}
              <span className="font-medium text-navy-200">
                {site.registration.stn}
              </span>
            </span>
          </div>
          <p className="text-xs text-navy-400">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
