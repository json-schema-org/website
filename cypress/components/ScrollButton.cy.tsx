/* eslint-disable cypress/no-unnecessary-waiting */
import React from 'react';
import ScrollButton from '~/components/ScrollButton';

const LONG_PAGE_HEIGHT = 4000;
const MAX_SCROLL_Y = LONG_PAGE_HEIGHT - 720;

describe('ScrollButton Component', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    // Mount the ScrollButton component with a tall (long page) container
    cy.mount(
      <div style={{ height: `${LONG_PAGE_HEIGHT}px` }}>
        <ScrollButton />
      </div>,
    );
  });

  it('should show a scroll-to-bottom arrow at the top of long pages', () => {
    // At the very top the down arrow should be available
    cy.window().scrollTo(0, 0);
    cy.wait(100);

    cy.get('[data-test="scroll-button"]')
      .should('exist')
      .and('have.attr', 'aria-label', 'Scroll to bottom');

    // Clicking it smooth-scrolls to the bottom of the page
    cy.get('[data-test="scroll-button"]').click();
    cy.wait(1000);

    cy.window().its('scrollY').should('be.closeTo', MAX_SCROLL_Y, 20);

    // Near the bottom the button now lets you scroll back to top
    cy.get('[data-test="scroll-button"]').should(
      'have.attr',
      'aria-label',
      'Scroll to top',
    );
  });

  it('should switch to scroll-to-top and hide in the scroll gap', () => {
    // Scroll past the threshold to trigger the scroll-to-top button
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    cy.get('[data-test="scroll-button"]')
      .should('exist')
      .and('have.attr', 'aria-label', 'Scroll to top');

    // Click the button and wait for the smooth scroll to complete
    cy.get('[data-test="scroll-button"]').click();
    cy.wait(1000);

    cy.window().its('scrollY').should('be.closeTo', 0, 1);

    // Between the down-arrow zone and the up-arrow threshold no button shows
    cy.window().scrollTo(0, 149);
    cy.wait(100);
    cy.get('[data-test="scroll-button"]').should('not.exist');

    cy.window().scrollTo(0, 100);
    cy.wait(100);
    cy.get('[data-test="scroll-button"]').should('not.exist');
  });

  it('should not appear on short pages', () => {
    // Remount inside a short container (below the long-page threshold)
    cy.mount(
      <div style={{ height: '1000px' }}>
        <ScrollButton />
      </div>,
    );

    cy.window().scrollTo(0, 200);
    cy.wait(100);
    cy.get('[data-test="scroll-button"]').should('not.exist');

    cy.window().scrollTo('bottom');
    cy.wait(100);
    cy.get('[data-test="scroll-button"]').should('not.exist');
  });

  it('should have circular design', () => {
    // Scroll to trigger button appearance
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    // Check if button exists
    cy.get('[data-test="scroll-button"]').should('exist');

    // Verify circular design - should have rounded-full class
    cy.get('[data-test="scroll-button"]').should('have.class', 'rounded-full');

    // Verify the container has equal height and width (12x12)
    cy.get('[data-test="scroll-button"]').parent().should('have.class', 'h-12');
    cy.get('[data-test="scroll-button"]').parent().should('have.class', 'w-12');
  });

  it('should have proper accessibility attributes', () => {
    // Scroll to trigger button appearance
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    // Check if button has proper aria-label
    cy.get('[data-test="scroll-button"]').should(
      'have.attr',
      'aria-label',
      'Scroll to top',
    );

    // Check if button is accessible via keyboard (tabindex or role)
    cy.get('[data-test="scroll-button"]').should('be.visible');
    cy.get('[data-test="scroll-button"]').should('not.be.disabled');
  });

  it('should have smooth transitions and hover effects', () => {
    // Scroll to trigger button appearance
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    // Check for transition classes
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'transition-all',
    );
    cy.get('[data-test="scroll-button"]').should('have.class', 'duration-200');
    cy.get('[data-test="scroll-button"]').should('have.class', 'ease-in-out');

    // Check for hover effect class
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'hover:-translate-y-1',
    );
  });

  it('should support dark mode styling', () => {
    // Scroll to trigger button appearance
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    // Check for dark mode classes
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'dark:bg-gray-800',
    );
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'dark:border-gray-600',
    );
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'dark:hover:bg-gray-700',
    );

    // Check for light mode classes
    cy.get('[data-test="scroll-button"]').should('have.class', 'bg-white');
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'border-gray-200',
    );
    cy.get('[data-test="scroll-button"]').should(
      'have.class',
      'hover:bg-gray-50',
    );
  });

  it('should have proper icon styling', () => {
    // Scroll to trigger button appearance
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    // Check if arrow icon exists and has proper classes
    cy.get('[data-test="scroll-button"] svg').should('exist');
    cy.get('[data-test="scroll-button"] svg').should('have.class', 'h-6');
    cy.get('[data-test="scroll-button"] svg').should('have.class', 'w-6');
    cy.get('[data-test="scroll-button"] svg').should(
      'have.class',
      'text-gray-700',
    );
    cy.get('[data-test="scroll-button"] svg').should(
      'have.class',
      'dark:text-gray-300',
    );
  });

  it('should be positioned correctly', () => {
    // Scroll to trigger button appearance
    cy.window().scrollTo(0, 200);
    cy.wait(100);

    // Check positioning classes
    cy.get('[data-test="scroll-button"]')
      .parent()
      .should('have.class', 'fixed');
    cy.get('[data-test="scroll-button"]')
      .parent()
      .should('have.class', 'bottom-14');
    cy.get('[data-test="scroll-button"]')
      .parent()
      .should('have.class', 'right-4');
    cy.get('[data-test="scroll-button"]').parent().should('have.class', 'z-40');
  });
});
