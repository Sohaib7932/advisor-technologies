"use client";

import { useEffect, useState } from "react";

export function RenderScene({ name }: { name: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      const { createMaterials } = await import("@/components/three/materials");
      const { createShared } = await import("@/components/three/pieces");
      const { createEnvironment, createLights, createRenderer, frameObject } = await import("@/components/three/stage");
      const { buildNamedScene, SCENES, HERO_TUNING } = await import("@/components/three/scenes");
      const spec = SCENES[name];
      if (!spec) throw new Error(`Unknown scene ${name}`);

      const canvas = document.createElement("canvas");
      const renderer = createRenderer(canvas, { preserve: true });
      renderer.setPixelRatio(1);
      renderer.setSize(spec.width * 2, spec.height * 2, false);
      renderer.toneMappingExposure = HERO_TUNING.lights.exposure;
      const scene = new THREE.Scene();
      createEnvironment(renderer, scene, HERO_TUNING.lights.environment);
      createLights(scene, HERO_TUNING.lights);
      const object = buildNamedScene(name, createMaterials("high"), createShared());
      scene.add(object);

      const camera = new THREE.PerspectiveCamera(HERO_TUNING.camera.fov, spec.width / spec.height, 0.1, 200);
      if (spec.camera === "hero") {
        camera.position.set(...HERO_TUNING.camera.desktop.position);
        camera.lookAt(new THREE.Vector3(...HERO_TUNING.camera.desktop.target));
      } else {
        frameObject(camera, object, spec.camera);
      }
      // Transmission needs a warm-up frame before it samples the scene.
      for (let i = 0; i < 3; i++) renderer.render(scene, camera);
      if (!cancelled) setSrc(canvas.toDataURL("image/png"));
      renderer.dispose();
    })().catch((e) => setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, [name]);

  return (
    <div className="grid min-h-svh place-items-center bg-[repeating-conic-gradient(#e3e9f0_0_25%,#fff_0_50%)] bg-size-[24px_24px] p-8">
      {error && <p id="render-error">{error}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img id="render-output" src={src} alt={name} className="max-h-[80svh] max-w-full" />}
    </div>
  );
}
