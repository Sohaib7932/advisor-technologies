"use client";

import Image from "next/image";
import { useRef } from "react";
import { NotchedPanel } from "@/components/layout/notched-panel";
import { Button } from "@/components/ui/button";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { clients } from "@/lib/content";
import { HERO_TUNING } from "./hero-tuning";
import type { HeroIntro, HeroScene } from "./hero-scene";

const I = HERO_TUNING.intro;

/** Three real client logos for the trust chip. */
const TRUST = ["NADRA Islamabad / Karachi", "Capital Development Authority", "Ministry of Ports & Shipping"]
  .map((name) => clients.find((c) => c.name === name))
  .filter((c): c is (typeof clients)[number] => Boolean(c?.logo));

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Home hero (ref 1 composition, ref 2/3 3D style): an inset dark panel under
 * the notched header. Copy on the left; on the right the live 3D platform
 * skyline, bleeding to the panel edge. The composed final state is server-
 * rendered HTML (fast LCP). A static poster of the final scene stands in for
 * WebGL under reduced motion, without WebGL and on low-end devices.
 *
 * Intro (≈5.5s, autoplay, time-based, never scroll-driven): the panel
 * clip-reveals from the notch, headline lines rise out of their masks, the
 * platform rises and its LED ring lights, each product assembles from its
 * exploded parts with a glint, the tiles pop in, then the buttons and the
 * trust chip. Timing lives in hero-tuning.ts.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const panel = section.querySelector<HTMLElement>("[data-notched]")!;
      const canvas = canvasRef.current!;
      const poster = section.querySelector<HTMLElement>("[data-poster]")!;
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      const view = mobile ? "mobile" : "desktop";
      const reduced = window.matchMedia(MOTION.reduced).matches;
      const lowEnd =
        (navigator.hardwareConcurrency ?? 8) <= 2 ||
        Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
      const use3d = !reduced && !lowEnd && webglAvailable();

      let scene: HeroScene | null = null;
      let disposed = false;
      const showPoster = () => gsap.to(poster, { autoAlpha: 1, duration: 0.8, ease: EASE.out });

      // Shared state the timeline tweens and the scene reads every frame.
      const intro: HeroIntro = {
        platform: 0,
        led: 0,
        products: HERO_TUNING.layout[view].map(() => ({ appear: 0, explode: 1, glint: 0 })),
        tiles: HERO_TUNING.tiles[view].map(() => 0),
        idle: 0,
      };

      if (use3d) {
        import("./hero-scene").then(({ createHeroScene }) => {
          if (disposed) return;
          try {
            scene = createHeroScene(canvas, { mobile, reduced, quality: mobile ? "low" : "high", intro });
            gsap.to(canvas, { autoAlpha: 1, duration: 0.6, ease: EASE.out });
            // Exposed for the layout overlap check in verification.
            Object.assign(window, { __heroBounds: () => scene?.bounds() });
          } catch {
            showPoster();
          }
        });
      }

      const mm = gsap.matchMedia();
      mm.add(MOTION.reduced, () => {
        panel.dataset.reveal = "done";
        gsap.set(poster, { autoAlpha: 1 });
      });

      mm.add(MOTION.ok, () => {
        const svg = () => panel.querySelector<SVGElement>("[data-notch-svg]");
        const body = panel.querySelector<HTMLElement>("[data-panel-body]")!;
        const lines = section.querySelectorAll<HTMLElement>(".line-mask > span");
        const step = (key: string) => section.querySelectorAll<HTMLElement>(`[data-intro="${key}"]`);

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: EASE.out },
          onComplete: () => {
            panel.dataset.reveal = "done";
            gsap.set([body, svg()].filter(Boolean), { clearProps: "clipPath" });
          },
        });

        // 1. Panel pours down out of the notch.
        tl.fromTo(
          body,
          { clipPath: "inset(0% 18% 100% 18% round 40px)" },
          { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: I.panelDuration, ease: "expo.inOut" },
          I.panel,
        );
        tl.add(() => {
          const s = svg();
          if (!s) return;
          const h = panel.offsetHeight - body.offsetTop;
          gsap.fromTo(
            s,
            { clipPath: `inset(0px 0px ${h}px 0px)` },
            { clipPath: "inset(0px 0px 0px 0px)", duration: I.panelDuration, ease: "expo.inOut" },
          );
        }, I.panel);

        // 2. Copy.
        tl.fromTo(step("chip"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, I.chip);
        tl.fromTo(lines, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.1 }, I.headline);
        tl.fromTo(step("tagline"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, I.tagline);

        // 3. Platform rises, LED ring lights.
        tl.to(intro, { platform: 1, duration: 1.6, ease: "expo.out" }, I.platform);
        tl.to(intro, { led: 1, duration: 1.0, ease: "power2.out" }, I.led);
        if (!use3d) tl.add(showPoster, I.platform);

        // 4. Products assemble, staggered, each with a glint.
        intro.products.forEach((p, i) => {
          const at = I.products + i * I.productStagger;
          tl.to(p, { appear: 1, duration: 0.55, ease: "power3.out" }, at);
          tl.to(p, { explode: 0, duration: I.assemble, ease: "back.out(1.4)" }, at + 0.12);
          tl.to(p, { glint: 1, duration: 0.18, ease: "power2.out" }, at + I.assemble * 0.85);
          tl.to(p, { glint: 0, duration: 0.45, ease: "power2.in" }, at + I.assemble * 0.85 + 0.18);
        });

        // 5. Tiles pop in.
        intro.tiles.forEach((_, i) => {
          tl.to(intro.tiles, { [i]: 1, duration: 0.7, ease: "back.out(1.6)" }, I.tiles + i * I.tileStagger);
        });

        // 6. Buttons and trust chip, then idle.
        tl.fromTo(step("buttons"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, I.buttons);
        tl.fromTo(step("trust"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, I.trust);
        tl.to(intro, { idle: 1, duration: 1.5, ease: "power1.inOut" }, I.idle);

        // Start once the measured SVG is in place.
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => tl.play()));

        // Cheap exit parallax on scroll (never needed for the intro).
        const copy = section.querySelector<HTMLElement>("[data-hero-copy]")!;
        const onScroll = () => {
          const y = Math.min(window.scrollY, 600);
          copy.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
          copy.style.opacity = String(1 - y / 700);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("scroll", onScroll);
        };
      });

      return () => {
        disposed = true;
        scene?.dispose();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Introduction">
      <NotchedPanel
        reveal
        bodyClassName="lg:h-[clamp(620px,calc(100svh-var(--header-h)-28px),920px)]"
        backdrop={
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {/* One soft steel-blue light behind the platform, and its rings */}
            <div className="absolute top-[18%] right-[-6%] aspect-square w-[95%] rounded-full bg-[radial-gradient(closest-side,rgb(47_92_196/0.55),rgb(30_48_96/0.18)_55%,transparent)] lg:top-[4%] lg:right-[-4%] lg:w-[62%]" />
            <div className="rings top-[30%] right-[-14%] w-[110%] lg:top-[8%] lg:right-[-6%] lg:w-[66%]" />
          </div>
        }
      >
        <div className="relative grid lg:h-full lg:grid-cols-12">
          {/* Copy */}
          <div data-hero-copy className="relative z-10 flex flex-col justify-center px-(--gutter) pt-12 pb-6 lg:col-span-6 lg:py-16 xl:col-span-5 xl:pr-0">
            <span data-intro="chip" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-xs font-semibold tracking-[0.08em] text-white uppercase ring-1 ring-white/15">
              <span aria-hidden className="size-1.5 rounded-full bg-amber" />
              Islamabad · Pakistan
            </span>
            <h1 className="mt-6 text-h1 text-white">
              <span className="line-mask">
                <span>Six divisions.</span>
              </span>
              <span className="line-mask">
                <span className="text-sky">One accountable</span>
              </span>
              <span className="line-mask">
                <span className="text-sky">partner.</span>
              </span>
            </h1>
            <p data-intro="tagline" className="mt-6 max-w-md text-lead text-text-2">
              Complete technology and supply solutions, built for Pakistan.
            </p>
            <div data-intro="buttons" className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact#enquiry">Get a Quote</Button>
              <Button href="/services" variant="secondary">
                Explore services
              </Button>
            </div>
            <div data-intro="trust" className="mt-10 flex w-fit items-center gap-3 rounded-full bg-white/6 py-1.5 pr-4 pl-1.5 ring-1 ring-white/12">
              <span className="flex -space-x-2.5">
                {TRUST.map((c) => (
                  <span key={c.name} className="grid size-9 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-navy">
                    <Image src={c.logo!} alt="" width={36} height={36} unoptimized={c.logo!.endsWith(".svg")} className="size-7 object-contain" />
                  </span>
                ))}
              </span>
              <span className="text-sm font-medium text-text-2">
                Trusted by <span className="font-semibold text-white">{clients.length}+</span> ministries and institutions
              </span>
            </div>
          </div>

          {/* 3D: live scene, with a static poster for fallbacks */}
          <div className="relative h-[clamp(320px,90vw,520px)] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[40%] lg:h-auto xl:left-[34%]">
            <Image
              data-poster
              src="/3d/hero-poster.webp"
              alt="Server rack, CCTV camera, laptop, printer, office chair and gear on a glass platform"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="motion-hide object-contain object-center"
            />
            <canvas ref={canvasRef} aria-hidden className="invisible absolute inset-0 size-full opacity-0" />
          </div>
        </div>
      </NotchedPanel>
    </section>
  );
}
