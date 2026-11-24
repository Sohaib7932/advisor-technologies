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

/**
 * Hardware WebGL only. A software rasteriser (SwiftShader, llvmpipe, the
 * Windows basic renderer) would block the main thread compiling shaders,
 * so those devices get the poster instead.
 */
function hardwareWebgl() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
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
      const canvas = canvasRef.current!;
      const poster = section.querySelector<HTMLElement>("[data-poster]")!;
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      const view = mobile ? "mobile" : "desktop";
      const reduced = window.matchMedia(MOTION.reduced).matches;
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      const lowEnd =
        (nav.hardwareConcurrency ?? 8) <= HERO_TUNING.tiers.lowEnd ||
        (nav.deviceMemory ?? 8) <= HERO_TUNING.tiers.lowEnd ||
        Boolean(nav.connection?.saveData);
      // Phones and low-end devices get the poster (a render of this same
      // scene): no three.js download, no render loop, no battery drain.
      const phone = window.matchMedia("(max-width: 767px)").matches;
      const use3d = !reduced && !lowEnd && !phone && hardwareWebgl();

      let scene: HeroScene | null = null;
      let disposed = false;
      const showPoster = () => {
        section.dataset.poster = "";
        gsap.to(poster, { autoAlpha: 1, duration: 0.6, ease: EASE.out });
      };
      if (!use3d) showPoster();

      const mm = gsap.matchMedia();

      // The headline, panel and poster are visible from the first paint (they
      // are the LCP). The intro animates what follows them.
      mm.add(MOTION.ok, () => {
        const step = (key: string) => section.querySelectorAll<HTMLElement>(`[data-intro="${key}"]`);
        const tl = gsap.timeline({ defaults: { ease: EASE.out } });
        tl.fromTo(step("chip"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.1);
        tl.fromTo(step("tagline"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.25);
        tl.fromTo(step("buttons"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.4);
        tl.fromTo(step("trust"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.55);

        // Exit parallax on scroll, desktop only, one write per frame.
        if (mobile) return;
        const copy = section.querySelector<HTMLElement>("[data-hero-copy]")!;
        let raf = 0;
        const onScroll = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const y = Math.min(window.scrollY, 600);
            copy.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
            copy.style.opacity = String(1 - y / 700);
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("scroll", onScroll);
        };
      });

      if (use3d) {
        // Shared state the 3D timeline tweens and the scene reads every frame.
        const intro: HeroIntro = {
          platform: 0,
          led: 0,
          products: HERO_TUNING.layout[view].map(() => ({ appear: 0, explode: 1, glint: 0 })),
          tiles: HERO_TUNING.tiles[view].map(() => 0),
          idle: 0,
        };
        // The 3D intro starts only when the scene is compiled and drawn, and
        // the main thread is idle, so it never starts janky.
        const play3d = () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.out } });
          tl.to(intro, { platform: 1, duration: 1.6, ease: "expo.out" }, 0);
          tl.to(intro, { led: 1, duration: 1.0, ease: "power2.out" }, 0.6);
          intro.products.forEach((p, i) => {
            const at = 0.8 + i * I.productStagger;
            tl.to(p, { appear: 1, duration: 0.55, ease: "power3.out" }, at);
            tl.to(p, { explode: 0, duration: I.assemble, ease: "back.out(1.4)" }, at + 0.12);
            tl.to(p, { glint: 1, duration: 0.18, ease: "power2.out" }, at + I.assemble * 0.85);
            tl.to(p, { glint: 0, duration: 0.45, ease: "power2.in" }, at + I.assemble * 0.85 + 0.18);
          });
          intro.tiles.forEach((_, i) => {
            tl.to(intro.tiles, { [i]: 1, duration: 0.7, ease: "back.out(1.6)" }, 2.2 + i * I.tileStagger);
          });
          tl.to(intro, { idle: 1, duration: 1.5, ease: "power1.inOut" }, 3.6);
        };
        const whenIdle = (fn: () => void) =>
          typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 900 }) : window.setTimeout(fn, 300);
        whenIdle(() => {
          import("./hero-scene").then(({ createHeroScene }) => {
            if (disposed) return;
            try {
              scene = createHeroScene(canvas, {
                mobile,
                reduced,
                quality: mobile ? "low" : "high",
                intro,
                onFallback: () => {
                  showPoster();
                  gsap.to(canvas, { autoAlpha: 0, duration: 0.4, onComplete: () => scene?.dispose() });
                },
              });
              // Exposed for the layout overlap check in verification.
              Object.assign(window, { __heroBounds: () => scene?.bounds() });
              scene.ready.then(() => {
                if (disposed) return;
                gsap.to(canvas, { autoAlpha: 1, duration: 0.6, ease: EASE.out });
                play3d();
              });
            } catch {
              showPoster();
            }
          });
        });
      }

      return () => {
        disposed = true;
        scene?.dispose();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} data-banner aria-label="Introduction">
      <NotchedPanel
        bodyClassName="lg:min-h-[clamp(560px,calc(100svh-var(--header-h)-28px),55rem)] lg:flex"
        backdrop={
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {/* One soft steel-blue light behind the platform, and its rings */}
            <div className="absolute top-[18%] right-[-6%] aspect-square w-[95%] rounded-full bg-[radial-gradient(closest-side,rgb(47_92_196/0.55),rgb(30_48_96/0.18)_55%,transparent)] lg:top-[4%] lg:right-[-4%] lg:w-[62%]" />
            <div className="rings top-[30%] right-[-14%] w-[110%] lg:top-[8%] lg:right-[-6%] lg:w-[66%]" />
          </div>
        }
      >
        <div className="relative grid w-full lg:grid-cols-12">
          {/* Copy */}
          <div data-hero-copy className="relative z-10 flex flex-col justify-center px-(--gutter) pt-9 pb-4 sm:pt-12 lg:col-span-6 lg:py-14 xl:col-span-5 xl:pr-0 2xl:col-span-6">
            <span data-intro="chip" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-xs font-semibold tracking-[0.08em] text-white uppercase ring-1 ring-white/15">
              <span aria-hidden className="size-1.5 rounded-full bg-amber" />
              Islamabad · Pakistan
            </span>
            <h1 className="mt-5 text-h1 text-white sm:mt-6 lg:[&>span]:whitespace-nowrap">
              <span className="block">Six divisions.</span>
              <span className="block text-sky">One accountable</span>
              <span className="block text-sky">partner.</span>
            </h1>
            <p data-intro="tagline" className="mt-5 max-w-md text-lead text-text-2 sm:mt-6">
              Complete technology and supply solutions, built for Pakistan.
            </p>
            <div data-intro="buttons" className="mt-7 flex flex-wrap gap-3 sm:mt-9">
              <Button href="/contact#enquiry">Get a Quote</Button>
              <Button href="/services" variant="secondary">
                Explore services
              </Button>
            </div>
            <div data-intro="trust" className="mt-8 flex w-fit sm:mt-10 items-center gap-3 rounded-full bg-white/6 py-1.5 pr-4 pl-1.5 ring-1 ring-white/12">
              <span className="flex -space-x-2.5">
                {TRUST.map((c) => (
                  <span key={c.name} className="grid size-9 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-navy">
                    <Image src={c.logo!} alt="" width={36} height={36} className="size-7 object-contain" />
                  </span>
                ))}
              </span>
              <span className="text-sm font-medium text-text-2">
                Trusted by <span className="font-semibold text-white">{clients.length}+</span> ministries and institutions
              </span>
            </div>
          </div>

          {/* 3D: live scene, with a static poster for fallbacks */}
          <div className="relative h-[clamp(300px,75vw,560px)] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[43%] lg:h-auto xl:left-[38%] 2xl:left-[46%]">
            <Image
              data-poster
              src="/3d/hero-poster.webp"
              alt="Server rack, CCTV camera, laptop, printer, office chair and gear on a glass platform"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              loading="eager"
              fetchPriority="high"
              className="bob object-contain object-center lg:invisible lg:opacity-0"
            />
            <canvas ref={canvasRef} aria-hidden className="invisible absolute inset-0 size-full opacity-0" />
          </div>
        </div>
      </NotchedPanel>
    </section>
  );
}
