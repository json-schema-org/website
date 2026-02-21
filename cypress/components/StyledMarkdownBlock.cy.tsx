import React from 'react';
import { StyledMarkdownBlock } from '~/components/StyledMarkdownBlock';

describe('StyledMarkdownBlock', () => {
  it('should render a single-column table without crashing', () => {
    const markdown = `
| Header |
| ------ |
| Cell 1 |
| Cell 2 |
`;
    cy.mount(<StyledMarkdownBlock markdown={markdown} />);
    cy.get('table').should('exist');
    cy.get('th').should('have.length', 1).and('contain.text', 'Header');
    cy.get('td').should('have.length', 2);
    cy.get('td').eq(0).should('contain.text', 'Cell 1');
    cy.get('td').eq(1).should('contain.text', 'Cell 2');
  });

  it('should render a multi-column table without crashing', () => {
    const markdown = `
| Col A | Col B |
| ----- | ----- |
| A1    | B1    |
`;
    cy.mount(<StyledMarkdownBlock markdown={markdown} />);
    cy.get('table').should('exist');
    cy.get('th').should('have.length', 2);
    cy.get('td').should('have.length', 2);
  });
});
