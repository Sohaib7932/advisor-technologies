import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Small pill label above a heading. Reads correctly on light and dark. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex w-fit items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs text-accent ring-1 ring-line",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-sky" />
      {children}
    </span>
  );
}

/**
 * Eyebrow + sentence-case heading (+ lead and action). Wrap one phrase of
 * the title in <Accent> to colour it (steel on light, sky on dark).
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "split",
  className,
  action,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "split" | "center" | "left";
  className?: string;
  action?: React.ReactNode;
  id?: string;
}) {
  const heading = (
    <h2 id={id} className="text-h2 text-fg">
      {title}
    </h2>
  );

  if (align === "split") {
    return (
      <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
        <Reveal className="lg:col-span-7">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <div className="mt-5">{heading}</div>
        </Reveal>
        <Reveal delay={90} className="lg:col-span-5">
          {lead && <p className="max-w-md text-lead text-fg-muted">{lead}</p>}
          {action && <div className="mt-7">{action}</div>}
        </Reveal>
      </div>
    );
  }

  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", align === "left" && "max-w-3xl", className)}>
      <Reveal>
        {eyebrow && <Eyebrow className={align === "center" ? "mx-auto" : ""}>{eyebrow}</Eyebrow>}
        <div className="mt-5">{heading}</div>
        {lead && <p className={cn("mt-6 text-lead text-fg-muted", align === "center" && "mx-auto max-w-2xl")}>{lead}</p>}
        {action && <div className={cn("mt-8", align === "center" && "flex justify-center")}>{action}</div>}
      </Reveal>
    </div>
  );
}

/** The one accent phrase in a heading. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-accent">{children}</span>;
}
