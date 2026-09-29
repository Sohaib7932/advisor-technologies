import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/** Staggered entrance: pairs with the `hero-rise` class. */
function rise(delay: number) {
  return { "--rise-delay": `${delay}ms` } as React.CSSProperties;
}

/**
 * Dark banner used at the top of every inner page, with the same entrance
 * as the home hero: the photograph settles from a slight zoom and the copy
 * rises in step by step. It sits under the transparent navbar, so it always
 * provides the contrast the nav needs. `aside` fills the right-hand column
 * on large screens (a glass panel of facts, a deck, and so on).
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image = "/images/hero-image.png",
  aside,
  children,
}: {
  /** Page name, shown in the breadcrumb above the title. */
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  image?: string;
  aside?: React.ReactNode;
  /** Extra content under the lead, such as buttons. */
  children?: React.ReactNode;
}) {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-950 sm:rounded-hero">
        <div className="hero-zoom absolute inset-0 -z-10">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/75 to-navy-950/35"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950/90 via-transparent to-navy-950/60"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_85%_70%,rgb(31_107_255/0.28),transparent_70%)] mix-blend-screen"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(40%_45%_at_5%_0%,rgb(56_189_248/0.16),transparent_70%)]"
        />

        <Container className="pt-32 pb-14 sm:pt-40 sm:pb-18 lg:pt-44 lg:pb-20">
          <div
            className={cn(
              "grid gap-12",
              Boolean(aside) && "lg:grid-cols-12 lg:items-end lg:gap-10",
            )}
          >
            <div className={cn(Boolean(aside) && "lg:col-span-7")}>
              <nav
                aria-label="Breadcrumb"
                style={rise(60)}
                className="hero-rise flex items-center gap-2 text-xs font-medium text-white/55"
              >
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <span aria-hidden className="text-white/30">
                  /
                </span>
                <span aria-current="page" className="text-white/85">
                  {eyebrow}
                </span>
              </nav>

              <h1
                style={rise(240)}
                className="hero-rise mt-8 max-w-4xl text-display text-white"
              >
                {title}
              </h1>
              {lead && (
                <p
                  style={rise(380)}
                  className="hero-rise mt-7 max-w-2xl text-base leading-relaxed text-navy-200 sm:text-lg"
                >
                  {lead}
                </p>
              )}
              {children && (
                <div style={rise(480)} className="hero-rise mt-9">
                  {children}
                </div>
              )}
            </div>

            {aside && (
              <div style={rise(520)} className="hero-rise lg:col-span-5">
                {aside}
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}

/** Frosted panel of headline figures for a page hero's `aside`. */
export function HeroFacts({
  label,
  facts,
}: {
  label: string;
  facts: { value: React.ReactNode; label: string }[];
}) {
  return (
    <div className="rounded-[1.75rem] bg-navy-950/45 p-2 shadow-float ring-1 ring-white/15 backdrop-blur-xl">
      <p className="eyebrow px-4 pt-3 pb-3 text-[0.6875rem] text-navy-200">
        {label}
      </p>
      <dl className="grid grid-cols-2 gap-1">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl bg-white/6 px-4 py-4 ring-1 ring-white/8"
          >
            <dt className="sr-only">{fact.label}</dt>
            <dd className="font-display text-3xl font-semibold tracking-tight text-white tabular-nums">
              {fact.value}
            </dd>
            <dd className="mt-1.5 text-xs leading-snug text-white/60">
              {fact.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
