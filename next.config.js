/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [ 'page.tsx' ],
  async redirects () {
    return [{
      source: '/slack',
      destination: 'https://json-schema.slack.com/join/shared_invite/zt-15ylccbuu-3T2bRia8uzhE157TSW6nXg#/shared-invite/email',
      permanent: true
    }]
  }
}

module.exports = nextConfig
