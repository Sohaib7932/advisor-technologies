import Link from "next/link";
import { NotchedPanel } from "@/components/layout/notched-panel";
import { Render3D } from "@/components/three/render-3d";
import type { RenderName } from "@/components/three/renders";

/**
 * The dark banner that opens every inner page, with the notched header built
 * in: breadcrumb, sentence-case title (one accent phrase), lead, a row of
 * real key figures as chips, and the page's 3D render on the right. The
 * panel, headline and render are visible from the first paint (LCP); the
 * breadcrumb, lead, figures and actions rise in with a CSS animation, so
 * the banner hydrates nothing.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  render,
  facts = [],
  watermark,
  children,
}: {
  /** Page name, shown in the breadcrumb. */
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  render: RenderName;
  facts?: { value: React.ReactNode; label: string }[];
  /** Giant faint text behind the copy (the 404 page). */
  watermark?: string;
  /** Extra content under the lead, such as buttons. */
  children?: React.ReactNode;
}) {
  return (
    <section data-banner aria-label={eyebrow}>
      <NotchedPanel
        backdrop={
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-[-10%] right-[-8%] aspect-square w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(47_92_196/0.5),rgb(30_48_96/0.15)_55%,transparent)] lg:w-[48%]" />
            <div className="rings top-[-6%] right-[-4%] w-[80%] lg:w-[46%]" />
            {watermark && (
              <span className="absolute bottom-[-0.12em] left-[-0.04em] font-display text-[clamp(9rem,26vw,22rem)] leading-none font-extrabold tracking-[-0.05em] text-white/[0.045] select-none">
                {watermark}
              </span>
            )}
          </div>
        }
      >
        <div className="grid items-center gap-6 px-(--gutter) pt-12 pb-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="page-intro flex items-center gap-2 text-sm font-medium text-fg-subtle" style={{ "--d": "150ms" } as React.CSSProperties}>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span aria-hidden className="text-white/30">
                /
              </span>
              <span aria-current="page" className="text-sky">
                {eyebrow}
              </span>
            </nav>
            <h1 className="mt-6 max-w-3xl text-[clamp(1.875rem,0.4rem+3vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.02em] text-white">
              {title}
            </h1>
            {lead && (
              <p className="page-intro mt-6 max-w-2xl text-lead text-fg-muted" style={{ "--d": "220ms" } as React.CSSProperties}>
                {lead}
              </p>
            )}
            {facts.length > 0 && (
              <dl className="page-intro mt-8 flex flex-wrap gap-2.5" style={{ "--d": "290ms" } as React.CSSProperties}>
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline gap-2 rounded-full bg-white/7 px-4 py-2 ring-1 ring-white/12">
                    <dt className="order-2 text-sm text-fg-muted">{fact.label}</dt>
                    <dd className="order-1 font-display text-lg font-bold text-white tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {children && (
              <div className="page-intro mt-9" style={{ "--d": "360ms" } as React.CSSProperties}>
                {children}
              </div>
            )}
          </div>
          <div data-tilt-host className="mx-auto w-full max-w-[16rem] sm:max-w-sm lg:col-span-5 lg:max-w-none">
            <Render3D name={render} priority float sizes="(max-width: 1024px) 80vw, 36vw" />
          </div>
        </div>
      </NotchedPanel>
    </section>
  );
}
