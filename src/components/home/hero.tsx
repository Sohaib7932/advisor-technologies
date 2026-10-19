"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import type { HeroScene } from "./hero-scene";

const WORDS = ["Advisor", "Technologies"];

/** 16px blurred version of the plate, shown while it loads. */
const PLATE_BLUR =
  "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAkAA4BaJYwCdADzmXpoAAD+8udlTnTPnAs1NQzGxm7xP14mIDl98K8AAA==";

/**
 * Pinned, full-screen showroom hero. Scroll assembles the six business
 * pillars onto their display stands and flies the wordmark's letters
 * together until it locks in with a glow.
 *
 * Layers, back to front: room canvas (walls, mirror floor, pendant, beam,
 * haze, the title's glow and its floor reflection) · CSS haze · the HTML
 * title · objects canvas
 * (the pieces overlap the bottom of the letters) · grain and vignette · UI.
 * All text is real HTML; with reduced motion the scene renders composed and
 * nothing pins.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const roomCanvas = useRef<HTMLCanvasElement>(null);
  const frontCanvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HeroScene | null>(null);
  const progress = useRef(0);

  // Load three.js after first paint; the text never waits for it.
  useEffect(() => {
    let disposed = false;
    const room = roomCanvas.current;
    const front = frontCanvas.current;
    if (!room || !front) return;
    const mobile = window.matchMedia(MOTION.mobile).matches;
    const reduced = window.matchMedia(MOTION.reduced).matches;

    import("./hero-scene")
      .then(({ createHeroScene }) => {
        if (disposed) return;
        scene.current = createHeroScene({ room, front }, { mobile, reduced });
        scene.current.setProgress(reduced ? 1 : progress.current);
        root.current?.setAttribute("data-scene", "ready");
      })
      .catch(() => {
        // No WebGL: the CSS room backdrop and the text carry the hero alone.
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
            // Layer parallax: the plate settles in, haze drifts most, the title a little.
            .fromTo("[data-plate]", { scale: 1.04 }, { scale: 1, duration: 1 }, 0)
            .fromTo("[data-haze]", { yPercent: 0 }, { yPercent: -12, duration: 1 }, 0)
            .fromTo("[data-title-wrap]", { y: 30 }, { y: 0, duration: 0.85, ease: "power2.out" }, 0)
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
              {
                textShadow: "0 0 28px rgba(91,163,208,0.55), 0 0 80px rgba(91,163,208,0.35)",
                duration: 0.12,
              },
              0.8,
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
      data-tone="deep"
      className="group/hero relative isolate h-svh min-h-[38rem] overflow-hidden bg-[#10151d]"
    >
      {/* Layer 0a: CSS room, shown until (or instead of) the 3D room */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#14213a_0%,#172540_48%,#141922_62%,#10151d_100%)]"
      />
      {/* Layer 0b: the showroom photo; settles in from a slight zoom on scroll */}
      <div data-plate className="absolute inset-0 origin-[50%_60%]">
        <Image
          src="/images/hero/hero-bg.webp"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 100vw, 1px"
          placeholder="blur"
          blurDataURL={PLATE_BLUR}
          className="hidden object-cover md:block"
        />
        <Image
          src="/images/hero/hero-bg-mobile.webp"
          alt=""
          fill
          loading="eager"
          sizes="(max-width: 767px) 100vw, 1px"
          placeholder="blur"
          blurDataURL={PLATE_BLUR}
          className="object-cover md:hidden"
        />
        {/* Dims the plate so the title and pieces carry the frame (AA contrast) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_12_22/0.25)_0%,transparent_25%,transparent_70%,rgb(6_12_22/0.35)_100%)]" />
      </div>

      {/* Layer 0c: stage, light ring, haze and title glow over the photo */}
      <canvas
        ref={roomCanvas}
        aria-hidden
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000 group-data-[scene=ready]/hero:opacity-100"
      />

      {/* Layer 1: haze drifting across the room */}
      <div
        data-haze
        aria-hidden
        className="pointer-events-none absolute -inset-x-[10%] top-[5%] h-[90%] bg-[radial-gradient(40%_30%_at_30%_40%,rgb(91_163_208/0.10),transparent_70%),radial-gradient(35%_25%_at_72%_32%,rgb(63_109_133/0.12),transparent_70%)] mix-blend-screen"
      />

      {/* Layer 2: the wordmark on the back wall. From md up it is anchored to
          the floor line (bottom 48%), which scales with the screen height
          just as the photo and the 3D pieces do, and its size is capped by
          height so it never reaches the navbar on short screens. */}
      <div
        data-title-wrap
        className="absolute inset-x-0 top-[24%] flex flex-col items-center px-4 text-center md:top-auto md:bottom-[48%]"
      >
        <h1
          data-title
          className="font-display font-extrabold text-fg uppercase [text-shadow:0_0_24px_rgba(91,163,208,0.25)]"
        >
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
                  ? "block text-hero md:text-[min(clamp(3rem,0.6rem+9.4vw,11rem),19svh)]"
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
      </div>

      {/* Layer 3: the display pieces, in front of the title */}
      <canvas
        ref={frontCanvas}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-1000 group-data-[scene=ready]/hero:opacity-100"
      />

      {/* Layer 4: film grain, vignette and the scrim under the actions */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_45%,transparent_65%,rgba(8,11,16,0.45)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-linear-to-t from-bg/90 via-bg/45 to-transparent"
      />

      {/* UI: opening line, shown while the pieces still drift */}
      <div
        data-intro
        className="motion-only absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-6 text-center"
      >
        <span className="eyebrow inline-flex items-center gap-2.5 rounded-full bg-bg/50 px-4 py-2 text-fg-muted ring-1 ring-white/12 backdrop-blur-md">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-glow opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-glow" />
          </span>
          Islamabad · Pakistan
        </span>
        <p className="mt-6 max-w-2xl font-display text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-fg [text-shadow:0_2px_24px_rgba(8,11,16,0.8)]">
          Six divisions.{" "}
          <span className="text-glow">One accountable partner.</span>
        </p>
      </div>

      {/* UI: tagline and actions, over a scrim on the floor */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-24 text-center sm:pb-28 [@media(max-height:800px)]:pb-14">
        <span
          data-glowline
          aria-hidden
          className="glow-line block w-[min(32rem,70vw)] origin-center [@media(max-height:800px)]:hidden"
        />
        <p
          data-tail
          className="motion-hide mt-5 max-w-xl text-base text-fg-muted sm:text-lg [@media(max-height:800px)]:mt-2 [@media(max-height:800px)]:text-base"
        >
          Complete technology and supply solutions, built for Pakistan.
        </p>
        <div
          data-tail
          className="motion-hide mt-6 flex flex-wrap justify-center gap-3 [@media(max-height:800px)]:mt-4"
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
