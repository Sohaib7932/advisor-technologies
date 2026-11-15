/**
 * The six products, built procedurally from bevelled parts so they read as
 * polished product renders. Every builder returns a group whose direct
 * children are the named parts (`<name>-part-<n>`), which lets the hero
 * start them exploded and assemble them. Models stand on y = 0, centred on
 * x/z, about 1-2 units tall.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Materials } from "./materials";

export type ProductName = "rack" | "cctv" | "laptop" | "printer" | "chair" | "gear";
export const PRODUCT_NAMES: ProductName[] = ["rack", "cctv", "laptop", "printer", "chair", "gear"];

type V3 = [number, number, number];

const rbox = (w: number, h: number, d: number, r = 0.04) => new RoundedBoxGeometry(w, h, d, 3, r);

function part(geometry: THREE.BufferGeometry, material: THREE.Material, [x, y, z]: V3 = [0, 0, 0], [rx, ry, rz]: V3 = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  return mesh;
}

/** A sub-assembly that moves as one part. */
function assembly(children: THREE.Object3D[], [x, y, z]: V3 = [0, 0, 0], [rx, ry, rz]: V3 = [0, 0, 0]) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.set(rx, ry, rz);
  children.forEach((c) => g.add(c));
  return g;
}

function serverRack(m: Materials) {
  const parts: THREE.Object3D[] = [part(rbox(1, 2, 0.9, 0.08), m.ceramic, [0, 1, 0])];
  // Chrome door handle
  parts.push(part(rbox(0.03, 0.5, 0.04, 0.015), m.chrome, [0.44, 1.05, 0.47]));
  for (let i = 0; i < 6; i++) {
    const y = 0.3 + i * 0.28;
    parts.push(
      assembly(
        [
          part(rbox(0.82, 0.22, 0.06, 0.03), m.navy),
          part(new THREE.BoxGeometry(0.05, 0.05, 0.02), m.led, [0.31, 0.02, 0.035]),
          part(new THREE.BoxGeometry(0.05, 0.05, 0.02), i % 2 ? m.led : m.ledSoft, [0.23, 0.02, 0.035]),
          part(new THREE.BoxGeometry(0.4, 0.02, 0.02), m.chrome, [-0.14, -0.04, 0.035]),
        ],
        [0, y, 0.42],
      ),
    );
  }
  parts.push(part(rbox(1.04, 0.08, 0.94, 0.03), m.navy, [0, 0.04, 0]));
  parts.push(part(rbox(1.04, 0.06, 0.94, 0.03), m.navy, [0, 2.0, 0]));
  return parts;
}

function cctvCamera(m: Materials) {
  // Standing mount: base plate, pole, ball joint, then the housing.
  const head = assembly(
    [
      part(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 40), m.ceramic, [0, 0, 0], [Math.PI / 2, 0, 0]),
      part(new THREE.CylinderGeometry(0.28, 0.28, 0.72, 40, 1, true, 0, Math.PI), m.navy, [0, 0.03, -0.06], [Math.PI / 2, 0, Math.PI]),
      part(new THREE.CylinderGeometry(0.19, 0.2, 0.08, 40), m.chrome, [0, 0, 0.47], [Math.PI / 2, 0, 0]),
      part(new THREE.CircleGeometry(0.13, 40), m.ledSoft, [0, 0, 0.515]),
      part(new THREE.SphereGeometry(0.03, 12, 10), m.led, [0.15, 0.16, 0.36]),
    ],
    [0, 0.92, 0.05],
    [0.22, 0, 0],
  );
  return [
    part(rbox(0.5, 0.06, 0.5, 0.025), m.chrome, [0, 0.03, 0]),
    part(new THREE.CylinderGeometry(0.045, 0.06, 0.6, 20), m.chrome, [0, 0.36, 0]),
    part(new THREE.SphereGeometry(0.1, 24, 16), m.steel, [0, 0.68, 0]),
    head,
  ];
}

