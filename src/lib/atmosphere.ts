/**
 * The page background: every section declares a `tone`, and the fixed
 * global layer cross-fades between these flat colours as sections scroll
 * past. Edit the colours here.
 */

export type Tone = "deep" | "base" | "steel" | "charcoal";

/** Flat colour per tone. */
export const TONES: Record<Tone, string> = {
  deep: "#f5f8fb", // mist
  base: "#ffffff", // white
  steel: "#eaf1f7", // pale steel
  charcoal: "#f5f8fb", // mist again, for rhythm
};

export const ATMOSPHERE = {
  /** Distance (px) over which neighbouring tones blend at a section boundary. */
  toneBlend: 360,
} as const;
