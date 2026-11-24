import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * One card in a deck (a server component). On hover (desktop) it lifts and
 * its art moves: an illustration lifts and tilts toward the pointer (the
 * delegated tilt in ViewportFx), an icon tile springs and its rings ripple
 * out (CSS). `tone="navy"` is the deep
 * navy-to-steel variant with white text.
 */
export function DeckCard({
  children,
  illustration,
  illustrationAlt = "",
  art,
  tone = "light",
  className,
  bodyClassName,
  artClassName,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  illustration?: string;
  illustrationAlt?: string;
  /** Custom art in place of an illustration image (rises the same way). */
  art?: React.ReactNode;
  tone?: "light" | "navy" | "ice";
  className?: string;
  bodyClassName?: string;
  artClassName?: string;
  as?: "div" | "li";
}) {


  return (
    <Tag
      data-card
      data-tone-card={tone}
      data-theme={tone === "navy" ? "dark" : "light"}
      data-tilt-host
      className={cn("deck-card group/card relative isolate flex flex-col rounded-card", className)}
    >
      {(illustration || art) && (
        <div className={cn("relative h-36 shrink-0", artClassName)}>
          <div data-illus className="absolute inset-0 flex items-end justify-center pt-6">
            {illustration ? (
              <Image
                src={illustration}
                alt={illustrationAlt}
                width={320}
                height={320}
                sizes="200px"
                data-tilt="7" className="deck-card-art h-full w-auto max-w-[70%] object-contain object-bottom"
              />
            ) : (
              <div data-tilt="7" className="deck-card-art">{art}</div>
            )}
          </div>
        </div>
      )}
      <div className={cn("deck-card-body relative flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-5", bodyClassName)}>{children}</div>
    </Tag>
  );
}

/** Art for cards without a product illustration: the icon on a tile, framed
 *  by a fine ring and a dashed orbit (drawn, not glowing). They move on
 *  hover; see `.icon-art` in globals.css. */
export function IconArt({ children }: { children: React.ReactNode }) {
  return (
    <div className="icon-art relative grid size-22 place-items-center">
      <span aria-hidden className="icon-ripple absolute inset-0 rounded-full ring-1 ring-accent/25" />
      <span aria-hidden className="icon-orbit absolute inset-0 rounded-full border border-dashed border-accent/30" />
      <span className="icon-tile relative grid size-12 place-items-center rounded-2xl bg-brand text-white shadow-lift">
        <span className="icon-glyph grid place-items-center">{children}</span>
      </span>
    </div>
  );
}
