/**
 * The hero's 3D scene: the company's six business pillars, modelled from
 * primitives, start scattered through dark space and assemble onto a glowing
 * ring as `setProgress(0 → 1)` is driven by scroll.
 *
 * Plain Three.js (no React renderer) so the scroll timeline can drive it
 * directly and every resource is disposed on unmount. This module is
 * dynamically imported, keeping three.js out of the initial bundle.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type HeroScene = {
  setProgress: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
};

type Options = { mobile: boolean; reduced: boolean };

const COLORS = {
  deep: "#14213a",
  navy: "#2a4161",
  charcoal: "#4a4a4a",
  steel: "#3f6d85",
  glow: "#5ba3d0",
  body: "#2c333e",
  paper: "#dbe3ed",
};

/* ------------------------------------------------------------------------ */
/* Materials, shared by every object                                         */
/* ------------------------------------------------------------------------ */

function createMaterials() {
  return {
    body: new THREE.MeshStandardMaterial({ color: COLORS.body, metalness: 0.55, roughness: 0.38 }),
    navy: new THREE.MeshStandardMaterial({ color: COLORS.navy, metalness: 0.45, roughness: 0.35 }),
    charcoal: new THREE.MeshStandardMaterial({ color: COLORS.charcoal, metalness: 0.4, roughness: 0.5 }),
    steel: new THREE.MeshStandardMaterial({ color: COLORS.steel, metalness: 0.85, roughness: 0.28 }),
    paper: new THREE.MeshStandardMaterial({ color: COLORS.paper, metalness: 0.05, roughness: 0.7 }),
    screen: new THREE.MeshStandardMaterial({
      color: COLORS.deep,
      emissive: COLORS.steel,
      emissiveIntensity: 0.9,
      metalness: 0.2,
      roughness: 0.2,
    }),
    glow: new THREE.MeshBasicMaterial({ color: COLORS.glow }),
  };
}

type Materials = ReturnType<typeof createMaterials>;

/* ------------------------------------------------------------------------ */
/* Builders                                                                  */
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
/* Choreography                                                              */
/* ------------------------------------------------------------------------ */

