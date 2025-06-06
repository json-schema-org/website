import React from 'react';
import Badge from '../../pages/tools/components/ui/Badge';

describe('Badge Component', () => {
  it('renders with correct base classes', () => {
    cy.mount(<Badge>Test Badge</Badge>);
    cy.get('span').should('have.class', 'mx-[4px]');
    cy.get('span').should('have.class', 'my-[4px]');
    cy.get('span').should('have.class', 'bg-[#e2e8f0]');
    cy.get('span').should('have.class', 'dark:bg-[#0f172a]');
    cy.get('span').should('have.class', 'text-[#0f172a]');
    cy.get('span').should('have.class', 'dark:text-white');
    cy.get('span').should('have.class', 'inline-flex');
    cy.get('span').should('have.class', 'items-center');
    cy.get('span').should('have.class', 'justify-center');
    cy.get('span').should('have.class', 'rounded-md');
    cy.get('span').should('have.class', 'border');
  });

  it('renders with different variants', () => {
    cy.mount(<Badge variant='default'>Default Badge</Badge>);
    cy.get('span').should('have.class', 'bg-[#e2e8f0]');
    cy.get('span').should('have.class', 'dark:bg-[#0f172a]');
    cy.get('span').should('have.class', 'text-[#0f172a]');
    cy.get('span').should('have.class', 'dark:text-white');

    cy.mount(<Badge variant='secondary'>Secondary Badge</Badge>);
    cy.get('span').should('have.class', 'bg-[#e2e8f0]');
    cy.get('span').should('have.class', 'dark:bg-[#0f172a]');
    cy.get('span').should('have.class', 'text-[#0f172a]');
    cy.get('span').should('have.class', 'dark:text-white');

    cy.mount(<Badge variant='outline'>Outline Badge</Badge>);
    cy.get('span').should('have.class', 'bg-[#e2e8f0]');
    cy.get('span').should('have.class', 'dark:bg-[#0f172a]');
    cy.get('span').should('have.class', 'text-[#0f172a]');
    cy.get('span').should('have.class', 'dark:text-white');

    cy.mount(<Badge variant='destructive'>Destructive Badge</Badge>);
    cy.get('span').should('have.class', 'bg-[#e2e8f0]');
    cy.get('span').should('have.class', 'dark:bg-[#0f172a]');
    cy.get('span').should('have.class', 'text-[#0f172a]');
    cy.get('span').should('have.class', 'dark:text-white');
  });

  it('renders children content correctly', () => {
    const content = 'Test Badge Content';
    cy.mount(<Badge>{content}</Badge>);
    cy.get('span').should('contain', content);
  });
});
