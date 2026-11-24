import Image from "next/image";
import Link from "next/link";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Top-level nav links; the logo is the way home. */
export const navLinks = mainNav.filter((item) => item.href !== "/");

export const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

/** Logo mark plus the two-line wordmark. */
export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" title={`${site.name} home`} className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-white ring-1 ring-line",
          compact ? "size-9" : "size-11",
        )}
      >
        <Image
          src="/logos/logo-without-text-removebg.webp"
          alt=""
          width={44}
          height={44}
          loading="eager"
          className={cn("object-contain", compact ? "size-7" : "size-9")}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-bold tracking-tight text-navy", compact ? "text-[0.9375rem]" : "text-base")}>
          Advisor
        </span>{" "}
        <span aria-hidden className="mt-1 text-[0.5625rem] font-semibold tracking-[0.22em] text-text-3 uppercase">Technologies</span><span className="sr-only">Technologies</span>
      </span>
    </Link>
  );
}
