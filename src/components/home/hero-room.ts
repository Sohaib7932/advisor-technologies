/**
 * The showroom the hero's pieces assemble in, built procedurally: a panelled
 * navy back wall with steel-blue light strips, an LED strip along the upper
 * wall, a concrete side wall, a pendant lamp with a volumetric beam, haze, a
 * polished reflective floor and the display stage.
 *
 * Everything here lives on the ROOM layer (drawn on the canvas behind the
 * HTML title) and on layer 0 (so the floor mirror can see it).
 */
import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { HERO_TUNING } from "./hero-tuning";

export const LAYER = { MIRROR: 0, ROOM: 1, OBJECTS: 2 } as const;

const C = {
  deep: "#14213a",
  navy: "#2a4161",
  bg: "#1b1f26",
  charcoal: "#4a4a4a",
  steel: "#3f6d85",
  glow: "#5ba3d0",
  ice: "#d6ecfa",
};

export function setLayers(object: THREE.Object3D, ...layers: number[]) {
  object.traverse((child) => {
    child.layers.disableAll();
    layers.forEach((layer) => child.layers.enable(layer));
  });
}

/* ------------------------------------------------------------------------ */
/* Canvas textures (no image downloads)                                      */
/* ------------------------------------------------------------------------ */

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Soft round falloff: glows, light pools and contact shadows. */
export function radialTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  return canvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function noiseTexture(size: number, contrast: number) {
  const texture = canvasTexture(size, (ctx, s) => {
    const image = ctx.createImageData(s, s);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * contrast;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    // A few soft blotches so it reads as cast concrete, not static.
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 10 + Math.random() * 60;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${0.05 + Math.random() * 0.08})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Wispy haze: blurred blobs on transparent, tileable enough for drifting. */
function hazeTexture() {
  const texture = canvasTexture(256, (ctx, s) => {
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 30 + Math.random() * 90;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/* ------------------------------------------------------------------------ */
/* Volumetric beam: an open cone, brightest at the lamp, soft at the rim    */
/* ------------------------------------------------------------------------ */

function beamMaterial(opacity: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(C.glow) },
      uOpacity: { value: opacity },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float along = pow(vUv.y, 1.6);                       // fade toward the floor
        float edge = pow(abs(dot(vNormal, vView)), 1.4);    // soft silhouette
        gl_FragColor = vec4(uColor, along * edge * uOpacity);
      }`,
  });
}

/* ------------------------------------------------------------------------ */

export type Room = {
  group: THREE.Group;
  floor: Reflector | null;
  /** lock: 0 → 1 as the pieces settle; time in seconds. */
  update: (lock: number, time: number) => void;
  resize: (width: number, height: number, dpr: number) => void;
  textures: THREE.Texture[];
};

export function createRoom(mobile: boolean, plate: boolean): Room {
  const T = HERO_TUNING;
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const glowTex = radialTexture();
  textures.push(glowTex);

  const glowSprite = (color: string, scale: [number, number], opacity: number) => {
    const material = new THREE.SpriteMaterial({
      map: glowTex,
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(scale[0], scale[1], 1);
    return sprite;
  };

  // The built room: walls, ceiling, floor and pendant. With a photo plate
  // behind the canvas (the default), it is left out and only the stage,
  // its light ring, the haze and the title glow are drawn over the photo.
  const arch = new THREE.Group();
  if (!plate) group.add(arch);

  /* Back wall: large navy panels with glowing seams ----------------------- */
  const wallZ = T.room.wallZ;
  const panelMat = new THREE.MeshStandardMaterial({ color: "#101b30", roughness: 0.7, metalness: 0.35 });
  const panelAlt = new THREE.MeshStandardMaterial({ color: "#13213a", roughness: 0.6, metalness: 0.4 });
  const panelGeo = new RoundedBoxGeometry(2.36, 2.9, 0.18, 2, 0.04);
  for (let col = -5; col <= 5; col++) {
    for (let row = 0; row < 3; row++) {
      const panel = new THREE.Mesh(panelGeo, (col + row) % 3 === 0 ? panelAlt : panelMat);
      panel.position.set(col * 2.42, 1.48 + row * 2.96, wallZ + ((col * 7 + row * 3) % 4) * 0.02);
      arch.add(panel);
    }
  }
  const stripMat = new THREE.MeshBasicMaterial({ color: C.steel, toneMapped: false });
  const stripGeo = new THREE.BoxGeometry(0.025, 8.6, 0.03);
  const strips: THREE.Mesh[] = [];
  for (const x of [-8.47, -3.63, 3.63, 8.47]) {
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.set(x, 4.3, wallZ + 0.12);
    arch.add(strip);
    strips.push(strip);
    const halo = glowSprite(C.glow, [1.2, 9], 0.1);
    halo.position.set(x, 4.3, wallZ + 0.2);
    arch.add(halo);
  }

  // Long LED strip along the upper wall.
  const led = new THREE.Mesh(
    new THREE.BoxGeometry(27, 0.05, 0.05),
    new THREE.MeshBasicMaterial({ color: C.ice, toneMapped: false }),
  );
  led.position.set(0, 7.3, wallZ + 0.3);
  arch.add(led);
  const ledHalo = glowSprite(C.ice, [30, 1.6], 0.22);
  ledHalo.position.set(0, 7.3, wallZ + 0.35);
  arch.add(ledHalo);

  // Light falloff across the wall: lit where the title and stage sit,
  // sinking into shadow toward the corners and the ceiling.
  const wallShadeTex = canvasTexture(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s * 0.62, s * 0.05, s / 2, s * 0.62, s * 0.62);
    g.addColorStop(0, "rgba(10,14,22,0)");
    g.addColorStop(0.55, "rgba(10,14,22,0.45)");
    g.addColorStop(1, "rgba(10,14,22,0.92)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  textures.push(wallShadeTex);
  const wallShade = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 10),
    new THREE.MeshBasicMaterial({ map: wallShadeTex, transparent: true, depthWrite: false }),
  );
  wallShade.position.set(0, 4.6, wallZ + 0.4);
  arch.add(wallShade);

  // Glow on the wall behind the wordmark. The HTML title sits in front of
  // it; the mirror floor reflects it, which gives the title its reflection.
  const titleGlowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: C.glow,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const titleGlow = new THREE.Sprite(titleGlowMat);
  titleGlow.scale.set(mobile ? 9 : 16, mobile ? 3.2 : 3.6, 1);
  titleGlow.position.set(0, mobile ? 4.4 : 3.3, wallZ + 0.5);
  group.add(titleGlow);

  /* Side walls and ceiling ---------------------------------------------- */
  const concrete = noiseTexture(256, 34);
  concrete.repeat.set(3, 2);
  textures.push(concrete);
  const sideMat = new THREE.MeshStandardMaterial({ color: "#2a2f37", map: concrete, roughness: 0.92, metalness: 0.05 });
  const right = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), sideMat);
  right.rotation.y = -Math.PI / 2;
  right.position.set(13, 5, 2);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshStandardMaterial({ color: "#161b24", roughness: 0.9 }));
  left.rotation.y = Math.PI / 2;
  left.position.set(-13, 5, 2);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(30, 26), new THREE.MeshStandardMaterial({ color: "#10151e", roughness: 1 }));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 9.2, 2);
  arch.add(right, left, ceiling);

  /* Floor: a real mirror on desktop, dimmed into polished charcoal -------- */
  let floor: Reflector | null = null;
  const floorGeo = new THREE.PlaneGeometry(60, 40);
  if (!mobile && !plate) {
    floor = new Reflector(floorGeo, {
      textureWidth: 512,
      textureHeight: 512,
      color: new THREE.Color("#8a96a6"),
      clipBias: 0.003,
    });
    floor.rotation.x = -Math.PI / 2;
    arch.add(floor);
  } else {
    const matte = new THREE.Mesh(
      floorGeo,
      new THREE.MeshStandardMaterial({ color: C.bg, roughness: 0.35, metalness: 0.55 }),
    );
    matte.rotation.x = -Math.PI / 2;
    arch.add(matte);
  }
  // Dimming film over the mirror: clearer under the stage, darker at the edges.
  const floorFade = canvasTexture(256, (ctx, s) => {
    const reflect = HERO_TUNING.room.floorReflection;
    const g = ctx.createRadialGradient(s / 2, s * 0.55, 0, s / 2, s * 0.55, s * 0.55);
    g.addColorStop(0, `rgba(27,31,38,${1 - reflect})`);
    g.addColorStop(1, "rgba(20,23,29,0.97)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  textures.push(floorFade);
  const film = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 40),
    new THREE.MeshBasicMaterial({ map: floorFade, transparent: true, depthWrite: false }),
  );
  film.rotation.x = -Math.PI / 2;
  film.position.y = 0.004;
  film.renderOrder = 1;
  arch.add(film);

  /* Stage: a low glossy ellipse with a glowing ring of light ------------- */
  const stage = mobile ? T.stage.mobile : T.stage.desktop;
  const stageMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1.02, 0.16, 96),
    new THREE.MeshStandardMaterial({ color: "#20252e", roughness: 0.28, metalness: 0.65 }),
  );
  stageMesh.scale.set(stage.radiusX, 1, stage.radiusZ);
  stageMesh.position.set(0, 0.08, stage.centerZ);
  const ringMat = new THREE.MeshBasicMaterial({ color: C.glow, transparent: true, opacity: 0.35, toneMapped: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 8, 200), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.scale.set(stage.radiusX + 0.05, stage.radiusZ + 0.05, 1);
  ring.position.set(0, 0.012, stage.centerZ);
  const ringGlowMat = new THREE.MeshBasicMaterial({
    map: glowTex,
    color: C.glow,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const ringGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ringGlowMat);
  ringGlow.rotation.x = -Math.PI / 2;
  ringGlow.scale.set(stage.radiusX * 2.9, stage.radiusZ * 2.9, 1);
  ringGlow.position.set(0, 0.01, stage.centerZ);
  // Over the photo the pieces stand on its own floor: no stage disc.
  if (!plate) group.add(stageMesh, ring, ringGlow);

  /* Pendant lamp with a blue underglow and a volumetric beam ------------- */
  const lampY = mobile ? 7.6 : 6.4;
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 9.2 - lampY, 6),
    new THREE.MeshBasicMaterial({ color: "#3a404a" }),
  );
  cable.position.set(0, (9.2 + lampY) / 2, stage.centerZ);
  const lamp = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.66, 0.12, 48),
    new THREE.MeshStandardMaterial({ color: "#22272f", roughness: 0.3, metalness: 0.8 }),
  );
  lamp.position.set(0, lampY, stage.centerZ);
  const underglow = new THREE.Mesh(
    new THREE.CircleGeometry(0.58, 48),
    new THREE.MeshBasicMaterial({ color: C.ice, toneMapped: false }),
  );
  underglow.rotation.x = Math.PI / 2;
  underglow.position.set(0, lampY - 0.065, stage.centerZ);
  const lampHalo = glowSprite(C.glow, [3.6, 2.2], 0.55);
  lampHalo.position.set(0, lampY - 0.25, stage.centerZ);
  const beamHeight = lampY - 0.1;
  const beamMat = beamMaterial(T.room.beamOpacity);
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, mobile ? 2.6 : 3.8, beamHeight, 64, 1, true),
    beamMat,
  );
  beam.position.set(0, beamHeight / 2, stage.centerZ);
  arch.add(cable, lamp, underglow, lampHalo, beam);

  /* Haze: drifting soft planes in front of the wall ----------------------- */
  const hazeTex = hazeTexture();
  textures.push(hazeTex);
  const hazeMats: THREE.MeshBasicMaterial[] = [];
  const hazeCount = mobile ? 1 : 3;
  for (let i = 0; i < hazeCount; i++) {
    const material = new THREE.MeshBasicMaterial({
      map: hazeTex.clone(),
      color: C.steel,
      transparent: true,
      opacity: T.room.hazeOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    material.map!.wrapS = material.map!.wrapT = THREE.RepeatWrapping;
    material.map!.needsUpdate = true;
    textures.push(material.map!);
    hazeMats.push(material);
    const haze = new THREE.Mesh(new THREE.PlaneGeometry(30, 9), material);
    haze.position.set(0, 2.5 + i * 1.6, wallZ + 2.5 + i * 2.2);
    group.add(haze);
  }

  setLayers(group, LAYER.MIRROR, LAYER.ROOM);

  return {
    group,
    floor,
    textures,
    update(lock, time) {
      const boost = 1 + lock * T.lights.lockBoost;
      ringMat.opacity = 0.3 + lock * 0.6;
      ringGlowMat.opacity = 0.12 + lock * 0.22;
      beamMat.uniforms.uOpacity.value = T.room.beamOpacity * boost;
      (lampHalo.material as THREE.SpriteMaterial).opacity = 0.45 * boost;
      (ledHalo.material as THREE.SpriteMaterial).opacity = 0.18 * boost;
      titleGlowMat.opacity = 0.1 + lock * 0.32;
      hazeMats.forEach((material, i) => {
        material.map!.offset.set(time * (0.004 + i * 0.002), Math.sin(time * 0.05 + i) * 0.02);
      });
    },
    resize(width, height, dpr) {
      floor?.getRenderTarget().setSize(Math.round(width * dpr * 0.5), Math.round(height * dpr * 0.5));
    },
  };
}
