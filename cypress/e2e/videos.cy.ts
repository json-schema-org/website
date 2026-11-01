/* eslint-disable linebreak-style */
describe('Community Videos Page E2E', () => {
  it('renders the videos page with title, description, and empty state', () => {
    cy.visit('http://localhost:3000/learn/videos');

    // Title and introduction
    cy.get('h1').should('have.text', 'JSON Schema videos');
    cy.contains('Explore educational videos').should('be.visible');

    // Contribution notice banner
    cy.contains('Have an educational video to share?').should('be.visible');
    cy.get('a[href*="CONTRIBUTING.md"]').should('exist');
    cy.get('a[href*="issues/2623"]').should('exist');

    // Empty state container
    cy.get('[data-testid="videos-empty-state"]').should('be.visible');
    cy.contains('No community videos yet').should('be.visible');
  });

  it('navigates to the videos page from the learn landing page card', () => {
    cy.visit('http://localhost:3000/learn');

    // Check that the videos card exists and navigates to /learn/videos
    cy.contains('JSON Schema videos').click();
    cy.url().should('include', '/learn/videos');
    cy.get('h1').should('have.text', 'JSON Schema videos');
  });
});
