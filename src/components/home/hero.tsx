"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import type { HeroScene } from "./hero-scene";

const WORDS = ["Advisor", "Technologies"];

/**
 * Pinned, full-screen hero. Scroll assembles the six business pillars in 3D
 * and flies the wordmark's letters together until it locks in with a glow.
 * All text is real HTML (the canvas is decoration only). With reduced motion
 * the scene renders assembled and nothing pins.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HeroScene | null>(null);
  const progress = useRef(0);

  // Load three.js after first paint; the text never waits for it.
  useEffect(() => {
    let disposed = false;
    const node = canvas.current;
    if (!node) return;
    const mobile = window.matchMedia(MOTION.mobile).matches;
    const reduced = window.matchMedia(MOTION.reduced).matches;

    import("./hero-scene")
      .then(({ createHeroScene }) => {
        if (disposed) return;
        scene.current = createHeroScene(node, { mobile, reduced });
        scene.current.setProgress(reduced ? 1 : progress.current);
        node.dataset.ready = "true";
      })
      .catch(() => {
        // No WebGL: the gradient backdrop and the text carry the hero alone.
      });

    return () => {
      disposed = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { mobile: MOTION.mobile, motion: MOTION.ok },
        ({ conditions }) => {
          if (!conditions?.motion) return;
          const mobile = Boolean(conditions.mobile);
          const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
          const proxy = { p: 0 };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: mobile ? "+=130%" : "+=220%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            proxy,
            {
              p: 1,
              duration: 0.8,
              onUpdate: () => {
                progress.current = proxy.p;
                scene.current?.setProgress(proxy.p);
              },
            },
            0,
          )
            .to("[data-intro]", { autoAlpha: 0, y: -40, duration: 0.14 }, 0.04)
            .fromTo(
              letters,
              {
                x: () => gsap.utils.random(-0.45, 0.45) * window.innerWidth,
                y: () => gsap.utils.random(-0.35, 0.35) * window.innerHeight,
                rotation: () => gsap.utils.random(-70, 70),
                autoAlpha: 0,
                filter: mobile ? "none" : "blur(10px)",
              },
              {
                x: 0,
                y: 0,
                rotation: 0,
                autoAlpha: 1,
                filter: "blur(0px)",
                ease: "power3.out",
                duration: 0.32,
                stagger: { each: 0.012, from: "random" },
              },
              0.36,
            )
            .fromTo(
              "[data-glowline]",
              { scaleX: 0 },
              { scaleX: 1, duration: 0.12, ease: "expo.out" },
              0.8,
            )
            .to(
              "[data-title]",
              { textShadow: "0 0 42px rgba(91,163,208,0.55)", duration: 0.1 },
              0.82,
            )
            .fromTo(
              "[data-tail]",
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.04, ease: "power3.out" },
              0.86,
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="relative isolate h-svh min-h-[38rem] overflow-hidden bg-bg"
    >
      {/* Backdrop: deep navy into charcoal with a steel-blue glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_50%_35%,#22375a_0%,#14213a_45%,#1b1f26_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(40%_35%_at_50%_42%,rgb(91_163_208/0.18),transparent_70%)]"
      />
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 -z-10 size-full opacity-0 transition-opacity duration-1000 data-ready:opacity-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-bg via-bg/60 to-transparent"
      />

      {/* Opening line, shown while the pieces are still scattered */}
      <div
        data-intro
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-6 text-center"
      >
        <span className="eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/6 px-4 py-2 text-fg-muted ring-1 ring-white/12 backdrop-blur-md">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-glow opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-glow" />
          </span>
          Islamabad · Pakistan
        </span>
        <p className="mt-6 max-w-2xl font-display text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-fg">
          Six divisions.{" "}
          <span className="text-glow">One accountable partner.</span>
        </p>
      </div>

      {/* Assembled wordmark, tagline and actions */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-28 text-center sm:pb-32">
        <h1 data-title className="font-display font-extrabold text-fg uppercase">
          <span className="sr-only">
            {site.name}. Complete technology and supply solutions, built for
            Pakistan.
          </span>
          {WORDS.map((word, w) => (
            <span
              key={word}
              aria-hidden
              className={
                w === 0
                  ? "block text-hero"
                  : "mt-2 block text-[clamp(1.05rem,0.4rem+2.6vw,2.9rem)] leading-none font-semibold tracking-[0.32em] text-fg-muted"
              }
            >
              {word.split("").map((letter, i) => (
                <span key={i} data-letter className="motion-hide inline-block">
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <span
          data-glowline
          aria-hidden
          className="glow-line mt-6 block w-[min(32rem,70vw)] origin-center"
        />
        <p
          data-tail
          className="motion-hide mt-6 max-w-xl text-base text-fg-muted sm:text-lg"
        >
          Complete technology and supply solutions, built for Pakistan.
        </p>
        <div
          data-tail
          className="motion-hide mt-7 flex flex-wrap justify-center gap-3"
        >
          <Button href="/contact#enquiry" size="lg" withArrow>
            Get a Quote
          </Button>
          <Button href="/services" variant="ghost" size="lg">
            Explore services
          </Button>
        </div>
      </div>

      {/* "Scroll for more" notch cut into the bottom edge */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-t-3xl bg-bg px-6 pt-3 pb-4 text-xs font-medium tracking-wide text-fg-subtle">
          <span
            aria-hidden
            className="relative h-6 w-4 rounded-full ring-1 ring-fg-subtle/60"
          >
            <span className="scroll-cue-dot absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-glow" />
          </span>
          Scroll for more
        </div>
      </div>
    </section>
  );
}
