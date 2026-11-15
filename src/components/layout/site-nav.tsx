"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Close, Menu } from "@/components/ui/icons";
import { gsap, MOTION, NAV } from "@/lib/motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Brand, isActivePath, navLinks } from "./brand";
import { menu, useMenuOpen } from "./nav-store";

/**
 * The compact floating pill that takes over from the notched header once
 * the page scrolls past NAV.showAfter. The first time it appears near the
 * top it morphs out of the header's tab (it starts at the tab's position
 * and size and settles into place in NAV.morph seconds). After that it
 * hides while scrolling down and returns on scroll up. Solid white, always
 * above content and the hero canvas.
 */
export function FloatingNav() {
  const pathname = usePathname();
  const pill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pill.current;
    if (!el) return;
    const reduced = window.matchMedia(MOTION.reduced).matches;
    let shown = false;
    let last = window.scrollY;
    gsap.set(el, { autoAlpha: 0, yPercent: -140 });

    const tabLinks = () => document.querySelector<HTMLElement>("[data-notch-links]");

    const show = (fromTab: boolean) => {
      shown = true;
      gsap.killTweensOf(el);
      const tab = document.querySelector<HTMLElement>("[data-notch-tab]");
      if (reduced) {
        gsap.set(el, { autoAlpha: 1, yPercent: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
        return;
      }
      if (fromTab && tab && tab.offsetWidth > 0) {
        // Morph: start exactly over the tab, then settle into the pill.
        gsap.set(el, { yPercent: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
        const p = el.getBoundingClientRect();
        const t = tab.getBoundingClientRect();
        gsap.fromTo(
          el,
          {
            x: t.left + t.width / 2 - (p.left + p.width / 2),
            y: t.top + t.height / 2 - (p.top + p.height / 2),
            scaleX: t.width / p.width,
            scaleY: t.height / p.height,
            autoAlpha: 0,
          },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, autoAlpha: 1, duration: NAV.morph, ease: "power3.out" },
        );
        const links = tabLinks();
        if (links) gsap.to(links, { autoAlpha: 0, duration: NAV.morph * 0.6 });
      } else {
        gsap.fromTo(el, { yPercent: -140, autoAlpha: 1 }, { yPercent: 0, duration: NAV.morph, ease: "power3.out" });
      }
    };

    const hide = (toTop: boolean) => {
      shown = false;
      gsap.killTweensOf(el);
      if (reduced) {
        gsap.set(el, { autoAlpha: 0 });
      } else if (toTop) {
        gsap.to(el, { autoAlpha: 0, y: -12, duration: NAV.morph * 0.6, ease: "power2.out" });
      } else {
        gsap.to(el, { yPercent: -140, duration: NAV.morph, ease: "power2.in" });
      }
      if (toTop) {
        const links = tabLinks();
        if (links) gsap.to(links, { autoAlpha: 1, duration: NAV.morph });
      }
    };

    let first = true;
    const onScroll = () => {
      const y = window.scrollY;
      // Arriving mid-page (reload, anchor link): show the pill straight away.
      if (first) {
        first = false;
        last = y;
        if (y > NAV.showAfter) show(false);
        return;
      }
      const down = y > last + 2;
      const up = y < last - 2;
      last = y;
      if (y <= NAV.showAfter) {
        if (shown) hide(true);
        return;
      }
      if (!shown && (up || y < NAV.hideAfter)) show(y < NAV.hideAfter * 1.5);
      else if (shown && down && y > NAV.hideAfter) hide(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(el);
    };
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-(--inset) pt-3">
      <div
        ref={pill}
        className="nav-pill invisible pointer-events-auto flex h-16 w-full max-w-[64rem] items-center gap-4 rounded-full bg-white py-2 pr-2 pl-3 shadow-card ring-1 ring-line"
      >
        <Brand compact />
        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-7">
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
        <Button href="/contact#enquiry" size="sm" className="hidden lg:inline-flex">
          Get a Quote
        </Button>
        <button
          type="button"
          onClick={() => menu.set(true)}
          aria-label="Open menu"
          className="ml-auto grid size-11 place-items-center rounded-full text-navy ring-1 ring-line transition-colors hover:bg-mist lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}

/**
 * Phone menu: a full-height white panel with large links and the primary
 * button. Links rise in with a short stagger. Escape or any link closes it.
 */
export function MobileMenu() {
  const open = useMenuOpen();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on navigation.
  useEffect(() => {
    menu.set(false);
  }, [pathname]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reduced = window.matchMedia(MOTION.reduced).matches;
    if (open) {
      gsap.set(el, { autoAlpha: 1 });
      if (!reduced) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0 round 2.5rem)" }, { clipPath: "inset(0 0 0% 0 round 0rem)", duration: 0.5, ease: "expo.out" });
        gsap.fromTo(el.querySelectorAll("[data-menu-item]"), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out", stagger: 0.06, delay: 0.12 });
      }
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && menu.set(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    gsap.to(el, { autoAlpha: 0, duration: reduced ? 0 : 0.25 });
  }, [open]);

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-white px-(--gutter) pt-4 pb-8 opacity-0 lg:hidden"
    >
      <div className="flex h-16 items-center justify-between">
        <Brand />
        <button
          ref={closeRef}
          type="button"
          onClick={() => menu.set(false)}
          aria-label="Close menu"
          className="grid size-11 place-items-center rounded-full text-navy ring-1 ring-line"
        >
          <Close className="size-5" />
        </button>
      </div>
      <nav aria-label="Mobile" className="mt-8 flex-1">
        <ul className="divide-y divide-line">
          {navLinks.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href} data-menu-item>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => menu.set(false)}
                  className={cn("flex items-baseline justify-between py-4 font-display text-3xl font-bold tracking-tight", active ? "text-steel" : "text-navy")}
                >
                  {item.label}
                  {item.description && <span className="text-sm font-normal tracking-normal text-text-3">{item.description}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div data-menu-item className="mt-8 flex flex-col gap-4">
        <Button href="/contact#enquiry" className="justify-between">
          Get a Quote
        </Button>
        <a href={`tel:${site.contact.phoneHref}`} className="text-sm font-medium text-text-2">
          {site.contact.phone}
        </a>
      </div>
    </div>
  );
}
