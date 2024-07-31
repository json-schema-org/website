module.exports = {
  all: true,
  include: ['pages/**/*.tsx', 'components/**/*.tsx'],
  exclude: [
    'cypress/**/*.{js,ts,jsx,tsx}',
    '**/*.d.ts',
    '**/*.cy.{js,ts,jsx,tsx}',
  ],
  reporter: ['text', 'json', 'html'],
  'report-dir': './coverage',
};
