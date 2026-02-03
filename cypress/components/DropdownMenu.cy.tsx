/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import DropdownMenu from '@/pages/tools/components/ui/DropdownMenu';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

describe('DropdownMenu Component', () => {
  let mockRouter: MockRouter;
  const mockIcon = <svg data-testid='test-icon' />;
  const mockChildren = <div data-testid='test-content'>Test Content</div>;

  beforeEach(() => {
    mockRouter = mockNextRouter();
  });

  it('renders with basic props', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('Test Menu').should('be.visible');
    cy.get('[data-testid="test-icon"]').should('exist');
  });

  it('shows content when clicked', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    cy.get('button').click();
    cy.get('[data-testid="test-content"]').should('be.visible');
  });

  it('displays count badge when count is provided', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} count={5} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('5').should('be.visible');
  });

  it('does not show count badge when count is 0', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} count={0} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('0').should('not.exist');
  });

  it('rotates arrow icon when dropdown is toggled', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    // Initially arrow should point down
    cy.get('#arrow')
      .should('have.attr', 'style')
      .and('include', 'rotate(0deg)');

    // Click to open
    cy.get('button').click();
    cy.get('#arrow')
      .should('have.attr', 'style')
      .and('include', 'rotate(180deg)');

    // Click to close
    cy.get('button').click();
    cy.get('#arrow')
      .should('have.attr', 'style')
      .and('include', 'rotate(0deg)');
  });

  it('toggles content visibility multiple times', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    // First toggle
    cy.get('button').click();
    cy.get('[data-testid="test-content"]').should('be.visible');

    // Second toggle
    cy.get('button').click();
    cy.get('[data-testid="test-content"]').should('not.exist');

    // Third toggle
    cy.get('button').click();
    cy.get('[data-testid="test-content"]').should('be.visible');
  });

  it('persists state to localStorage when id is provided', () => {
    const testId = 'test-dropdown-id';

    // Clear storage before test
    window.localStorage.clear();

    // Spy on localStorage
    cy.spy(window.localStorage, 'setItem').as('setItem');
    cy.spy(window.localStorage, 'getItem').as('getItem');

    // 1. Mount and open
    cy.mount(
      <DropdownMenu
        label='Persist Test'
        icon={mockIcon}
        id={testId}
        testMode={true}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    // Initially closed
    cy.get('[data-testid="test-content"]').should('not.exist');

    // Open it
    cy.get('button').click();
    cy.get('[data-testid="test-content"]').should('be.visible');

    // Verify setItem was called
    cy.get('@setItem').should(
      'have.been.calledWith',
      `sidebar_open_${testId}`,
      'true',
    );

    // 2. Remount (simulate page reload)
    cy.mount(
      <DropdownMenu
        label='Persist Test'
        icon={mockIcon}
        id={testId}
        testMode={true}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    // Verify getItem was called
    cy.get('@getItem').should('have.been.calledWith', `sidebar_open_${testId}`);

    // Should be open immediately because of localStorage
    cy.get('[data-testid="test-content"]').should('be.visible');

    // 3. Close it
    cy.get('button').click();
    cy.get('@setItem').should(
      'have.been.calledWith',
      `sidebar_open_${testId}`,
      'false',
    );
  });
});
