import React from 'react';
import { TableOfContentMarkdown } from '../../components/TableOfContentMarkdown';

describe('TableOfContentMarkdown Component', () => {
  it('renders h1 as a link with generated slug', () => {
    cy.mount(<TableOfContentMarkdown markdown='# Hello World' />);
    cy.get('a').should('have.attr', 'href', '#hello-world');
    cy.get('a').should('contain', 'Hello World');
  });

  it('renders h2 with bullet point', () => {
    cy.mount(<TableOfContentMarkdown markdown='## Section Title' depth={2} />);
    cy.get('a').should('have.attr', 'href', '#section-title');
    cy.get('a').should('contain', 'Section Title');
  });

  it('ignores h3 when depth is 2', () => {
    cy.mount(<TableOfContentMarkdown markdown='### Sub Section' depth={2} />);
    cy.get('a').should('not.exist');
  });

  it('renders h3 when depth is 3', () => {
    cy.mount(<TableOfContentMarkdown markdown='### Sub Section' depth={3} />);
    cy.get('a').should('have.attr', 'href', '#sub-section');
    cy.get('a').should('contain', 'Sub Section');
  });
});
