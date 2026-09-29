"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is on screen (with a preload margin), so a
 * background effect only builds its WebGL context once it is about to be seen.
 */
export function useInViewport<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/**
 * Fires once, the first time the element enters view, and stays true after.
 * `seen` is derived from `inView`, so it is set during render rather than in
 * an effect.
 */
export function useInViewOnce<T extends Element>(rootMargin = "0px") {
  const { ref, inView } = useInViewport<T>(rootMargin);
  const [seen, setSeen] = useState(false);
  if (inView && !seen) {
    setSeen(true);
  }
  return { ref, seen };
}
