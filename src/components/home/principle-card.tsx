"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/lib/content";

/**
 * Dark glass principle card with a spotlight and border glow that follow the
 * cursor. The pointer position is written straight to CSS variables, so
 * moving the mouse never re-renders React.
 */
export function PrincipleCard({
  index,
  title,
  body,
  icon,
}: {
  index: number;
  title: string;
  body: string;
  icon: IconName;
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
      className="group/principle relative isolate h-full overflow-hidden rounded-2xl bg-linear-to-b from-navy-800/95 to-navy-900/95 p-5 shadow-float ring-1 ring-white/10 transition-[translate,box-shadow] duration-500 ease-out-soft [--spot-x:50%] [--spot-y:0%] hover:-translate-y-1 hover:ring-white/20"
    >
      {/* Cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/principle:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--spot-x) var(--spot-y), rgb(56 189 248 / 0.16), transparent 70%)",
        }}
      />
      {/* Border glow: a gradient ring masked to the 1px edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-500 group-hover/principle:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--spot-x) var(--spot-y), rgb(56 189 248 / 0.7), transparent 70%)",
          mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        }}
      />
      {/* Top highlight line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent"
      />

      <div className="flex items-start justify-between gap-4">
        <span className="relative flex h-12 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-navy-500/40 to-navy-700/40 text-navy-100 ring-1 ring-white/15 transition-[rotate,background-color,color] duration-500 ease-out-soft group-hover/principle:rotate-6 group-hover/principle:bg-navy-400/30 group-hover/principle:text-white">
          <Icon name={icon} className="size-4.5" />
        </span>
        <span className="font-display text-xs font-medium tabular-nums tracking-widest text-navy-400 transition-colors duration-500 group-hover/principle:text-sky-300">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-navy-200/85">
        {body}
      </p>
    </div>
  );
}
