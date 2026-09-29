"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Sticky jump bar for the catalogue. It highlights whichever category
 * section is crossing the upper part of the screen, so it doubles as a
 * "you are here" marker while scrolling.
 */
export function CatalogueNav({
  items,
}: {
  items: { id: string; label: string; icon: IconName; count: number }[];
}) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);

    // A thin band a third of the way down the screen: whichever section
    // overlaps it is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Catalogue categories"
      className="sticky top-22 z-30 sm:top-26"
    >
      <ul className="no-scrollbar mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white/85 p-1.5 shadow-lift ring-1 ring-navy-900/8 backdrop-blur-xl">
        {items.map((item) => {
          const isActive = item.id === active;

          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                  isActive
                    ? "bg-navy-950 text-white"
                    : "text-graphite-600 hover:bg-canvas hover:text-navy-900",
                )}
              >
                <Icon name={item.icon} className="size-4" />
                {item.label}
                <span
                  className={cn(
                    "grid min-w-5 place-items-center rounded-full px-1.5 text-[0.6875rem] tabular-nums",
                    isActive ? "bg-white/15 text-white" : "bg-canvas text-graphite-500",
                  )}
                >
                  {item.count}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
