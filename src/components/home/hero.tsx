import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ClientLogo } from "@/components/ui/client-logo";
import { clients } from "@/lib/content";
import { site } from "@/lib/site";

import { HeroDivisions } from "./hero-divisions";

/** A handful of recognisable names for the trust row under the CTAs. */
const trustClients = [
  "NADRA Islamabad / Karachi",
  "Capital Development Authority",
  "National Police Academy Islamabad",
  "IESCO, Islamabad",
].flatMap((name) => clients.filter((client) => client.name === name));

/** Staggered entrance: pairs with the `hero-rise` class, which rises the
 *  element in `delay` ms after first paint. */
function rise(delay: number) {
  return { "--rise-delay": `${delay}ms` } as React.CSSProperties;
}

export function Hero() {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate flex min-h-[46rem] flex-col overflow-hidden rounded-[1.75rem] bg-navy-950 sm:rounded-hero lg:min-h-[min(92vh,56rem)]">
        {/* Backdrop: settles from a slight zoom as the page opens */}
        <div className="hero-zoom absolute inset-0 -z-10">
          <Image
            src="/images/hero-image.png"
            alt="Advisor Technologies head office in Islamabad"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Legibility: dark where the copy sits (left and bottom), open on
            the right so the photograph still reads. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-b from-navy-950/70 via-navy-950/15 to-navy-950/90"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/80 via-navy-950/35 to-transparent"
        />
        {/* Brand light: a cool blue glow lifting the machinery floor */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_78%_62%,rgb(31_107_255/0.28),transparent_70%)] mix-blend-screen"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_8%_0%,rgb(56_189_248/0.16),transparent_70%)]"
        />

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pt-28 pb-6 sm:px-10 sm:pt-32 sm:pb-10 lg:px-14 lg:pb-12">
          <div className="flex flex-1 flex-col justify-center">
            <span
              style={rise(100)}
              className="hero-rise inline-flex w-fit items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/85 ring-1 ring-white/20 backdrop-blur-sm"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-300 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-sky-200" />
              </span>
              Islamabad · Serving public &amp; private sector across Pakistan
            </span>

            <h1 className="mt-7 max-w-[18ch] font-display font-extrabold text-white">
              <span className="sr-only">
                {site.name}. {site.tagline}
              </span>
              <span
                aria-hidden
                style={rise(200)}
                className="hero-rise block text-[clamp(3.5rem,12vw,10rem)] leading-[0.86] tracking-[-0.05em]"
              >
                <span className="hero-wordmark">Advisor</span>
              </span>
              <span
                aria-hidden
                style={rise(340)}
                className="hero-rise mt-3 flex items-center gap-4 text-[clamp(1rem,3.1vw,2.6rem)] leading-none font-semibold tracking-[0.16em] text-white/75 uppercase"
              >
                <span className="hero-line h-0.5 shrink-0 w-[clamp(1.5rem,4vw,3.5rem)] origin-left rounded-full bg-linear-to-r from-sky-300 to-white/60" />
                Technologies
              </span>
            </h1>
          </div>

          {/* Lower band: statement, CTAs and trust on the left; the division
              panel on the right. */}
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div>
              <p
                style={rise(480)}
                className="hero-rise max-w-lg text-2xl leading-[1.2] font-medium text-white sm:text-[1.75rem]"
              >
                Supply, installation and maintenance
                <span className="text-white/55">
                  {" "}
                  for Pakistan&rsquo;s institutions.
                </span>
              </p>
              <p
                style={rise(560)}
                className="hero-rise mt-4 max-w-md text-sm leading-relaxed text-white/65"
              >
                Branded plant &amp; machinery, IT infrastructure, security
                systems and repair works, backed by international standards of
                after-sales service.
              </p>

              <div
                style={rise(660)}
                className="hero-rise mt-8 flex flex-wrap items-center gap-3"
              >
                <Button href="/services" variant="light" size="lg" withArrow>
                  Explore our services
                </Button>
                <Button
                  href="/contact"
                  size="lg"
                  className="bg-white/10 ring-1 ring-white/25 backdrop-blur-md hover:bg-white/20"
                >
                  Talk to our team
                </Button>
              </div>

              <div
                style={rise(760)}
                className="hero-rise mt-8 flex items-center gap-4"
              >
                <span className="flex -space-x-1.5">
                  {trustClients.map((client) => (
                    <ClientLogo
                      key={client.name}
                      client={client}
                      labelled
                      sizes="44px"
                      className="size-11 rounded-full ring-2! ring-navy-950!"
                    />
                  ))}
                  <span className="grid size-11 place-items-center rounded-full bg-white font-display text-[0.6875rem] font-bold text-navy-900 ring-2 ring-navy-950">
                    {clients.length}+
                  </span>
                </span>
                <span className="text-sm leading-snug text-white/70">
                  Trusted by federal ministries,
                  <br className="hidden sm:block" /> authorities and enterprises
                </span>
              </div>
            </div>

            <div style={rise(600)} className="hero-rise">
              <HeroDivisions />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
