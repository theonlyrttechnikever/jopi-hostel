import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn6.agoda.net',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
