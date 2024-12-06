/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/igdb/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
    ],
  },
  env: {
    RAWG_API_KEY: process.env.RAWG_API_KEY,
    NEXT_PUBLIC_RAWG_API_URL: process.env.NEXT_PUBLIC_RAWG_API_URL,
  },
}

module.exports = nextConfig
