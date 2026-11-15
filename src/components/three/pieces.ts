/**
 * The stagecraft around the products: the glossy two-tier platform with its
 * glass rim and LED ring, glass plinths, frosted icon tiles, glass spheres
 * and the glass bar-chart cluster (ref 3).
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { PALETTE, type Materials } from "./materials";
import { iconTexture, radialTexture, type IconKey } from "./textures";

/** Height of the platform's top surface. */
export const PLATFORM_TOP = 0.56;

export function createShared() {
  return {
    shadow: radialTexture("11,22,38", 0.85, 0.32),
    pool: radialTexture("91,141,239", 0.55, 0.18),
  };
}
export type Shared = ReturnType<typeof createShared>;

/** A soft contact shadow (or light pool) lying flat at y. */
export function flatSprite(texture: THREE.Texture, size: number, y: number, opacity = 1) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity, toneMapped: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.renderOrder = -1;
  return mesh;
}

export type Platform = {
  group: THREE.Group;
  /** Its own material so it can pulse without touching other LEDs. */
  ledMaterial: THREE.MeshBasicMaterial;
  pool: THREE.Mesh;
};

export function buildPlatform(m: Materials, shared: Shared, radius = 4.4): Platform {
  const group = new THREE.Group();
  group.name = "platform";
  const r = radius;
  const lower = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.12, 0.3, 160), m.deck);
  lower.position.y = 0.15;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r + 0.14, 0.11, 24, 180), m.glass);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.2;
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r * 0.82, 0.24, 160), m.deck);
  upper.position.y = 0.42;
  const ledMaterial = new THREE.MeshBasicMaterial({ color: PALETTE.led, toneMapped: false, transparent: true });
  const led = new THREE.Mesh(new THREE.TorusGeometry(r * 0.82 + 0.02, 0.028, 12, 200), ledMaterial);
  led.rotation.x = Math.PI / 2;
  led.position.y = 0.32;
  const lowerLed = new THREE.Mesh(new THREE.TorusGeometry(r + 0.13, 0.018, 10, 200), ledMaterial);
  lowerLed.rotation.x = Math.PI / 2;
  lowerLed.position.y = 0.04;
  const pool = flatSprite(shared.pool, r * 2.5, -0.02, 0.9);
  group.add(pool, lower, rim, upper, led, lowerLed);
  [lower, upper].forEach((mesh) => (mesh.receiveShadow = true));
  return { group, ledMaterial, pool };
}

/** A glass plinth with a navy cap; products stand on `top`. */
export function buildPlinth(m: Materials, width: number, depth: number, height: number) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 3, Math.min(0.1, height / 3)), m.glass);
  body.position.y = height / 2;
  const cap = new THREE.Mesh(new RoundedBoxGeometry(width + 0.04, 0.05, depth + 0.04, 2, 0.02), m.navy);
  cap.position.y = height + 0.025;
  group.add(body, cap);
  return { group, top: height + 0.05 };
}

/** A frosted (or navy) glass tile with an icon floating inside. */
export function buildTile(m: Materials, icon: IconKey, variant: "frost" | "navy" = "frost", size = 1) {
  const group = new THREE.Group();
  group.name = `tile-${icon}`;
  const slab = new THREE.Mesh(new RoundedBoxGeometry(size, size, size * 0.24, 4, size * 0.18), variant === "navy" ? m.navy : m.frost);
  const glyph = new THREE.Mesh(
    new THREE.PlaneGeometry(size * 0.7, size * 0.7),
    new THREE.MeshBasicMaterial({
      map: iconTexture(icon, variant === "navy" ? PALETTE.led : "#ffffff"),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  glyph.position.z = size * 0.125;
  // A sky-tinted inner card behind the glyph, so it reads through the glass.
  const inner = new THREE.Mesh(
    new RoundedBoxGeometry(size * 0.72, size * 0.72, 0.02, 2, size * 0.14),
    new THREE.MeshBasicMaterial({ color: variant === "navy" ? "#1d3557" : "#3f74e0", transparent: true, opacity: variant === "navy" ? 1 : 0.92, toneMapped: false }),
  );
  inner.position.z = size * 0.06;
  group.add(inner, slab, glyph);
  return group;
}

export function buildSphere(m: Materials, radius: number) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), m.bubble);
  mesh.name = "sphere";
  return mesh;
}

/** Glass dish with four glass columns of different heights (ref 3). */
export function buildBarChart(m: Materials, shared: Shared) {
  const group = new THREE.Group();
  group.name = "bar-chart";
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.85, 0.14, 96), m.glass);
  dish.position.y = 0.07;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.05, 16, 120), m.chrome);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.12;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.05, 96), m.navy);
  base.position.y = 0.03;
  group.add(flatSprite(shared.pool, 6, -0.01, 0.8), base, dish, rim);
  const bars: [number, number, number, keyof Materials][] = [
    [-0.75, 0.35, 1.0, "glassSky"],
    [-0.05, -0.45, 1.75, "glass"],
    [0.75, 0.25, 1.3, "glassSky"],
    [0.15, 0.75, 2.3, "glass"],
  ];
  for (const [x, z, h, mat] of bars) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, h, 64), m[mat] as THREE.Material);
    bar.position.set(x, 0.14 + h / 2, z);
    const cap = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 64), m.led);
    cap.rotation.x = Math.PI / 2;
    cap.position.set(x, 0.14 + h, z);
    group.add(bar, cap);
  }
  return group;
}
