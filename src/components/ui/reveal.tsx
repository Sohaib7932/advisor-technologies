import { cn } from "@/lib/utils";

/**
 * Fades and lifts children into view once, when they first enter the
 * viewport. A server component: one shared observer (ViewportFx, mounted in
 * the layout) adds `reveal-in`, so a page with dozens of reveals hydrates
 * nothing per reveal. Without JavaScript a <noscript> rule shows the content,
 * and a CSS failsafe shows it after 3s if scripts fail to start.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
}) {
  return (
    <Tag
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
