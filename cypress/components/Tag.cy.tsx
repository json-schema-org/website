import React from 'react';
import Tag from '../../pages/tools/components/ui/Tag';

describe('Tag Component', () => {
  it('renders with default neutral intent', () => {
    cy.mount(<Tag>Default Tag</Tag>);
    cy.get('span').should('have.class', 'bg-slate-500/10');
    cy.get('span').should('have.class', 'dark:bg-slate-500/20');
    cy.get('span').should('have.class', 'text-slate-700');
    cy.get('span').should('have.class', 'dark:text-slate-400');
    cy.get('span').should('have.class', 'inline-flex');
    cy.get('span').should('have.class', 'items-center');
    cy.get('span').should('have.class', 'justify-center');
    cy.get('span').should('have.class', 'rounded-md');
    cy.get('span').should('have.class', 'border');
  });

  it('renders with success intent', () => {
    cy.mount(<Tag intent='success'>Success Tag</Tag>);
    cy.get('span').should('have.class', 'bg-emerald-500/10');
    cy.get('span').should('have.class', 'dark:bg-emerald-500/20');
    cy.get('span').should('have.class', 'text-emerald-700');
    cy.get('span').should('have.class', 'dark:text-emerald-400');
  });

  it('renders with warning intent', () => {
    cy.mount(<Tag intent='warning'>Warning Tag</Tag>);
    cy.get('span').should('have.class', 'bg-amber-500/10');
    cy.get('span').should('have.class', 'dark:bg-amber-500/20');
    cy.get('span').should('have.class', 'text-amber-700');
    cy.get('span').should('have.class', 'dark:text-amber-400');
  });

  it('renders with error intent', () => {
    cy.mount(<Tag intent='error'>Error Tag</Tag>);
    cy.get('span').should('have.class', 'bg-red-500/10');
    cy.get('span').should('have.class', 'dark:bg-red-500/20');
    cy.get('span').should('have.class', 'text-red-700');
    cy.get('span').should('have.class', 'dark:text-red-400');
  });

  it('renders children content correctly', () => {
    const content = 'Test Tag Content';
    cy.mount(<Tag>{content}</Tag>);
    cy.get('span').should('contain', content);
  });

  it('renders with correct base classes', () => {
    cy.mount(<Tag>Test Tag</Tag>);
    cy.get('span').should('have.class', 'mr-2');
    cy.get('span').should('have.class', 'text-[12px]');
    cy.get('span').should('have.class', 'font-semibold');
  });
});
