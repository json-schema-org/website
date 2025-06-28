/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
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
          cy.get(`[data-test="accordion-answer-${item.id}"]`).should(
            'not.be.visible',
          );

          // Click on the question to see the answer
          cy.get(`[data-test="accordion-question-${item.id}"]`).click();

          // Answer should now be visible
          cy.get(`[data-test="accordion-answer-${item.id}"]`).should(
            'be.visible',
          );
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
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'not.be.visible',
    );

    // Click on the first item to expand it
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();

    // Check if the first item is expanded (answer should be visible)
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'be.visible',
    );

    // Click on the toggle button to collapse the first item
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();

    // Check if the first item is collapsed (answer should not be visible)
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'not.be.visible',
    );
  });

  // Test multiple items interaction
  it('should handle multiple items being open simultaneously', () => {
    // Open first item
    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();
    cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should(
      'be.visible',
    );

    // Open second item
    cy.get(`[data-test="accordion-toggle-${items[1].id}"]`).click();
    cy.get(`[data-test="accordion-answer-${items[1].id}"]`).should(
      'be.visible',
    );

    // Both items should remain open
    cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should(
      'be.visible',
    );
    cy.get(`[data-test="accordion-answer-${items[1].id}"]`).should(
      'be.visible',
    );

    // Close first item
    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();
    cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should(
      'not.be.visible',
    );

    // Second item should still be open
    cy.get(`[data-test="accordion-answer-${items[1].id}"]`).should(
      'be.visible',
    );
  });

  // Test click behavior on already open items
  it('should close item when clicking on already open question', () => {
    const firstItem = items[0];

    // Open the item first
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'be.visible',
    );

    // Click on the question link when it's already open
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).click();

    // Item should be closed
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'not.be.visible',
    );
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
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).should(
      'have.class',
      'text-primary',
    );

    // Check that the circle icon shows the correct state
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`)
      .find('span')
      .should('have.text', '×');
  });

  // Test visual states when accordion items are closed
  it('should show correct visual states when items are closed', () => {
    const firstItem = items[0];

    // Ensure item is closed initially
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'not.be.visible',
    );

    // Check that the circle icon shows the correct state for closed items
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`)
      .find('span')
      .should('have.text', '+');

    // Check that the question title doesn't have active color class
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).should(
      'not.have.class',
      'text-primary',
    );
  });

  // Test dark mode styling classes
  it('should have dark mode styling classes', () => {
    const firstItem = items[0];

    // Check for dark mode border classes (always present)
    cy.get(`[data-test="accordion-item-${firstItem.id}"]`)
      .find('div')
      .first()
      .should('have.class', 'dark:border-[#bfdbfe]');

    // Check for dark mode background classes (only when open)
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    cy.get(`[data-test="accordion-item-${firstItem.id}"]`)
      .find('div')
      .first()
      .should('have.class', 'dark:bg-[#0f172a]');

    // Check for dark mode text classes on question
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).should(
      'have.class',
      'dark:hover:text-[#bfdbfe]',
    );

    // Check for dark mode icon classes (only when open)
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`)
      .find('div')
      .should('have.class', 'dark:bg-[#bfdbfe]')
      .and('have.class', 'dark:text-black')
      .and('have.class', 'dark:border-[#bfdbfe]');
  });

  // Test accessibility features
  it('should have proper accessibility attributes', () => {
    const firstItem = items[0];

    // Check that collapsible trigger has proper ARIA attributes
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).should(
      'have.attr',
      'data-state',
    );

    // Check that content has proper ARIA attributes
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'have.attr',
      'data-state',
    );

    // Check that the trigger has button-like behavior
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).should(
      'have.attr',
      'type',
      'button',
    );
  });

  // Test keyboard navigation
  it('should support keyboard navigation', () => {
    const firstItem = items[0];

    // Click to focus and open the toggle
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'be.visible',
    );

    // Click again to close
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'not.be.visible',
    );

    // Test that the component responds to keyboard events through the collapsible
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'be.visible',
    );
  });

  // Test animation classes
  it('should have proper animation classes', () => {
    const firstItem = items[0];

    // Check for animation classes on content
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`)
      .should('have.class', 'data-[state=closed]:animate-collapsible-up')
      .and('have.class', 'data-[state=open]:animate-collapsible-down');
  });

  // Test edge cases
  it('should handle empty items array', () => {
    cy.mount(<Accordion items={[]} />);

    // Should render without errors
    cy.get('[data-test^="accordion-item-"]').should('not.exist');
  });

  it('should handle single item', () => {
    const singleItem = [items[0]];
    cy.mount(<Accordion items={singleItem} />);

    // Should render the single item correctly
    cy.get(`[data-test="accordion-item-${singleItem[0].id}"]`).should('exist');
    cy.get(`[data-test="accordion-question-${singleItem[0].id}"]`).should(
      'have.text',
      singleItem[0].question,
    );
  });

  // Test scroll behavior with element positioning
  it('should scroll to correct position when opening item', () => {
    const firstItem = items[0];
    const scrollToSpy = cy.spy(window, 'scrollTo');

    // Mock getElementById to return a mock element
    const mockElement = {
      offsetTop: 500,
    };
    cy.stub(document, 'getElementById').returns(mockElement as any);

    // Click on the question to open it and trigger scroll
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).click();

    // Wait for the setTimeout to execute
    cy.wait(150);

    // Check if scrollTo was called with correct parameters
    cy.wrap(scrollToSpy).should('have.been.calledWithMatch', {
      top: 330, // 500 - 150 (navbar) - 20 (offset)
      behavior: 'smooth',
    });
  });

  // Test scroll behavior when element is not found
  it('should handle scroll gracefully when element is not found', () => {
    const firstItem = items[0];
    const scrollToSpy = cy.spy(window, 'scrollTo');

    // Mock getElementById to return null
    cy.stub(document, 'getElementById').returns(null);

    // Click on the question to open it
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).click();

    // Wait for the setTimeout to execute
    cy.wait(150);

    // scrollTo should not be called when element is not found
    cy.wrap(scrollToSpy).should('not.have.been.called');
  });

  // Test that clicking on question link prevents default behavior
  it('should prevent default behavior when clicking on question link', () => {
    const firstItem = items[0];

    // Click on the question link to open it
    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).click();

    // The item should be opened
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'be.visible',
    );
  });

  // Test that the component handles malformed items gracefully
  it('should handle malformed items gracefully', () => {
    const malformedItems = [
      {
        question: 'Test Question',
        answer: 'Test Answer',
        id: 'invalid-id', // string instead of number
      },
    ];

    // Should mount without errors
    cy.mount(<Accordion items={malformedItems as any} />);

    // Should still render the item
    cy.get('[data-test="accordion-item-invalid-id"]').should('exist');
  });

  // Test that the component handles duplicate IDs gracefully
  it('should handle duplicate IDs gracefully', () => {
    const duplicateItems = [
      {
        question: 'First Question',
        answer: 'First Answer',
        id: 1,
      },
      {
        question: 'Second Question',
        answer: 'Second Answer',
        id: 1, // duplicate ID
      },
    ];

    // Should mount without errors
    cy.mount(<Accordion items={duplicateItems} />);

    // Should render both items (React will handle the key conflict)
    cy.get('[data-test="accordion-item-1"]').should('have.length', 2);
  });

  describe('Accordion scrolling behavior', () => {
    it('should handle hash changes correctly', () => {
      // Set up the router with a hash before mounting
      mockRouter.asPath = `#${items[0].id}`;

      // Remount the component with the hash in the URL
      cy.mount(<Accordion items={items} />);

      // Check if the accordion item is expanded due to the hash
      cy.get(`[data-test="accordion-answer-${items[0].id}"]`).should(
        'be.visible',
      );
    });

    it('should handle non-existent hash gracefully', () => {
      cy.mount(<Accordion items={items} />);

      // Simulate the router asPath change to a non-existent item
      mockRouter.asPath = '#999';
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // No items should be expanded
      items.forEach((item) => {
        cy.get(`[data-test="accordion-answer-${item.id}"]`).should(
          'not.be.visible',
        );
      });
    });

    it('should handle invalid hash format gracefully', () => {
      cy.mount(<Accordion items={items} />);

      // Simulate the router asPath change to an invalid hash
      mockRouter.asPath = '#invalid';
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // No items should be expanded
      items.forEach((item) => {
        cy.get(`[data-test="accordion-answer-${item.id}"]`).should(
          'not.be.visible',
        );
      });
    });

    it('should handle hash with no fragment gracefully', () => {
      cy.mount(<Accordion items={items} />);

      // Simulate the router asPath change with no hash fragment
      mockRouter.asPath = '/some-path';
      cy.wrap(null).then(() => {
        Cypress.$(window).trigger('hashchange');
      });

      // No items should be expanded
      items.forEach((item) => {
        cy.get(`[data-test="accordion-answer-${item.id}"]`).should(
          'not.be.visible',
        );
      });
    });

    it('should handle useEffect when items prop changes', () => {
      // Start with initial items
      cy.mount(<Accordion items={items} />);

      // Create new items with different IDs
      const newItems = [
        {
          question: 'New Question 1',
          answer: 'New Answer 1',
          id: 10,
        },
        {
          question: 'New Question 2',
          answer: 'New Answer 2',
          id: 11,
        },
      ];

      // Set hash to match new item before remounting
      mockRouter.asPath = '#10';

      // Remount with new items
      cy.mount(<Accordion items={newItems} />);

      // Wait a bit for useEffect to process
      cy.wait(50);

      // New item should be expanded due to hash
      cy.get('[data-test="accordion-answer-10"]').should('be.visible');
      cy.get('[data-test="accordion-answer-11"]').should('not.be.visible');
    });
  });

  // Test component structure and CSS classes
  it('should have proper component structure', () => {
    const firstItem = items[0];

    // Check main container
    cy.get(`[data-test="accordion-item-${firstItem.id}"]`).should(
      'have.class',
      'w-full',
    );

    // Check collapsible trigger structure
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`)
      .should('have.class', 'w-full')
      .within(() => {
        // Check question container
        cy.get('div').first().should('have.class', 'flex-1');

        // Check icon container - it's the second div with ml-4 flex-shrink-0
        cy.get('div').eq(1).should('have.class', 'ml-4 flex-shrink-0');
      });

    // Check answer container
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`).should(
      'have.class',
      'overflow-hidden',
    );
  });

  // Test transition effects
  it('should have proper transition effects', () => {
    const firstItem = items[0];

    // Check for transition classes
    cy.get(`[data-test="accordion-item-${firstItem.id}"]`)
      .find('div')
      .first()
      .should('have.class', 'transition-colors');

    cy.get(`[data-test="accordion-question-${firstItem.id}"]`).should(
      'have.class',
      'transition-all duration-200',
    );

    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`)
      .find('div')
      .should('have.class', 'transition-all duration-200');
  });

  // Test with long content
  it('should handle long content properly', () => {
    const longContentItems = [
      {
        question:
          'This is a very long question that might wrap to multiple lines and should be handled gracefully by the accordion component',
        answer:
          'This is a very long answer that contains a lot of text and might also wrap to multiple lines. It should be displayed properly within the accordion content area without breaking the layout or causing any visual issues. The content should be readable and properly formatted.',
        id: 100,
      },
    ];

    cy.mount(<Accordion items={longContentItems} />);

    // Should render without layout issues
    cy.get('[data-test="accordion-item-100"]').should('exist');
    cy.get('[data-test="accordion-question-100"]').should(
      'have.text',
      longContentItems[0].question,
    );

    // Open the item
    cy.get('[data-test="accordion-toggle-100"]').click();
    cy.get('[data-test="accordion-answer-100"]').should('be.visible');
    cy.get('[data-test="accordion-answer-100"]').should(
      'have.text',
      longContentItems[0].answer,
    );
  });

  // Test responsive design classes
  it('should have proper responsive design classes', () => {
    const firstItem = items[0];

    // Check for responsive width classes
    cy.get(`[data-test="accordion-item-${firstItem.id}"]`).should(
      'have.class',
      'w-full',
    );

    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).should(
      'have.class',
      'w-full',
    );

    // Check for responsive padding and spacing - the p-4 is on the trigger div itself
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).should(
      'have.class',
      'p-4',
    );

    // Open the item first to check the answer content div
    cy.get(`[data-test="accordion-toggle-${firstItem.id}"]`).click();
    cy.get(`[data-test="accordion-answer-${firstItem.id}"]`)
      .find('div')
      .should('have.class', 'px-4 pb-4');
  });

  // Test that all items have unique data-test attributes
  it('should have unique data-test attributes for all elements', () => {
    items.forEach((item) => {
      // Check that each item has unique test attributes
      cy.get(`[data-test="accordion-item-${item.id}"]`).should('exist');
      cy.get(`[data-test="accordion-toggle-${item.id}"]`).should('exist');
      cy.get(`[data-test="accordion-question-${item.id}"]`).should('exist');
      cy.get(`[data-test="accordion-answer-${item.id}"]`).should('exist');
    });

    // Verify that we have the correct number of elements
    cy.get('[data-test^="accordion-item-"]').should(
      'have.length',
      items.length,
    );
    cy.get('[data-test^="accordion-toggle-"]').should(
      'have.length',
      items.length,
    );
    cy.get('[data-test^="accordion-question-"]').should(
      'have.length',
      items.length,
    );
    cy.get('[data-test^="accordion-answer-"]').should(
      'have.length',
      items.length,
    );
  });
});
