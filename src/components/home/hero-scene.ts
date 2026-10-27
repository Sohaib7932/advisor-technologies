/**
 * The hero's 3D scene: a procedural light studio (a seamless white-to-pale-
 * steel cyclorama, a matte light floor, soft contact shadows, a window light
 * from the upper left) and the company's six business pillars, each built
 * from named sub-meshes so it can start exploded and assemble.
 *
 * The scene owns no animation timing: it exposes plain numeric targets
 * (`intro`) that the hero's GSAP timeline tweens, and renders on GSAP's
 * ticker, so the page runs a single animation loop. Dynamically imported,
 * keeping three.js out of the initial bundle.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "@/lib/gsap";
import { HERO_TUNING, type Slot } from "./hero-tuning";

/** Per-product intro state, tweened by the hero timeline (0 → 1 unless noted). */
export type ProductIntro = {
  /** Parts scale in from nothing. */
  appear: number;
  /** 1 = parts flung apart and lifted, 0 = assembled on its spot. */
  explode: number;
  /** Plinth and contact shadow grow in as the product lands. */
  land: number;
  /** A quick specular glint when it snaps into place (0 → 1 → 0). */
  glint: number;
};

export type HeroScene = {
  intro: { light: number; pull: number; idle: number; products: ProductIntro[] };
  /** Jump every value to the composed final state (reduced motion). */
  setFinal: () => void;
  /** Projected screen rectangles of each product, for layout checks. */
  bounds: () => { left: number; top: number; right: number; bottom: number }[];
  dispose: () => void;
};

type Options = { mobile: boolean; reduced: boolean };

const COLORS = {
  deep: "#14213a",
  navy: "#2a4161",
  steel: "#3f6d85",
  glow: "#5ba3d0",
  white: "#f4f6f9",
  silver: "#c3ccd6",
  paper: "#ffffff",
  plinth: "#e2e8ef",
};

/* ------------------------------------------------------------------------ */
/* Materials: white/silver bodies, navy and steel accents, small LEDs       */
/* ------------------------------------------------------------------------ */

function createMaterials() {
  return {
    body: new THREE.MeshStandardMaterial({ color: COLORS.white, metalness: 0.15, roughness: 0.32 }),
    navy: new THREE.MeshStandardMaterial({ color: COLORS.deep, metalness: 0.35, roughness: 0.38 }),
    charcoal: new THREE.MeshStandardMaterial({ color: COLORS.silver, metalness: 0.85, roughness: 0.28 }),
    steel: new THREE.MeshStandardMaterial({ color: COLORS.steel, metalness: 0.7, roughness: 0.3 }),
    paper: new THREE.MeshStandardMaterial({ color: COLORS.paper, metalness: 0, roughness: 0.75 }),
    screen: new THREE.MeshStandardMaterial({
      color: COLORS.navy,
      emissive: COLORS.steel,
      emissiveIntensity: 0.55,
      metalness: 0.1,
      roughness: 0.15,
    }),
    glow: new THREE.MeshStandardMaterial({
      color: COLORS.glow,
      emissive: COLORS.glow,
      emissiveIntensity: 1.1,
      roughness: 0.4,
    }),
  };
}

type Materials = ReturnType<typeof createMaterials>;

/* ------------------------------------------------------------------------ */
/* Products                                                                  */
/* ------------------------------------------------------------------------ */

function part(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  [x, y, z]: [number, number, number] = [0, 0, 0],
  [rx, ry, rz]: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  return mesh;
}

const rbox = (w: number, h: number, d: number, r = 0.04) =>
  new RoundedBoxGeometry(w, h, d, 2, r);

function serverRack(m: Materials) {
  const g = new THREE.Group();
  g.add(part(rbox(1, 1.9, 0.9, 0.06), m.body));
  for (let i = 0; i < 6; i++) {
    const y = -0.72 + i * 0.29;
    g.add(part(rbox(0.84, 0.22, 0.05, 0.02), m.navy, [0, y, 0.45]));
    g.add(part(new THREE.BoxGeometry(0.05, 0.05, 0.02), m.glow, [0.32, y, 0.48]));
    g.add(part(new THREE.BoxGeometry(0.42, 0.025, 0.02), m.charcoal, [-0.12, y, 0.48]));
  }
  return g;
}

