/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/app-clima',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig 