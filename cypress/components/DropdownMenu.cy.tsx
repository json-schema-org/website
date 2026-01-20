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

  it('syncs open state when controlled via isOpen prop', () => {
    const onToggle = cy.stub().as('onToggle');

    cy.mount(
      <DropdownMenu
        label='Test Menu'
        icon={mockIcon}
        isOpen={true}
        onToggle={onToggle}
        testMode={true}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    cy.get('[data-testid="test-content"]').should('be.visible');
  });

  it('calls onToggle when trigger is clicked in controlled mode', () => {
    const onToggle = cy.stub().as('onToggle');

    cy.mount(
      <DropdownMenu
        label='Test Menu'
        icon={mockIcon}
        isOpen={false}
        onToggle={onToggle}
        testMode={true}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    cy.get('button').click();
    cy.get('@onToggle').should('have.been.called');
  });

  it('works without onToggle prop (uncontrolled mode)', () => {
    cy.mount(
      <DropdownMenu label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('Test Menu').should('be.visible');
    cy.get('button').should('be.visible');
  });
});
