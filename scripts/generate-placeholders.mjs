import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

const NAVY = ["#0a1220", "#121e30", "#1a2b44", "#23395a", "#2a4468"];
const GRAPHITE = ["#1c1e21", "#2b2e32", "#3c4045", "#4d5157"];

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Branded stand-in artwork: a dark navy field, a faint engineering grid, the
 * logo's arc motif and a caption. Swap these files for real photography later.
 */
function placeholder({ w, h, label: rawLabel, seed, tone = "navy" }) {
  const label = esc(rawLabel);
  const ramp = tone === "navy" ? NAVY : GRAPHITE;
  const a = ramp[seed % ramp.length];
  const b = ramp[(seed + 2) % ramp.length];
  const id = `g${seed}`;
  const fontSize = Math.round(Math.min(w, h) * 0.055) + 6;

  // Deterministic pseudo-random helper so output is stable between runs.
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);

  const bars = Array.from({ length: 7 }, (_, i) => {
    const bw = Math.round(w * (0.04 + rnd() * 0.1));
    const bh = Math.round(h * (0.06 + rnd() * 0.34));
    const x = Math.round(w * 0.08 + i * (w * 0.12));
    const y = Math.round(h * 0.82 - bh);
    return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${Math.round(bw / 3)}" fill="#ffffff" opacity="${(0.04 + rnd() * 0.07).toFixed(3)}"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="${id}b" cx="0.75" cy="0.15" r="0.9">
      <stop offset="0" stop-color="#8fa9c9" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#6d8cb3" stop-opacity="0"/>
    </radialGradient>
    <pattern id="${id}grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>
  <rect width="${w}" height="${h}" fill="url(#${id}grid)"/>
  <rect width="${w}" height="${h}" fill="url(#${id}b)"/>
  ${bars}
  <path d="M0 ${h * 0.78} C ${w * 0.3} ${h * 0.55}, ${w * 0.62} ${h * 0.72}, ${w} ${h * 0.42} L ${w} ${h} L 0 ${h} Z" fill="#000000" opacity="0.22"/>
  <path d="M0 ${h * 0.86} C ${w * 0.34} ${h * 0.66}, ${w * 0.66} ${h * 0.82}, ${w} ${h * 0.56}" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="2"/>
  <g transform="translate(${Math.round(w * 0.5)} ${Math.round(h * 0.42)})" opacity="0.07">
    <circle r="${Math.round(Math.min(w, h) * 0.17)}" fill="#ffffff"/>
    <path d="M0 -${Math.round(Math.min(w, h) * 0.13)} L ${Math.round(Math.min(w, h) * 0.11)} ${Math.round(Math.min(w, h) * 0.11)} L -${Math.round(Math.min(w, h) * 0.11)} ${Math.round(Math.min(w, h) * 0.11)} Z" fill="${a}"/>
  </g>
  <text x="${Math.round(w * 0.045)}" y="${Math.round(h * 0.94)}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="${Math.round(fontSize * 0.42)}" font-weight="600" letter-spacing="3" fill="#ffffff" fill-opacity="0.28">${label}</text>
</svg>`;
}

const files = [
  { name: "hero.svg", w: 1920, h: 1080, label: "HEADQUARTERS", seed: 1 },
  { name: "about.svg", w: 1280, h: 1600, label: "OUR TEAM", seed: 2 },
  { name: "workshop.svg", w: 1280, h: 960, label: "SERVICE WORKSHOP", seed: 3 },
  { name: "operations.svg", w: 1600, h: 1000, label: "FIELD OPERATIONS", seed: 4 },
  { name: "warehouse.svg", w: 1280, h: 960, label: "WAREHOUSE", seed: 5 },
  { name: "team.svg", w: 1280, h: 860, label: "ENGINEERING TEAM", seed: 6 },
  { name: "office.svg", w: 1600, h: 1000, label: "ISLAMABAD OFFICE", seed: 7 },
  { name: "plant-machinery.svg", w: 1200, h: 900, label: "PLANT & MACHINERY", seed: 8 },
  { name: "it-networks.svg", w: 1200, h: 900, label: "NETWORK SOLUTIONS", seed: 9 },
  { name: "computing.svg", w: 1200, h: 900, label: "COMPUTING", seed: 10 },
  { name: "security.svg", w: 1200, h: 900, label: "SECURITY SYSTEMS", seed: 11 },
  { name: "printing.svg", w: 1200, h: 900, label: "PRINTING", seed: 12, tone: "graphite" },
  { name: "maintenance.svg", w: 1200, h: 900, label: "MAINTENANCE WORKS", seed: 13, tone: "graphite" },
  { name: "contact.svg", w: 1400, h: 1000, label: "F-8 MARKAZ, ISLAMABAD", seed: 14 },
  { name: "clients.svg", w: 1600, h: 900, label: "PUBLIC SECTOR PROJECTS", seed: 15 },
];

for (const f of files) {
  writeFileSync(join(OUT, f.name), placeholder(f));
}

console.log(`Wrote ${files.length} placeholders to ${OUT}`);
