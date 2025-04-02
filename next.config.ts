import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "publicdomainarchive.com",
        port: "",
        pathname: "/**",
      },
      // Add other domains if needed
    ],
  },
};

export default nextConfig;
