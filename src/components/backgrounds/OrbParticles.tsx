"use client";

/**
 * A glowing particle orb, reactive to the cursor. Ported from React Bits'
 * Particles component (https://reactbits.dev/backgrounds/particles), by
 * David Haz, MIT + Commons Clause v1.0 — free to use as part of a
 * product/website (this), not to be resold or redistributed as a standalone
 * component. Copyright notice kept per that license's terms.
 *
 * Copyright (c) 2026 David Haz
 *
 * The upstream component fills a solid sphere volume (`r = cbrt(random())`
 * pulls points uniformly through the ball, which reads as a fuzzy cloud).
 * The one change from upstream: points are pushed out to a thin shell near
 * the sphere's surface instead, which is what turns the cloud into a
 * recognisable glowing orb/globe silhouette. Everything else — the point
 * sprite shader, the rotation, the mouse-drag reactivity via
 * moveParticlesOnHover — is unchanged. Colors are driven by our palette at
 * the call site.
 */
import React, { useEffect, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer } from "ogl";

import "./OrbParticles.css";

interface OrbParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  /** 0 = thin shell (orb outline), 1 = filled ball (upstream default). */
  shellThickness?: number;
  /** Scales the per-particle sine wobble; see the prop default for why. */
  jitter?: number;
  /** Soft circular CSS mask; see the prop default for why. */
  orbMask?: boolean;
  className?: string;
}

const defaultColors: string[] = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex: string): [number, number, number] => {
  let normalized = hex.replace(/^#/, "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(normalized.slice(0, 6), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform float uJitter;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x) * uJitter;
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w) * uJitter;
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z) * uJitter;

    vec4 mvPos = viewMatrix * mPos;
    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

const OrbParticles: React.FC<OrbParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  shellThickness = 0.12,
  /** Scales the per-particle sine wobble. Upstream hardcodes this at full
   *  strength, which reads as jitter rather than drift once the points are
   *  spread thin across a shell instead of packed through a solid ball. */
  jitter = 0.35,
  /** Soft circular fade so the field reads as a contained glowing orb rather
   *  than dust scattered corner to corner. The perspective camera's actual
   *  projected size is sensitive to particleSpread/cameraDistance/fov in a
   *  way that's fragile to tune precisely for an arbitrary card size; a CSS
   *  mask makes the "orb" silhouette reliable regardless. */
  orbMask = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      // Push points out to a thin shell near r=1, rather than filling the
      // whole ball uniformly: this is what reads as an orb's surface
      // instead of a fuzzy cloud.
      const radius = 1 - shellThickness * Math.random();
      const norm = radius / Math.sqrt(len);
      positions.set([x * norm, y * norm, z * norm], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
        uJitter: { value: jitter },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let lastTime = performance.now();
    let elapsed = 0;
    // Upstream snaps the orb straight to the raw mouse position every frame,
    // which reads as shaky rather than reactive. Lerp toward the target
    // instead, matching how every other effect in this project follows the
    // cursor.
    let currentX = 0;
    let currentY = 0;

    const update = (t: number) => {
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        const targetX = -mouseRef.current.x * particleHoverFactor;
        const targetY = -mouseRef.current.y * particleHoverFactor;
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;
        particles.position.x = currentX;
        particles.position.y = currentY;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
      animationFrameId = requestAnimationFrame(update);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(update);
      }
    };
    const tryStop = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      tryStop();
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio,
    shellThickness,
    jitter,
  ]);

  // `closest-side` sizes the circle to the card's shorter dimension, which
  // is predictable across card aspect ratios; the default `farthest-corner`
  // sizing scales to the box diagonal, which for a wide card is big enough
  // that the mask barely crops anything.
  const maskImage = orbMask
    ? "radial-gradient(circle closest-side at 50% 50%, black 0%, black 55%, transparent 100%)"
    : undefined;

  return (
    <div
      ref={containerRef}
      className={`particles-container ${className ?? ""}`.trim()}
      style={{ maskImage, WebkitMaskImage: maskImage }}
    />
  );
};

export default OrbParticles;
