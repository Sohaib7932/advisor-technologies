/**
 * Saves each hero product, rendered by /dev/capture, as a transparent WebP
 * card illustration in public/images/illustrations/.
 *
 *   npm run dev            (in another terminal)
 *   node scripts/capture-illustrations.cjs [baseUrl]
 *
 * Needs Playwright (npx playwright install chromium) and sharp.
 */
const { chromium } = require("playwright");
const sharp = require("sharp");
const fs = require("node:fs");

const base = process.argv[2] || "http://localhost:3000";
const OUT = "public/images/illustrations";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage();
  await page.goto(`${base}/dev/capture`, { waitUntil: "networkidle" });
  await page.waitForSelector("#capture-gear", { timeout: 60000 });
  for (const name of ["rack", "cctv", "laptop", "printer", "chair", "gear"]) {
    const dataUrl = await page.getAttribute(`#capture-${name}`, "src");
    const png = Buffer.from(dataUrl.split(",")[1], "base64");
    await sharp(png).trim().resize({ width: 640, height: 640, fit: "inside" }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/${name}.webp`);
    console.log(`${OUT}/${name}.webp`);
  }
  await browser.close();
})();
