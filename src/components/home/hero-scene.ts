/**
 * The live hero scene: the shared hero composition, animated. It owns no
 * timeline: it exposes plain numeric targets (`intro`) that the hero's GSAP
 * timeline tweens, and renders on GSAP's ticker, so the page has a single
 * animation loop. Pauses when offscreen, caps DPR at 2, and drops to DPR 1
 * and fake glass if frames run slow. Dynamically imported, keeping three.js
 * out of the initial bundle.
 */
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { createMaterials, disposeMaterials, type Materials, type Quality } from "@/components/three/materials";
import { createShared } from "@/components/three/pieces";
import { buildHeroComposition } from "@/components/three/hero-composition";
import { createEnvironment, createLights, createRenderer, fitHeroCamera } from "@/components/three/stage";
import { PALETTE } from "@/components/three/materials";
import { HERO_TUNING as T } from "./hero-tuning";

export type ProductIntro = { appear: number; explode: number; glint: number };

export type HeroIntro = {
  /** Platform rises into place (0 → 1). */
  platform: number;
  /** LED ring lights up (0 → 1). */
  led: number;
  products: ProductIntro[];
  /** Each tile pops in (0 → 1). */
  tiles: number[];
  /** Idle motion blends in (0 → 1). */
  idle: number;
};

export type HeroScene = {
  intro: HeroIntro;
  /** Resolves once every shader is compiled and the first frame is drawn. */
  ready: Promise<void>;
  setFinal: () => void;
  bounds: () => { left: number; top: number; right: number; bottom: number }[];
  dispose: () => void;
};

type Options = {
  mobile: boolean;
  reduced: boolean;
  quality: Quality;
  /** Shared state the hero timeline tweens; created here if omitted. */
  intro?: HeroIntro;
  /** Tier 2 reached (fake glass, DPR 1). */
  onSlow?: () => void;
  /** Tier 3: still too slow; the caller swaps in the static poster. */
  onFallback?: () => void;
};

/** The intro state at the start of the timeline (or composed, if `final`). */
export function createIntro(view: "desktop" | "mobile", final: boolean): HeroIntro {
  return {
    platform: final ? 1 : 0,
    led: final ? 1 : 0,
    products: T.layout[view].map(() => (final ? { appear: 1, explode: 0, glint: 0 } : { appear: 0, explode: 1, glint: 0 })),
    tiles: T.tiles[view].map(() => (final ? 1 : 0)),
    idle: 0,
  };
}

const damp = THREE.MathUtils.damp;

/** Turn every transmissive glass into the cheap fake glass. */
function degradeGlass(m: Materials) {
  for (const key of ["glass", "glassSky"] as const) {
    const mat = m[key];
    if (mat.transmission > 0) {
      mat.transmission = 0;
      mat.transparent = true;
      mat.opacity = key === "glass" ? 0.32 : 0.4;
      mat.depthWrite = false;
      mat.envMapIntensity = 1.6;
      mat.needsUpdate = true;
    }
  }
}

