/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  pageExtensions: ['page.tsx'],
  async redirects() {
    return [
      {
        source: '/draft/2019-09/vocab/core',
        destination: '/draft/2019-09/json-schema-core.html#rfc.section.8',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/applicator',
        destination: '/draft/2019-09/json-schema-core.html#rfc.section.9',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/content',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.8',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/format',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.7',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/core',
        destination: '/draft/2019-09/json-schema-core.html#rfc.section.8',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/applicator',
        destination: '/draft/2019-09/json-schema-core.html#rfc.section.9',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/content',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.8',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/format',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.7',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/hyper-schema',
        destination: '/draft/2019-09/json-schema-hypermedia.html',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/meta-data',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.9',
        statusCode: 301
      },
      {
        source: '/draft/2019-09/vocab/validation',
        destination: '/draft/2019-09/json-schema-validation.html#rfc.section.6',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/core',
        destination: '/draft/2020-12/json-schema-core.html#rfc.section-8',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/applicator',
        destination: '/draft/2020-12/json-schema-core.html#section-10',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/content',
        destination: '/draft/2020-12/json-schema-validation.html#section-8',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/format-annotation',
        destination: '/draft/2020-12/json-schema-validation.html#section-8',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/format-assertion',
        destination: '/draft/2020-12/json-schema-validation.html#section-7',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/meta-data',
        destination: '/draft/2020-12/json-schema-validation.html#section-9',
        statusCode: 301
      },
      {
        source: '/draft/2020-12/vocab/validation',
        destination: '/draft/2020-12/json-schema-validation.html#section-6',
        statusCode: 301
      },
      {
        source: '/links',
        destination: '/specification-links',
        statusCode: 301
      },
      {
        source: '/schema',
        destination: '/draft/2020-12/schema',
        statusCode: 301
      },
      {
        source: '/understanding-json-schema/UnderstandingJSONSchema.pdf',
        destination: '/UnderstandingJSONSchema.pdf',
        statusCode: 301
      },
      {
        source: '/latest/json-schema-core',
        destination: '/draft/2020-12/json-schema-core',
        statusCode: 301
      },
      {
        source: '/latest/json-schema-validation',
        destination: '/draft/2020-12/json-schema-validation',
        statusCode: 301
      },
      {
        source: '/latest/relative-json-pointer',
        destination: '/draft/2020-12/relative-json-pointer.html',
        statusCode: 301
      },
      {
        source: '/slack-redirect',
        destination: 'https://join.slack.com/t/json-schema/shared_invite/zt-2d3itejo7-~oj1PqGs24dLohkeaFBVYw',
        statusCode: 301
      }
    ];
},
};

module.exports = nextConfig;