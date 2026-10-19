import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/atmosphere";

/** Page gutter + max width. Every section uses this so edges stay aligned. */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "wide" && "max-w-[110rem]",
        size === "default" && "max-w-[80rem]",
        size === "narrow" && "max-w-[56rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Consistent vertical rhythm between sections. A section never paints an
 * opaque background of its own: it declares a `tone`, which the fixed global
 * layer (Atmosphere) cross-fades to as the section scrolls in, and an optional
 * `backdrop` (a SectionBackdrop) layered on top with soft, masked edges.
 */
export function Section({
  className,
  children,
  id,
  tone = "base",
  backdrop,
  divider = false,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tone?: Tone;
  backdrop?: React.ReactNode;
  /** A thin glowing line along the top edge. */
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn("relative isolate py-16 md:py-24 xl:py-32", className)}
    >
      {backdrop}
      {divider && (
        <span aria-hidden className="glow-line absolute inset-x-[8%] top-0 opacity-60" />
      )}
      {children}
    </section>
  );
}
