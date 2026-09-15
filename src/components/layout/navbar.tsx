"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Close, Menu } from "@/components/ui/icons";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Swap the pill from transparent to solid once the hero starts scrolling away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        aria-label="Main"
        className={cn(
          "pointer-events-auto mx-auto flex h-16 max-w-[76rem] items-center justify-between rounded-full pl-5 pr-2.5 transition-all duration-500 ease-out-soft sm:h-[4.5rem] sm:pl-7 sm:pr-3",
          open
            ? "bg-surface shadow-float ring-1 ring-navy-900/8"
            : scrolled
              ? "glass shadow-float ring-1 ring-navy-900/8"
              : "bg-white/12 ring-1 ring-white/20 backdrop-blur-md",
        )}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${site.name} home`}
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-500 sm:size-11",
              scrolled || open ? "bg-transparent" : "bg-white shadow-soft",
            )}
          >
            <Image
              src="/logos/logo-without-text-removebg.webp"
              alt=""
              width={44}
              height={44}
              priority
              className="size-8 object-contain sm:size-9"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-[0.9375rem] font-bold tracking-tight transition-colors duration-500 sm:text-base",
                scrolled || open ? "text-navy-900" : "text-white",
              )}
            >
              Advisor
            </span>
            <span
              className={cn(
                "mt-0.5 text-[0.5625rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500 sm:text-[0.625rem]",
                scrolled || open ? "text-graphite-500" : "text-white/70",
              )}
            >
              Technologies
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-300",
                  scrolled
                    ? isActive(item.href)
                      ? "bg-navy-600 text-white"
                      : "text-graphite-600 hover:bg-navy-900/6 hover:text-navy-900"
                    : isActive(item.href)
                      ? "bg-white text-navy-900"
                      : "text-white/80 hover:bg-white/15 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/contact#enquiry"
            className={cn(
              "group hidden h-11 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium transition-all duration-300 sm:inline-flex",
              scrolled || open
                ? "bg-navy-600 text-white hover:bg-navy-700"
                : "bg-white text-navy-900 hover:bg-navy-50",
            )}
          >
            Request a quote
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full transition-colors duration-300 lg:hidden",
              scrolled || open
                ? "bg-navy-900/6 text-navy-900 hover:bg-navy-900/10"
                : "bg-white/15 text-white hover:bg-white/25",
            )}
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="pointer-events-auto mx-auto mt-3 max-w-[76rem] overflow-hidden rounded-panel bg-surface p-3 shadow-float ring-1 ring-navy-900/8 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors",
                  isActive(item.href)
                    ? "bg-navy-600 text-white"
                    : "hover:bg-navy-50",
                )}
              >
                <span className="flex flex-col">
                  <span className="font-display text-lg font-semibold tracking-tight">
                    {item.label}
                  </span>
                  {item.description && (
                    <span
                      className={cn(
                        "mt-0.5 text-[0.8125rem]",
                        isActive(item.href) ? "text-navy-100" : "text-graphite-500",
                      )}
                    >
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
          className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-navy-900 py-4 font-medium text-white transition-colors hover:bg-navy-800"
        >
          Request a quote
          <ArrowUpRight className="size-4" />
        </Link>

        <div className="mt-3 flex flex-col gap-1 rounded-2xl bg-canvas px-4 py-3.5 text-sm">
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="font-medium text-navy-800 hover:underline"
          >
            {site.contact.phone}
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="text-graphite-500 hover:underline"
          >
            {site.contact.email}
          </a>
        </div>
      </div>
    </header>
  );
}
