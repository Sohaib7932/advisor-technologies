/**
 * Renders every named 3D scene (src/components/three/scenes.ts) to a
 * transparent WebP at 2x in public/3d/, in the same style as the live hero.
 *
 *   npm run dev                          (in another terminal)
 *   node scripts/render-3d.mjs [baseUrl] [scene ...]
 *
 * With no scene names it renders all of them. Needs Playwright (Chromium)
 * and sharp. If Playwright is not installed in this project, point
 * PLAYWRIGHT_PATH at another install's `node_modules/playwright`.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const [base = "http://localhost:3000", ...only] = process.argv.slice(2);
const OUT = "public/3d";
mkdirSync(OUT, { recursive: true });

const SCENES = [
  "hero-poster",
  "chart",
  "cta",
  ...["rack", "cctv", "laptop", "printer", "chair", "gear"].map((n) => `product-${n}`),
  ...["shield", "gear", "network", "camera", "printer", "laptop", "chart", "wrench"].map((n) => `tile-${n}`),
  ...["about", "services", "products", "clients", "contact", "404"].map((n) => `banner-${n}`),
];

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage();
for (const scene of only.length ? only : SCENES) {
  await page.goto(`${base}/dev/render?scene=${scene}`, { waitUntil: "networkidle" });
  await page.waitForSelector("#render-output, #render-error", { timeout: 180_000 });
  const error = await page.$eval("#render-error", (el) => el.textContent).catch(() => null);
  if (error) {
    console.error(`${scene}: ${error}`);
    continue;
  }
  const dataUrl = await page.getAttribute("#render-output", "src");
  const png = Buffer.from(dataUrl.split(",")[1], "base64");
  // Keep the hero poster's framing (it must line up with the live scene);
  // trim the rest to their content with a little air.
  const image = scene === "hero-poster" ? sharp(png) : sharp(png).trim({ threshold: 2 }).extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 0, g: 0, b: 0, alpha: 0 } });
  await image.webp({ quality: 86, alphaQuality: 92, effort: 5 }).toFile(`${OUT}/${scene}.webp`);
  console.log(`${OUT}/${scene}.webp`);
}
await browser.close();
