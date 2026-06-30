import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    proxyClientMaxBodySize: '50mb',
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
          protocol: 'https',
          hostname: 'placehold.co'
      },
      {
          protocol: 'https',
          hostname: 'ykuynhasvslylybksdnp.supabase.co'
      }
    ],
  },
};

export default nextConfig;
