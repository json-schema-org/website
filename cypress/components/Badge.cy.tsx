import React from 'react';
import Badge from '../../pages/tools/components/ui/Badge';

describe('Badge Component', () => {
  it('renders with correct base classes', () => {
    cy.mount(<Badge>Test Badge</Badge>);
    cy.get('div').should('have.class', 'whitespace-nowrap');
    cy.get('div').should('have.class', 'inline-block');
    cy.get('div').should('have.class', 'rounded-md');
    cy.get('div').should('have.class', 'bg-slate-200');
    cy.get('div').should('have.class', 'dark:bg-slate-900');
  });

  it('renders with correct spacing classes', () => {
    cy.mount(<Badge>Test Badge</Badge>);
    cy.get('div').should('have.class', 'mx-[4px]');
    cy.get('div').should('have.class', 'my-[4px]');
    cy.get('div').should('have.class', 'px-[16px]');
    cy.get('div').should('have.class', 'py-[4px]');
  });

  it('renders children content correctly', () => {
    const content = 'Test Badge Content';
    cy.mount(<Badge>{content}</Badge>);
    cy.get('div').should('contain', content);
  });

  it('renders with dark mode classes', () => {
    cy.mount(<Badge>Dark Mode Badge</Badge>);
    cy.get('div').should('have.class', 'dark:bg-slate-900');
  });
}); 