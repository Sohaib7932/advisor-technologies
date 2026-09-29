"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Segment = {
  text: string;
  /** Colour for this segment's words once lit, written with the `data-lit:`
   *  variant (e.g. "data-lit:text-ink") so Tailwind can see the class. */
  litClass: string;
};

/**
 * A statement that lights up word by word as it scrolls through the viewport.
 * Words start in a faint tone and take their segment's colour as the reader
 * passes them. The server renders every word lit, so without JavaScript (or
 * with reduced motion) it simply reads as finished text.
 */
export function ScrollHighlight({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = Array.from(node.querySelectorAll<HTMLElement>("[data-word]"));
    let frame = 0;
    let lastLit = -1;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Starts as the paragraph's top reaches 85% down the screen, completes
      // as its bottom passes the 45% line.
      const progress =
        (viewport * 0.85 - rect.top) / (rect.height + viewport * 0.4);
      const lit = Math.round(Math.min(Math.max(progress, 0), 1) * words.length);
      if (lit === lastLit) return;
      lastLit = lit;
      words.forEach((word, index) => word.toggleAttribute("data-lit", index < lit));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      words.forEach((word) => word.setAttribute("data-lit", ""));
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {segments.map((segment, segmentIndex) =>
        segment.text
          .split(/(\s+)/)
          .map((part, index) =>
            /^\s+$/.test(part) || part === "" ? (
              part
            ) : (
              <span
                key={`${segmentIndex}-${index}`}
                data-word
                data-lit=""
                className={cn(
                  "text-graphite-300 transition-colors duration-300 ease-out-soft",
                  segment.litClass,
                )}
              >
                {part}
              </span>
            ),
          ),
      )}
    </p>
  );
}