function cctvCamera(m: Materials) {
  const g = new THREE.Group();
  g.add(part(rbox(0.46, 0.1, 0.46, 0.03), m.charcoal, [0, 0.75, 0]));
  g.add(part(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 12), m.charcoal, [0, 0.5, 0]));
  g.add(part(new THREE.SphereGeometry(0.09, 16, 12), m.steel, [0, 0.27, 0]));

  const head = new THREE.Group();
  head.position.set(0, 0.12, 0.22);
  head.rotation.x = 0.35;
  head.add(part(new THREE.CylinderGeometry(0.26, 0.26, 0.95, 28), m.body, [0, 0, 0], [Math.PI / 2, 0, 0]));
  head.add(part(new THREE.CylinderGeometry(0.3, 0.3, 0.7, 28, 1, true, 0, Math.PI), m.navy, [0, 0.03, -0.08], [Math.PI / 2, 0, Math.PI]));
  head.add(part(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 28), m.charcoal, [0, 0, 0.49], [Math.PI / 2, 0, 0]));
  head.add(part(new THREE.CircleGeometry(0.13, 28), m.glow, [0, 0, 0.525]));
  head.add(part(new THREE.SphereGeometry(0.03, 10, 8), m.glow, [0.18, 0.2, 0.3]));
  g.add(head);
  return g;
}

function laptop(m: Materials) {
  const g = new THREE.Group();
  g.add(part(rbox(1.6, 0.07, 1.05, 0.03), m.body));
  g.add(part(new THREE.BoxGeometry(1.3, 0.012, 0.45), m.charcoal, [0, 0.04, 0.08]));
  g.add(part(new THREE.BoxGeometry(0.42, 0.012, 0.24), m.navy, [0, 0.04, 0.4]));

  const lid = new THREE.Group();
  lid.position.set(0, 0.035, -0.5);
  lid.rotation.x = -0.28;
  lid.add(part(rbox(1.6, 1.02, 0.05, 0.03), m.body, [0, 0.51, 0]));
  lid.add(part(new THREE.BoxGeometry(1.46, 0.88, 0.01), m.screen, [0, 0.51, 0.03]));
  // A few glowing interface lines on the display.
  [0.3, 0.12, -0.06].forEach((y, i) =>
    lid.add(part(new THREE.BoxGeometry(i === 0 ? 0.8 : 0.5, 0.035, 0.005), m.glow, [-0.25 + i * 0.05, 0.51 + y, 0.038])),
  );
  g.add(lid);
  return g;
}

function printer(m: Materials) {
  const g = new THREE.Group();
  g.add(part(rbox(1.3, 0.7, 1, 0.06), m.body));
  g.add(part(rbox(1.32, 0.12, 1.02, 0.04), m.charcoal, [0, 0.41, 0]));
  g.add(part(new THREE.BoxGeometry(1, 0.01, 0.7), m.screen, [0, 0.475, 0]));
  g.add(part(new THREE.BoxGeometry(0.9, 0.04, 0.12), m.navy, [0, 0.08, 0.5]));
  g.add(part(new THREE.BoxGeometry(0.7, 0.012, 0.5), m.paper, [0, 0.02, 0.62], [0.12, 0, 0]));
  const panel = part(rbox(0.36, 0.06, 0.2, 0.02), m.navy, [0.4, 0.5, 0.38], [-0.4, 0, 0]);
  panel.add(part(new THREE.BoxGeometry(0.22, 0.02, 0.03), m.glow, [0, 0.035, 0]));
  g.add(panel);
  return g;
}

function officeChair(m: Materials) {
  const g = new THREE.Group();
  g.add(part(rbox(0.9, 0.14, 0.85, 0.06), m.navy, [0, 0.55, 0]));
  g.add(part(rbox(0.85, 0.95, 0.12, 0.06), m.navy, [0, 1.15, -0.4], [-0.12, 0, 0]));
  g.add(part(new THREE.BoxGeometry(0.1, 0.5, 0.06), m.charcoal, [0, 0.75, -0.44]));
  g.add(part(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 12), m.steel, [0, 0.3, 0]));
  for (const side of [-1, 1]) {
    g.add(part(new THREE.BoxGeometry(0.06, 0.28, 0.06), m.charcoal, [side * 0.42, 0.74, 0]));
    g.add(part(rbox(0.09, 0.05, 0.42, 0.02), m.charcoal, [side * 0.42, 0.89, 0.02]));
  }
  const legGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.08);
  const caster = new THREE.SphereGeometry(0.06, 12, 10);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    g.add(part(legGeometry, m.charcoal, [Math.cos(a) * 0.25, 0.08, Math.sin(a) * 0.25], [0, -a, 0]));
    g.add(part(caster, m.steel, [Math.cos(a) * 0.48, 0.04, Math.sin(a) * 0.48]));
  }
  g.position.y = -0.7;
  const wrap = new THREE.Group();
  wrap.add(g);
  return wrap;
}

