/* eslint-disable cypress/unsafe-to-chain-command */
import React from 'react';
import Checkbox from '../../pages/tools/components/ui/Checkbox';

describe('Checkbox Component', () => {
  it('renders with required props', () => {
    cy.mount(
      <Checkbox label='Test Checkbox' value='test' name='test-checkbox' />,
    );
    cy.get('label').should('exist');
    cy.get('button[role="checkbox"]').should('exist');
    cy.contains('Test Checkbox').should('be.visible');
  });

  it('handles disabled state', () => {
    cy.mount(
      <Checkbox
        label='Disabled Checkbox'
        value='test'
        name='test-checkbox'
        disabled={true}
      />,
    );
    cy.get('button[role="checkbox"]').should('have.attr', 'disabled');
  });

  describe('Light Mode', () => {
    beforeEach(() => {
      cy.mount(
        <Checkbox label='Test Checkbox' value='test' name='test-checkbox' />,
      );
    });

    it('renders correctly and handles interactions', () => {
      // Check initial render
      cy.contains('Test Checkbox').should('be.visible');
      cy.get('[data-state="unchecked"]').should('exist');

      // Check styling
      cy.get('label').should('have.class', 'flex');
      cy.get('button[role="checkbox"]')
        .should('have.class', 'h-5')
        .and('have.class', 'w-5')
        .and('have.class', 'border-gray-500');

      // Check interaction
      cy.get('button[role="checkbox"]')
        .click()
        .should('have.attr', 'data-state', 'checked')
        .click()
        .should('have.attr', 'data-state', 'unchecked');
    });

    it('handles checked state prop', () => {
      cy.mount(
        <Checkbox
          label='Test Checkbox'
          value='test'
          name='test-checkbox'
          checked={true}
        />,
      );
      cy.get('button[role="checkbox"]')
        .should('have.attr', 'data-state', 'checked')
        .and('have.class', 'data-[state=checked]:bg-blue-500')
        .and('have.class', 'data-[state=checked]:border-blue-500')
        .and('have.class', 'data-[state=checked]:text-white');
    });

    it('has properly centered icon when checked', () => {
      cy.mount(
        <Checkbox
          label='Test Checkbox'
          value='test'
          name='test-checkbox'
          checked={true}
        />,
      );

      // Check that the indicator container has proper centering classes
      cy.get('[data-slot="checkbox-indicator"]')
        .should('have.class', 'flex')
        .and('have.class', 'items-center')
        .and('have.class', 'justify-center')
        .and('have.class', 'w-full')
        .and('have.class', 'h-full');

      // Check that the icon exists and has proper sizing
      cy.get('[data-slot="checkbox-indicator"] svg')
        .should('exist')
        .and('have.class', 'size-3.5');

      // Verify the checkbox has the correct dimensions for centering
      cy.get('button[role="checkbox"]')
        .should('have.class', 'size-4')
        .and('have.class', 'rounded-[4px]');
    });
  });

  describe('Dark Mode', () => {
    beforeEach(() => {
      cy.mount(
        <div className='dark'>
          <Checkbox label='Test Checkbox' value='test' name='test-checkbox' />
        </div>,
      );
    });

    it('renders with correct dark mode styling', () => {
      // Check label styling
      cy.get('label')
        .should('have.class', 'dark:bg-slate-900')
        .and('have.class', 'dark:border-slate-700');

      // Check text color
      cy.get('span').should('have.class', 'dark:text-slate-300');

      // Check checkbox styling
      cy.get('button[role="checkbox"]').should(
        'have.class',
        'dark:border-slate-600',
      );
    });

    it('handles checked state in dark mode', () => {
      cy.mount(
        <div className='dark'>
          <Checkbox
            label='Test Checkbox'
            value='test'
            name='test-checkbox'
            checked={true}
          />
        </div>,
      );
      cy.get('button[role="checkbox"]')
        .should('have.attr', 'data-state', 'checked')
        .and('have.class', 'dark:data-[state=checked]:bg-[#bfdbfe]')
        .and('have.class', 'dark:data-[state=checked]:text-black');
    });
  });
});
