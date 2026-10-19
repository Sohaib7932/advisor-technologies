import Image from "next/image";
import { ATMOSPHERE, type PlateName } from "@/lib/atmosphere";
import { cn } from "@/lib/utils";

export type BackdropDetail =
  | "blueprint" // faint line grid
  | "glow-tl" // light from the top-left corner
  | "glow-top" // pendant light from above
  | "aurora" // slow navy → steel aurora (desktop, motion on)
  | "floor" // polished-floor sheen along the bottom
  | "spot" // soft spotlight in the middle
  | "scrim"; // dark wash for text-heavy sections

/**
 * A section's own background: a dimmed crop of the hero room (pre-blurred,
 * no runtime filters) plus detail layers. Its top and bottom fade out over
 * ATMOSPHERE.seam px, so it melts into the fixed global layer and sections
 * never meet at a hard line.
 */
export function SectionBackdrop({
  plate,
  src: imageSrc,
  plateOpacity = 0.35,
  details = [],
  className,
}: {
  plate?: PlateName;
  /** A resolved image path (see sectionImage() in lib/section-images). */
  src?: string;
  plateOpacity?: number;
  details?: BackdropDetail[];
  className?: string;
}) {
  const src = imageSrc ?? (plate ? `${ATMOSPHERE.plates[plate]}.webp` : null);
  const seam = `${ATMOSPHERE.seam}px`;
  const has = (detail: BackdropDetail) => details.includes(detail);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      style={{
        maskImage: `linear-gradient(to bottom, transparent 0, black ${seam}, black calc(100% - ${seam}), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0, black ${seam}, black calc(100% - ${seam}), transparent 100%)`,
      }}
    >
      {src && (
        <div data-parallax="plate" className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover"
            style={{ opacity: plateOpacity }}
          />
        </div>
      )}

      {has("scrim") && <div className="absolute inset-0 bg-bg-deep/55" />}

      {has("aurora") && (
        <div className="aurora absolute inset-0">
          <span className="aurora-a" />
          <span className="aurora-b" />
        </div>
      )}

      {has("glow-tl") && (
        <div
          data-parallax="glow"
          className="absolute -top-[10%] -left-[10%] size-[70vmax] bg-[radial-gradient(closest-side,rgb(91_163_208/0.16),transparent)]"
        />
      )}
      {has("glow-top") && (
        <div
          data-parallax="glow"
          className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(45%_70%_at_50%_0%,rgb(124_195_232/0.14),transparent_70%)]"
        />
      )}
      {has("spot") && (
        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_55%,rgb(124_195_232/0.12),transparent_70%)]" />
      )}

      {has("blueprint") && (
        <div className="absolute inset-0 bg-[linear-gradient(rgb(124_195_232/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(124_195_232/0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(65%_60%_at_30%_35%,black,transparent_80%)]" />
      )}

      {has("floor") && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(58_98_133/0.22),transparent_70%)]" />
          <div className="absolute inset-x-[12%] bottom-[18%] h-px bg-linear-to-r from-transparent via-led/25 to-transparent" />
        </>
      )}
    </div>
  );
}