function gear(m: Materials) {
  const teeth = 12;
  const outer = 0.92;
  const inner = 0.74;
  const shape = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    const pts: [number, number][] = [
      [inner, a0],
      [outer, a0 + step * 0.15],
      [outer, a0 + step * 0.45],
      [inner, a0 + step * 0.6],
    ];
    pts.forEach(([r, a], j) => {
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0 && j === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geometry.center();

  const g = new THREE.Group();
  g.add(part(geometry, m.steel));
  g.add(part(new THREE.TorusGeometry(0.36, 0.035, 10, 40), m.glow, [0, 0, 0.19]));
  return g;
}


/* ------------------------------------------------------------------------ */
/* Studio                                                                    */
/* ------------------------------------------------------------------------ */

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Soft round falloff, used for contact shadows. */
function shadowTexture() {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(20,33,58,0.9)");
    g.addColorStop(0.45, "rgba(20,33,58,0.35)");
    g.addColorStop(1, "rgba(20,33,58,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
}

/** Four-point specular star for the snap glint. */
function glintTexture() {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 20);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.moveTo(64, 4);
    ctx.quadraticCurveTo(68, 60, 124, 64);
    ctx.quadraticCurveTo(68, 68, 64, 124);
    ctx.quadraticCurveTo(60, 68, 4, 64);
    ctx.quadraticCurveTo(60, 60, 64, 4);
    ctx.fill();
  });
}

/**
 * A seamless cyclorama: floor running into a quarter-circle cove and up the
 * back wall, as one mesh, with its gradient mapped along the profile so the
 * seam disappears. Dithered, so the soft gradient never bands.
 */
