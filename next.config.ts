import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/proptech-lab",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
