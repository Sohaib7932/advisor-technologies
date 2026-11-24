/**
 * Responsive check: every route at every width, against a running server.
 *
 *   npm run build && npm run start           (in another terminal, port 3000)
 *   npm run responsive:check -- [baseUrl] [--widths 360,1440] [--routes /,/about]
 *                                [--shots dir] [--shot-widths 360,768,1440]
 *
 * Asserts, per page and viewport:
 *   - no horizontal scroll (scrollWidth <= innerWidth)
 *   - no visible content outside the viewport (decorative/aria-hidden and
 *     marquee/deck tracks excluded)
 *   - readable text: body copy >= 14px, labels >= 12px
 *   - tap targets >= 44px on touch viewports (links inside running text excluded)
 *   - no clipped text in headings, buttons, cards
 *   - no overlapping text blocks
 * Screenshots (full page) go to docs/responsive/ (or --shots).
 *
 * Needs Playwright: set PLAYWRIGHT_PATH to a `node_modules/playwright` if it
 * is not installed in this project.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const base = (argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000").replace(/\/$/, "");
const routes = opt("routes", "/,/about,/services,/products,/clients,/contact,/this-page-does-not-exist").split(",");
const VIEWPORTS = {
  320: [320, 640], 360: [360, 740], 390: [390, 844], 414: [414, 896], 600: [600, 960], 768: [768, 1024], 820: [820, 1180],
  1024: [1024, 768], 1180: [1180, 820], 1280: [1280, 800], 1440: [1440, 900], 1920: [1920, 1080], 2560: [2560, 1440],
  "667x375": [667, 375], "1366x600": [1366, 600], "zoom200": [640, 400], // 1280x800 at 200% zoom
};
const widths = opt("widths", Object.keys(VIEWPORTS).join(",")).split(",");
const shotsDir = opt("shots", "docs/responsive");
const shotWidths = opt("shot-widths", "360,768,1440").split(",");
mkdirSync(shotsDir, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

for (const key of widths) {
  const [w, h] = VIEWPORTS[key] ?? key.split("x").map(Number);
  const touch = w < 1024;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && w < 820, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(800);
    // Scroll through so lazy content and reveals are in their final state.
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += h) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    const problems = await page.evaluate(({ touch }) => {
      const out = [];
      const W = window.innerWidth;
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      if (doc.scrollWidth > W) out.push(`horizontal scroll: ${doc.scrollWidth - W}px`);

      // Excluded: decorative or hidden layers, intentional horizontal rails
      // (marquees, the catalogue category rail), the off-canvas menu, the
      // skip link, and the product-line deck cards (fixed design).
      const decorative = (el) =>
        el.closest('[aria-hidden="true"], [inert], .marquee, [data-marquee], .no-scrollbar, canvas, .rings, nextjs-portal, #mobile-menu, header.fixed, [role="dialog"], .sr-only, a[href="#main"], #products article');
      const visible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const label = (el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 32)}"`;

      // Off-screen content
      for (const el of document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button, main li, footer a, footer p")) {
        if (decorative(el) || !visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.right > W + 1 || r.left < -1) out.push(`off-screen ${Math.round(Math.max(r.right - W, -r.left))}px: ${label(el)}`);
      }
      // Text size
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const el = walker.currentNode.parentElement;
        if (!el || seen.has(el) || !walker.currentNode.textContent.trim() || decorative(el) || !visible(el)) continue;
        seen.add(el);
        if (el.closest(".sr-only, svg, iframe, noscript, script, style")) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        const isLabel = getComputedStyle(el).textTransform === "uppercase" || el.closest("dt, .eyebrow, [class*='tabular-nums'], li[class*='rounded-full'], span[class*='rounded-full'], label");
        const min = isLabel || el.tagName !== "P" ? 12 : 14;
        if (fs < min - 0.01) out.push(`text ${fs}px < ${min}px: ${label(el)}`);
      }
      // Tap targets
      if (touch) {
        for (const el of document.querySelectorAll("a[href], button, input, select, textarea, [role='tab']")) {
          if (decorative(el) || !visible(el) || el.closest("p")) continue;
          const r = el.getBoundingClientRect();
          if (r.height < 44 && r.width < 44) out.push(`tap target ${Math.round(r.width)}x${Math.round(r.height)}: ${label(el)}`);
          else if (Math.min(r.height, r.width) < 24) out.push(`tap target ${Math.round(r.width)}x${Math.round(r.height)}: ${label(el)}`);
        }
      }
      // Clipped text
      for (const el of document.querySelectorAll("main h1, main h2, main h3, .btn, [data-card] h3, [data-card] p, .card h3, .card p")) {
        if (decorative(el) || !visible(el)) continue;
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== "visible") out.push(`clipped text: ${label(el)}`);
        const box = el.closest("[data-card], .card");
        if (box) {
          const b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
          if (r.bottom > b.bottom + 1 || r.right > b.right + 1) out.push(`text outside its card: ${label(el)}`);
        }
      }
      // Overlapping text blocks (headings/paragraphs/buttons that are not nested)
      const blocks = [...document.querySelectorAll("main h1, main h2, main h3, main p, main .btn")].filter((e) => !decorative(e) && visible(e));
      const rects = blocks.map((e) => e.getBoundingClientRect());
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          if (blocks[i].contains(blocks[j]) || blocks[j].contains(blocks[i])) continue;
          const a = rects[i], b = rects[j];
          const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ix > 4 && iy > 4) out.push(`overlap: ${label(blocks[i])} / ${label(blocks[j])}`);
        }
      }
      window.scrollTo(0, scrollTop);
      return [...new Set(out)];
    }, { touch });

    const name = `${(route === "/" ? "home" : route.slice(1)).replace(/\W+/g, "-")}-${key}`;
    if (shotWidths.includes(String(key))) await page.screenshot({ path: `${shotsDir}/${name}.png`, fullPage: true });
    if (problems.length) {
      failures += problems.length;
      console.log(`✗ ${route} @${key}`);
      problems.slice(0, 12).forEach((p) => console.log(`    ${p}`));
      if (problems.length > 12) console.log(`    … ${problems.length - 12} more`);
    } else {
      console.log(`✓ ${route} @${key}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(failures ? `\n${failures} problem(s)` : "\nAll routes pass at all widths.");
process.exitCode = failures ? 1 : 0;
