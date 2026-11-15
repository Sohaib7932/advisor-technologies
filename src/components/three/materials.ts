/**
 * The material set every scene uses, so renders and the live hero share one
 * look: clearcoat navy, white ceramic, chrome, steel blue, LED glow and
 * glass. `glass` is real transmission on capable devices and a fake
 * (transparent, env-lit, clearcoat) glass on phones and slow machines.
 */
import * as THREE from "three";
import { screenTexture } from "./textures";

export const PALETTE = {
  ink: "#0b1626",
  navy: "#14213a",
  brand: "#2a4161",
  steel: "#3a5fb4",
  sky: "#5b8def",
  led: "#8fb3ff",
  ceramic: "#f3f6fa",
  chrome: "#dfe6ee",
};

export type Quality = "high" | "low";

export function createMaterials(quality: Quality) {
  const high = quality === "high";

  const glass = (tint: string, roughness: number, opacity = 0.32, fake = false) =>
    high && !fake
      ? new THREE.MeshPhysicalMaterial({
          color: tint,
          metalness: 0,
          roughness,
          transmission: 1,
          thickness: 0.6,
          ior: 1.45,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          attenuationColor: new THREE.Color(PALETTE.sky),
          attenuationDistance: 2.5,
          specularIntensity: 1,
          envMapIntensity: 1.2,
        })
      : new THREE.MeshPhysicalMaterial({
          color: tint,
          metalness: 0.1,
          roughness: Math.min(roughness, 0.15),
          transparent: true,
          opacity,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.6,
          depthWrite: false,
        });

  return {
    navy: new THREE.MeshPhysicalMaterial({
      color: "#16264a",
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 0.45,
    }),
    /** The platform deck: deep, glossy, reflecting the blue rim light. */
    deck: new THREE.MeshPhysicalMaterial({
      color: "#10203f",
      metalness: 0.45,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 0.2,
    }),
    brand: new THREE.MeshPhysicalMaterial({
      color: PALETTE.brand,
      metalness: 0.3,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    ceramic: new THREE.MeshPhysicalMaterial({
      color: PALETTE.ceramic,
      metalness: 0,
      roughness: 0.28,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
    }),
    chrome: new THREE.MeshStandardMaterial({ color: PALETTE.chrome, metalness: 1, roughness: 0.16 }),
    steel: new THREE.MeshPhysicalMaterial({
      color: PALETTE.steel,
      metalness: 0.55,
      roughness: 0.28,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    }),
    led: new THREE.MeshBasicMaterial({ color: PALETTE.led, toneMapped: false }),
    ledSoft: new THREE.MeshBasicMaterial({ color: PALETTE.sky, toneMapped: false, transparent: true, opacity: 0.9 }),
    paper: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 }),
    laptopScreen: new THREE.MeshBasicMaterial({ map: screenTexture("laptop"), toneMapped: false }),
    printerScreen: new THREE.MeshBasicMaterial({ map: screenTexture("printer"), toneMapped: false }),
    /** Plinths and the platform rim. */
    glass: glass("#e8f3fb", 0.08),
    /** Floating tiles and spheres sit over the page, not the scene, so they
     *  use fake glass: transmission over a transparent canvas reads milky. */
    frost: glass("#9dbbf5", 0.06, 0.34, true),
    bubble: glass("#d6ebf9", 0.04, 0.2, true),
    /** Bar-chart columns, tinted sky. */
    glassSky: glass("#a9c4ff", 0.06, 0.45),
  };
}

export type Materials = ReturnType<typeof createMaterials>;

export function disposeMaterials(m: Materials) {
  for (const material of Object.values(m)) {
    const mat = material as THREE.Material & { map?: THREE.Texture | null };
    mat.map?.dispose();
    mat.dispose();
  }
}