type Piece = {
  object: THREE.Group;
  from: { position: THREE.Vector3; rotation: THREE.Euler; scale: number };
  to: { position: THREE.Vector3; rotation: THREE.Euler; scale: number };
  phase: number;
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export function createHeroScene(
  canvas: HTMLCanvasElement,
  { mobile, reduced }: Options,
): HeroScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mobile ? 52 : 34, 1, 0.1, 100);
  const cameraZ = mobile ? 13 : 13;
  // Aim below the pieces so the assembled ring sits in the upper half of the
  // frame, clear of the wordmark below it.
  const lookAt = new THREE.Vector3(0, mobile ? -0.9 : -0.25, 0);

  // Lighting: cool fill, a white key and two steel-blue rims.
  scene.add(new THREE.AmbientLight("#b9c7d9", 0.35));
  scene.add(new THREE.HemisphereLight(COLORS.glow, "#1b1f26", 0.7));
  const key = new THREE.DirectionalLight("#ffffff", 1.8);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(COLORS.glow, 40, 24);
  rim.position.set(-5, 3, 3);
  scene.add(rim);
  const back = new THREE.PointLight(COLORS.steel, 30, 24);
  back.position.set(5, 0, -4);
  scene.add(back);

  const m = createMaterials();
  const world = new THREE.Group();
  world.position.y = mobile ? 1.15 : 1.05;
  scene.add(world);

  // Mobile carries fewer pieces; the assembly reads the same.
  const builders = mobile
    ? [serverRack, cctvCamera, laptop, gear]
    : [serverRack, cctvCamera, laptop, printer, officeChair, gear];
  const scales = mobile ? [0.6, 0.82, 0.66, 0.52] : [0.66, 0.9, 0.74, 0.7, 0.7, 0.58];

  // Hand-placed scatter positions so the opening frame is balanced.
  const scatter: [number, number, number][] = [
    [-7.5, 3.2, -3],
    [6.8, 4.1, -2],
    [-6.2, -3.4, 1],
    [7.4, -2.8, 0],
    [-1.8, 5.6, -5],
    [2.6, -5.2, -4],
  ];

  const radius = mobile ? 2 : 3.3;
  const pieces: Piece[] = builders.map((build, i) => {
    const object = build(m);
    // Pieces land on the back arc of the ring (190° → 350°): a skyline that
    // sits above the wordmark, rather than a full circle hidden behind it.
    const angle = Math.PI * (190 + (160 * i) / (builders.length - 1)) / 180;
    const [sx, sy, sz] = scatter[i];
    const piece: Piece = {
      object,
      from: {
        position: new THREE.Vector3(mobile ? sx * 0.55 : sx, sy, sz),
        rotation: new THREE.Euler(
          ((i * 1.7) % 3) - 1.5,
          ((i * 2.3) % 3) - 1.5,
          ((i * 1.1) % 2) - 1,
        ),
        scale: scales[i] * 0.75,
      },
      to: {
        position: new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius * 0.45),
        rotation: new THREE.Euler(0, -Math.cos(angle) * 0.45, 0),
        scale: scales[i],
      },
      phase: i * 1.37,
    };
    world.add(object);
    return piece;
  });

  // The platform the pieces assemble onto.
  const ring = part(
    new THREE.TorusGeometry(radius + 0.6, 0.018, 8, 160),
    new THREE.MeshBasicMaterial({ color: COLORS.glow, transparent: true, opacity: 0 }),
    [0, -1.05, 0],
    [Math.PI / 2, 0, 0],
  );
  ring.scale.set(1, 0.45, 1);
  const disc = part(
    new THREE.CircleGeometry(radius + 0.6, 64),
    new THREE.MeshBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0, side: THREE.DoubleSide }),
    [0, -1.07, 0],
    [-Math.PI / 2, 0, 0],
  );
  disc.scale.set(1, 0.45, 1);
  world.add(ring, disc);

  // Dust field for depth.
  const dustCount = mobile ? 220 : 520;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = 6 + Math.random() * 10;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    dustPositions.set([r * Math.sin(p) * Math.cos(t), r * Math.cos(p) * 0.6, r * Math.sin(p) * Math.sin(t) - 4], i * 3);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: COLORS.glow, size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true, depthWrite: false }),
  );
  scene.add(dust);

  /* ---------------------------------------------------------------------- */

  let progress = reduced ? 1 : 0;

  const seconds = () => performance.now() / 1000;

  function apply(time: number) {
    const n = pieces.length;
    const spread = 0.06;
    pieces.forEach((piece, i) => {
      // Each piece starts a beat after the last, so they arrive in sequence.
      const local = clamp01((progress - i * spread) / (1 - (n - 1) * spread));
      const e = easeInOutCubic(local);
      const drift = reduced ? 0 : 1 - e;
      const { from, to, object } = piece;
      object.position.lerpVectors(from.position, to.position, e);
      object.position.y += Math.sin(time * 0.8 + piece.phase) * (0.35 * drift + 0.05);
      object.rotation.set(
        THREE.MathUtils.lerp(from.rotation.x, to.rotation.x, e) + Math.sin(time * 0.5 + piece.phase) * 0.15 * drift,
        THREE.MathUtils.lerp(from.rotation.y, to.rotation.y, e) + time * 0.12 * drift,
        THREE.MathUtils.lerp(from.rotation.z, to.rotation.z, e),
      );
      object.scale.setScalar(THREE.MathUtils.lerp(from.scale, to.scale, e));
    });

    const lock = smoothstep(0.78, 1, progress);
    (ring.material as THREE.MeshBasicMaterial).opacity = lock * 0.9;
    (disc.material as THREE.MeshBasicMaterial).opacity = lock * 0.22;

    // Once assembled, the whole composition sways gently.
    world.rotation.y = (1 - lock) * 0.5 + Math.sin(time * 0.35) * 0.12 * lock;
    dust.rotation.y = time * 0.015;
    camera.position.set(0, 2.4 - progress * 0.5, cameraZ + (1 - progress) * 2);
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
    apply(seconds());
  }

  // Render only while the hero is on screen.
  let frame = 0;
  let visible = false;
  const loop = () => {
    apply(seconds());
    frame = requestAnimationFrame(loop);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(frame);
    if (visible && !reduced) frame = requestAnimationFrame(loop);
  });
  observer.observe(canvas);

  const resizeObserver = new ResizeObserver(resize);
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
  resize();

  return {
    setProgress(value) {
      progress = clamp01(value);
      if (reduced || !visible) apply(seconds());
    },
    resize,
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((mat) => mat.dispose());
        else material?.dispose();
      });
      Object.values(m).forEach((mat) => mat.dispose());
      renderer.dispose();
    },
  };
}
