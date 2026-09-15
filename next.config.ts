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
    ],
  },
};

export default nextConfig;
