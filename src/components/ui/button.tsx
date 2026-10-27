"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow] duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Glow-blue CTA with navy text (6.0:1); deepens on hover (navy on #4a8fbd: 4.9:1).
  primary: "bg-glow text-on-glow shadow-glow hover:bg-[#4a8fbd]",
  // Tokens make these work in both themes: navy outline on light,
  // light outline inside dark scopes.
  secondary:
    "bg-surface-2 text-fg ring-1 ring-inset ring-line hover:ring-accent/60 hover:shadow-glow",
  ghost:
    "text-fg ring-1 ring-inset ring-fg/35 hover:bg-fg/6 hover:ring-fg/70",
  light: "bg-fg text-bg shadow-soft hover:shadow-glow",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-12 px-7 text-[0.9375rem] xl:h-14 xl:px-8 xl:text-base",
};

type ButtonProps = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/**
 * Pill button. Primary buttons are magnetic: they lean a few pixels toward
 * the pointer (gsap.quickTo, transform only) and spring back on leave.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow = false,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const classes = cn(base, variants[variant], sizes[size], className);

  useGSAP(
    (_, contextSafe) => {
      const node = ref.current;
      if (!node || variant !== "primary" || !contextSafe) return;
      if (!window.matchMedia(`${MOTION.ok} and (hover: hover)`).matches) return;

      const toX = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" });
      const toY = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" });
      const onMove = contextSafe((event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        toX((event.clientX - rect.left - rect.width / 2) * 0.25);
        toY((event.clientY - rect.top - rect.height / 2) * 0.35);
      });
      const onLeave = contextSafe(() => {
        toX(0);
        toY(0);
      });
      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [variant] },
  );

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowUpRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
