/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import NavigationButtons from '../../components/NavigationButtons';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

interface NavigationButtonsProps {
  prevLabel?: string;
  prevURL?: string;
  nextLabel?: string;
  nextURL?: string;
}

const defaultProps: NavigationButtonsProps = {
  prevLabel: 'Previous Page',
  prevURL: '/previous',
  nextLabel: 'Next Page',
  nextURL: '/next',
};

describe('NavigationButtons Component', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = mockNextRouter();
  });

  it('should render both navigation buttons correctly', () => {
    cy.mount(<NavigationButtons {...defaultProps} />);

    // Check if both buttons are rendered
    cy.get('[data-test="nav-button-prev"]').should('exist');
    cy.get('[data-test="nav-button-next"]').should('exist');

    // Check previous button content
    cy.get('[data-test="nav-button-prev"]').within(() => {
      cy.get('[data-test="nav-button-text"]').should('have.text', 'Go Back');
      cy.get('[data-test="nav-button-label"]').should(
        'have.text',
        defaultProps.prevLabel,
      );
      cy.get('[data-test="nav-button-icon"]').should('exist');
    });

    // Check next button content
    cy.get('[data-test="nav-button-next"]').within(() => {
      cy.get('[data-test="nav-button-text"]').should('have.text', 'Up Next');
      cy.get('[data-test="nav-button-label"]').should(
        'have.text',
        defaultProps.nextLabel,
      );
      cy.get('[data-test="nav-button-icon"]').should('exist');
    });
  });

  it('should render only previous button when next props are missing', () => {
    const propsWithOnlyPrev: NavigationButtonsProps = {
      prevLabel: 'Previous Page',
      prevURL: '/previous',
    };

    cy.mount(<NavigationButtons {...propsWithOnlyPrev} />);

    // Previous button should exist and be functional
    cy.get('[data-test="nav-button-prev"]').should('exist');
    cy.get('[data-test="nav-button-prev"]').within(() => {
      cy.get('[data-test="nav-button-text"]').should('have.text', 'Go Back');
      cy.get('[data-test="nav-button-label"]').should(
        'have.text',
        propsWithOnlyPrev.prevLabel,
      );
    });

    // Next button should be a placeholder div
    cy.get('[data-test="nav-button-next"]').should('not.exist');
    cy.get('[class*="w-full"]').should('have.length', 2);
  });

  it('should render only next button when prev props are missing', () => {
    const propsWithOnlyNext: NavigationButtonsProps = {
      nextLabel: 'Next Page',
      nextURL: '/next',
    };

    cy.mount(<NavigationButtons {...propsWithOnlyNext} />);

    // Next button should exist and be functional
    cy.get('[data-test="nav-button-next"]').should('exist');
    cy.get('[data-test="nav-button-next"]').within(() => {
      cy.get('[data-test="nav-button-text"]').should('have.text', 'Up Next');
      cy.get('[data-test="nav-button-label"]').should(
        'have.text',
        propsWithOnlyNext.nextLabel,
      );
    });

    // Previous button should be a placeholder div
    cy.get('[data-test="nav-button-prev"]').should('not.exist');
    cy.get('[class*="w-full"]').should('have.length', 2);
  });

  it('should render placeholder divs when no props are provided', () => {
    cy.mount(<NavigationButtons />);

    // No navigation buttons should be rendered
    cy.get('[data-test="nav-button-prev"]').should('not.exist');
    cy.get('[data-test="nav-button-next"]').should('not.exist');

    // Should have two placeholder divs
    cy.get('[class*="w-full"]').should('have.length', 2);
  });

  it('should apply correct styling classes', () => {
    cy.mount(<NavigationButtons {...defaultProps} />);

    // Check container styling
    cy.get('.mb-4.grid.grid-cols-1.md\\:grid-cols-2.gap-4').should('exist');

    // Check card styling
    cy.get(
      '.h-full.cursor-pointer.border-gray-200.p-4.text-center.shadow-md',
    ).should('exist');

    // Check button styling
    cy.get('.w-full.gap-5.p-0.text-\\[18px\\].hover\\:bg-transparent').should(
      'exist',
    );

    // Check text styling
    cy.get('.font-bold.uppercase.text-primary').should('exist');
    cy.get('.text-base.font-medium.text-slate-600').should('exist');
  });

  it('should handle hover effects correctly', () => {
    cy.mount(<NavigationButtons {...defaultProps} />);

    // Check hover classes are applied
    cy.get('.hover\\:border-gray-300.hover\\:shadow-lg').should('exist');
    cy.get(
      '.dark\\:shadow-xl.dark\\:hover\\:shadow-lg.dark\\:drop-shadow-lg',
    ).should('exist');
  });

  it('should handle dark mode styling', () => {
    cy.mount(<NavigationButtons {...defaultProps} />);

    // Check dark mode classes
    cy.get('.dark\\:text-slate-300').should('exist');
    cy.get(
      '.dark\\:shadow-xl.dark\\:hover\\:shadow-lg.dark\\:drop-shadow-lg',
    ).should('exist');
  });

  it('should render with correct responsive classes', () => {
    cy.mount(<NavigationButtons {...defaultProps} />);

    // Check responsive text alignment
    cy.get('.text-center.lg\\:text-left').should('exist');
  });

  it('should handle empty string props gracefully', () => {
    const emptyProps: NavigationButtonsProps = {
      prevLabel: '',
      prevURL: '',
      nextLabel: '',
      nextURL: '',
    };

    cy.mount(<NavigationButtons {...emptyProps} />);

    // Should render placeholder divs when props are empty strings
    cy.get('[data-test="nav-button-prev"]').should('not.exist');
    cy.get('[data-test="nav-button-next"]').should('not.exist');
    cy.get('[class*="w-full"]').should('have.length', 2);
  });

  it('should handle mixed valid and invalid props', () => {
    const mixedProps: NavigationButtonsProps = {
      prevLabel: 'Valid Previous',
      prevURL: '/valid-prev',
      nextLabel: '', // Invalid
      nextURL: '', // Invalid
    };

    cy.mount(<NavigationButtons {...mixedProps} />);

    // Previous button should be rendered
    cy.get('[data-test="nav-button-prev"]').should('exist');
    cy.get('[data-test="nav-button-prev"]').within(() => {
      cy.get('[data-test="nav-button-label"]').should(
        'have.text',
        mixedProps.prevLabel,
      );
    });

    // Next button should not be rendered (placeholder div instead)
    cy.get('[data-test="nav-button-next"]').should('not.exist');
  });
});
