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

/** Consistent vertical rhythm between sections. */
export function Section({
  className,
  children,
  id,
  tone = "canvas",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tone?: "canvas" | "surface" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28 lg:py-32",
        tone === "surface" && "bg-surface",
        tone === "dark" && "bg-navy-950 text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}
