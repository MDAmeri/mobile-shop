import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /////////////////////////
  // config options here //
  /////////////////////////
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  /////////////////////////////////////////////////////////////////////////////
  // Configure allowed external image domains for Next.js Image Optimization //
  /////////////////////////////////////////////////////////////////////////////
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
