import React from 'react';
import ScrollButton from '~/components/ScrollButton';

describe('ScrollButton Component', () => {
  // Should render and function correctly
  it('should render and function correctly', () => {
    // Mount the ScrollButton component
    cy.mount(
      <div style={{ height: '1000px' }}>
        <ScrollButton />
      </div>,
    );

    // Initially, the button should not exist
    cy.get('[data-test="scroll-button"]').should('not.exist');

    // when window scrollY is >150 the button should exist
    cy.window().scrollTo(0, 151);

    // Check if the button is exist
    cy.get('[data-test="scroll-button"]').should('exist');

    // Click the button
    cy.get('[data-test="scroll-button"]').click();

    // Check if the window scroll to top
    cy.window().its('scrollY').should('eq', 1);

    // check again if the button is not exist
    cy.get('[data-test="scroll-button"]').should('not.exist');

    // when window scrollY is <150 the button should not exist
    cy.window().scrollTo(0, 149);
    cy.get('[data-test="scroll-button"]').should('not.exist');
  });
});
