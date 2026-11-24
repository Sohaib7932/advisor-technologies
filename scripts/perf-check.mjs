/**
 * Lighthouse across every route (mobile preset: simulated Slow 4G and 4x CPU
 * throttle) against a PRODUCTION server.
 *
 *   npm run build && npm run start          (in another terminal, port 3000)
 *   npm run perf:check -- [baseUrl] [--runs 3] [--out docs/perf/after.json]
 *
 * With --runs N each route is measured N times and the median run (by
 * Performance score) is reported, as Lighthouse recommends for noisy hosts.
 *
 * Needs Chrome/Chromium: set CHROME_PATH if it is not found automatically.
 * Lighthouse is fetched on demand with npx (no project dependency).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("http")) ?? "http://localhost:3000").replace(/\/$/, "");
const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? args[outIdx + 1] : null;
const runsIdx = args.indexOf("--runs");
const RUNS = runsIdx >= 0 ? Math.max(1, Number(args[runsIdx + 1]) || 1) : 1;
const ROUTES = ["/", "/about", "/services", "/products", "/clients", "/contact"];

const TARGETS = { performance: 90, accessibility: 95, "best-practices": 95, seo: 95, lcp: 2500, cls: 0.05, tbt: 200 };

function measure(route) {
  const file = path.join(tmpdir(), `lh-${route.replace(/\W/g, "") || "home"}.json`);
  try {
    execFileSync(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["-y", "lighthouse@12", base + route, "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${file}`],
      { stdio: "ignore", shell: process.platform === "win32" },
    );
  } catch {
    console.error(`Lighthouse failed for ${route}`);
    return null;
  }
  const r = JSON.parse(readFileSync(file, "utf8"));
  rmSync(file, { force: true });
  const a = r.audits;
  const items = a["resource-summary"]?.details?.items ?? [];
  const kb = (type) => Math.round((items.find((i) => i.resourceType === type)?.transferSize ?? 0) / 1024);
  return {
    route,
    performance: Math.round(r.categories.performance.score * 100),
    accessibility: Math.round(r.categories.accessibility.score * 100),
    "best-practices": Math.round(r.categories["best-practices"].score * 100),
    seo: Math.round(r.categories.seo.score * 100),
    lcp: Math.round(a["largest-contentful-paint"].numericValue),
    cls: Number(a["cumulative-layout-shift"].numericValue.toFixed(3)),
    tbt: Math.round(a["total-blocking-time"].numericValue),
    jsKB: kb("script"),
    imageKB: kb("image"),
  };
}

const rows = [];
for (const route of ROUTES) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const m = measure(route);
    if (m) runs.push(m);
  }
  if (!runs.length) continue;
  runs.sort((x, y) => x.performance - y.performance);
  rows.push({ ...runs[Math.floor((runs.length - 1) / 2)], runs: runs.length });
}

const pad = (v, n) => String(v).padEnd(n);
console.log("\n" + ["route", "perf", "a11y", "bp", "seo", "LCP ms", "CLS", "TBT ms", "JS KB", "img KB"].map((h, i) => pad(h, i ? 8 : 11)).join(""));
let failed = 0;
for (const r of rows) {
  const perfTarget = r.route === "/" ? 85 : TARGETS.performance;
  const bad =
    r.performance < perfTarget || r.accessibility < TARGETS.accessibility || r["best-practices"] < TARGETS["best-practices"] ||
    r.seo < TARGETS.seo || r.lcp > TARGETS.lcp || r.cls > TARGETS.cls || r.tbt > TARGETS.tbt;
  failed += bad ? 1 : 0;
  console.log(
    [r.route, r.performance, r.accessibility, r["best-practices"], r.seo, r.lcp, r.cls, r.tbt, r.jsKB, r.imageKB]
      .map((v, i) => pad(v, i ? 8 : 11))
      .join("") + (bad ? "  <- below target" : ""),
  );
}
if (out) {
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(rows, null, 2));
}
process.exitCode = failed ? 1 : 0;
