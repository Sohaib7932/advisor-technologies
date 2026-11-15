import { cn } from "@/lib/utils";

/**
 * Content inside the frame, with the 20-48px gutter. Sections and panels
 * set the frame width, so every section's content lines up with the hero's.
 */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-(--gutter)",
        size === "narrow" && "max-w-[56rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type SectionTone = "white" | "mist" | "ice" | "navy";

const TONE: Record<SectionTone, string> = {
  white: "frame",
  mist: "panel bg-mist",
  ice: "panel bg-ice",
  navy: "panel bg-navy",
};

/**
 * A section of the page. White sections are plain bands; mist, ice and navy
 * sections are inset rounded panels (radius 40, 12-24px from the viewport
 * edge). Navy panels are dark scopes, so tokens and buttons flip.
 */
export function Section({
  className,
  children,
  id,
  tone = "white",
  pad = true,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tone?: SectionTone;
  /** Vertical padding of clamp(72px, 9vw, 128px). */
  pad?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "id">) {
  return (
    <section
      id={id}
      data-theme={tone === "navy" ? "dark" : undefined}
      className={cn("relative isolate", TONE[tone], pad && "section-y", className)}
      {...rest}
    >
      {children}
    </section>
  );
}
