"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { bindTilt } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RENDERS, type RenderName } from "./renders";

/**
 * One of the offline 3D renders in public/3d/ (scripts/render-3d.mjs), shown
 * as an image: it tilts toward the pointer (fine pointers) and can float.
 * Only the hero runs live WebGL, so each page has at most one context.
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
  tilt?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = RENDERS[name];
  useEffect(() => (ref.current && tilt > 0 ? bindTilt(ref.current, tilt) : undefined), [tilt]);

  return (
    <div ref={ref} className={cn("tilt", className)}>
      <Image
        src={`/3d/${name}.webp`}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn("h-auto w-full select-none", float && "bob", imgClassName)}
        draggable={false}
      />
    </div>
  );
}
