"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Brand, isActivePath, navLinks } from "./brand";
import { menu } from "./nav-store";

/** Panel corner radius, tab corner radius and shoulder radius (px). */
const R = 40;
const TAB_R = 24;
const SHOULDER = 24;

type Geometry = { w: number; h: number; top: number; x1: number; x2: number };

/**
 * The silhouette: a rounded panel whose top edge rises into a tab between
 * x1 and x2, joined by concave (inverse-radius) shoulders, as in ref 1.
 * With no tab (x2 <= x1) it is a plain rounded rectangle.
 */
function silhouette({ w, h, top: t, x1, x2 }: Geometry) {
  const r = Math.min(R, (h - t) / 2);
  const parts = [`M0 ${t + r}`, `A${r} ${r} 0 0 1 ${r} ${t}`];
  if (x2 - x1 > TAB_R * 2) {
    parts.push(
      `L${x1 - SHOULDER} ${t}`,
      `A${SHOULDER} ${SHOULDER} 0 0 0 ${x1} ${t - SHOULDER}`,
      `L${x1} ${TAB_R}`,
      `A${TAB_R} ${TAB_R} 0 0 1 ${x1 + TAB_R} 0`,
      `L${x2 - TAB_R} 0`,
      `A${TAB_R} ${TAB_R} 0 0 1 ${x2} ${TAB_R}`,
      `L${x2} ${t - SHOULDER}`,
      `A${SHOULDER} ${SHOULDER} 0 0 0 ${x2 + SHOULDER} ${t}`,
    );
  }
  parts.push(
    `L${w - r} ${t}`,
    `A${r} ${r} 0 0 1 ${w} ${t + r}`,
    `L${w} ${h - r}`,
    `A${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L${r} ${h}`,
    `A${r} ${r} 0 0 1 0 ${h - r}`,
    "Z",
  );
  return parts.join(" ");
}

/**
 * The first panel of every page, with the site header built into it. The
 * logo sits in the white strip at top-left, the "Get a Quote" button at
 * top-right, and the nav links ride in a raised tab of the dark panel
 * (desktop). Phones get the logo and a menu button instead.
 *
 * The shape is one SVG path generated from measured sizes (ResizeObserver),
 * so it stays crisp at every width. Before it is measured, CSS paints the
 * same panel and tab without the shoulders, so first paint already reads
 * correctly.
 */
export function NotchedPanel({
  children,
  backdrop,
  className,
  bodyClassName,
}: {
  children: React.ReactNode;
  /** Decoration clipped to the panel body, behind the content. */
  backdrop?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);
  const tab = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const gradientId = useId();

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const tabEl = tab.current;
      const visible = !!tabEl && tabEl.offsetWidth > 0;
      setGeo({
        w: el.offsetWidth,
        h: el.offsetHeight,
        top: body.current?.offsetTop ?? 76,
        x1: visible ? tabEl.offsetLeft : 0,
        x2: visible ? tabEl.offsetLeft + tabEl.offsetWidth : 0,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (tab.current) observer.observe(tab.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrap} data-notched className={cn("frame relative isolate mt-2 sm:mt-3", className)}>
      {geo && (
        <svg
          aria-hidden
          data-notch-svg
          className="pointer-events-none absolute inset-0 -z-10 size-full"
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={geo.w * 0.4} y2={geo.h}>
              <stop offset="0" stopColor="#0b1626" />
              <stop offset="1" stopColor="#14213a" />
            </linearGradient>
          </defs>
          <path d={silhouette(geo)} fill={`url(#${gradientId})`} />
        </svg>
      )}

      {/* Header strip: logo on white, nav tab in the panel, button on white */}
      <div className="relative flex h-(--header-h) items-center gap-4 pl-1 sm:pl-2">
        <Brand />
        <div className="flex-1 lg:hidden" />
        <nav
          ref={tab}
          data-notch-tab
          aria-label="Main"
          data-theme="dark"
          className={cn(
            "mr-7 ml-[clamp(1.5rem,4vw,5rem)] hidden h-full flex-1 items-center justify-center self-start px-6 lg:flex xl:mr-10 xl:px-10",
            !geo && "rounded-t-[24px] bg-ink",
          )}
        >
          <ul data-notch-links className="flex items-center gap-[clamp(1.25rem,3.2vw,3.5rem)]">
            {navLinks.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Button href="/contact#enquiry" size="sm" className="hidden shrink-0 lg:inline-flex xl:hidden">
          Get a Quote
        </Button>
        <Button href="/contact#enquiry" className="hidden shrink-0 xl:inline-flex">
          Get a Quote
        </Button>
        <button
          type="button"
          onClick={() => menu.set(true)}
          aria-label="Open menu"
          className="grid size-11 place-items-center rounded-full text-navy ring-1 ring-line transition-colors hover:bg-mist lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <div
        ref={body}
        data-panel-body
        data-theme="dark"
        className={cn(
          "relative isolate overflow-hidden rounded-(--radius-panel)",
          !geo && "bg-ink",
          bodyClassName,
        )}
      >
        {backdrop}
        {children}
      </div>
    </div>
  );
}
