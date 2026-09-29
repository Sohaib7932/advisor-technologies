"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1600;

/**
 * Counts a figure like "25+" up from zero the first time it scrolls into
 * view. The server renders the final value, so it reads correctly without
 * JavaScript; the count writes straight to the DOM rather than through state,
 * so it never re-renders React on each frame.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!node || !match || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(match[1]);
    const suffix = match[2];

    // Already on screen at load: leave the final value rather than flashing to 0.
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    node.textContent = `0${suffix}`;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          node.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
