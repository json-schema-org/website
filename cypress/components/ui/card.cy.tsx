// card.cy.tsx

import React from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

describe('Card Component', () => {
  it('renders all Card subcomponents correctly', () => {
    cy.mount(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardDescription>Description here</CardDescription>
        <CardContent>Content goes here</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    cy.get('[data-slot="card"]').should('exist');
    cy.get('[data-slot="card-header"]').should('exist');
    cy.get('[data-slot="card-title"]').contains('Test Title');
    cy.get('[data-slot="card-action"]').contains('Action');
    cy.get('[data-slot="card-description"]').contains('Description here');
    cy.get('[data-slot="card-content"]').contains('Content goes here');
    cy.get('[data-slot="card-footer"]').contains('Footer');
  });
});
