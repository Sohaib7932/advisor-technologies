"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Bento card with a cursor-following spotlight and a glowing edge. The
 * pointer position is written straight to CSS variables, so moving the mouse
 * never re-renders React.
 */
export function GlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={cn(
        "group/glow card-surface relative isolate h-full overflow-hidden rounded-card transition-[translate,box-shadow] duration-500 ease-out-soft [--spot-x:50%] [--spot-y:0%] hover:-translate-y-1",
        className,
      )}
    >
      {/* Spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--spot-x) var(--spot-y), rgb(91 163 208 / 0.16), transparent 70%)",
        }}
      />
      {/* Edge glow: a gradient masked down to the 1px border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--spot-x) var(--spot-y), rgb(91 163 208 / 0.8), transparent 70%)",
          mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        }}
      />
      {/* Top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
      />
      {children}
    </div>
  );
}
