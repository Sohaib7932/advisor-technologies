/**
 * The hero composition (ref 2's platform skyline, ref 3's glass tiles):
 * the two-tier platform with six products on glass plinths of different
 * heights, frosted icon tiles and glass spheres around it. Shared by the
 * live hero (which animates it) and the offline poster render (final state).
 */
import * as THREE from "three";
import { HERO_TUNING, type ProductSlot, type TileSlot } from "@/components/home/hero-tuning";
import type { Materials } from "./materials";
import { buildPlatform, buildPlinth, buildSphere, buildTile, flatSprite, PLATFORM_TOP, type Shared } from "./pieces";
import { buildProduct } from "./products";
import { glintTexture } from "./textures";

export type HeroPart = {
  obj: THREE.Object3D;
  rest: THREE.Vector3;
  restRot: THREE.Euler;
  out: THREE.Vector3;
  spin: THREE.Euler;
};

export type HeroProduct = {
  slot: ProductSlot;
  /** Plinth + product, positioned on the platform. */
  holder: THREE.Group;
  plinth: THREE.Group;
  model: THREE.Group;
  baseY: number;
  parts: HeroPart[];
  shadow: THREE.Mesh;
  glint: THREE.Sprite;
  phase: number;
};

export type HeroTile = { group: THREE.Group; slot: TileSlot; base: THREE.Vector3; baseRot: THREE.Euler; phase: number };
export type HeroSphere = { mesh: THREE.Mesh; base: THREE.Vector3; phase: number };

const seeded = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export function buildHeroComposition(m: Materials, shared: Shared, view: "desktop" | "mobile") {
  const root = new THREE.Group();
  /** Platform and products: rotates as one in the idle swing. */
  const stage = new THREE.Group();
  root.add(stage);
  const platform = buildPlatform(m, shared);
  stage.add(platform.group);
  const glintTex = glintTexture();

  const products: HeroProduct[] = HERO_TUNING.layout[view].map((slot, i) => {
    const holder = new THREE.Group();
    holder.position.set(slot.x, PLATFORM_TOP, slot.z);
    const plinth = buildPlinth(m, slot.size[0], slot.size[1], slot.plinth);
    holder.add(plinth.group);

    const model = buildProduct(slot.name, m);
    model.scale.setScalar(slot.scale);
    model.rotation.y = slot.turn;
    model.position.y = plinth.top;
    holder.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const shadow = flatSprite(shared.shadow, Math.max(size.x, size.z) * 1.5, plinth.top + 0.004, 0.7);
    holder.add(shadow);

    const glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, transparent: true, depthWrite: false, opacity: 0, toneMapped: false }));
    glint.position.set(size.x * 0.3, plinth.top + size.y * 0.9, size.z * 0.3);
    glint.scale.setScalar(0.9);
    holder.add(glint);

    const parts = model.children.map((obj, j) => {
      const dir = new THREE.Vector3(seeded(i * 31 + j) - 0.5, seeded(i * 17 + j * 3) * 0.9 + 0.1, seeded(i * 7 + j * 5) - 0.5)
        .normalize()
        .multiplyScalar(HERO_TUNING.intro.explode * (0.55 + seeded(i + j * 11) * 0.45));
      return {
        obj,
        rest: obj.position.clone(),
        restRot: obj.rotation.clone(),
        out: obj.position.clone().add(dir),
        spin: new THREE.Euler((seeded(j + 1) - 0.5) * 1.4, (seeded(j + 2) - 0.5) * 1.4, (seeded(j + 3) - 0.5) * 1.4),
      };
    });

    stage.add(holder);
    return { slot, holder, plinth: plinth.group, model, baseY: plinth.top, parts, shadow, glint, phase: i * 1.37 };
  });

  const tiles: HeroTile[] = HERO_TUNING.tiles[view].map((slot, i) => {
    const group = buildTile(m, slot.icon, slot.navy ? "navy" : "frost", slot.size);
    group.position.set(...slot.pos);
    group.rotation.set(...slot.rot);
    root.add(group);
    return { group, slot, base: group.position.clone(), baseRot: group.rotation.clone(), phase: i * 0.9 };
  });

  const spheres: HeroSphere[] = HERO_TUNING.spheres[view].map((s, i) => {
    const mesh = buildSphere(m, s.r);
    mesh.position.set(...s.pos);
    root.add(mesh);
    return { mesh, base: mesh.position.clone(), phase: i * 2.1 + 0.5 };
  });

  return { root, stage, platform, products, tiles, spheres, glintTex };
}

export type HeroComposition = ReturnType<typeof buildHeroComposition>;
