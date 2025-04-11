import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "widgets.astronomyapi.com",
      },
      {
        hostname: "via.placeholder.com",
      },
      {
        hostname: 'picsum.photos'
      }
    ],
  },
};

export default nextConfig;
