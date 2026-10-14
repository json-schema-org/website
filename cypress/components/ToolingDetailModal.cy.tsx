import React from 'react';
import ToolingDetailModal from '../../pages/tools/components/ToolingDetailModal';
import type { JSONSchemaTool } from '../../pages/tools/JSONSchemaTool';

describe('ToolingDetailModal Component', () => {
  const mockTool: JSONSchemaTool = {
    name: 'Test Tool',
    description: 'A test tool for JSON schema',
    languages: ['TypeScript', 'JavaScript'],
    toolingTypes: ['validator'],
    source: 'https://github.com/test/test-tool',
    homepage: 'https://test-tool.org',
    license: 'MIT',
  };

  it('renders modal with dialog accessibility attributes and content', () => {
    const onClose = cy.stub().as('onClose');
    cy.mount(<ToolingDetailModal tool={mockTool} onClose={onClose} />);

    // Verify dialog accessibility attributes
    cy.get('[role="dialog"]').should('exist');
    cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true');
    cy.get('[role="dialog"]').should(
      'have.attr',
      'aria-labelledby',
      'tool-modal-title',
    );

    // Verify title and description
    cy.get('#tool-modal-title').should('contain', 'Test Tool');
    cy.contains('A test tool for JSON schema').should('be.visible');
    cy.contains('https://github.com/test/test-tool').should('be.visible');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = cy.stub().as('onClose');
    cy.mount(<ToolingDetailModal tool={mockTool} onClose={onClose} />);

    cy.get('button[aria-label="Close modal"]').click();
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = cy.stub().as('onClose');
    cy.mount(<ToolingDetailModal tool={mockTool} onClose={onClose} />);

    cy.document().trigger('keydown', { key: 'Escape' });
    cy.get('@onClose').should('have.been.calledOnce');
  });
});
