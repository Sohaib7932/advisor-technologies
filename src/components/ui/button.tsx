"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "md" | "sm";
export type ButtonState = "idle" | "loading" | "success";

type ButtonProps = {
  /** Renders a Next.js Link when set, otherwise a <button>. */
  href?: string;
  /** primary: sky fill. secondary: outline (navy on light, white on dark). link: text + arrow. */
  variant?: ButtonVariant;
  /** md is 48px tall, sm is 40px. */
  size?: ButtonSize;
  /** Form buttons: loading spins the chip, success shows a tick. */
  state?: ButtonState;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/**
 * The site's one button. Pill, label plus an arrow-in-a-circle chip.
 * Hover (CSS, see `.btn` in globals.css): a darker fill wipes in from the
 * left, the chip turns 45° up-right, the label nudges 2px, the button lifts
 * 2px; press scales to .97. On fine pointers it is also magnetic: it leans
 * up to 6px toward the pointer (GSAP quickTo, transform only).
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  state = "idle",
  className,
  children,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const node = ref.current;
      if (!node || variant === "link" || !contextSafe) return;
      if (!window.matchMedia(`${MOTION.ok} and (hover: hover) and (pointer: fine)`).matches) return;

      const toX = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" });
      const toY = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-6, 6);
      const onMove = contextSafe((event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        toX(clamp((event.clientX - rect.left - rect.width / 2) * 0.12));
        toY(clamp((event.clientY - rect.top - rect.height / 2) * 0.25));
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

  if (variant === "link") {
    const content = (
      <>
        <span>{children}</span>
        <ArrowRight aria-hidden />
      </>
    );
    return href ? (
      <Link href={href} className={cn("btn-link", className)}>
        {content}
      </Link>
    ) : (
      <button className={cn("btn-link", className)} {...props}>
        {content}
      </button>
    );
  }

  const classes = cn("btn", variant === "primary" ? "btn-primary" : "btn-secondary", className);
  const content = (
    <>
      <span className="btn-label">{children}</span>
      <span className="btn-chip" aria-hidden>
        {state === "success" ? <Check /> : state === "loading" ? <Spinner /> : <ArrowRight />}
      </span>
    </>
  );

  if (href) {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} data-size={size}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      data-size={size}
      data-state={state}
      aria-busy={state === "loading" || undefined}
      {...props}
    >
      {content}
    </button>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
