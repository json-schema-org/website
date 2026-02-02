import React from 'react';
import { TabsGroup } from '../../components/TabsGroup';

describe('TabsGroup Component', () => {
  const StyledMarkdownBlock = ({ markdown }: { markdown: string }) => (
    <div data-test="markdown-content">{markdown}</div>
  );

  const basicMarkdown = `
[tabs-start "My Tabs"]
[tab "Tab 1"]
Content 1
[tab "Tab 2"]
Content 2
[tabs-end]
`;

  it('should render the tabs group label', () => {
    cy.mount(
      <TabsGroup
        markdown={basicMarkdown}
        StyledMarkdownBlock={StyledMarkdownBlock}
      />
    );
    cy.contains('My Tabs:').should('exist');
  });

  it('should render tab buttons', () => {
    cy.mount(
      <TabsGroup
        markdown={basicMarkdown}
        StyledMarkdownBlock={StyledMarkdownBlock}
      />
    );
    cy.get('[role="tablist"]').should('exist');
    cy.get('button[role="tab"]').should('have.length', 2);
    cy.contains('button', 'Tab 1').should('exist');
    cy.contains('button', 'Tab 2').should('exist');
  });

  it('should show the first tab content by default', () => {
    cy.mount(
      <TabsGroup
        markdown={basicMarkdown}
        StyledMarkdownBlock={StyledMarkdownBlock}
      />
    );
    cy.get('[role="tabpanel"]').should('exist');
    cy.get('[data-test="markdown-content"]').should('contain', 'Content 1');
    cy.get('[data-test="markdown-content"]').should('not.contain', 'Content 2');
  });

  it('should switch content when clicking a tab', () => {
    cy.mount(
      <TabsGroup
        markdown={basicMarkdown}
        StyledMarkdownBlock={StyledMarkdownBlock}
      />
    );
    // Click second tab
    cy.contains('button', 'Tab 2').click();
    
    // Check content changed
    cy.get('[data-test="markdown-content"]').should('contain', 'Content 2');
    cy.get('[data-test="markdown-content"]').should('not.contain', 'Content 1');
    
    // Check active state classes (checking specific class might be brittle, but checking aria-selected is good)
    cy.contains('button', 'Tab 2').should('have.attr', 'aria-selected', 'true');
    cy.contains('button', 'Tab 1').should('have.attr', 'aria-selected', 'false');
  });

  it('should have correct ARIA attributes', () => {
    cy.mount(
      <TabsGroup
        markdown={basicMarkdown}
        StyledMarkdownBlock={StyledMarkdownBlock}
      />
    );
    
    // Tablist
    cy.get('[role="tablist"]').should('have.attr', 'aria-label', 'My Tabs');
    
    // Tabs
    cy.contains('button', 'Tab 1')
      .should('have.attr', 'aria-controls', 'tabpanel-0')
      .should('have.id', 'tab-0');
      
    // Panel
    cy.get('[role="tabpanel"]')
      .should('have.id', 'tabpanel-0')
      .should('have.attr', 'aria-labelledby', 'tab-0');
  });
});
