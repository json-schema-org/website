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

  // Render the Accordion component with items corrently
  it('should render the Accordion Items correctly', () => {
    // Check if all items are rendered
    items.forEach((item) => {
      cy.get(`[data-test="accordion-item-${item.id}"]`)
        .should('exist')
        .within(() => {
          // Check if the question is rendered
          cy.get(`[data-test=accordion-question-${item.id}]`).should(
            'have.text',
            item.question,
          );

          // Now click on the question to see the answer
          cy.get(`[data-test=accordion-question-${item.id}]`).click();
          cy.get('@routerPush').should('have.been.calledWith', `#${item.id}`);
          cy.get(`[ data-test=accordion-answer-${item.id}]`).should(
            'have.text',
            item.answer,
          );
        });
      // Check if answer is expanded and visible
      cy.get(`[data-test=accordion-item-${item.id}]`).should(
        'have.class',
        'max-h-96',
      );
    });
  });

  // Toggle Button of the Accordion items should work correctly
  it('should handle the toggle correctly', () => {
    /* Testing the behavior with the first item */

    // Initially, all items should be collapsed
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-20',
    );

    // Click on the first item to expand it
    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();

    // Check if the first item is expanded
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-96',
    );

    // Click on the toggle button to collapse the first item
    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();

    // Check if the first item is collapsed
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-20',
    );
  });

  describe('Accordion scrolling behavior', () => {
    /* Testing the behavior with the first item */

    // Scroll to the Accordion item when the router asPath changes
    it('should scroll when router asPath changes', () => {
      // spy the scrollTo method
      const scrollToSpy = cy.spy(window, 'scrollTo');
      const foundIndex = 0;
      cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
        'have.class',
        'max-h-20',
      );
      cy.get(`[data-test="accordion-question-${items[0].id}"]`).click();

      // Simulate the behavior of findIndex
      cy.stub(items, 'findIndex').callsFake((predicate) => {
        console.log(predicate);
        return predicate({ id: items[0].id }) ? foundIndex : -1;
      });

      // Simulate the router asPath change
      mockRouter.asPath = `#${items[0].id}`;
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // Check if the accordion item is expanded
      cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
        'have.class',
        'max-h-96',
      );

      // Check if scrollTo was called
      cy.wrap(scrollToSpy).should('have.been.called');
      cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should('exist');

      // Check if scrollTo was called with the correct arguments
      cy.wrap(scrollToSpy).should('have.been.calledWithMatch', {
        top: Cypress.sinon.match.number,
        behavior: 'smooth',
      });
    });

    it('should not scroll when findIndex is -1', () => {
      /* Testing the behavior with the first item */

      const foundIndex = 0;
      cy.get(`[data-test="accordion-question-${items[0].id}"]`).click();

      // Simulate the router asPath change to the first item
      mockRouter.asPath = `#${items[0].id}`;
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // Using mockId as null to get findIndex return -1
      cy.stub(items, 'findIndex').callsFake((predicate) => {
        console.log(predicate);
        return predicate({ id: null }) ? foundIndex : -1;
      });
    });

    it('should not scroll when element is not found', () => {
      /* Testing the behavior with the first item */

      const foundIndex = 0;
      // Stub the getElementById method
      const getElementByIdStub = cy.stub(document, 'getElementById');

      cy.get(`[data-test="accordion-question-${items[0].id}"]`).click();

      // Simulate the router asPath change to the first item
      mockRouter.asPath = `#${items[0].id}`;
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // Simulate the behavior of findIndex when element not found
      cy.stub(items, 'findIndex').callsFake((predicate) => {
        return predicate({ id: items[0].id }) ? foundIndex : -1;
      });

      // using mockId as -1 to simulate the behavior of getElementById when element not found
      const mockId = -1;
      const mockElement = document.createElement('div');
      getElementByIdStub.withArgs(mockId.toString()).returns(mockElement);
    });
  });
});
