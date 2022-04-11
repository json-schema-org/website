/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [ 'page.tsx' ],
  redirects: async () => {
    return [
      {
        source: '/understanding-json-schema',
        destination: '/docs',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
