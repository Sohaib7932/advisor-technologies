"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Close, Menu } from "@/components/ui/icons";

/** Top-level links; the logo itself is the way home. */
const links = mainNav.filter((item) => item.href !== "/");

export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Solid from first paint. Slides away while scrolling down past the first
  // screen, and comes back the moment the reader scrolls up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    // z-[100]: above every section, pinned layer and the hero canvases.
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-3 transition-transform duration-500 ease-out-soft sm:px-5 sm:pt-4",
        hidden && !open && "-translate-y-[130%]",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "glass pointer-events-auto mx-auto flex h-16 max-w-[76rem] items-center justify-between rounded-full pr-2.5 pl-4 shadow-soft ring-1 ring-[var(--glass-edge)] sm:pl-5",
        )}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${site.name} home`}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-line">
            <Image
              src="/logos/logo-without-text-removebg.webp"
              alt=""
              width={40}
              height={40}
              loading="eager"
              className="size-8 object-contain"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.9375rem] font-bold tracking-tight text-fg">
              Advisor
            </span>
            <span className="mt-0.5 text-[0.5625rem] font-semibold tracking-[0.22em] text-fg-subtle uppercase">
              Technologies
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-300",
                    active ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-4 bottom-1.5 h-px origin-left bg-accent transition-transform duration-500 ease-out-soft",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/contact#enquiry"
            className="group hidden h-11 items-center gap-2 rounded-full bg-glow px-5 text-sm font-semibold text-on-glow shadow-glow transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#4a8fbd] sm:inline-flex"
          >
            Get a Quote
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-full bg-surface-2 text-fg ring-1 ring-line transition-colors duration-300 hover:ring-accent/50 lg:hidden"
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="pointer-events-auto mx-auto mt-3 max-w-[76rem] overflow-hidden rounded-panel bg-white p-3 shadow-float ring-1 ring-line lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors",
                  isActive(item.href)
                    ? "bg-bg-raised text-fg ring-1 ring-accent/30"
                    : "text-fg-muted hover:bg-canvas hover:text-fg",
                )}
              >
                <span className="flex flex-col">
                  <span className="font-display text-lg font-semibold tracking-tight">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 text-[0.8125rem] text-fg-subtle">
                      {item.description}
                    </span>
                  )}
                </span>
                <ArrowUpRight className="size-4 shrink-0 opacity-60" />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact#enquiry"
          onClick={() => setOpen(false)}
          className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-glow font-semibold text-on-glow transition-colors hover:bg-[#4a8fbd]"
        >
          Get a Quote
          <ArrowUpRight className="size-4" />
        </Link>

        <div className="mt-3 flex flex-col gap-1 rounded-2xl bg-canvas px-4 py-3.5 text-sm">
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="font-medium text-fg hover:underline"
          >
            {site.contact.phone}
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="text-fg-subtle hover:underline"
          >
            {site.contact.email}
          </a>
        </div>
      </div>
    </header>
  );
}
