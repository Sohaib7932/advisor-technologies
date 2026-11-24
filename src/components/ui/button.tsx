import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "md" | "sm";
export type ButtonState = "idle" | "loading" | "success";

type ButtonProps = {
  /** Renders a Next.js Link when set, otherwise a <button>. */
  href?: string;
  /** primary: navy fill (white on dark). secondary: outline. link: text + arrow. */
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
 * 2px; press scales to .97. The magnetic pull (fine pointers only) is one
 * delegated listener in ViewportFx, so buttons hydrate nothing.
 */
export function Button({ href, variant = "primary", size = "md", state = "idle", className, children, ...props }: ButtonProps) {
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
      <Link href={href} className={classes} data-size={size} data-magnetic="">
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} data-size={size} data-state={state} data-magnetic="" aria-busy={state === "loading" || undefined} {...props}>
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
