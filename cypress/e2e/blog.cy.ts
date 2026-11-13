const BASE_URL = Cypress.config('baseUrl') ?? 'http://localhost:3000';

describe('Blog page pagination scroll (#2581)', () => {
  before(() => {
    // there is no backend /__coverage__ endpoint; probe the warm page instead
    // so the code-coverage after-hook gets a response and skips gracefully
    Cypress.env('codeCoverage', { url: '/blog' });
  });

  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('stays at the top on initial load', () => {
    cy.visit(`${BASE_URL}/blog`);
    // the regression auto-scrolled ~2s after load via a mount effect
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- waiting is the point: the regression only manifests ~2s after load
    cy.wait(3000);
    cy.window().its('scrollY').should('eq', 0);
  });

  it('scrolls to the posts list when clicking Next', () => {
    cy.visit(`${BASE_URL}/blog`);
    cy.contains('button', 'Next').click();
    cy.contains('span', /Page 2 of \d+/);
    cy.window().its('scrollY').should('be.greaterThan', 0);
  });
});
