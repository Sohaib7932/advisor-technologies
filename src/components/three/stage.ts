/**
 * Renderer, image-based lighting and the light rig shared by the live hero
 * and the offline renders: RoomEnvironment (PMREM) for reflections, a warm-
 * white key from the upper right, a sky-blue rim from behind-left and a
 * soft hemisphere fill. ACES tone mapping for a product-shot look.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { PALETTE } from "./materials";

export function createRenderer(canvas: HTMLCanvasElement, { preserve = false, antialias = true } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias,
    alpha: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: preserve,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  return renderer;
}

export function createEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene, intensity = 0.85) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.03).texture;
  room.dispose();
  pmrem.dispose();
  scene.environment = env;
  scene.environmentIntensity = intensity;
  return env;
}

export function createLights(scene: THREE.Scene, { key = 2.1, rim = 3.2 } = {}) {
  const keyLight = new THREE.DirectionalLight("#fff7ee", key);
  keyLight.position.set(6, 10, 8);
  const rimLight = new THREE.DirectionalLight(PALETTE.sky, rim);
  rimLight.position.set(-8, 4, -7);
  const fill = new THREE.HemisphereLight("#dcecf8", PALETTE.ink, 0.45);
  // Travelling highlight for the idle "light sweep".
  const sweep = new THREE.PointLight("#ffffff", 0, 9, 1.6);
  sweep.position.set(-7, 3.2, 4);
  scene.add(keyLight, rimLight, fill, sweep);
  return { key: keyLight, rim: rimLight, fill, sweep };
}

/**
 * Pulls the hero camera back along its view direction until a circle of
 * `radius` (the platform, plus margin) fits the canvas width, so the
 * platform is never cut off on narrow or tall canvases. Returns the
 * fitted position.
 */
export function fitHeroCamera(camera: THREE.PerspectiveCamera, position: THREE.Vector3, target: THREE.Vector3, radius = 6) {
  const offset = position.clone().sub(target);
  const distance = offset.length();
  const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * distance;
  const k = Math.max(1, radius / halfWidth);
  return target.clone().add(offset.multiplyScalar(k));
}

/** Points the camera so `object` fills the frame (offline renders). */
export function frameObject(camera: THREE.PerspectiveCamera, object: THREE.Object3D, { elevation = 0.42, azimuth = 0.5, padding = 1.12 } = {}) {
  const box = new THREE.Box3().setFromObject(object);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const fit = Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * camera.aspect));
  const distance = (sphere.radius * padding) / Math.sin(fit / 2);
  const dir = new THREE.Vector3(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
  camera.position.copy(sphere.center).addScaledVector(dir, distance);
  camera.near = distance / 50;
  camera.far = distance * 10;
  camera.lookAt(sphere.center);
  camera.updateProjectionMatrix();
}
