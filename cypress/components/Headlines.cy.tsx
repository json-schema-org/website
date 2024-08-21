import React from 'react';
import {
  Headline1,
  Headline2,
  Headline3,
  Headline4,
} from '~/components/Headlines';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

describe('Headlines Component', () => {
  let mockRouter: MockRouter;
  beforeEach(() => {
    mockRouter = mockNextRouter();
  });

  // Should render all types of headlines correctly with attributes and children
  it('should render all types of headlines correctly with attributes and children', () => {
    /*Testing all types of headline components with attributes and children and headlines should not be active*/

    // Mount the Headline1
    cy.mount(
      <Headline1 attributes={{ className: 'custom-class' }}>
        Headline <p>1</p>
      </Headline1>,
    );
    // Check if the headline is rendered correctly with the custom class
    cy.get('h1')
      .should('have.text', 'Headline 1')
      .should('have.class', 'custom-class');
    // Check if headline is not active
    cy.get('span').should('not.exist');

    // Mount the Headline2
    cy.mount(
      <Headline2 attributes={{ className: 'custom-class' }}>
        Headline <p>2</p>
      </Headline2>,
    );
    // Check if the headline is rendered correctly with the custom class
    cy.get('h2')
      .should('have.text', 'Headline 2')
      .should('have.class', 'custom-class');
    // Check if headline is not active
    cy.get('span').should('not.exist');

    // Mount the Headline3
    cy.mount(
      <Headline3 attributes={{ className: 'custom-class' }}>
        Headline <p>3</p>
      </Headline3>,
    );
    // Check if the headline is rendered correctly with the custom class
    cy.get('h3')
      .should('have.text', 'Headline 3')
      .should('have.class', 'custom-class');
    // Check if headline is not active
    cy.get('span').should('not.exist');

    // Mount the Headline4
    cy.mount(
      <Headline4 attributes={{ className: 'custom-class' }}>
        Headline <p>4</p>
      </Headline4>,
    );
    // Check if the headline is rendered correctly with the custom class
    cy.get('h4')
      .should('have.text', 'Headline 4')
      .should('have.class', 'custom-class');
    // Check if headline is not active
    cy.get('span').should('not.exist');
  });

  // Check if the headline is active on click and the URL changes
  it('should correctly call router push on click', () => {
    /* Testing onClick property of headline with Headline1 */

    // Mount the Headline1
    cy.mount(<Headline1>What is JSON Schema?</Headline1>);
    // Click on the headline to make it active
    cy.get('[data-test="headline"]').click();

    // Push router to the URL with the hash
    mockRouter.push('/#what-is-json-schema');

    // Check if the headline is active
    cy.get('span').should(
      'have.class',
      'text-startBlue dark:text-endBlue inline-block ml-2',
    );
    cy.get('span').should('have.text', '¶');
  });

  // Check if visit the URL with the hash, the headline is active
  it('should be active if the URL has the hash', () => {
    /* Testing the active headline with Headline1 */

    // Set the URL with the hash
    mockRouter.asPath = '/#what-is-json-schema';

    // Check if Correct headline is active
    cy.mount(<Headline1>What is JSON Schema?</Headline1>);
    cy.get('span').should(
      'have.class',
      'text-startBlue dark:text-endBlue inline-block ml-2',
    );
    cy.get('span').should('have.text', '¶');
  });
});
