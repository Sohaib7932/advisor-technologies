import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn("eyebrow inline-flex items-center gap-3 text-accent", className)}
    >
      <span
        aria-hidden
        className="h-px w-8 bg-linear-to-r from-transparent to-glow shadow-[0_0_8px_rgb(91_163_208/0.7)]"
      />
      {children}
    </span>
  );
}

/**
 * The label + statement pair at the top of most sections. Titles are bold
 * uppercase display type; wrap a phrase in <span className="text-accent"> to
 * pick it out.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "split",
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "split" | "center" | "left";
  className?: string;
  action?: React.ReactNode;
}) {
  const heading = (
    <h2 className="text-headline font-bold text-fg uppercase">{title}</h2>
  );

  if (align === "split") {
    return (
      <div
        className={cn(
          "grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12",
          className,
        )}
      >
        <Reveal className="lg:col-span-7">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <div className="mt-5">{heading}</div>
        </Reveal>
        <Reveal delay={90} className="lg:col-span-5">
          {lead && (
            <p className="max-w-md text-base leading-relaxed text-fg-muted">
              {lead}
            </p>
          )}
          {action && <div className="mt-7">{action}</div>}
        </Reveal>
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
          <Eyebrow className={align === "center" ? "justify-center" : ""}>
            {eyebrow}
          </Eyebrow>
        )}
        <div className="mt-5">{heading}</div>
        {lead && (
          <p
            className={cn(
              "mt-6 text-base leading-relaxed text-fg-muted sm:text-lg",
              align === "center" && "mx-auto max-w-2xl",
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
