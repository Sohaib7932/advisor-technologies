/**
 * Every tunable value for the hero showroom, in one place.
 * Units are three.js world units (the floor is y = 0; 1 unit ≈ 1 metre).
 */

export type Placement = {
  /** Landing spot on the stage (x across, z toward the camera). */
  x: number;
  z: number;
  /** Display stand height under the piece; 0 = stands on the stage. */
  pedestal: number;
  /** Turn on the stand, radians. */
  turn: number;
  scale: number;
  /** Where it floats before the assembly, x / y / z. */
  scatter: [number, number, number];
};

export const HERO_TUNING = {
  /**
   * Draw the room from the photo (public/images/hero/hero-bg.webp) instead of
   * building it in 3D. The stage, light ring, haze and pieces still render on
   * top. Set false to fall back to the procedural room.
   */
  plate: true,
  /** With the photo: move the whole display this far back (−z) toward the wall. */
  plateDepth: 1.8,

  camera: {
    fov: { desktop: 34, mobile: 50 },
    /** Final camera position once assembled; the push-in starts `pushIn` units further back. */
    position: { desktop: [0, 2.35, 12.6], mobile: [0, 2.9, 13.4] },
    lookAt: { desktop: [0, 1.75, 0], mobile: [0, 1.7, 0] },
    pushIn: 2.4,
    /** Narrow screens: pull back this many units per 1.0 of aspect below `wideAspect`. */
    narrowPullBack: 7,
    wideAspect: 1.45,
  },

  /** Desktop mouse tilt: how far the camera drifts with the pointer. */
  parallax: { x: 0.55, y: 0.28, ease: 0.06 },

  lights: {
    ambient: 0.26,
    hemisphere: 0.34,
    /** Pendant spotlight, the key light on the stage. */
    pendant: 26,
    /** Blue rim lights behind the display. */
    rim: 30,
    /** Room lights brighten by this factor as the pieces lock in. */
    lockBoost: 0.35,
    exposure: 1.05,
  },

  room: {
    wallZ: -7.5,
    fog: { near: 13, far: 34 },
    /** How strongly the floor mirrors the scene (0 = matte, 1 = mirror). */
    floorReflection: 0.42,
    hazeOpacity: 0.07,
    beamOpacity: 0.14,
  },

  /** Order matches the builders: rack, CCTV, laptop, printer, chair, gear. */
  layout: {
    desktop: [
      { x: -3.6, z: 0.1, pedestal: 0, turn: 0.35, scale: 0.98, scatter: [-6.4, 3.4, -2] },
      { x: -2.95, z: 1.45, pedestal: 1.0, turn: 0.25, scale: 0.7, scatter: [5.6, 4.2, -2] },
      { x: -0.45, z: 2.05, pedestal: 0.3, turn: 0.12, scale: 0.6, scatter: [-5.2, 1.4, 1.5] },
      { x: 1.3, z: 1.85, pedestal: 0.4, turn: -0.2, scale: 0.56, scatter: [6, 1.6, 1] },
      { x: 2.65, z: 0.8, pedestal: 0, turn: -0.55, scale: 0.92, scatter: [-2.4, 4.6, -3.5] },
      { x: 3.6, z: -0.25, pedestal: 0, turn: -0.5, scale: 0.9, scatter: [2.8, 4.9, -3.2] },
    ] as Placement[],
    mobile: [
      { x: -1.55, z: 0.1, pedestal: 0, turn: 0.35, scale: 0.78, scatter: [-2.4, 5.6, -2] },
      { x: -0.35, z: 1.25, pedestal: 0.95, turn: 0.2, scale: 0.6, scatter: [2.2, 6.4, -1.5] },
      { x: 0.85, z: 1.7, pedestal: 0.3, turn: -0.15, scale: 0.5, scatter: [-2, 2.6, 2] },
      { x: 1.75, z: 0.2, pedestal: 0, turn: -0.5, scale: 0.72, scatter: [2.2, 3.4, 1] },
    ] as Placement[],
  },

  stage: {
    desktop: { radiusX: 5.6, radiusZ: 2.35, centerZ: 0.85 },
    mobile: { radiusX: 2.8, radiusZ: 1.75, centerZ: 0.8 },
  },
} as const;
