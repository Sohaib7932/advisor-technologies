/**
 * Makes every client logo a clean, uniform asset: crops off stray frame
 * lines, removes the background (white, cream or dark) to transparency,
 * trims, and scales every logo to the same height (keeping its shape), so
 * all logos sit identically in the logo strip and on the client cards.
 *
 *   node scripts/clean-logos.mjs
 *
 * Input: public/clients-logos/*  ->  Output: public/clients-logos/clean/*.webp
 */
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/clients-logos";
const OUT = `${SRC}/clean`;
const H = 240; // output height; width follows the logo (up to 2x)
const PAD = 10; // breathing room around the mark

/** Fractions to crop off each edge (left, top, right, bottom) before cleaning. */
const CROP = {
  "general-post-clearance-audit.webp": [0.04, 0.02, 0.04, 0.02], // blue frame lines
  "NCT.jpg": [0.02, 0.02, 0.2, 0.02], // vertical rule on the right
  "marine-fisheries.jpg": [0, 0, 0, 0.04], // hairline along the bottom
  "iesco-logo.webp": [0.04, 0.04, 0.04, 0.04], // inside its cream box
};

/** White-on-dark logos: recolour the mark so it reads on a light tile. */
const RECOLOR = {
  "Pakistan_Marine_Academy.webp": [20, 33, 58], // brand navy
};

mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(SRC)) {
  if (!/\.(png|jpe?g|webp|svg)$/i.test(file)) continue;
  let image = sharp(path.join(SRC, file), { density: 300 }).ensureAlpha();
  const meta = await image.metadata();
  const [l, t, r, b] = CROP[file] ?? [0, 0, 0, 0];
  if (CROP[file]) {
    image = image.extract({
      left: Math.round(meta.width * l),
      top: Math.round(meta.height * t),
      width: Math.round(meta.width * (1 - l - r)),
      height: Math.round(meta.height * (1 - t - b)),
    });
  }
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Background = the median colour of the four corners.
  const px = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  const corners = [px(1, 1), px(width - 2, 1), px(1, height - 2), px(width - 2, height - 2)];
  const bg = [0, 1, 2].map((c) => corners.map((p) => p[c]).sort((a, b) => a - b)[1]);
  const bgTransparent = corners.every((p) => p[3] < 16);

  // Alpha from the distance to the background; un-blend the colour so
  // anti-aliased edges keep their true hue on any tile.
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const [R, G, B, A] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    let a;
    if (bgTransparent) a = A / 255;
    else {
      const d = Math.hypot(R - bg[0], G - bg[1], B - bg[2]);
      a = Math.min(1, Math.max(0, (d - 22) / 70)) * (A / 255);
    }
    const unblend = (v, k) => (a > 0.02 && !bgTransparent ? Math.round(Math.min(255, Math.max(0, (v - bg[k] * (1 - a)) / a))) : v);
    const tint = RECOLOR[file];
    out[o] = tint ? tint[0] : unblend(R, 0);
    out[o + 1] = tint ? tint[1] : unblend(G, 1);
    out[o + 2] = tint ? tint[2] : unblend(B, 2);
    out[o + 3] = Math.round(a * 255);
  }

  const name = file.replace(/\.[^.]+$/, "");
  const trimmed = await sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
  await sharp(trimmed)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .resize({ width: (H - PAD * 2) * 2, height: H - PAD * 2, fit: "inside" })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${OUT}/${name}.webp`);
  console.log(`${OUT}/${name}.webp`);
}