function cyclorama() {
  const coveRadius = 5;
  const wallZ = -9;
  const profile: [number, number][] = []; // [y, z] from the front of the floor up the wall
  profile.push([0, 30]);
  profile.push([0, wallZ + coveRadius]);
  for (let i = 1; i <= 16; i++) {
    const a = (i / 16) * (Math.PI / 2);
    profile.push([coveRadius - Math.cos(a) * coveRadius, wallZ + coveRadius - Math.sin(a) * coveRadius]);
  }
  profile.push([34, wallZ]);

  const lengths = [0];
  for (let i = 1; i < profile.length; i++) {
    const [y0, z0] = profile[i - 1];
    const [y1, z1] = profile[i];
    lengths.push(lengths[i - 1] + Math.hypot(y1 - y0, z1 - z0));
  }
  const total = lengths[lengths.length - 1];
  const width = 90;
  const cols = 2;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  profile.forEach(([y, z], i) => {
    for (let c = 0; c <= cols; c++) {
      positions.push(-width / 2 + (c / cols) * width, y, z);
      uvs.push(c / cols, lengths[i] / total);
    }
  });
  for (let i = 0; i < profile.length - 1; i++) {
    for (let c = 0; c < cols; c++) {
      const a = i * (cols + 1) + c;
      const b = a + cols + 1;
      index.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();

  // v runs from the front of the floor (0) to the top of the wall (1).
  const floorEnd = lengths[1] / total;
  const coveEnd = lengths[profile.length - 2] / total;
  const map = canvasTexture(64, 1024, (ctx) => {
    const g = ctx.createLinearGradient(0, 1024, 0, 0); // canvas y is flipped vs v
    g.addColorStop(0, HERO_TUNING.studio.floor);
    g.addColorStop(floorEnd, HERO_TUNING.studio.floor);
    g.addColorStop((floorEnd + coveEnd) / 2, HERO_TUNING.studio.wall.bottom);
    g.addColorStop(Math.min(1, coveEnd + 0.12), "#f4f8fb");
    g.addColorStop(1, HERO_TUNING.studio.wall.top);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 1024);
  });
  map.wrapS = THREE.ClampToEdgeWrapping;

  const material = new THREE.MeshStandardMaterial({ map, roughness: 0.9, metalness: 0, dithering: true });
  const mesh = new THREE.Mesh(geometry, material);

  return { mesh, textures: [map] };
}

/* ------------------------------------------------------------------------ */

type Product = {
  root: THREE.Group;
  model: THREE.Group;
  parts: { mesh: THREE.Object3D; rest: THREE.Vector3; restRot: THREE.Euler; out: THREE.Vector3; spin: THREE.Euler }[];
  plinth: THREE.Mesh | null;
  floorShadow: THREE.Mesh;
  topShadow: THREE.Mesh | null;
  glint: THREE.Sprite;
  slot: Slot;
  height: number;
  phase: number;
  /** Model height that seats it on its plinth (or the floor). */
  baseY: number;
};

const damp = THREE.MathUtils.damp;

export function createHeroScene(canvas: HTMLCanvasElement, { mobile, reduced }: Options): HeroScene {
  const T = HERO_TUNING;
  const view = mobile ? "mobile" : "desktop";
  let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = T.lights.exposure;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(T.studio.wall.top);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(T.camera.fov[view], 1, 0.1, 120);
  const basePos = new THREE.Vector3(...T.camera.position[view]);
  const lookAt = new THREE.Vector3(...T.camera.lookAt[view]);

  // Key light from the upper left, matching the window light on the wall.
  const key = new THREE.DirectionalLight("#ffffff", T.lights.key);
  key.position.set(-7, 10, 7);
  scene.add(key, new THREE.HemisphereLight("#ffffff", "#dfe7ef", 0.35));

  /* Studio ---------------------------------------------------------------- */
  const studio = cyclorama();
  scene.add(studio.mesh);

  // Matte floor only: no mirror, so products read as standing on a
  // studio floor (contact shadows ground them), never floating on water.

  /* Products --------------------------------------------------------------- */
  const m = createMaterials();
  const shadowTex = shadowTexture();
  const glintTex = glintTexture();
  const plinthMat = new THREE.MeshStandardMaterial({ color: COLORS.plinth, roughness: 0.45, metalness: 0.05 });
  const builders = mobile
    ? [serverRack, cctvCamera, laptop, gear]
    : [serverRack, cctvCamera, laptop, printer, officeChair, gear];
  const names = mobile ? ["rack", "cctv", "laptop", "gear"] : ["rack", "cctv", "laptop", "printer", "chair", "gear"];
  const random = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  const products: Product[] = builders.map((build, i) => {
    const slot = T.layout[view][i];
    const model = build(m);
    // Seat the model on y = 0.
    const box = new THREE.Box3().setFromObject(model);
    model.position.y -= box.min.y;
    const size = box.getSize(new THREE.Vector3());

    // Parts: the model's direct children (or its single wrapper's children).
    const holder = model.children.length === 1 && model.children[0].type === "Group" ? (model.children[0] as THREE.Group) : model;
    const parts = holder.children.map((mesh, j) => {
      mesh.name = `${names[i]}-part-${j}`;
      const dir = new THREE.Vector3(random(i * 31 + j) - 0.5, random(i * 17 + j * 3) * 0.8 + 0.2, random(i * 7 + j * 5) - 0.5)
        .normalize()
        .multiplyScalar(T.intro.explode * (0.55 + random(i + j * 11) * 0.45));
      return {
        mesh,
        rest: mesh.position.clone(),
        restRot: mesh.rotation.clone(),
        out: mesh.position.clone().add(dir),
        spin: new THREE.Euler((random(j + 1) - 0.5) * 0.5, (random(j + 2) - 0.5) * 0.5, (random(j + 3) - 0.5) * 0.5),
      };
    });

    const root = new THREE.Group();
    root.name = names[i];
    root.add(model);
    model.scale.setScalar(slot.scale);
    model.position.multiplyScalar(slot.scale);
    model.position.y += slot.plinth;
    root.rotation.y = slot.turn;
    scene.add(root);

    const footprint = Math.max(size.x, size.z) * slot.scale;
    let plinth: THREE.Mesh | null = null;
    let topShadow: THREE.Mesh | null = null;
    if (slot.plinth > 0) {
      const w = footprint + 0.3;
      plinth = new THREE.Mesh(new RoundedBoxGeometry(w, slot.plinth, w * 0.85, 2, 0.05), plinthMat);
      plinth.position.y = slot.plinth / 2;
      root.add(plinth);
      topShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(footprint * 1.25, footprint * 1.05),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }),
      );
      topShadow.rotation.x = -Math.PI / 2;
      topShadow.position.y = slot.plinth + 0.004;
      root.add(topShadow);
    }
    const floorShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(footprint * 1.8, footprint * 1.5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }),
    );
    floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.position.y = 0.006;
    root.add(floorShadow);

    const glint = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glintTex, transparent: true, depthWrite: false, opacity: 0, toneMapped: false }),
    );
    glint.position.set(size.x * slot.scale * 0.3, slot.plinth + size.y * slot.scale * 0.95, footprint * 0.3);
    root.add(glint);

    return {
      root,
      model,
      parts,
      plinth,
      floorShadow,
      topShadow,
      glint,
      slot,
      height: slot.plinth + size.y * slot.scale,
      phase: i * 1.37,
      baseY: model.position.y,
    };
  });

  /* Intro state (tweened by the hero timeline) ----------------------------- */
  const intro: HeroScene["intro"] = {
    light: reduced ? 1 : 0,
    pull: reduced ? 0 : 1,
    idle: reduced ? 0 : 0,
    products: products.map(() =>
      reduced ? { appear: 1, explode: 0, land: 1, glint: 0 } : { appear: 0, explode: 1, land: 0, glint: 0 },
    ),
  };

  /* Layout: place each product by screen position, so it scales with aspect */
  function layout() {
    const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // Portrait screens (tablets) pull the outer products in so none is cut off.
    const inset = camera.aspect < 1 ? 0.82 : 1;
    for (const p of products) {
      const distance = basePos.z - p.slot.z;
      const halfWidth = halfTan * distance * camera.aspect;
      p.root.position.set(p.slot.nx * inset * halfWidth, 0, p.slot.z);
    }
  }

  /* Pointer and frame loop -------------------------------------------------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const tilt = !mobile && !reduced && window.matchMedia("(hover: hover)").matches;
  const onPointer = (event: PointerEvent) => {
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (tilt) window.addEventListener("pointermove", onPointer, { passive: true });

  // Adaptive quality: if frames run slow for a while, drop DPR.
  let slowTime = 0;
  let degraded = false;
  function adapt(dt: number) {
    if (degraded) return;
    slowTime = dt > 1 / 40 ? slowTime + dt : Math.max(0, slowTime - dt);
    if (slowTime > 1.5) {
      degraded = true;
      dpr = 1;
      renderer.setPixelRatio(1);
      resize();
    }
  }

  const tmp = new THREE.Euler();
  let time = 0;
  function frame(dt: number) {
    time += dt;
    // Studio light comes up.
    scene.environmentIntensity = T.lights.environment * (0.25 + 0.75 * intro.light);
    key.intensity = T.lights.key * intro.light;
    renderer.toneMappingExposure = T.lights.exposure * (0.6 + 0.4 * intro.light);

    products.forEach((p, i) => {
      const s = intro.products[i];
      const e = s.explode;
      for (const part of p.parts) {
        part.mesh.position.lerpVectors(part.rest, part.out, e);
        tmp.set(part.restRot.x + part.spin.x * e, part.restRot.y + part.spin.y * e, part.restRot.z + part.spin.z * e);
        part.mesh.rotation.copy(tmp);
        part.mesh.scale.setScalar(Math.max(0.0001, s.appear));
      }
      // Lifted while exploded, slow float afterwards.
      const float = intro.idle * Math.sin(time * 0.9 + p.phase) * 0.035;
      p.model.position.y = p.baseY + e * 0.45 + float;
      p.model.rotation.y = e * 0.25 + intro.idle * Math.sin(time * 0.4 + p.phase) * 0.03;

      if (p.plinth) {
        p.plinth.scale.set(1, Math.max(0.0001, s.land), 1);
        p.plinth.position.y = (p.slot.plinth * s.land) / 2;
        (p.plinth.material as THREE.Material).visible = s.land > 0.001;
      }
      (p.floorShadow.material as THREE.MeshBasicMaterial).opacity = T.studio.shadowOpacity * 1.6 * s.land;
      p.floorShadow.scale.setScalar(0.5 + 0.5 * s.land);
      if (p.topShadow) (p.topShadow.material as THREE.MeshBasicMaterial).opacity = T.studio.shadowOpacity * 1.4 * s.land;
      (p.glint.material as THREE.SpriteMaterial).opacity = s.glint;
      p.glint.scale.setScalar(0.2 + s.glint * 0.9);
      p.glint.material.rotation = s.glint * 0.8;
    });

    pointer.x = damp(pointer.x, pointer.tx, T.parallax.damping, dt);
    pointer.y = damp(pointer.y, pointer.ty, T.parallax.damping, dt);
    camera.position.set(
      basePos.x + pointer.x * T.parallax.x,
      basePos.y - pointer.y * T.parallax.y,
      basePos.z + intro.pull * T.camera.introPullBack,
    );
    camera.lookAt(lookAt);
    renderer.render(scene, camera);
  }

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const { clientWidth: w, clientHeight: h } = parent;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    layout();
    frame(0);
  }

  // One loop for the whole page: render on GSAP's ticker, only while visible.
  let visible = false;
  const tick = (_t: number, deltaMs: number) => {
    const dt = Math.min(deltaMs / 1000, 0.1);
    adapt(dt);
    frame(dt);
  };
  const observer = new IntersectionObserver(([entry]) => {
    const next = entry.isIntersecting && !reduced;
    if (next && !visible) gsap.ticker.add(tick);
    if (!next && visible) gsap.ticker.remove(tick);
    visible = next;
  });
  observer.observe(canvas);
  const resizeObserver = new ResizeObserver(resize);
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
  resize();

  const project = new THREE.Vector3();
  return {
    intro,
    setFinal() {
      intro.light = 1;
      intro.pull = 0;
      intro.idle = 0;
      intro.products.forEach((s) => Object.assign(s, { appear: 1, explode: 0, land: 1, glint: 0 }));
      frame(0);
    },
    bounds() {
      const rect = canvas.getBoundingClientRect();
      return products.map((p) => {
        const box = new THREE.Box3().setFromObject(p.model);
        if (p.plinth) box.expandByObject(p.plinth);
        let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
        for (const x of [box.min.x, box.max.x])
          for (const y of [box.min.y, box.max.y])
            for (const z of [box.min.z, box.max.z]) {
              project.set(x, y, z).project(camera);
              const sx = rect.left + ((project.x + 1) / 2) * rect.width;
              const sy = rect.top + ((1 - project.y) / 2) * rect.height;
              left = Math.min(left, sx); right = Math.max(right, sx);
              top = Math.min(top, sy); bottom = Math.max(bottom, sy);
            }
        return { left, top, right, bottom };
      });
    },
    dispose() {
      gsap.ticker.remove(tick);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((mat) => mat.dispose());
        else material?.dispose();
      });
      [...studio.textures, shadowTex, glintTex, envTexture].forEach((t) => t.dispose());
      Object.values(m).forEach((mat) => mat.dispose());
      plinthMat.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------------------ */
