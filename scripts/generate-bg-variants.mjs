/**
 * Pre-blurred background plates cut from the hero image, so sections can
 * reuse "the same room" without any runtime blur filter.
 *
 *   node scripts/generate-bg-variants.mjs
 *
 * Writes WebP files to public/images/bg/. Re-run after replacing the source.
 */
import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "public/hero-section-bg.png";
const OUT = "public/images/bg";
mkdirSync(OUT, { recursive: true });

const meta = await sharp(SOURCE).metadata();
const W = meta.width;
const H = meta.height;
const box = (x0, y0, x1, y1) => ({
  left: Math.round(W * x0),
  top: Math.round(H * y0),
  width: Math.round(W * (x1 - x0)),
  height: Math.round(H * (y1 - y0)),
});

const variants = [
  // The whole room, softened and dimmed: contact, generic plates.
  { name: "room", region: box(0, 0, 1, 1), blur: 22, brightness: 0.7 },
  // Back wall with the LED strip: about, services.
  { name: "wall", region: box(0.22, 0.08, 0.78, 0.6), blur: 12, brightness: 0.85 },
  // Polished floor and its reflections: section bottoms, process.
  { name: "floor", region: box(0, 0.58, 1, 1), blur: 16, brightness: 0.8 },
  // The LED strip's light as a haze band.
  { name: "haze", region: box(0.2, 0.09, 0.8, 0.3), blur: 30, brightness: 1 },
];

for (const v of variants) {
  // One 1280px master; next/image serves smaller widths to small screens.
  for (const width of [1280]) {
    const file = `${OUT}/${v.name}.webp`;
    await sharp(SOURCE)
      .extract(v.region)
      .resize({ width })
      .blur(v.blur * (width / 1280) + 0.3)
      .modulate({ brightness: v.brightness, saturation: 0.85 })
      .webp({ quality: 68, effort: 5 })
      .toFile(file);
    console.log(`${file}  ${(statSync(file).size / 1024).toFixed(0)} KB`);
  }
}
