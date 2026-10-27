import { notFound } from "next/navigation";
import { CaptureProducts } from "./capture-products";

/**
 * Dev-only: renders each hero product to a transparent PNG for the card
 * illustrations. Run `node scripts/capture-illustrations.cjs` with the dev
 * server up; it saves the renders to public/images/illustrations/.
 */
export default function CapturePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CaptureProducts />;
}
