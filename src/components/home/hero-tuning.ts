/**
 * Hero tuning: camera, the platform skyline, floating tiles, idle motion
 * and the intro timeline. Units are three.js world units; the platform's
 * top surface is at y ≈ 0.56 and its radius is 4.4. Times are seconds.
 */
import type { IconKey } from "@/components/three/textures";
import type { ProductName } from "@/components/three/products";

export type ProductSlot = {
  name: ProductName;
  /** Position on the platform top (x, z). */
  x: number;
  z: number;
  /** Glass plinth height under the product. */
  plinth: number;
  /** Plinth footprint (width, depth). */
  size: [number, number];
  turn: number;
  scale: number;
};

export type TileSlot = { icon: IconKey; pos: [number, number, number]; rot: [number, number, number]; size: number; navy?: boolean };

export const HERO_TUNING = {
  camera: {
    fov: 30,
    /** 3/4 high angle, like ref 2. */
    desktop: { position: [0.6, 9.2, 17.6] as const, target: [-0.9, 1.5, 0] as const },
    mobile: { position: [0, 9.4, 18] as const, target: [0, 1.5, 0] as const },
  },
  /** DPR cap for the live scene (phones show the poster instead). */
  dprCap: 2,
  /**
   * Quality tiers. 1: full (transmission glass, DPR up to dprCap).
   * 2: DPR 1 and fake glass. 3: static poster. A step happens after
   * `patience` seconds of frames slower than `slowFrame` seconds.
   * Devices that start on the poster: reduced motion, Save-Data, phones,
   * no hardware WebGL, hardwareConcurrency or deviceMemory <= lowEnd.
   */
  tiers: { slowFrame: 1 / 38, patience: 1.6, lowEnd: 4 },
  lights: { environment: 0.85, key: 2.1, rim: 3.2, exposure: 1.02 },

  /** Tallest at centre-back, gear and chair at the sides, three in front. */
  layout: {
    desktop: [
      { name: "rack", x: 0, z: -1.5, plinth: 0.9, size: [1.4, 1.3], turn: 0.25, scale: 1 },
      { name: "gear", x: 2.55, z: -0.55, plinth: 0.55, size: [1.15, 1.0], turn: -0.55, scale: 0.85 },
      { name: "chair", x: -2.6, z: -0.5, plinth: 0.35, size: [1.25, 1.2], turn: 0.7, scale: 0.85 },
      { name: "laptop", x: -1.45, z: 1.55, plinth: 0.45, size: [1.55, 1.25], turn: 0.35, scale: 0.72 },
      { name: "printer", x: 1.5, z: 1.5, plinth: 0.3, size: [1.4, 1.2], turn: -0.35, scale: 0.72 },
      { name: "cctv", x: 0.1, z: 2.55, plinth: 0.2, size: [0.75, 0.75], turn: -0.15, scale: 0.75 },
    ] as ProductSlot[],
    mobile: [
      { name: "rack", x: 0, z: -1.3, plinth: 0.8, size: [1.4, 1.3], turn: 0.2, scale: 1 },
      { name: "gear", x: 2.3, z: -0.2, plinth: 0.5, size: [1.15, 1.0], turn: -0.5, scale: 0.85 },
      { name: "laptop", x: -2.0, z: 0.7, plinth: 0.4, size: [1.55, 1.25], turn: 0.4, scale: 0.75 },
      { name: "cctv", x: 0.3, z: 2.2, plinth: 0.2, size: [0.75, 0.75], turn: -0.2, scale: 0.8 },
    ] as ProductSlot[],
  },

  /** Frosted tiles at different depths; some cross the panel edge. */
  /** Three quiet glass tiles; they drift slowly and tilt on hover. */
  tiles: {
    desktop: [
      { icon: "shield", pos: [-3.6, 4.2, -2.4], rot: [0.2, 0.45, -0.1], size: 0.9 },
      { icon: "network", pos: [3.3, 4.5, -2.2], rot: [0.25, -0.35, 0.08], size: 0.85, navy: true },
      { icon: "gear", pos: [4.6, 1.2, 2.6], rot: [-0.1, -0.5, -0.08], size: 0.8 },
    ] as TileSlot[],
    mobile: [
      { icon: "shield", pos: [-3.2, 4.0, -1.6], rot: [0.2, 0.45, -0.1], size: 0.9 },
      { icon: "network", pos: [3.2, 4.2, -1.6], rot: [0.25, -0.35, 0.08], size: 0.85, navy: true },
    ] as TileSlot[],
  },
  spheres: {
    desktop: [] as { pos: [number, number, number]; r: number }[],
    mobile: [] as { pos: [number, number, number]; r: number }[],
  },

  idle: {
    /** Platform yaw swing (radians, ±8°) and its period. */
    swing: 0.14,
    swingPeriod: 16,
    float: 0.06,
    tileDrift: 0.18,
    /** A light sweeps across the products every N seconds. */
    sweepEvery: 8,
    ledPulse: 0.35,
    parallax: { x: 0.5, y: 0.28, damping: 3.2 },
  },

  /** Autoplay intro (≈5.5s). Offsets from the start of the timeline. */
  intro: {
    panel: 0,
    panelDuration: 0.9,
    chip: 0.35,
    headline: 0.45,
    tagline: 1.0,
    platform: 0.7,
    led: 1.3,
    products: 1.5,
    productStagger: 0.22,
    assemble: 1.1,
    tiles: 3.0,
    tileStagger: 0.12,
    buttons: 3.6,
    trust: 3.9,
    idle: 5.5,
    /** How far parts fly out before assembling. */
    explode: 0.9,
  },
} as const;