/* Single-product renders, for the card illustrations (dev capture page)     */
/* ------------------------------------------------------------------------ */

export const PRODUCT_BUILDERS = {
  rack: serverRack,
  cctv: cctvCamera,
  laptop,
  printer,
  chair: officeChair,
  gear,
} as const;

export type ProductName = keyof typeof PRODUCT_BUILDERS;

/** Renders one product, lit like the hero, on a transparent background. */
export function renderProduct(name: ProductName, size = 900): string {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = HERO_TUNING.lights.environment;
  const key = new THREE.DirectionalLight("#ffffff", HERO_TUNING.lights.key);
  key.position.set(-7, 10, 7);
  scene.add(key, new THREE.HemisphereLight("#ffffff", "#dfe7ef", 0.35));

  const m = createMaterials();
  const model = PRODUCT_BUILDERS[name](m);
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const radius = box.getSize(new THREE.Vector3()).length() / 2;
  model.position.sub(center);
  model.rotation.y = -0.55;
  scene.add(model);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const distance = radius / Math.sin(THREE.MathUtils.degToRad(15)) * 1.04;
  camera.position.set(0, distance * 0.42, distance * 0.91);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");

  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
  });
  Object.values(m).forEach((mat) => mat.dispose());
  env.dispose();
  pmrem.dispose();
  renderer.dispose();
  return url;
}
