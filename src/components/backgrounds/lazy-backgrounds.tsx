"use client";

/**
 * Every WebGL effect is code-split out of the main bundle and never
 * server-rendered: a canvas has nothing to draw until a GL context exists.
 * Import from here, not from the effect files directly, so that stays true.
 */
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { useInViewOnce } from "./hooks";

/**
 * Defers an effect until it first comes near the viewport, so the chunk
 * download and shader compile stay off the page-load critical path. Mounted
 * once and kept: each effect already pauses its own loop while off screen,
 * and remounting would build a fresh WebGL context on every scroll past.
 * The card's CSS surface gradient shows until the canvas fades in on top.
 */
function whenNearViewport<P extends object>(Effect: ComponentType<P>) {
  function Deferred(props: P) {
    const { ref, seen } = useInViewOnce<HTMLDivElement>("240px");
    return (
      <div ref={ref} className="fx-layer absolute inset-0">
        {seen && <Effect {...props} />}
      </div>
    );
  }
  Deferred.displayName = `WhenNearViewport(${Effect.displayName ?? Effect.name ?? "Effect"})`;
  return Deferred;
}

export const GhostFibersBackground = whenNearViewport(
  dynamic(() => import("./GhostFibers"), { ssr: false }),
);

export const MoltenMetalBackground = whenNearViewport(
  dynamic(() => import("./MoltenMetal"), { ssr: false }),
);

export const OrbParticlesBackground = whenNearViewport(
  dynamic(() => import("./OrbParticles"), { ssr: false }),
);

export const GradientBlindsBackground = whenNearViewport(
  dynamic(() => import("./GradientBlinds"), { ssr: false }),
);
