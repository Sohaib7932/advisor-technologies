"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "@/components/ui/icons";

/**
 * The office map, loaded only when it comes near the viewport. The Google
 * Maps embed ships ~0.5 MB of script, so until then a light placeholder
 * (with a direct "Open in Google Maps" link) holds its space.
 */
export function MapEmbed({ src, title, href }: { src: string; title: string; href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoad(true);
        io.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center bg-mist">
      {load ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full [filter:grayscale(0.6)_contrast(0.95)_brightness(1.03)]"
        />
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-steel">
          <MapPin className="size-5" />
          Open in Google Maps
        </a>
      )}
    </div>
  );
}
