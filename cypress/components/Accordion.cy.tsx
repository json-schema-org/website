import React from 'react';
import Accordion from '~/components/Accordion';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

interface AccordionItem {
  question: string;
  answer: string;
  id: number;
}

interface AccordionProps {
  items: AccordionItem[];
}

const items: AccordionProps['items'] = [
  {
    question: 'What is JSON Schema?',
    answer:
      'JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It is used to define the structure of JSON data for documentation, validation, and interaction control.',
    id: 1,
  },
  {
    question: 'What is JSON Schema used for?',
    answer:
      'JSON Schema is used to define the structure of JSON data for documentation, validation, and interaction control.',
    id: 2,
  },
  {
    question: 'What is JSON Schema validation?',
    answer:
      'JSON Schema validation is the process of ensuring that a JSON document is correctly formatted and structured according to a JSON Schema.',
    id: 3,
  },
];

describe('Accordion Component', () => {
  let mockRouter: MockRouter;
  beforeEach(() => {
    mockRouter = mockNextRouter();
    cy.mount(<Accordion items={items} />);
  });

  // Render the Accordion component with items correctly
  it('should render the Accordion Items correctly', () => {
    // Check if all items are rendered
    items.forEach((item) => {
      cy.get(`[data-test="accordion-item-${item.id}"]`)
        .should('exist')
        .within(() => {
          // Check if the question is rendered
          cy.get(`[data-test="accordion-question-${item.id}"]`).should(
            'have.text',
            item.question,
          );

          // Initially, answer should not be visible
          cy.get(`[data-test="accordion-answer-${item.id}"]`).should('not.be.visible');

          // Click on the question to see the answer
          cy.get(`[data-test="accordion-question-${item.id}"]`).click();
          
          // Answer should now be visible
          cy.get(`[data-test="accordion-answer-${item.id}"]`).should('be.visible');
          cy.get(`[data-test="accordion-answer-${item.id}"]`).should(
            'have.text',
            item.answer,
          );
        });
    });
  });

  // Toggle functionality of the Accordion items should work correctly
  it('should handle the toggle correctly', () => {
    const firstItem = items[0];

    // Initially, answer should not be visible
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should('not.be.visible');

    // Click on the first item to expand it
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();

    // Check if the first item is expanded (answer should be visible)
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should('be.visible');

    // Click on the toggle button to collapse the first item
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();

    // Check if the first item is collapsed (answer should not be visible)
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should('not.be.visible');
  });

  // Test hover effects on question titles
  it('should apply hover effects on question titles', () => {
    const firstItem = items[0];
    
    // Hover over the question title
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`)
      .trigger('mouseover')
      .should('have.class', 'hover:text-lg');
  });

  // Test visual states when accordion items are open
  it('should show correct visual states when items are open', () => {
    const firstItem = items[0];
    
    // Click to open the item
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    
    // Check that the container has the correct background color class
    cy.get(`[data-test="accordion-item-${firstItem.id}"]`)
      .find('div')
      .first()
      .should('have.class', 'bg-[#e2e8f0]');
    
    // Check that the question title has the active color class
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`)
      .should('have.class', 'text-primary');
    
    // Check that the circle icon shows the correct state
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`)
      .find('span')
      .should('have.text', '×');
  });

  describe('Accordion scrolling behavior', () => {
    // Scroll to the Accordion item when the router asPath changes
    it('should scroll when router asPath changes', () => {
      // spy the scrollTo method
      const scrollToSpy = cy.spy(window, 'scrollTo');
      
      // Initially, answer should not be visible
      cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should('not.be.visible');
      
      // Click on the question to open it
      cy.get(`[data-test="accordion-question-${items[0].id}"]`).click();

      // Simulate the router asPath change
      mockRouter.asPath = `#${items[0].id}`;
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // Check if the accordion item is expanded
      cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should('be.visible');

      // Check if scrollTo was called
      cy.wrap(scrollToSpy).should('have.been.called');
      cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should('exist');

      // Check if scrollTo was called with the correct arguments
      cy.wrap(scrollToSpy).should('have.been.calledWithMatch', {
        top: Cypress.sinon.match.number,
        behavior: 'smooth',
      });
    });

    it('should handle hash changes correctly', () => {
      // Set up the router with a hash before mounting
      mockRouter.asPath = `#${items[0].id}`;
      
      // Remount the component with the hash in the URL
      cy.mount(<Accordion items={items} />);

      // Check if the accordion item is expanded due to the hash
      cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should('be.visible');
    });

    it('should handle non-existent hash gracefully', () => {
      // Simulate the router asPath change to a non-existent item
      mockRouter.asPath = '#999';
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // No items should be expanded
      items.forEach((item) => {
        cy.get(`[data-test="accordion-answer-${item.id}"]`).should('not.be.visible');
      });
    });
  });
});
