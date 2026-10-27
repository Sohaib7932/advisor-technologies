"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap, MOTION } from "@/lib/gsap";
import { site } from "@/lib/site";
import { HERO_TUNING } from "./hero-tuning";
import type { HeroScene } from "./hero-scene";

const TITLE = "Advisor";

/**
 * Full-height light studio hero. No pin, no scrub: the intro is a timed GSAP
 * timeline that starts the moment the 3D studio is ready.
 *
 * First paint is the composed final layout in real HTML (title, tagline and
 * CTAs are server-rendered and visible), with a very short branded loader
 * over it. Then the studio lights up, six products fly together from
 * exploded parts, the title assembles, and the copy and navbar slide in.
 * After that: a slow float, a light sweep across the title every few
 * seconds, damped mouse parallax, and a cheap fade as the page scrolls on.
 * Reduced motion: the composed final state, no loader, nothing moves.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const node = canvas.current;
    if (!section || !node) return;
    const reduced = window.matchMedia(MOTION.reduced).matches;
    const mobile = window.matchMedia(MOTION.mobile).matches;
    const I = HERO_TUNING.intro;
    let scene: HeroScene | null = null;
    let disposed = false;
    let timeline: gsap.core.Timeline | null = null;

    const q = gsap.utils.selector(section);
    if (!reduced) {
      // Before the intro: copy hidden (the loader covers the hero meanwhile,
      // so this never shows as a flash). CSS keeps the navbar tucked away.
      gsap.set(q("[data-letter]"), { opacity: 0, z: -400, filter: "blur(12px)", scale: 1.4 });
      gsap.set(q("[data-tracking]"), { opacity: 0, letterSpacing: "0.9em" });
      gsap.set(q("[data-reveal-hero]"), { opacity: 0, y: 24 });
    }

    function play() {
      if (disposed) return;
      section!.setAttribute("data-loaded", "");
      if (reduced) {
        section!.setAttribute("data-nav-in", "");
        return;
      }
      const s = scene?.intro;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          if (s) gsap.to(s, { idle: 1, duration: 1.5, ease: "power2.inOut" });
          // Flatten the letters so the idle light sweep can clip to them.
          gsap.set(q("[data-letter]"), { clearProps: "all" });
          section!.setAttribute("data-idle", "");
        },
      });
      timeline = tl;
      if (s) {
        tl.to(s, { light: 1, duration: 1.2, ease: "power2.out" }, I.lightsUp).to(
          s,
          { pull: 0, duration: 4.6, ease: "expo.out" },
          I.lightsUp,
        );
        s.products.forEach((p, i) => {
          tl.to(p, { appear: 1, duration: 0.7, ease: "expo.out" }, I.partsAppear + i * 0.06);
          const at = I.assembleStart + i * I.assembleStagger;
          tl.to(p, { explode: 0, duration: I.assembleDuration, ease: "back.out(1.15)" }, at)
            .to(p, { land: 1, duration: 0.7 }, at + I.assembleDuration * 0.55)
            .to(p, { glint: 1, duration: 0.14, ease: "power2.out" }, at + I.assembleDuration * 0.78)
            .to(p, { glint: 0, duration: 0.45, ease: "power2.in" }, at + I.assembleDuration * 0.78 + 0.14);
        });
      }
      tl.to(
        q("[data-letter]"),
        { opacity: 1, z: 0, filter: "blur(0px)", scale: 1, duration: 1.1, ease: "expo.out", stagger: 0.07 },
        I.title,
      )
        .to(
          q("[data-tracking]"),
          { opacity: 1, letterSpacing: "0.32em", duration: 1.2, ease: "expo.out" },
          I.titleTracking,
        )
        .to(q("[data-reveal-hero]"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, I.tagline)
        .add(() => section!.setAttribute("data-nav-in", ""), I.nav);
    }

    // Load the studio and start the intro when it is ready, but never hold
    // the loader past 600ms: a slow device starts with the HTML intro and the
    // studio joins at its final state when it arrives.
    const ready = import("./hero-scene")
      .then(({ createHeroScene }) => {
        if (disposed) return;
        scene = createHeroScene(node, { mobile, reduced });
        if (reduced) scene.setFinal();
        section.setAttribute("data-scene", "ready");
        (window as unknown as { __heroBounds?: () => unknown }).__heroBounds = () => scene?.bounds();
      })
      .catch(() => {
        // No WebGL: the CSS studio backdrop carries the hero.
      });
    const minWait = new Promise<void>((resolve) => setTimeout(resolve, reduced ? 0 : 350));
    const maxWait = new Promise<void>((resolve) => setTimeout(resolve, 600));
    Promise.race([Promise.all([ready, minWait]), maxWait]).then(() => {
      if (!scene) ready.then(() => scene && !disposed && scene.setFinal());
      play();
    });

    // After the intro, the hero copy drifts up and fades as the page scrolls
    // past: a passive listener writing a transform. No pin, no scrub.
    const { distance, fadeBy } = HERO_TUNING.scrollFade;
    const onScroll = () => {
      const block = content.current;
      if (!block || reduced) return;
      const p = Math.min(1, window.scrollY / (section.offsetHeight * fadeBy));
      block.style.transform = `translate3d(0, ${-p * distance}px, 0)`;
      block.style.opacity = String(1 - p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      timeline?.kill();
      window.removeEventListener("scroll", onScroll);
      scene?.dispose();
    };
  }, []);

  return (
    <section
      ref={root}
      aria-label="Introduction"
      data-tone="base"
      className="group/hero relative isolate flex h-svh min-h-[640px] flex-col overflow-hidden bg-white"
    >
      {/* Studio backdrop in CSS, matching the 3D studio's tones, so there is
          no blank flash before (or without) WebGL. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(55%_45%_at_18%_12%,#ffffff_0%,transparent_70%),linear-gradient(180deg,#ffffff_0%,#f4f8fb_42%,#eaf1f7_58%,#e6ecf2_100%)]"
      />
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 -z-10 size-full opacity-0 transition-opacity duration-700 group-data-[scene=ready]/hero:opacity-100"
      />

      {/* Copy: the centre column, kept clear of the products */}
      <div
        ref={content}
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-[clamp(6.5rem,15svh,9.5rem)] text-center will-change-transform"
      >
        <span
          data-reveal-hero
          className="eyebrow inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-accent shadow-soft ring-1 ring-line"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-amber" />
          Islamabad · Pakistan
        </span>

        <h1 className="mt-6 font-display font-extrabold uppercase [perspective:900px]">
          <span className="sr-only">
            {site.name}. Complete technology and supply solutions, built for
            Pakistan.
          </span>
          <span
            aria-hidden
            className="hero-sweep block text-[clamp(3rem,1rem+8.6vw,10rem)] leading-[0.88] tracking-[-0.04em] text-brand-deep [text-shadow:0_14px_40px_rgb(20_33_58/0.12)]"
          >
            {TITLE.split("").map((letter, i) => (
              <span key={i} data-letter className="inline-block">
                {letter}
              </span>
            ))}
          </span>
          <span
            aria-hidden
            data-tracking
            className="mt-3 block text-[clamp(0.95rem,0.4rem+2vw,2.4rem)] leading-none font-semibold tracking-[0.32em] text-accent"
          >
            Technologies
          </span>
        </h1>

        <p data-reveal-hero className="mt-6 max-w-xl text-base text-fg-muted sm:text-lg">
          Complete technology and supply solutions, built for Pakistan.
        </p>
        <div data-reveal-hero className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/contact#enquiry" size="lg" withArrow>
            Get a Quote
          </Button>
          <Button href="/services" variant="ghost" size="lg">
            Explore services
          </Button>
        </div>
      </div>

      {/* "Scroll for more" notch */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-t-3xl bg-white px-6 pt-3 pb-4 text-xs font-medium tracking-wide text-fg-subtle shadow-[0_-6px_20px_rgb(20_33_58/0.06)]">
          <span aria-hidden className="relative h-6 w-4 rounded-full ring-1 ring-fg-subtle/60">
            <span className="scroll-cue-dot absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />
          </span>
          Scroll for more
        </div>
      </div>

      {/* Branded loader: the logo mark and a ring that draws, under 600ms.
          Hidden with reduced motion; CSS fades it even without JavaScript. */}
      <div
        aria-hidden
        className="hero-loader pointer-events-none absolute inset-0 z-10 grid place-items-center bg-white group-data-loaded/hero:opacity-0"
      >
        <span className="relative grid size-20 place-items-center rounded-full bg-white shadow-soft ring-1 ring-line">
          <Image
            src="/logos/logo-without-text-removebg.webp"
            alt=""
            width={64}
            height={64}
            loading="eager"
            className="size-14 object-contain"
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#3f6d85"
              strokeWidth="2"
              pathLength="1"
              className="hero-loader-ring"
            />
          </svg>
        </span>
      </div>
    </section>
  );
}
