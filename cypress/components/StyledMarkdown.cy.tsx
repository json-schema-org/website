
import React from 'react';
import StyledMarkdown from '../../components/StyledMarkdown';

describe('StyledMarkdown Component', () => {
  it('should render standard markdown', () => {
    const markdown = '# Hello World';
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.contains('Hello World').should('exist');
  });

  it('should render tab groups', () => {
    const markdown = `
[tabs-start "My Tabs"]
[tab "Tab 1"]
Content 1
[tabs-end]
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.contains('My Tabs:').should('exist');
    cy.contains('Tab 1').should('exist');
    cy.contains('Content 1').should('exist');
  });

  it('should render mixed content', () => {
    const markdown = `
# Header
[tabs-start]
[tab "Tab 1"]
Content 1
[tabs-end]
Footer
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.contains('Header').should('exist');
    cy.contains('Tab 1').should('exist');
    cy.contains('Footer').should('exist');
  });

  it('should handle null/empty markdown', () => {
    cy.mount(<StyledMarkdown markdown="" />);
    cy.get('div').should('not.exist'); // Or checks that nothing renders
  });
});
