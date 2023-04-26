/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  async redirects () {
    return [{
      source: '/slack',
      destination: 'https://json-schema.slack.com/join/shared_invite/zt-1tc77c02b-z~UiKXqpM2gHchClKbUoXw#/shared-invite/email',
      permanent: true
    }]
  }
}

module.exports = nextConfig
