import React from 'react';
import Tag from '../../pages/tools/components/ui/Tag';

describe('Tag Component', () => {
  it('renders with default neutral intent', () => {
    cy.mount(<Tag>Default Tag</Tag>);
    cy.get('div').should('have.class', 'bg-gray-50');
    cy.get('div').should('have.class', 'text-gray-700');
    cy.get('div').should('have.class', 'border-gray-300');
  });

  it('renders with success intent', () => {
    cy.mount(<Tag intent="success">Success Tag</Tag>);
    cy.get('div').should('have.class', 'bg-green-50');
    cy.get('div').should('have.class', 'text-green-700');
    cy.get('div').should('have.class', 'border-green-300');
  });

  it('renders with warning intent', () => {
    cy.mount(<Tag intent="warning">Warning Tag</Tag>);
    cy.get('div').should('have.class', 'bg-yellow-50');
    cy.get('div').should('have.class', 'text-yellow-700');
    cy.get('div').should('have.class', 'border-yellow-300');
  });

  it('renders with error intent', () => {
    cy.mount(<Tag intent="error">Error Tag</Tag>);
    cy.get('div').should('have.class', 'bg-red-50');
    cy.get('div').should('have.class', 'text-red-700');
    cy.get('div').should('have.class', 'border-red-300');
  });

  it('renders children content correctly', () => {
    const content = 'Test Tag Content';
    cy.mount(<Tag>{content}</Tag>);
    cy.get('div').should('contain', content);
  });
}); 