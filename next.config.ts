import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // -- i had sharp issues on ubuntu
  },
};

export default nextConfig;
