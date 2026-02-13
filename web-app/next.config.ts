import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'label-reeha-shop-images.s3.eu-north-1.amazonaws.com',
      },
      {
          protocol: 'https',
          hostname: 'placehold.co'
      }
    ],
  },
};

export default nextConfig;
