import React from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../../components/ui/collapsible';

describe('Collapsible Component', () => {
  it('should render and toggle content', () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
    };

    cy.mount(<TestComponent />);

    cy.contains('Toggle').should('exist');
    cy.contains('Content').should('not.exist'); // Initially closed

    cy.contains('Toggle').click();
    cy.contains('Content').should('exist'); // Open

    cy.contains('Toggle').click();
    cy.contains('Content').should('not.exist'); // Closed
  });
});
