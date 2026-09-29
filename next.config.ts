import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // AVIF first (roughly 20-30% smaller than WebP), WebP as the fallback.
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/logos/**",
      },
      {
        pathname: "/clients-logos/**",
      },
    ],
  },
};

export default nextConfig;
