import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
