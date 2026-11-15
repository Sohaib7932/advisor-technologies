/**
 * Named scenes for the offline renders in public/3d/ (scripts/render-3d.mjs
 * drives /dev/render?scene=<name>). Same materials, lights and pieces as the
 * live hero, so every image on the site shares one look.
 */
import * as THREE from "three";
import { HERO_TUNING } from "@/components/home/hero-tuning";
import { buildHeroComposition } from "./hero-composition";
import type { Materials } from "./materials";
import { buildBarChart, buildPlatform, buildPlinth, buildSphere, buildTile, flatSprite, PLATFORM_TOP, type Shared } from "./pieces";
import { buildProduct, PRODUCT_NAMES, type ProductName } from "./products";
import { ICON_PATHS, type IconKey } from "./textures";

export type SceneSpec = {
  /** Output size in CSS pixels; rendered at 2x. */
  width: number;
  height: number;
  /** "hero" uses the hero camera; otherwise the object is auto-framed. */
  camera: "hero" | { elevation: number; azimuth: number; padding?: number };
};

const ICONS = Object.keys(ICON_PATHS) as IconKey[];

export const SCENES: Record<string, SceneSpec> = {
  "hero-poster": { width: 960, height: 880, camera: "hero" },
  chart: { width: 720, height: 720, camera: { elevation: 0.42, azimuth: 0.55, padding: 1.08 } },
  cta: { width: 760, height: 620, camera: { elevation: 0.38, azimuth: 0.5, padding: 1.04 } },
  ...Object.fromEntries(PRODUCT_NAMES.map((n) => [`product-${n}`, { width: 640, height: 640, camera: { elevation: 0.32, azimuth: 0.6, padding: 1.1 } }])),
  ...Object.fromEntries(ICONS.map((n) => [`tile-${n}`, { width: 320, height: 320, camera: { elevation: 0.28, azimuth: 0.45, padding: 1.0 } }])),
  ...Object.fromEntries(
    ["about", "services", "products", "clients", "contact", "404"].map((n) => [`banner-${n}`, { width: 760, height: 620, camera: { elevation: 0.42, azimuth: 0.55, padding: 1.0 } }]),
  ),
};

/** Small two-tier platform with a few products on glass plinths. */
function miniStage(m: Materials, shared: Shared, items: [ProductName, number, number, number, number][]) {
  const group = new THREE.Group();
  const platform = buildPlatform(m, shared, 2.4);
  group.add(platform.group);
  for (const [name, x, z, plinthH, s] of items) {
    const scale = s * 1.45;
    const plinth = buildPlinth(m, 1.25 * scale + 0.2, 1.1 * scale + 0.2, plinthH);
    plinth.group.position.set(x, PLATFORM_TOP, z);
    const model = buildProduct(name, m);
    model.scale.setScalar(scale);
    model.position.set(x, PLATFORM_TOP + plinth.top, z);
    model.rotation.y = x > 0 ? -0.4 : 0.4;
    group.add(plinth.group, model, flatSprite(shared.shadow, 1.6 * scale, PLATFORM_TOP + plinth.top + 0.004, 0.6));
  }
  return group;
}

function withTiles(group: THREE.Group, m: Materials, tiles: [IconKey, number, number, number, boolean?][]) {
  for (const [icon, x, y, z, navy] of tiles) {
    const tile = buildTile(m, icon, navy ? "navy" : "frost", 1.15);
    tile.position.set(x, y, z);
    tile.rotation.set(0.2, x > 0 ? -0.45 : 0.45, x > 0 ? 0.08 : -0.08);
    group.add(tile);
  }
  return group;
}

export function buildNamedScene(name: string, m: Materials, shared: Shared): THREE.Object3D {
  if (name === "hero-poster") return buildHeroComposition(m, shared, "desktop").root;
  if (name.startsWith("product-")) {
    const group = new THREE.Group();
    const model = buildProduct(name.slice(8) as ProductName, m);
    model.rotation.y = 0.5;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    group.add(model, flatSprite(shared.shadow, Math.max(size.x, size.z) * 1.6, 0.003, 0.55));
    return group;
  }
  if (name.startsWith("tile-")) {
    const icon = name.slice(5) as IconKey;
    return buildTile(m, icon, icon === "network" || icon === "printer" ? "navy" : "frost", 1);
  }
  if (name === "chart") {
    const g = buildBarChart(m, shared);
    const s1 = buildSphere(m, 0.32);
    s1.position.set(-2.0, 1.6, 0.6);
    const s2 = buildSphere(m, 0.2);
    s2.position.set(1.9, 2.6, -0.6);
    g.add(s1, s2);
    return g;
  }
  if (name === "cta") {
    const g = buildBarChart(m, shared);
    withTiles(g, m, [
      ["shield", -2.3, 2.3, 0.4],
      ["chart", 2.3, 2.9, -0.4, true],
    ]);
    const s = buildSphere(m, 0.28);
    s.position.set(-1.6, 3.4, -0.8);
    g.add(s);
    return g;
  }
  switch (name) {
    case "banner-about":
      return withTiles(miniStage(m, shared, [["gear", -0.85, -0.2, 0.45, 0.75], ["rack", 0.9, -0.5, 0.25, 0.7]]), m, [["shield", -2.4, 2.4, 0.6]]);
    case "banner-services":
      return withTiles(miniStage(m, shared, [["laptop", -0.8, 0.5, 0.3, 0.65], ["cctv", 0.9, 0.2, 0.55, 0.7], ["gear", 0.1, -0.9, 0.2, 0.6]]), m, [["wrench", 2.5, 2.4, -0.2, true]]);
    case "banner-products":
      return withTiles(miniStage(m, shared, [["printer", -0.8, 0.3, 0.3, 0.7], ["rack", 0.7, -0.5, 0.45, 0.75]]), m, [["laptop", -2.4, 2.6, -0.2]]);
    case "banner-clients":
      return withTiles(miniStage(m, shared, [["chair", -0.6, -0.2, 0.35, 0.75], ["laptop", 0.9, 0.5, 0.25, 0.6]]), m, [["network", 2.4, 2.5, -0.3, true], ["shield", -2.4, 2.2, 0.4]]);
    case "banner-contact":
      return withTiles(miniStage(m, shared, [["laptop", -0.4, 0.2, 0.35, 0.75]]), m, [["network", 2.0, 2.2, 0, true], ["camera", -2.1, 2.5, -0.2]]);
    case "banner-404":
      return withTiles(miniStage(m, shared, [["gear", 0, -0.2, 0.3, 0.9]]), m, [["wrench", 2.2, 2.6, -0.2, true], ["shield", -2.2, 2.2, 0.3]]);
  }
  throw new Error(`Unknown scene: ${name}`);
}

export { HERO_TUNING };
