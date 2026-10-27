"use client";

import { useEffect, useState } from "react";

const NAMES = ["rack", "cctv", "laptop", "printer", "chair", "gear"] as const;

export function CaptureProducts() {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    import("@/components/home/hero-scene").then(({ renderProduct }) => {
      setImages(Object.fromEntries(NAMES.map((name) => [name, renderProduct(name)])));
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-8 pt-32">
      {NAMES.map((name) =>
        images[name] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={name} id={`capture-${name}`} src={images[name]} alt={name} className="w-full bg-canvas" />
        ) : null,
      )}
    </div>
  );
}
