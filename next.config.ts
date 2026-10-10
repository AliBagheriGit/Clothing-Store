import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "Clothing-Store.github.io";
const basePath = process.env.BASE_PATH ?? (isProd ? `/${repoName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  trailingSlash: true,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
    ],
  },
};

export default nextConfig;
