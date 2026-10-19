/**
 * The hero's 3D scene: the company's six business pillars, modelled from
 * primitives, drift scattered through a dark showroom and land on their
 * display stands as `setProgress(0 → 1)` is driven by scroll.
 *
 * Plain Three.js (no React renderer) so the scroll timeline can drive it
 * directly and every resource is disposed on unmount. This module is
 * dynamically imported, keeping three.js out of the initial bundle.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createRoom, LAYER, radialTexture, setLayers } from "./hero-room";
import { HERO_TUNING } from "./hero-tuning";

export type HeroScene = {
  setProgress: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
};

type Options = { mobile: boolean; reduced: boolean };
type Canvases = { room: HTMLCanvasElement; front: HTMLCanvasElement };

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

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export function createHeroScene(
  canvases: Canvases,
  { mobile, reduced }: Options,
): HeroScene {
  const T = HERO_TUNING;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

  // Two renderers over one scene: the room is drawn behind the HTML title,
  // the display pieces on a transparent canvas in front of it, so the pieces
  // genuinely overlap the lower part of the letters.
  const makeRenderer = (canvas: HTMLCanvasElement, transparent: boolean) => {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !mobile,
      alpha: transparent,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = T.lights.exposure;
    renderer.setClearColor("#10151d", transparent ? 0 : 1);
    return renderer;
  };
  const roomRenderer = makeRenderer(canvases.room, T.plate);
  const frontRenderer = makeRenderer(canvases.front, true);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#11182a", T.room.fog.near, T.room.fog.far);
  const view = mobile ? "mobile" : "desktop";
  const camera = new THREE.PerspectiveCamera(T.camera.fov[view], 1, 0.1, 80);
  const basePosition = new THREE.Vector3(...T.camera.position[view]);
  // Extra distance on screens narrower than the composition (tablets).
  let pullBack = 0;
  const lookAt = new THREE.Vector3(...T.camera.lookAt[view]);

  const room = createRoom(mobile, T.plate);
  scene.add(room.group);
  const stageTop = T.plate ? 0 : 0.16;
  const stageZ = (mobile ? T.stage.mobile : T.stage.desktop).centerZ;

  /* Lighting: one key from the pendant, blue rims, a whisper of fill ------ */
  const lights = new THREE.Group();
  const ambient = new THREE.AmbientLight("#b9c7d9", T.lights.ambient);
  const hemi = new THREE.HemisphereLight(COLORS.glow, "#1b1f26", T.lights.hemisphere);
  const pendant = new THREE.SpotLight("#e6f2fb", T.lights.pendant, 22, 0.62, 0.85, 1.2);
  pendant.position.set(0, mobile ? 7.4 : 6.2, stageZ);
  pendant.target.position.set(0, 0, stageZ);
  const rimL = new THREE.PointLight(COLORS.glow, T.lights.rim, 14, 1.4);
  rimL.position.set(-5, 3.5, -2.5);
  const rimR = new THREE.PointLight(COLORS.glow, T.lights.rim, 14, 1.4);
  rimR.position.set(5, 3.5, -2.5);
  const fill = new THREE.DirectionalLight("#ffffff", 0.35);
  fill.position.set(0, 3, 10);
  lights.add(ambient, hemi, pendant, pendant.target, rimL, rimR, fill);
  scene.add(lights);
  setLayers(lights, LAYER.MIRROR, LAYER.ROOM, LAYER.OBJECTS);

  const m = createMaterials();
  const shadowTex = radialTexture("rgba(0,0,0,0.85)", "rgba(0,0,0,0)");
  const poolTex = radialTexture();

  // Mobile carries fewer pieces; the assembly reads the same.
  const builders = mobile
    ? [serverRack, cctvCamera, laptop, gear]
    : [serverRack, cctvCamera, laptop, printer, officeChair, gear];
  const layout = T.layout[view];
  const pedestalMat = new THREE.MeshStandardMaterial({ color: "#3a414c", roughness: 0.32, metalness: 0.55 });

  const pieces = builders.map((build, i) => {
    const base = layout[i];
    const place = { ...base, z: base.z - (T.plate ? T.plateDepth : 0) };

    // Re-seat each model so its base sits at y = 0 inside a wrapper.
    const model = build(m);
    const bounds = new THREE.Box3().setFromObject(model);
    model.position.y -= bounds.min.y;
    const footprint = Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z);
    const object = new THREE.Group();
    object.add(model);
    scene.add(object);
    setLayers(object, LAYER.MIRROR, LAYER.OBJECTS);

    // Display stand, empty and waiting in the intro.
    const surface = stageTop + place.pedestal;
    const onStand = place.pedestal > 0;
    if (onStand) {
      const width = footprint * place.scale + 0.35;
      const stand = new THREE.Group();
      stand.add(part(rbox(width, place.pedestal, width * 0.8, 0.05), pedestalMat, [0, place.pedestal / 2, 0]));
      stand.add(part(new THREE.BoxGeometry(width * 0.86, 0.014, 0.014), m.glow, [0, place.pedestal - 0.02, width * 0.4 + 0.004]));
      stand.position.set(place.x, stageTop, place.z);
      stand.rotation.y = place.turn * 0.5;
      scene.add(stand);
      setLayers(stand, LAYER.MIRROR, LAYER.OBJECTS);
      const standShadow = part(
        new THREE.PlaneGeometry(width * 1.9, width * 1.6),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.9 }),
        [place.x, stageTop + 0.003, place.z],
        [-Math.PI / 2, 0, 0],
      );
      scene.add(standShadow);
      setLayers(standShadow, LAYER.ROOM);
    }

    // Contact shadow and a soft blue light pool where the piece lands.
    const shadowSize = footprint * place.scale * 1.5;
    const shadow = part(
      new THREE.PlaneGeometry(shadowSize, shadowSize * 0.75),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }),
      [place.x, surface + 0.004, place.z],
      [-Math.PI / 2, 0, 0],
    );
    shadow.renderOrder = 2;
    const pool = part(
      new THREE.PlaneGeometry(shadowSize * 1.8, shadowSize * 1.3),
      new THREE.MeshBasicMaterial({
        map: poolTex,
        color: COLORS.glow,
        transparent: true,
        depthWrite: false,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      }),
      [place.x, stageTop + 0.006, place.z + 0.25],
      [-Math.PI / 2, 0, 0],
    );
    scene.add(shadow, pool);
    // A shadow on a stand top must draw with the stand, in front of the title.
    setLayers(shadow, onStand ? LAYER.OBJECTS : LAYER.ROOM);
    setLayers(pool, LAYER.ROOM);

    const [sx, sy, sz] = place.scatter;
    return {
      object,
      shadow,
      pool,
      from: {
        position: new THREE.Vector3(sx, sy, sz),
        rotation: new THREE.Euler(((i * 1.7) % 3) - 1.5, ((i * 2.3) % 3) - 1.5, ((i * 1.1) % 2) - 1),
        scale: place.scale * 0.8,
      },
      to: {
        position: new THREE.Vector3(place.x, surface, place.z),
        rotation: new THREE.Euler(0, place.turn, 0),
        scale: place.scale,
      },
      phase: i * 1.37,
    };
  });

  /* ---------------------------------------------------------------------- */

  let progress = reduced ? 1 : 0;
  const seconds = () => performance.now() / 1000;

  // Desktop mouse tilt, eased toward the pointer.
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const tiltEnabled = !mobile && !reduced && window.matchMedia("(hover: hover)").matches;
  const onPointer = (event: PointerEvent) => {
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (tiltEnabled) window.addEventListener("pointermove", onPointer, { passive: true });

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
      object.position.y += Math.sin(time * 0.8 + piece.phase) * 0.35 * drift;
      object.rotation.set(
        THREE.MathUtils.lerp(from.rotation.x, to.rotation.x, e) + Math.sin(time * 0.5 + piece.phase) * 0.15 * drift,
        THREE.MathUtils.lerp(from.rotation.y, to.rotation.y, e) + time * 0.12 * drift,
        THREE.MathUtils.lerp(from.rotation.z, to.rotation.z, e),
      );
      object.scale.setScalar(THREE.MathUtils.lerp(from.scale, to.scale, e));

      // Shadow sharpens and darkens as the piece comes down onto its spot.
      const land = smoothstep(0.55, 1, e);
      (piece.shadow.material as THREE.MeshBasicMaterial).opacity = land * 0.9;
      piece.shadow.scale.setScalar(1.6 - 0.6 * land);
      (piece.pool.material as THREE.MeshBasicMaterial).opacity = land * 0.16;
    });

    const lock = smoothstep(0.78, 1, progress);
    room.update(lock, time);
    const boost = 1 + lock * T.lights.lockBoost;
    pendant.intensity = T.lights.pendant * boost;
    rimL.intensity = rimR.intensity = T.lights.rim * boost;

    pointer.x += (pointer.tx - pointer.x) * T.parallax.ease;
    pointer.y += (pointer.ty - pointer.y) * T.parallax.ease;
    camera.position.set(
      basePosition.x + pointer.x * T.parallax.x,
      basePosition.y - pointer.y * T.parallax.y,
      basePosition.z + pullBack + (1 - progress) * T.camera.pushIn,
    );
    camera.lookAt(lookAt);

    camera.layers.set(LAYER.ROOM);
    roomRenderer.render(scene, camera);
    camera.layers.set(LAYER.OBJECTS);
    frontRenderer.render(scene, camera);
  }

  function resize() {
    const parent = canvases.room.parentElement;
    if (!parent) return;
    const { clientWidth: w, clientHeight: h } = parent;
    roomRenderer.setSize(w, h, false);
    frontRenderer.setSize(w, h, false);
    room.resize(w, h, dpr);
    camera.aspect = w / h;
    pullBack = mobile ? 0 : Math.max(0, T.camera.wideAspect - camera.aspect) * T.camera.narrowPullBack;
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
  observer.observe(canvases.front);

  const resizeObserver = new ResizeObserver(resize);
  if (canvases.room.parentElement) resizeObserver.observe(canvases.room.parentElement);
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
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((mat) => mat.dispose());
        else material?.dispose();
      });
      room.floor?.dispose();
      [...room.textures, shadowTex, poolTex].forEach((texture) => texture.dispose());
      Object.values(m).forEach((mat) => mat.dispose());
      pedestalMat.dispose();
      roomRenderer.dispose();
      frontRenderer.dispose();
    },
  };
}
