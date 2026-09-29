import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
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
