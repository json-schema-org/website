import React from 'react';
import Radio from '@/pages/tools/components/ui/Radio';

describe('Radio Component', () => {
  it('renders with label and value', () => {
    cy.mount(
      <Radio
        label="Test Radio"
        value="test"
        selectedValue=""
        onChange={() => {}}
      />
    );

    cy.get('[role="radiogroup"]').should('exist');
    cy.get('[role="radio"]').should('exist');
    cy.contains('Test Radio').should('be.visible');
  });

  it('handles selection change', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    
    cy.mount(
      <Radio
        label="Test Radio"
        value="test"
        selectedValue=""
        onChange={onChangeSpy}
      />
    );

    cy.get('[role="radio"]').click();
    cy.get('@onChangeSpy').should('have.been.calledWith', 'test');
  });

  it('shows correct selected state', () => {
    cy.mount(
      <Radio
        label="Test Radio"
        value="test"
        selectedValue="test"
        onChange={() => {}}
      />
    );

    cy.get('[role="radio"]').should('have.attr', 'data-state', 'checked');
  });

  it('has correct styling classes', () => {
    cy.mount(
      <Radio
        label="Test Radio"
        value="test"
        selectedValue=""
        onChange={() => {}}
      />
    );

    cy.get('label').should('have.class', 'flex');
    cy.get('label').should('have.class', 'items-center');
    cy.get('label').should('have.class', 'gap-3');
    cy.get('label').should('have.class', 'px-4');
    cy.get('label').should('have.class', 'py-2');
  });

  it('maintains selection state when re-rendered', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    
    cy.mount(
      <Radio
        label="Test Radio"
        value="test"
        selectedValue=""
        onChange={onChangeSpy}
      />
    );

    // First click to select
    cy.get('[role="radio"]').click();
    cy.get('@onChangeSpy').should('have.been.calledWith', 'test');

    // Re-mount with the selected value
    cy.mount(
      <Radio
        label="Test Radio"
        value="test"
        selectedValue="test"
        onChange={onChangeSpy}
      />
    );

    // Verify the selection state is maintained
    cy.get('[role="radio"]').should('have.attr', 'data-state', 'checked');
  });
}); 