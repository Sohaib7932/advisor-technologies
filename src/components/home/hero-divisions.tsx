"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Icon } from "@/components/ui/icons";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

const CYCLE_MS = 3600;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Glass panel in the hero that walks through the six divisions. The progress
 * bar's CSS animation is the timer: when it ends the next division opens, and
 * pausing it on hover pauses the cycle with it. Hovering a row opens that row.
 * With reduced motion there is no timer; rows open on hover or focus only.
 */
export function HeroDivisions() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="w-full rounded-[1.75rem] bg-navy-950/45 p-2 shadow-float ring-1 ring-white/15 backdrop-blur-xl lg:w-[22rem] xl:w-[25rem]"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
        <span className="eyebrow text-[0.6875rem] text-navy-200">
          What we deliver
        </span>
        <span className="font-display text-xs font-medium text-white/60 tabular-nums">
          <span className="text-white">{String(active + 1).padStart(2, "0")}</span>
          {" / "}
          {String(services.length).padStart(2, "0")}
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {services.map((service, index) => {
          const isActive = index === active;

          return (
            <li key={service.id}>
              <Link
                href={`/services#${service.id}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cn(
                  "group relative block overflow-hidden rounded-2xl px-4 py-2.5 transition-colors duration-500 ease-out-soft",
                  isActive ? "bg-white/12" : "hover:bg-white/6",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-500",
                      isActive
                        ? "bg-white text-navy-900 ring-white"
                        : "bg-white/5 text-white/70 ring-white/15",
                    )}
                  >
                    <Icon name={service.icon} className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm font-medium transition-colors duration-500",
                      isActive ? "text-white" : "text-white/65",
                    )}
                  >
                    {service.title}
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "size-4 shrink-0 transition-all duration-500 ease-out-soft",
                      isActive
                        ? "translate-x-0 text-white opacity-100"
                        : "-translate-x-1 text-white/0 opacity-0",
                    )}
                  />
                </span>

                {/* Expands with a grid-rows transition, so the height animates
                    without measuring the text. */}
                <span
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-out-soft",
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <span className="overflow-hidden">
                    <span className="block pt-1.5 pl-11 text-xs leading-relaxed text-white/60">
                      {service.short}
                    </span>
                  </span>
                </span>

                {isActive && !reducedMotion && (
                  <span
                    key={active}
                    aria-hidden
                    onAnimationEnd={() => setActive((active + 1) % services.length)}
                    className="hero-progress absolute inset-x-4 bottom-0 h-px origin-left bg-linear-to-r from-sky-300/0 via-sky-300 to-white"
                    style={{
                      animationDuration: `${CYCLE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
