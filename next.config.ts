import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [],
    unoptimized: false,
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
