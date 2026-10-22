/* eslint-disable linebreak-style */
import React from 'react';
import { TabsGroup } from '~/components/TabsGroup';

// Simple stand-in for StyledMarkdownBlock that prints the markdown it receives
const StubMarkdownBlock = ({ markdown }: { markdown: string }) => (
  <div>{markdown}</div>
);

const tabsMarkdown = `[tabs-start "Language"]
[tab "JavaScript"]
JavaScript content here
[tab "Python"]
Python content here
[tabs-end]`;

describe('TabsGroup Component', () => {
  // Render the group label and one label per tab
  it('should render the group label and a label for each tab', () => {
    cy.mount(
      <TabsGroup
        markdown={tabsMarkdown}
        StyledMarkdownBlock={StubMarkdownBlock}
      />,
    );
    cy.contains('Language:').should('exist');
    cy.contains(/^JavaScript$/).should('exist');
    cy.contains(/^Python$/).should('exist');
  });

  // The first tab is active when the component loads
  it('should show the first tab content by default', () => {
    cy.mount(
      <TabsGroup
        markdown={tabsMarkdown}
        StyledMarkdownBlock={StubMarkdownBlock}
      />,
    );
    cy.contains('JavaScript content here').should('exist');
    cy.contains('Python content here').should('not.exist');
  });

  // Clicking a tab swaps the displayed content
  it('should show the selected tab content after clicking another tab', () => {
    cy.mount(
      <TabsGroup
        markdown={tabsMarkdown}
        StyledMarkdownBlock={StubMarkdownBlock}
      />,
    );
    cy.contains(/^Python$/).click();
    cy.contains('Python content here').should('exist');
    cy.contains('JavaScript content here').should('not.exist');
  });

  // No group label when the markdown has no [tabs-start] line
  it('should not render a group label when none is provided', () => {
    const noLabelMarkdown = `[tab "JavaScript"]
JavaScript content here
[tab "Python"]
Python content here
[tabs-end]`;
    cy.mount(
      <TabsGroup
        markdown={noLabelMarkdown}
        StyledMarkdownBlock={StubMarkdownBlock}
      />,
    );
    cy.contains('Language:').should('not.exist');
    cy.contains(/^JavaScript$/).should('exist');
  });
});