export function createHeroScene(canvas: HTMLCanvasElement, { mobile, reduced, quality, onSlow, onFallback, intro: given }: Options): HeroScene {
  const view = mobile ? "mobile" : "desktop";
  const renderer = createRenderer(canvas, { antialias: !mobile });
  let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : T.dprCap);
  renderer.setPixelRatio(dpr);
  renderer.toneMappingExposure = T.lights.exposure;

  const scene = new THREE.Scene();
  const env = createEnvironment(renderer, scene, T.lights.environment);
  const lights = createLights(scene, T.lights);
  const camera = new THREE.PerspectiveCamera(T.camera.fov, 1, 0.1, 100);
  const cam = T.camera[view];
  const designPos = new THREE.Vector3(...cam.position);
  let basePos = designPos.clone();
  const target = new THREE.Vector3(...cam.target);

  const m = createMaterials(quality);
  const shared = createShared();
  const comp = buildHeroComposition(m, shared, view);
  scene.add(comp.root);

  const intro: HeroIntro = given ?? createIntro(view, reduced);

  /* Size ------------------------------------------------------------------ */
  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    basePos = fitHeroCamera(camera, designPos, target);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  /* Pointer: parallax and tile hover ------------------------------------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, nx: 0, ny: 0, inside: false };
  const fine = !mobile && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const raycaster = new THREE.Raycaster();
  const tileMeshes = comp.tiles.map((t) => t.group);
  const tileHover = comp.tiles.map(() => 0);
  const onPointer = (event: PointerEvent) => {
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    const r = canvas.getBoundingClientRect();
    pointer.nx = ((event.clientX - r.left) / r.width) * 2 - 1;
    pointer.ny = -((event.clientY - r.top) / r.height) * 2 + 1;
    pointer.inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
  };
  if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

  /* Adaptive quality ------------------------------------------------------ */
  // Tier 1: full quality. Tier 2: DPR 1 and fake glass. Tier 3: the caller
  // shows the static poster. Each step needs 1.6s of frames slower than
  // HERO_TUNING.tiers.slowFrame (seconds) to trigger.
  let slow = 0;
  let degraded = quality === "low";
  let fellBack = false;
  function adapt(dt: number) {
    slow = dt > T.tiers.slowFrame ? slow + dt : Math.max(0, slow - dt * 0.5);
    if (slow < T.tiers.patience) return;
    slow = 0;
    if (dpr > 1) {
      dpr = 1;
      renderer.setPixelRatio(1);
      resize();
    } else if (!degraded) {
      degraded = true;
      degradeGlass(m);
      onSlow?.();
    } else if (!fellBack) {
      fellBack = true;
      onFallback?.();
    }
  }

  /* Frame ----------------------------------------------------------------- */
  const tmp = new THREE.Euler();
  const ndc = new THREE.Vector2();
  const ledColor = new THREE.Color(PALETTE.led);
  let time = 0;
  let sweepClock = 2;

  function frame(dt: number) {
    time += dt;
    const idle = intro.idle;

    // Platform rises, then swings gently.
    const p = intro.platform;
    comp.stage.position.y = -1.6 * (1 - p);
    comp.stage.scale.setScalar(0.9 + 0.1 * p);
    comp.stage.rotation.y = idle * T.idle.swing * Math.sin((time / T.idle.swingPeriod) * Math.PI * 2);
    comp.platform.pool.visible = p > 0.01;
    (comp.platform.pool.material as THREE.MeshBasicMaterial).opacity = 0.9 * p;

    // LED ring: lights up, then pulses slowly.
    const pulse = 1 - T.idle.ledPulse * idle * (0.5 + 0.5 * Math.sin(time * 1.4));
    comp.platform.ledMaterial.color.copy(ledColor).multiplyScalar(0.15 + 0.85 * intro.led * pulse);
    comp.platform.ledMaterial.opacity = 0.2 + 0.8 * intro.led;

    // Products assemble from exploded parts.
    comp.products.forEach((prod, i) => {
      const s = intro.products[i];
      const e = s.explode;
      for (const part of prod.parts) {
        part.obj.position.lerpVectors(part.rest, part.out, e);
        tmp.set(part.restRot.x + part.spin.x * e, part.restRot.y + part.spin.y * e, part.restRot.z + part.spin.z * e);
        part.obj.rotation.copy(tmp);
      }
      const a = Math.max(0.0001, s.appear);
      prod.model.scale.setScalar(prod.slot.scale * a);
      // Float only lifts (never sinks into the plinth).
      prod.model.position.y = prod.baseY + e * 0.6 + idle * (0.5 + 0.5 * Math.sin(time * 0.9 + prod.phase)) * T.idle.float;
      prod.plinth.scale.set(1, Math.max(0.0001, Math.min(1, a * 1.2)), 1);
      (prod.shadow.material as THREE.MeshBasicMaterial).opacity = 0.7 * a * (1 - e);
      (prod.glint.material as THREE.SpriteMaterial).opacity = s.glint;
      prod.glint.scale.setScalar(0.3 + s.glint * 1.1);
    });

    // Tiles: pop in, drift, tilt toward the pointer when hovered.
    if (fine && pointer.inside) {
      raycaster.setFromCamera(ndc.set(pointer.nx, pointer.ny), camera);
      const hit = raycaster.intersectObjects(tileMeshes, true)[0];
      const hitTile = hit ? tileMeshes.findIndex((g) => g === hit.object.parent || g === hit.object) : -1;
      tileHover.forEach((_, i) => (tileHover[i] = damp(tileHover[i], i === hitTile ? 1 : 0, 6, dt)));
    } else {
      tileHover.forEach((_, i) => (tileHover[i] = damp(tileHover[i], 0, 6, dt)));
    }
    comp.tiles.forEach((tile, i) => {
      const t = intro.tiles[i];
      tile.group.visible = t > 0.001;
      tile.group.scale.setScalar(Math.max(0.0001, t));
      const drift = idle * T.idle.tileDrift;
      tile.group.position.set(
        tile.base.x + Math.sin(time * 0.35 + tile.phase) * drift * 0.6,
        tile.base.y + Math.sin(time * 0.6 + tile.phase) * drift + (1 - t) * -0.6,
        tile.base.z,
      );
      tile.group.rotation.set(
        tile.baseRot.x + Math.sin(time * 0.4 + tile.phase) * 0.06 * idle - tileHover[i] * pointer.ny * 0.5,
        tile.baseRot.y + Math.sin(time * 0.3 + tile.phase) * 0.08 * idle + tileHover[i] * pointer.nx * 0.6,
        tile.baseRot.z,
      );
    });
    comp.spheres.forEach((s) => {
      s.mesh.visible = intro.platform > 0.5;
      s.mesh.position.y = s.base.y + Math.sin(time * 0.7 + s.phase) * 0.15 * idle;
      s.mesh.scale.setScalar(Math.max(0.0001, (intro.tiles[0] ?? 1)));
    });

    // Light sweep every few seconds.
    if (idle > 0.5) {
      sweepClock += dt;
      if (sweepClock > T.idle.sweepEvery) sweepClock = 0;
      const k = Math.min(1, sweepClock / 1.8);
      lights.sweep.position.x = -7 + 14 * k;
      lights.sweep.intensity = sweepClock < 1.8 ? Math.sin(k * Math.PI) * 26 : 0;
    }

    // Damped parallax.
    pointer.x = damp(pointer.x, pointer.tx, T.idle.parallax.damping, dt);
    pointer.y = damp(pointer.y, pointer.ty, T.idle.parallax.damping, dt);
    camera.position.set(basePos.x + pointer.x * T.idle.parallax.x, basePos.y - pointer.y * T.idle.parallax.y, basePos.z);
    camera.lookAt(target);

    renderer.render(scene, camera);
  }

  /* Loop: GSAP's ticker, only while visible -------------------------------- */
  let visible = true;
  let last = performance.now();
  const tick = () => {
    if (!visible) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frame(dt);
    if (!reduced) adapt(dt);
  };
  // Render only while on screen and the tab is visible.
  let onScreen = true;
  const checkVisible = () => {
    const next = onScreen && document.visibilityState === "visible";
    if (next && !visible) last = performance.now();
    visible = next;
  };
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    checkVisible();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", checkVisible);
  const ready = renderer
    .compileAsync(scene, camera)
    .catch(() => undefined)
    .then(() => {
      frame(0);
      if (!reduced) gsap.ticker.add(tick);
    });

  return {
    intro,
    ready,
    setFinal() {
      intro.platform = 1;
      intro.led = 1;
      intro.products.forEach((s) => Object.assign(s, { appear: 1, explode: 0, glint: 0 }));
      intro.tiles.forEach((_, i) => (intro.tiles[i] = 1));
      frame(0);
    },
    bounds() {
      const r = canvas.getBoundingClientRect();
      return [...comp.products.map((p) => p.holder), ...comp.tiles.map((t) => t.group)].map((obj) => {
        const box = new THREE.Box3().setFromObject(obj);
        const out = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
        for (let c = 0; c < 8; c++) {
          const v = new THREE.Vector3(c & 1 ? box.max.x : box.min.x, c & 2 ? box.max.y : box.min.y, c & 4 ? box.max.z : box.min.z).project(camera);
          const x = r.left + ((v.x + 1) / 2) * r.width;
          const y = r.top + ((1 - v.y) / 2) * r.height;
          out.left = Math.min(out.left, x);
          out.right = Math.max(out.right, x);
          out.top = Math.min(out.top, y);
          out.bottom = Math.max(out.bottom, y);
        }
        return out;
      });
    },
    dispose() {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", checkVisible);
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | undefined;
        if (mat && !Object.values(m).includes(mat as never)) {
          (mat as THREE.MeshBasicMaterial).map?.dispose();
          mat.dispose();
        }
      });
      disposeMaterials(m);
      shared.shadow.dispose();
      shared.pool.dispose();
      comp.glintTex.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}
