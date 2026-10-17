import { cn } from "@/lib/utils";

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
 * Consistent vertical rhythm between sections. Two tones alternate down the
 * page: charcoal (the page colour) and navy, a deep-navy wash whose top edge
 * carries a glowing rule so the shift between sections reads as connected.
 */
export function Section({
  className,
  children,
  id,
  tone = "charcoal",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tone?: "charcoal" | "navy";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate py-16 md:py-24 xl:py-32",
        tone === "navy" &&
          "bg-[linear-gradient(180deg,#14213a_0%,#172540_55%,#1b1f26_100%)]",
        className,
      )}
    >
      {tone === "navy" && (
        <span aria-hidden className="glow-line absolute inset-x-0 top-0" />
      )}
      {children}
    </section>
  );
}
