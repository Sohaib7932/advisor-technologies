import Image from "next/image";
import { cn } from "@/lib/utils";
import { RENDERS, type RenderName } from "./renders";

/**
 * One of the offline 3D renders in public/3d/ (scripts/render-3d.mjs), shown
 * as an image. A server component: the pointer tilt (fine pointers) is one
 * delegated handler in ViewportFx, reading `data-tilt`; `float` bobs gently
 * while on screen (not on phones). Only the hero runs live WebGL, so each
 * page has at most one WebGL context.
 */
export function Render3D({
  name,
  alt = "",
  sizes = "(max-width: 1024px) 80vw, 40vw",
  float = false,
  tilt = 8,
  priority = false,
  className,
  imgClassName,
}: {
  /** A render in public/3d/, e.g. "banner-about". */
  name: RenderName;
  alt?: string;
  sizes?: string;
  float?: boolean;
  /** Maximum tilt in degrees toward the pointer (0 disables it). */
  tilt?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [width, height] = RENDERS[name];
  return (
    <div data-tilt={tilt || undefined} className={cn("tilt", className)}>
      <Image
        src={`/3d/${name}.webp`}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={cn("h-auto w-full select-none", float && "bob", imgClassName)}
        draggable={false}
      />
    </div>
  );
}
