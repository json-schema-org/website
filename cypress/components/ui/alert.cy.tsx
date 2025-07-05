import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert Component', () => {
  it('renders basic Alert component correctly', () => {
    cy.mount(<Alert>This is a basic alert message</Alert>);

    cy.get('[data-slot="alert"]').should('exist');
    cy.get('[role="alert"]').should('exist');
    cy.get('[data-slot="alert"]').contains('This is a basic alert message');
  });

  it('renders Alert with default variant correctly', () => {
    cy.mount(<Alert variant="default">Default alert message</Alert>);

    cy.get('[data-slot="alert"]').should('exist');
    cy.get('[data-slot="alert"]').should('have.class', 'bg-card');
    cy.get('[data-slot="alert"]').should('have.class', 'text-card-foreground');
  });

  it('renders Alert with destructive variant correctly', () => {
    cy.mount(<Alert variant="destructive">Destructive alert message</Alert>);

    cy.get('[data-slot="alert"]').should('exist');
    cy.get('[data-slot="alert"]').should('have.class', 'text-destructive');
    cy.get('[data-slot="alert"]').should('have.class', 'bg-card');
  });

  it('renders Alert with custom className correctly', () => {
    cy.mount(
      <Alert className="custom-alert-class">Alert with custom class</Alert>,
    );

    cy.get('[data-slot="alert"]').should('have.class', 'custom-alert-class');
  });

  it('renders Alert with AlertTitle correctly', () => {
    cy.mount(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        This is the alert description
      </Alert>,
    );

    cy.get('[data-slot="alert-title"]').should('exist');
    cy.get('[data-slot="alert-title"]').contains('Alert Title');
    cy.get('[data-slot="alert-title"]').should('have.class', 'font-medium');
  });

  it('renders Alert with AlertDescription correctly', () => {
    cy.mount(
      <Alert>
        <AlertDescription>This is an alert description</AlertDescription>
      </Alert>,
    );

    cy.get('[data-slot="alert-description"]').should('exist');
    cy.get('[data-slot="alert-description"]').contains(
      'This is an alert description',
    );
    cy.get('[data-slot="alert-description"]').should(
      'have.class',
      'text-muted-foreground',
    );
  });

  it('renders Alert with both AlertTitle and AlertDescription correctly', () => {
    cy.mount(
      <Alert>
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          This is a detailed description of the alert message.
        </AlertDescription>
      </Alert>,
    );

    cy.get('[data-slot="alert-title"]').should('exist');
    cy.get('[data-slot="alert-title"]').contains('Important Notice');
    cy.get('[data-slot="alert-description"]').should('exist');
    cy.get('[data-slot="alert-description"]').contains(
      'This is a detailed description of the alert message.',
    );
  });

  it('renders Alert with icon correctly', () => {
    cy.mount(
      <Alert>
        <svg data-testid="alert-icon" />
        <AlertTitle>Alert with Icon</AlertTitle>
        <AlertDescription>This alert has an icon</AlertDescription>
      </Alert>,
    );

    cy.get('[data-testid="alert-icon"]').should('exist');
    cy.get('[data-slot="alert"]').should('have.class', 'has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]');
  });

  it('renders destructive Alert with icon correctly', () => {
    cy.mount(
      <Alert variant="destructive">
        <svg data-testid="destructive-icon" />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This is a destructive alert with icon</AlertDescription>
      </Alert>,
    );

    cy.get('[data-testid="destructive-icon"]').should('exist');
    cy.get('[data-slot="alert"]').should('have.class', 'text-destructive');
    // Check that the alert description has the data-slot attribute and is styled appropriately
    cy.get('[data-slot="alert-description"]').should('exist');
    cy.get('[data-slot="alert-description"]').should('have.attr', 'data-slot', 'alert-description');
  });

  it('renders AlertTitle with custom className correctly', () => {
    cy.mount(
      <Alert>
        <AlertTitle className="custom-title-class">Custom Title</AlertTitle>
      </Alert>,
    );

    cy.get('[data-slot="alert-title"]').should('have.class', 'custom-title-class');
  });

  it('renders AlertDescription with custom className correctly', () => {
    cy.mount(
      <Alert>
        <AlertDescription className="custom-description-class">
          Custom Description
        </AlertDescription>
      </Alert>,
    );

    cy.get('[data-slot="alert-description"]').should('have.class', 'custom-description-class');
  });

  it('renders multiple Alert components correctly', () => {
    cy.mount(
      <div>
        <Alert variant="default" data-testid="alert-1">
          <AlertTitle>First Alert</AlertTitle>
          <AlertDescription>First alert description</AlertDescription>
        </Alert>
        <Alert variant="destructive" data-testid="alert-2">
          <AlertTitle>Second Alert</AlertTitle>
          <AlertDescription>Second alert description</AlertDescription>
        </Alert>
      </div>,
    );

    cy.get('[data-testid="alert-1"]').should('exist');
    cy.get('[data-testid="alert-1"] [data-slot="alert-title"]').contains('First Alert');
    cy.get('[data-testid="alert-2"]').should('exist');
    cy.get('[data-testid="alert-2"] [data-slot="alert-title"]').contains('Second Alert');
    cy.get('[data-testid="alert-2"]').should('have.class', 'text-destructive');
  });

  it('renders Alert with HTML content correctly', () => {
    cy.mount(
      <Alert>
        <AlertTitle>HTML Content Alert</AlertTitle>
        <AlertDescription>
          This alert contains <strong>bold text</strong> and <em>italic text</em>.
        </AlertDescription>
      </Alert>,
    );

    cy.get('[data-slot="alert-description"]').contains('bold text');
    cy.get('[data-slot="alert-description"]').contains('italic text');
    cy.get('[data-slot="alert-description"] strong').should('exist');
    cy.get('[data-slot="alert-description"] em').should('exist');
  });

  it('renders Alert with accessibility attributes correctly', () => {
    cy.mount(
      <Alert aria-label="Custom alert" data-testid="accessible-alert">
        <AlertTitle>Accessible Alert</AlertTitle>
        <AlertDescription>This alert has custom accessibility attributes</AlertDescription>
      </Alert>,
    );

    cy.get('[data-testid="accessible-alert"]').should('have.attr', 'aria-label', 'Custom alert');
    cy.get('[data-testid="accessible-alert"]').should('have.attr', 'role', 'alert');
  });
}); 