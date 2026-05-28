import React from 'react';
import AnnouncementBanner from './AnnouncementBanner';

describe('AnnouncementBanner', () => {
  beforeEach(() => {
    cy.mount(<AnnouncementBanner />);
  });

  describe('Initial render', () => {
    it('renders the banner on page load', () => {
      cy.get('[data-testid="announcement-banner"]', { timeout: 1000 })
        .should('exist')
        .and('be.visible');
    });

    it('starts invisible then fades in', () => {
      // Re-mount to capture the initial opacity-0 state before the 100ms timeout
      cy.mount(<AnnouncementBanner />);

      // Immediately after mount the banner should be in the DOM but opacity-0
      cy.get('[data-testid="announcement-banner"]')
        .should('exist')
        .and('have.class', 'opacity-0');

      // After the 100ms delay it becomes visible
      cy.get('[data-testid="announcement-banner"]', { timeout: 1000 }).should(
        'have.class',
        'opacity-100',
      );
    });

    it('displays the announcement text', () => {
      cy.contains('The JSON Schema Office Hours Now Runs Weekly!').should(
        'be.visible',
      );
    });

    it('renders a "Join Us!" link with the correct href', () => {
      cy.get('a')
        .contains('Join Us!')
        .should('be.visible')
        .and(
          'have.attr',
          'href',
          'https://github.com/orgs/json-schema-org/discussions/34'
        );
    });

    it('renders the dismiss button', () => {
      cy.get('button[aria-label="Dismiss banner"]').should('be.visible');
    });
  });

  describe('Text slide-in animation', () => {
    it('text starts off-screen then slides into view', () => {
      cy.mount(<AnnouncementBanner />);

      // Before 400ms the text span should be translated left and invisible
      cy.get('[data-testid="announcement-text"]')
        .should('have.class', '-translate-x-8')
        .and('have.class', 'opacity-0');

      // After 400ms it should be in its natural position
      cy.get('[data-testid="announcement-text"]', { timeout: 1000 })
        .should('have.class', 'translate-x-0')
        .and('have.class', 'opacity-100');
    });
  });

  describe('Dismiss behaviour', () => {
    it('hides the banner when the dismiss button is clicked', () => {
      // Wait for banner to be fully visible first
      cy.get('[data-testid="announcement-banner"]', { timeout: 1000 }).should(
        'have.class',
        'opacity-100'
      );

      cy.get('button[aria-label="Dismiss banner"]').click();

      // Banner fades out (opacity-0) before being removed
      cy.get('[data-testid="announcement-banner"]').should(
        'have.class',
        'opacity-0'
      );

      // After the 500ms transition the component is removed from the DOM
      cy.get('[data-testid="announcement-banner"]', { timeout: 1000 }).should(
        'not.exist'
      );
    });

    it('does not re-appear after being dismissed', () => {
      cy.get('[data-testid="announcement-banner"]', { timeout: 1000 }).should(
        'have.class',
        'opacity-100'
      );

      cy.get('button[aria-label="Dismiss banner"]').click();

      cy.get('[data-testid="announcement-banner"]', { timeout: 1000 }).should(
        'not.exist',
      );

      // Wait an extra moment to confirm it stays gone
      cy.wait(600);
      cy.get('[data-testid="announcement-banner"]').should('not.exist');
    });
  });

  describe('Accessibility', () => {
    it('dismiss button has an accessible aria-label', () => {
      cy.get('button[aria-label="Dismiss banner"]').should('exist');
    });
  });

  describe('onHeightChange callback', () => {
    it('calls onHeightChange when the banner mounts', () => {
      const onHeightChange = cy.stub().as('onHeightChange');
      cy.mount(<AnnouncementBanner onHeightChange={onHeightChange} />);

      // The callback should be invoked at least once on mount
      cy.get('@onHeightChange').should('have.been.called');
    });

    it('calls onHeightChange with a numeric height value', () => {
      const onHeightChange = cy.stub().as('onHeightChange');
      cy.mount(<AnnouncementBanner onHeightChange={onHeightChange} />);

      cy.get('@onHeightChange').should('have.been.calledWithMatch',
        Cypress.sinon.match.number);
    });
  });
});