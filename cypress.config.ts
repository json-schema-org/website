import { defineConfig } from 'cypress';
import { resolve } from 'node:path';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/components/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      on('task', {
        async blogStaticProps(slug: string) {
          // The preceding article request compiles the real server module.
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { getStaticProps } =
            await require('./.next/server/pages/blog/posts/[slug].js');
          const result = await getStaticProps({ params: { slug } });
          const coverage = (
            globalThis as typeof globalThis & {
              __coverage__?: Record<string, unknown>;
            }
          ).__coverage__;
          const articlePath = resolve('pages/blog/posts/[slug].page.tsx');

          if (!coverage?.[articlePath]) {
            throw new Error('Server article coverage was not collected.');
          }

          return { result, coverage: { [articlePath]: coverage[articlePath] } };
        },
      });
      return config;
    },
  },
});
