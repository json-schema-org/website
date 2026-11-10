import React from 'react';
import { StyledMarkdownBlock } from '~/components/StyledMarkdownBlock';
import mockNextRouter from '../plugins/mockNextRouterUtils';

describe('StyledMarkdownBlock links', () => {
  beforeEach(() => {
    mockNextRouter();
  });

  it('keeps internal and fragment links in the current tab while opening external links in a new tab', () => {
    cy.mount(
      <StyledMarkdownBlock
        markdown={
          '[Internal](/docs/guide)\n\n[Section](#overview)\n\n[External](https://example.com)'
        }
      />,
    );

    cy.contains('a', 'Internal')
      .should('have.attr', 'href', '/docs/guide')
      .and('not.have.attr', 'target');
    cy.contains('a', 'Section')
      .should('have.attr', 'href', '#overview')
      .and('not.have.attr', 'target');
    cy.contains('a', 'External')
      .should('have.attr', 'href', 'https://example.com')
      .and('have.attr', 'target', '_blank');
  });
});
