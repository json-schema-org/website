import React from 'react';
import { Remember } from '~/components/Remember';

describe('Remember Component', () => {
  // Should render the Remember component correctly
  it('should render the Remember component', () => {
    // Mount the Remember component
    cy.mount(<Remember />);

    // Should have the correct elements and text

    cy.get('[data-test="remember-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Remember');

    cy.get('[data-test="contribute-docs-span"]')
      .should('have.prop', 'tagName', 'SPAN')
      .and('contain.text', 'Contribute to the JSON Schema Docs');

    cy.get('[data-test="contribute-docs-div"]').should('exist');

    cy.get('[data-test="get-started-span"]')
      .should('have.prop', 'tagName', 'SPAN')
      .and('contain.text', 'To get started as a Docs contributor:');

    cy.get('ol').should('exist');

    cy.get('li').should('have.length', 4);

    cy.get('[data-test="contribute-docs-questions-span"]')
      .should('have.prop', 'tagName', 'SPAN')
      .and('contain.text', 'Docs contributor questions?');

    cy.get('[data-test="contribute-docs-questions-div"]').should('exist');

    // Should have the correct links
    cy.get('a').should('have.length', 4);
    cy.get('a')
      .eq(0)
      .should(
        'have.attr',
        'href',
        'https://github.com/json-schema-org/community/blob/main/CONTRIBUTING.md',
      );
    cy.get('a')
      .eq(1)
      .should(
        'have.attr',
        'href',
        'https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md',
      );
    cy.get('a')
      .eq(2)
      .should(
        'have.attr',
        'href',
        'https://github.com/orgs/json-schema-org/projects/16',
      );
    cy.get('a')
      .eq(3)
      .should('have.attr', 'href', 'https://json-schema.org/slack');
  });
});
