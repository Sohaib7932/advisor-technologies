"use client";

import Link from "next/link";
import { useRef } from "react";
import { NotchedPanel } from "@/components/layout/notched-panel";
import { Render3D } from "@/components/three/render-3d";
import type { RenderName } from "@/components/three/renders";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/motion";

/**
 * The dark banner that opens every inner page, with the notched header built
 * in: breadcrumb, sentence-case title (one accent phrase), lead, a row of
 * real key figures as chips, and the page's 3D render on the right. The
 * panel pours out of the notch and the copy rises in, like the home hero.
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
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panel = root.current!.querySelector<HTMLElement>("[data-notched]")!;
      const mm = gsap.matchMedia();
      mm.add(MOTION.reduced, () => {
        panel.dataset.reveal = "done";
      });
      mm.add(MOTION.ok, () => {
        const body = panel.querySelector<HTMLElement>("[data-panel-body]")!;
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: EASE.out },
          onComplete: () => {
            panel.dataset.reveal = "done";
            gsap.set(panel.querySelectorAll("[data-panel-body],[data-notch-svg]"), { clearProps: "clipPath" });
          },
        });
        tl.fromTo(body, { clipPath: "inset(0% 18% 100% 18% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: 0.8, ease: "expo.inOut" }, 0);
        tl.add(() => {
          const svg = panel.querySelector<SVGElement>("[data-notch-svg]");
          if (!svg) return;
          const h = panel.offsetHeight - body.offsetTop;
          gsap.fromTo(svg, { clipPath: `inset(0px 0px ${h}px 0px)` }, { clipPath: "inset(0px 0px 0px 0px)", duration: 0.8, ease: "expo.inOut" });
        }, 0);
        tl.fromTo(panel.querySelectorAll(".line-mask > span"), { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1, stagger: 0.08 }, 0.35);
        tl.fromTo(panel.querySelectorAll("[data-intro]"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 0.3);
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => tl.play()));
        return () => cancelAnimationFrame(raf);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={eyebrow}>
      <NotchedPanel
        reveal
        backdrop={
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-[-10%] right-[-8%] aspect-square w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(63_109_133/0.5),rgb(42_65_97/0.15)_55%,transparent)] lg:w-[48%]" />
            <div className="rings top-[-6%] right-[-4%] w-[80%] lg:w-[46%]" />
            {watermark && (
              <span className="absolute bottom-[-0.12em] left-[-0.04em] font-display text-[clamp(9rem,26vw,22rem)] leading-none font-extrabold tracking-[-0.05em] text-white/[0.045] select-none">
                {watermark}
              </span>
            )}
          </div>
        }
      >
        <div className="mx-auto grid max-w-[80rem] items-center gap-6 px-(--gutter) pt-12 pb-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" data-intro className="flex items-center gap-2 text-sm font-medium text-fg-subtle">
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
            <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,4.4vw,4rem)] leading-[1.05] font-bold tracking-[-0.02em] text-white">
              <span className="line-mask">
                <span>{title}</span>
              </span>
            </h1>
            {lead && (
              <p data-intro className="mt-6 max-w-2xl text-lead text-fg-muted">
                {lead}
              </p>
            )}
            {facts.length > 0 && (
              <dl data-intro className="mt-8 flex flex-wrap gap-2.5">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline gap-2 rounded-full bg-white/7 px-4 py-2 ring-1 ring-white/12">
                    <dt className="order-2 text-sm text-fg-muted">{fact.label}</dt>
                    <dd className="order-1 font-display text-lg font-bold text-white tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {children && (
              <div data-intro className="mt-9">
                {children}
              </div>
            )}
          </div>
          <div data-intro data-tilt-host className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <Render3D name={render} priority float sizes="(max-width: 1024px) 80vw, 36vw" />
          </div>
        </div>
      </NotchedPanel>
    </section>
  );
}
