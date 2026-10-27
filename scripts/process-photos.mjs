/**
 * Downloads the site's licensed photographs (Unsplash License: free for
 * commercial use, no permission needed) and gives them one consistent bright,
 * cool grade, cropped to fixed aspect ratios.
 *
 *   node scripts/process-photos.mjs
 *
 * Output: public/images/photos/<name>.webp (+ <name>-sm.webp). Credits are in
 * docs/image-credits.md. To swap a photo, change its id here and re-run.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/images/photos";
mkdirSync(OUT, { recursive: true });

export const PHOTOS = [
  { name: "plant-machinery", id: "1581091226825-a6a2a5aee158", ratio: 4 / 3 },
  { name: "it-networks", id: "1544197150-b99a580bb7a8", ratio: 4 / 3 },
  { name: "computing", id: "1497215728101-856f4ea42174", ratio: 4 / 3 },
  { name: "security", id: "1557597774-9d273605dfa9", ratio: 4 / 3 },
  { name: "printing", id: "1612815154858-60aa4c59eaa6", ratio: 4 / 3 },
  { name: "maintenance", id: "1581092160562-40aa08e78837", ratio: 4 / 3 },
  { name: "about", id: "1524758631624-e2822e304c36", ratio: 16 / 10 },
  { name: "corridor", id: "1497366216548-37526070297c", ratio: 16 / 10 },
];

for (const photo of PHOTOS) {
  const url = `https://images.unsplash.com/photo-${photo.id}?w=2200&q=85&fm=jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${photo.name}: HTTP ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());

  // One grade for every photo: a touch brighter, slightly desaturated, cooled
  // (red down, blue up) so warm casts fall in line with the navy/steel brand.
  const graded = sharp(input)
    .modulate({ brightness: 1.05, saturation: 0.86 })
    .linear([0.97, 1, 1.04], [0, 2, 6]);

  for (const [suffix, width] of [["", 1600], ["-sm", 800]]) {
    const height = Math.round(width / photo.ratio);
    await graded
      .clone()
      .resize({ width, height, fit: "cover", position: "attention" })
      .webp({ quality: 80, effort: 5 })
      .toFile(`${OUT}/${photo.name}${suffix}.webp`);
  }
  console.log(`${photo.name}: done`);
}

writeFileSync(`${OUT}/.generated`, new Date().toISOString());
