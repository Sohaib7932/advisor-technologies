import { notFound } from "next/navigation";
import { RenderScene } from "./render-scene";

/**
 * Dev-only: renders one named 3D scene (src/components/three/scenes.ts) to a
 * transparent PNG at 2x. scripts/render-3d.mjs visits this page for every
 * scene and saves WebP files to public/3d/. Run it with `npm run dev` up.
 */
export default async function RenderPage({ searchParams }: { searchParams: Promise<{ scene?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { scene } = await searchParams;
  return <RenderScene name={scene ?? "hero-poster"} />;
}
