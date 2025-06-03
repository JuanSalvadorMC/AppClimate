/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/AppClimate',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig 