/**
 * The page atmosphere: one place to tune the background system.
 *
 * Colours are sampled from the hero plate (public/hero-section-bg.png) and
 * kept inside the brand family. Every section declares a `tone`; the fixed
 * global layer cross-fades between these tones as sections scroll past.
 */

export type Tone = "deep" | "base" | "steel" | "charcoal";

/** Full-viewport gradients for the fixed global layer, one per tone. */
export const TONES: Record<Tone, string> = {
  // Ceiling shadow: the darkest navy, a cool light far above.
  deep: "radial-gradient(70% 55% at 50% -10%, #102540 0%, transparent 70%), linear-gradient(180deg, #070e19 0%, #060c16 100%)",
  // The back wall: deep navy with the LED strip's halo along the top.
  base: "radial-gradient(80% 50% at 50% -5%, #133458 0%, transparent 65%), linear-gradient(180deg, #0d1926 0%, #0b1522 100%)",
  // Steel-blue tinted dark: the floor reflections.
  steel: "radial-gradient(60% 50% at 75% 105%, #1f4466 0%, transparent 70%), radial-gradient(50% 45% at 15% 0%, #12304e 0%, transparent 70%), linear-gradient(180deg, #0b1828 0%, #0f2033 100%)",
  // Charcoal-navy: the concrete side wall.
  charcoal: "radial-gradient(60% 50% at 20% 0%, #1c2633 0%, transparent 70%), linear-gradient(180deg, #161b23 0%, #121821 100%)",
};

export const ATMOSPHERE = {
  /** Distance (px) over which neighbouring tones blend at a section boundary. */
  toneBlend: 420,

  /** The drifting glow orb on the global layer. */
  glow: {
    /** 0 → 1: peak opacity of the orb. */
    strength: 0.5,
    color: "91 163 208", // rgb triplet, the brand glow
    size: "70vmax",
  },

  /** Parallax: yPercent travelled across a section's scroll (desktop only). */
  parallax: {
    plate: 8, // section image plates
    glow: 16, // section glow layers
    orb: 35, // global orb, across the whole page (vh)
  },

  /** Seam between sections: height (px) of the masked fade at each edge. */
  seam: 160,

  texture: {
    grain: 0.05, // film grain opacity
    grid: 0.06, // dot grid opacity
  },

  /** Plates cut from the hero image (scripts/generate-bg-variants.mjs). */
  plates: {
    room: "/images/bg/room",
    wall: "/images/bg/wall",
    floor: "/images/bg/floor",
    haze: "/images/bg/haze",
  },

  /**
   * Optional per-section photos. Drop a file with this name into
   * public/images/bg/ and the section uses it automatically, with the same
   * overlays; without it, the section falls back to the plate listed.
   */
  sectionImages: {
    about: { file: "about-bg.webp", fallback: "wall" },
    services: { file: "services-bg.webp", fallback: "wall" },
    contact: { file: "contact-bg.webp", fallback: "room" },
  },
} as const;

export type PlateName = keyof typeof ATMOSPHERE.plates;
