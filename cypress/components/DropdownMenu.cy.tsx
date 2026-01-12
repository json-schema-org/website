/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import DropdownMenu from '@/pages/tools/components/ui/DropdownMenu';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

const DropdownMenuWrapper = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  label: string;
  icon: React.ReactElement;
  testMode?: boolean;
  count?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu {...props} isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
    </DropdownMenu>
  );
};

describe('DropdownMenu Component', () => {
  let mockRouter: MockRouter;
  const mockIcon = <svg data-testid='test-icon' />;
  const mockChildren = <div data-testid='test-content'>Test Content</div>;

  beforeEach(() => {
    mockRouter = mockNextRouter();
  });

  it('renders with basic props', () => {
    cy.mount(
      <DropdownMenu
        label='Test Menu'
        icon={mockIcon}
        testMode={true}
        isOpen={false}
        onOpenChange={cy.stub()}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('Test Menu').should('be.visible');
    cy.get('[data-testid="test-icon"]').should('exist');
  });

  it('shows content when clicked', () => {
    cy.mount(
      <DropdownMenuWrapper label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenuWrapper>,
    );

    cy.get('button').click();
    cy.get('[data-testid="test-content"]').should('be.visible');
  });

  it('displays count badge when count is provided', () => {
    cy.mount(
      <DropdownMenu
        label='Test Menu'
        icon={mockIcon}
        count={5}
        testMode={true}
        isOpen={false}
        onOpenChange={cy.stub()}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('5').should('be.visible');
  });

  it('does not show count badge when count is 0', () => {
    cy.mount(
      <DropdownMenu
        label='Test Menu'
        icon={mockIcon}
        count={0}
        testMode={true}
        isOpen={false}
        onOpenChange={cy.stub()}
      >
        {mockChildren}
      </DropdownMenu>,
    );

    cy.contains('0').should('not.exist');
  });

  it('rotates arrow icon when dropdown is toggled', () => {
    cy.mount(
      <DropdownMenuWrapper label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenuWrapper>,
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
      <DropdownMenuWrapper label='Test Menu' icon={mockIcon} testMode={true}>
        {mockChildren}
      </DropdownMenuWrapper>,
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
});
