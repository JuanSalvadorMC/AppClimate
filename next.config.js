/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/app-clima' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/app-clima/' : '',
}

module.exports = nextConfig 