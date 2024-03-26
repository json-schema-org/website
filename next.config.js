/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  pageExtensions: ['page.tsx'],
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
