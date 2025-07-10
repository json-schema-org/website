import React from 'react';
import { DocsHelp } from '~/components/DocsHelp';
import mockNextRouter from '../plugins/mockNextRouterUtils';

describe('DocsHelp GitRedirect Tests', () => {
  beforeEach(() => {
    mockNextRouter();
  });

  it('should use direct URL when fileRenderType is a URL', () => {
    // This test specifically targets line 67-69 in DocsHelp.tsx
    const directUrl = 'https://github.com/direct-url';
    cy.mount(<DocsHelp fileRenderType={directUrl} />);

    // Verify the URL is used directly without modification
    cy.get('[data-test="edit-on-github-link"]')
      .should('have.attr', 'href')
      .and('eq', directUrl);
  });

  it('should handle different file types correctly', () => {
    // Test all file type cases
    const types = [
      { type: 'tsx', expected: '/index.page.tsx' },
      { type: '_indexmd', expected: '/_index.md' },
      { type: 'indexmd', expected: '/index.md' },
      { type: '_md', expected: '.md' },
    ];

    types.forEach(({ type, expected }) => {
      cy.mount(<DocsHelp fileRenderType={type} />);

      cy.get('[data-test="edit-on-github-link"]')
        .should('have.attr', 'href')
        .and('include', expected);
    });
  });
});
