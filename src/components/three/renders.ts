/**
 * Pixel sizes (2x) of the renders in public/3d/, produced by
 * scripts/render-3d.mjs. Update after re-rendering if framing changes.
 */
export const RENDERS = {
  "hero-poster": [1920, 1760],
  chart: [849, 600],
  cta: [738, 694],
  "banner-about": [792, 660],
  "banner-services": [791, 579],
  "banner-products": [776, 682],
  "banner-clients": [787, 637],
  "banner-contact": [784, 668],
  "banner-404": [770, 670],
  "product-rack": [658, 794],
  "product-cctv": [700, 704],
  "product-laptop": [780, 477],
  "product-printer": [779, 448],
  "product-chair": [671, 772],
  "product-gear": [718, 643],
  "tile-shield": [450, 491],
  "tile-gear": [450, 491],
  "tile-network": [450, 491],
  "tile-camera": [450, 491],
  "tile-printer": [450, 491],
  "tile-laptop": [450, 491],
  "tile-chart": [450, 491],
  "tile-wrench": [450, 491],
} as const satisfies Record<string, readonly [number, number]>;

export type RenderName = keyof typeof RENDERS;
