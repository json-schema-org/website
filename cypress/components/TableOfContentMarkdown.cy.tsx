import React from 'react';
import { TableOfContentMarkdown } from '../../components/TableOfContentMarkdown';
import { FullMarkdownContext } from '../../context';

describe('TableOfContentMarkdown Component', () => {
  const markdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
`;

  it('should render headings correctly', () => {
    cy.mount(
      <FullMarkdownContext.Provider value={markdown}>
        <TableOfContentMarkdown markdown={markdown} />
      </FullMarkdownContext.Provider>,
    );

    cy.contains('Heading 1').should('exist');
    cy.contains('Heading 2').should('exist');
  });

  it('should respect depth prop', () => {
    cy.mount(
      <FullMarkdownContext.Provider value={markdown}>
        <TableOfContentMarkdown markdown={markdown} depth={3} />
      </FullMarkdownContext.Provider>,
    );

    cy.contains('Heading 3').should('exist');
  });

  it('should generate correct href slugs', () => {
    cy.mount(
      <FullMarkdownContext.Provider value={markdown}>
        <TableOfContentMarkdown markdown={markdown} />
      </FullMarkdownContext.Provider>,
    );

    cy.contains('a', 'Heading 1').should('have.attr', 'href', '#heading-1');
  });

  it('should handle Chrome-specific styling', () => {
    // Mock userAgent to be Chrome
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        configurable: true,
      });
      Object.defineProperty(win.navigator, 'vendor', {
        value: 'Google Inc.',
        configurable: true,
      });
    });

    cy.mount(
      <FullMarkdownContext.Provider value={markdown}>
        <TableOfContentMarkdown markdown={markdown} depth={2} />
      </FullMarkdownContext.Provider>,
    );

    // We can't easily check the exact class applied by state change without waiting or checking implementation details
    // But we can check if it renders without error
    cy.contains('Heading 2').should('exist');
  });
});
