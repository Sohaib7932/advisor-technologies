import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-600 text-white shadow-soft hover:bg-navy-700 hover:shadow-lift hover:-translate-y-0.5",
  secondary:
    "bg-navy-900/5 text-navy-900 ring-1 ring-inset ring-navy-900/10 hover:bg-navy-900/8 hover:ring-navy-900/20",
  ghost: "text-navy-800 hover:bg-navy-900/5",
  light:
    "bg-white text-navy-900 shadow-soft hover:-translate-y-0.5 hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

type ButtonProps = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow = false,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowUpRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
