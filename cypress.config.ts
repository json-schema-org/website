import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/components/**/*.cy.{js,jsx,ts,tsx}',
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
