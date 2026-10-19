import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { ATMOSPHERE } from "./atmosphere";

export type SectionImage = keyof typeof ATMOSPHERE.sectionImages;

/**
 * The background image for a section: its own photo if one has been dropped
 * into public/images/bg/ (e.g. about-bg.webp), otherwise the hero-room plate
 * it falls back to. Resolved at build time on the server.
 */
export function sectionImage(name: SectionImage): string {
  const { file, fallback } = ATMOSPHERE.sectionImages[name];
  if (existsSync(path.join(process.cwd(), "public/images/bg", file))) return `/images/bg/${file}`;
  return `${ATMOSPHERE.plates[fallback]}.webp`;
}
