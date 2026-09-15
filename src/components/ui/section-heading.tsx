import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2.5",
        tone === "dark" ? "text-navy-600" : "text-navy-200",
        className,
      )}
    >
      <span
        className={cn(
          "h-px w-6",
          tone === "dark" ? "bg-navy-600/50" : "bg-navy-200/50",
        )}
      />
      {children}
    </span>
  );
}

/**
 * The paired label + statement layout used at the top of most sections:
 * a small eyebrow on the left, a large statement on the right.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "split",
  tone = "dark",
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "split" | "center" | "left";
  tone?: "dark" | "light";
  className?: string;
  action?: React.ReactNode;
}) {
  const muted = tone === "dark" ? "text-graphite-600" : "text-navy-200";
  const strong = tone === "dark" ? "text-ink" : "text-white";

  if (align === "split") {
    return (
      <div
        className={cn(
          "grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12",
          className,
        )}
      >
        <Reveal className="lg:col-span-4">
          {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
          {lead && (
            <p className={cn("mt-5 max-w-xs text-sm leading-relaxed", muted)}>
              {lead}
            </p>
          )}
          {action && <div className="mt-7 hidden lg:block">{action}</div>}
        </Reveal>
        <Reveal delay={80} className="lg:col-span-8">
          <h2 className={cn("text-headline", strong)}>{title}</h2>
        </Reveal>
        {action && <div className="lg:hidden">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-3xl",
        className,
      )}
    >
      <Reveal>
        {eyebrow && (
          <Eyebrow tone={tone} className={align === "center" ? "justify-center" : ""}>
            {eyebrow}
          </Eyebrow>
        )}
        <h2 className={cn("mt-5 text-headline", strong)}>{title}</h2>
        {lead && (
          <p
            className={cn(
              "mt-6 text-base leading-relaxed sm:text-lg",
              align === "center" && "mx-auto max-w-2xl",
              muted,
            )}
          >
            {lead}
          </p>
        )}
        {action && <div className="mt-8">{action}</div>}
      </Reveal>
    </div>
  );
}
