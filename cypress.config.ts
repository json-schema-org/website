import { defineConfig } from 'cypress';
import { blogMetadataTasks } from './cypress/plugins/blogMetadataTasks';

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
      on('task', blogMetadataTasks);
      return config;
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      on('task', blogMetadataTasks);
      return config;
    },
  },
});
