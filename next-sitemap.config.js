/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://json-schema.org/',
    generateRobotsTxt: true, // (optional),
    outDir: 'out',
    // ...other options
  }
