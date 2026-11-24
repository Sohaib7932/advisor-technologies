import type { NextConfig } from "next";

/** Long-lived caching for files whose content never changes at a URL. */
const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
/** Public assets keep their filenames across deploys, so revalidate weekly. */
const longLived = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Only the GSAP and three modules actually imported end up in bundles.
    optimizePackageImports: ["gsap", "three"],
  },
  images: {
    // AVIF first (roughly 20-30% smaller than WebP), WebP as the fallback.
    formats: ["image/avif", "image/webp"],
    qualities: [72],
    minimumCacheTTL: 2678400, // 31 days for optimized images
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/logos/**" },
      { pathname: "/clients-logos/**" },
      // Offline 3D renders (scripts/render-3d.mjs)
      { pathname: "/3d/**" },
    ],
  },
  async headers() {
    return [
      { source: "/_next/static/:path*", headers: immutable },
      { source: "/3d/:path*", headers: longLived },
      { source: "/images/:path*", headers: longLived },
      { source: "/logos/:path*", headers: longLived },
      { source: "/clients-logos/:path*", headers: longLived },
    ];
  },
};

export default nextConfig;
