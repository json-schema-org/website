/* eslint-disable linebreak-style */
import React from 'react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with default variant and size', () => {
    cy.mount(<Button>Click me</Button>);

    cy.get('button')
      .should('have.class', 'bg-primary')
      .and('have.class', 'h-9')
      .and('have.class', 'px-4')
      .and('have.class', 'py-2');
  });

  it('renders with different variants', () => {
    cy.mount(
      <div className='flex gap-2'>
        <Button variant='default'>Default</Button>
        <Button variant='destructive'>Destructive</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='link'>Link</Button>
      </div>,
    );

    cy.get('button').eq(0).should('have.class', 'bg-primary');
    cy.get('button').eq(1).should('have.class', 'bg-destructive');
    cy.get('button').eq(2).should('have.class', 'border');
    cy.get('button').eq(3).should('have.class', 'bg-secondary');
    cy.get('button').eq(4).should('have.class', 'hover:bg-accent');
    cy.get('button').eq(5).should('have.class', 'text-primary');
  });

  it('renders with different sizes', () => {
    cy.mount(
      <div className='flex gap-2'>
        <Button size='default'>Default</Button>
        <Button size='sm'>Small</Button>
        <Button size='lg'>Large</Button>
        <Button size='icon'>Icon</Button>
      </div>,
    );

    cy.get('button').eq(0).should('have.class', 'h-9');
    cy.get('button').eq(1).should('have.class', 'h-8');
    cy.get('button').eq(2).should('have.class', 'h-10');
    cy.get('button').eq(3).should('have.class', 'size-9');
  });

  it('handles disabled state', () => {
    cy.mount(<Button disabled>Disabled Button</Button>);

    cy.get('button')
      .should('be.disabled')
      .and('have.class', 'disabled:opacity-50')
      .and('have.class', 'disabled:pointer-events-none');
  });

  it('renders with icon', () => {
    cy.mount(
      <Button>
        <svg data-testid='test-icon' />
        Button with Icon
      </Button>,
    );

    cy.get('button').should('have.class', 'has-[>svg]:px-3');
    cy.get('[data-testid="test-icon"]').should('exist');
  });

  it('applies custom className', () => {
    cy.mount(<Button className='custom-class'>Custom Button</Button>);

    cy.get('button').should('have.class', 'custom-class');
  });

  it('handles click events', () => {
    const onClickSpy = cy.spy().as('onClickSpy');

    cy.mount(<Button onClick={onClickSpy}>Click me</Button>);

    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('does not trigger click events when disabled', () => {
  const onClickSpy = cy.spy().as('onClickSpy');

  cy.mount(
    <Button disabled onClick={onClickSpy}>
      Disabled Button
    </Button>,
  );

  cy.get('button').click({ force: true });
  cy.get('@onClickSpy').should('not.have.been.called');
});

  it('renders as child component when asChild is true', () => {
    cy.mount(
      <Button asChild>
        <a href='#test'>Link Button</a>
      </Button>,
    );

    cy.get('a')
      .should('have.attr', 'href', '#test')
      .and('have.class', 'bg-primary');
  });
});
