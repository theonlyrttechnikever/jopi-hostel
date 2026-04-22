import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