function laptop(m: Materials) {
  const lid = assembly(
    [
      part(rbox(1.6, 1.04, 0.05, 0.035), m.ceramic, [0, 0.52, 0]),
      part(new THREE.PlaneGeometry(1.46, 0.9), m.laptopScreen, [0, 0.52, 0.027]),
    ],
    [0, 0.06, -0.5],
    [-0.28, 0, 0],
  );
  return [
    part(rbox(1.6, 0.07, 1.06, 0.035), m.ceramic, [0, 0.035, 0]),
    part(rbox(1.34, 0.012, 0.46, 0.006), m.navy, [0, 0.075, -0.06]),
    part(rbox(0.46, 0.01, 0.26, 0.006), m.brand, [0, 0.075, 0.33]),
    lid,
  ];
}

function printer(m: Materials) {
  return [
    part(rbox(1.3, 0.72, 1, 0.08), m.ceramic, [0, 0.36, 0]),
    part(rbox(1.34, 0.12, 1.04, 0.05), m.navy, [0, 0.78, 0]),
    part(rbox(1.06, 0.02, 0.72, 0.01), m.glass, [0, 0.85, 0]),
    part(rbox(0.92, 0.05, 0.14, 0.02), m.navy, [0, 0.42, 0.5]),
    part(new THREE.BoxGeometry(0.72, 0.012, 0.52), m.paper, [0, 0.4, 0.64], [0.1, 0, 0]),
    assembly(
      [
        part(rbox(0.38, 0.06, 0.22, 0.02), m.navy),
        part(new THREE.PlaneGeometry(0.28, 0.14), m.printerScreen, [0, 0.032, 0], [-Math.PI / 2, 0, 0]),
      ],
      [0.42, 0.86, 0.36],
      [-0.35, 0, 0],
    ),
  ];
}

function officeChair(m: Materials) {
  const parts: THREE.Object3D[] = [
    part(rbox(0.92, 0.16, 0.86, 0.07), m.steel, [0, 0.66, 0]),
    part(rbox(0.86, 0.98, 0.13, 0.07), m.steel, [0, 1.28, -0.42], [-0.12, 0, 0]),
    part(rbox(0.1, 0.5, 0.06, 0.02), m.chrome, [0, 0.9, -0.46]),
    part(new THREE.CylinderGeometry(0.05, 0.05, 0.46, 20), m.chrome, [0, 0.38, 0]),
  ];
  for (const side of [-1, 1]) {
    parts.push(
      assembly(
        [
          part(new THREE.BoxGeometry(0.05, 0.28, 0.05), m.chrome, [0, 0, 0]),
          part(rbox(0.1, 0.05, 0.44, 0.02), m.ceramic, [0, 0.15, 0.02]),
        ],
        [side * 0.43, 0.86, 0],
      ),
    );
  }
  const legs = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    legs.add(part(rbox(0.5, 0.05, 0.08, 0.02), m.chrome, [Math.cos(a) * 0.25, 0.12, Math.sin(a) * 0.25], [0, -a, 0]));
    legs.add(part(new THREE.SphereGeometry(0.06, 14, 10), m.ceramic, [Math.cos(a) * 0.48, 0.06, Math.sin(a) * 0.48]));
  }
  parts.push(legs);
  return parts;
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
  hole.absarc(0, 0, 0.32, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.26,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 4,
    curveSegments: 16,
  });
  geometry.center();
  return [
    part(geometry, m.steel, [0, 0.98, 0]),
    part(new THREE.TorusGeometry(0.4, 0.035, 14, 64), m.led, [0, 0.98, 0.2]),
    part(new THREE.CylinderGeometry(0.2, 0.2, 0.44, 32), m.chrome, [0, 0.98, 0], [Math.PI / 2, 0, 0]),
    part(rbox(0.7, 0.08, 0.4, 0.03), m.navy, [0, 0.04, 0]),
  ];
}

const BUILDERS: Record<ProductName, (m: Materials) => THREE.Object3D[]> = {
  rack: serverRack,
  cctv: cctvCamera,
  laptop,
  printer,
  chair: officeChair,
  gear,
};

/** A product as a group of named parts, standing on y = 0. */
export function buildProduct(name: ProductName, m: Materials) {
  const group = new THREE.Group();
  group.name = name;
  BUILDERS[name](m).forEach((p, i) => {
    p.name = `${name}-part-${i}`;
    group.add(p);
  });
  const box = new THREE.Box3().setFromObject(group);
  group.children.forEach((c) => (c.position.y -= box.min.y));
  return group;
}
