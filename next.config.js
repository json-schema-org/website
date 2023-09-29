/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],

  async redirects() {
    return [
      {
        source: '/draft/2019-09/vocab/core',
        destination: '/draft/2019-09/json-schema-core.html#rfc.section.8',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2019-09/vocab/applicator',
        destination: '/draft/2019-09/json-schema-core.html#rfc.section.9',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2019-09/vocab/content',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.8',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2019-09/vocab/format',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.7',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2019-09/vocab/hyper-schema',
        destination: '/draft/2019-09/json-schema-hypermedia.html',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2019-09/vocab/meta-data',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.9',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2019-09/vocab/validation',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.6',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/core',
        destination: '/draft/2020-12/json-schema-core.html#section-8',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/applicator',
        destination: '/draft/2020-12/json-schema-core.html#section-10',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/content',
        destination: '/draft/2020-12/json-schema-validation.html#section-8',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/format-annotation',
        destination: '/draft/2020-12/json-schema-validation.html#section-7',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/format-assertion',
        destination: '/draft/2020-12/json-schema-validation.html#section-7',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/meta-data',
        destination: '/draft/2020-12/json-schema-validation.html#section-9',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      {
        source: '/draft/2020-12/vocab/validation',
        destination: '/draft/2020-12/json-schema-validation.html#section-6',
        permanent: true, // Set to true for a permanent (301) redirect
      },
      // Add more redirects as needed
    ];
  },
};

module.exports = nextConfig;