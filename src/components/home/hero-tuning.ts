/**
 * Every tunable value for the hero, in one place: studio, camera, lights,
 * product layout and intro timing. Units are three.js world units (the floor
 * is y = 0; one unit is roughly one metre).
 */

export type Slot = {
  /** Horizontal screen position of the product's base, −1 (left edge) → 1. */
  nx: number;
  /** Depth on the floor: 0 is the front row, negative is further back. */
  z: number;
  /** Plinth height under the product; 0 = it stands on the floor. */
  plinth: number;
  /** Turn toward the centre, radians. */
  turn: number;
  scale: number;
};

export const HERO_TUNING = {
  camera: {
    fov: { desktop: 32, mobile: 42 },
    position: { desktop: [0, 3.1, 14], mobile: [0, 3.6, 15] },
    lookAt: { desktop: [0, 2.15, 0], mobile: [0, 2.9, 0] },
    /** The camera starts this much further back and eases in during the intro. */
    introPullBack: 2.2,
  },

  /** Desktop mouse parallax: how far the camera drifts, and the damping. */
  parallax: { x: 0.45, y: 0.22, damping: 3.5 },

  /** Hero content drifts up and fades as the page scrolls past (no pin). */
  scrollFade: { distance: 140, fadeBy: 0.7 },

  lights: {
    /** Image-based light from a neutral studio environment. */
    environment: 0.9,
    /** One soft key from the upper left, matching the window light. */
    key: 1.35,
    exposure: 1.0,
  },

  studio: {
    wall: { top: "#ffffff", bottom: "#eaf1f7" },
    floor: "#e6ecf2",
    shadowOpacity: 0.28,
  },

  /** Order matches the builders: rack, CCTV, laptop, printer, chair, gear.
   *  Left and right arcs, the centre column kept clear for the copy. */
  layout: {
    desktop: [
      { nx: -0.8, z: 1.4, plinth: 0, turn: 0.55, scale: 0.95 }, // rack
      { nx: -0.6, z: -0.6, plinth: 0.9, turn: 0.4, scale: 0.72 }, // CCTV
      { nx: -0.45, z: 2.6, plinth: 0.35, turn: 0.3, scale: 0.6 }, // laptop
      { nx: 0.45, z: 2.6, plinth: 0.35, turn: -0.3, scale: 0.6 }, // printer
      { nx: 0.56, z: -0.6, plinth: 0, turn: -0.95, scale: 0.85 }, // chair
      { nx: 0.82, z: 1.4, plinth: 0, turn: -0.5, scale: 0.66 }, // gear
    ] as Slot[],
    mobile: [
      { nx: -0.7, z: 1.6, plinth: 0, turn: 0.45, scale: 0.8 }, // rack
      { nx: -0.25, z: 3, plinth: 0.35, turn: 0.2, scale: 0.6 }, // CCTV
      { nx: 0.25, z: 3, plinth: 0.3, turn: -0.2, scale: 0.55 }, // laptop
      { nx: 0.7, z: 1.6, plinth: 0, turn: -0.45, scale: 0.62 }, // gear
    ] as Slot[],
  },

  /** Intro timeline, seconds from the moment assets are ready. */
  intro: {
    lightsUp: 0,
    partsAppear: 0.35,
    assembleStart: 1.15,
    assembleStagger: 0.18,
    assembleDuration: 1.25,
    title: 2.5,
    titleTracking: 3.1,
    tagline: 3.6,
    nav: 3.9,
    /** How far parts fly out when exploded. */
    explode: 0.42,
    /** Idle loop: seconds between light sweeps across the title. */
    sweepEvery: 8,
  },
} as const;
