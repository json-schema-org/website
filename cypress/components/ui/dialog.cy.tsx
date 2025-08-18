import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

describe('Dialog Component', () => {
  it('renders Dialog with all subcomponents correctly', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog Title</DialogTitle>
            <DialogDescription>
              This is a test dialog description
            </DialogDescription>
          </DialogHeader>
          <div>Dialog content goes here</div>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    // Dialog root doesn't render visible DOM elements, so we test the content instead
    cy.get('[data-slot="dialog-content"]').should('exist');
    cy.get('[data-slot="dialog-header"]').should('exist');
    cy.get('[data-slot="dialog-title"]').should('exist');
    cy.get('[data-slot="dialog-description"]').should('exist');
    cy.get('[data-slot="dialog-footer"]').should('exist');
  });

  it('renders Dialog with custom className correctly', () => {
    cy.mount(
      <Dialog open>
        <DialogContent className='custom-dialog-class'>
          <DialogTitle>Custom Dialog</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-content"]').should(
      'have.class',
      'custom-dialog-class',
    );
  });

  it('renders Dialog with showCloseButton=false', () => {
    cy.mount(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No Close Button</DialogTitle>
          <div>Content without close button</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-close"]').should('not.exist');
  });

  it('renders Dialog with showCloseButton=true (default)', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>With Close Button</DialogTitle>
          <div>Content with close button</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-close"]').should('exist');
    cy.get('[data-slot="dialog-close"]').should('contain.text', 'Close');
  });

  it('renders DialogTitle with correct styling', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-title"]')
      .should('exist')
      .and('contain.text', 'Test Title')
      .and('have.class', 'text-lg')
      .and('have.class', 'font-semibold');
  });

  it('renders DialogDescription with correct styling', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Test Description</DialogDescription>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-description"]')
      .should('exist')
      .and('contain.text', 'Test Description')
      .and('have.class', 'text-sm')
      .and('have.class', 'text-muted-foreground');
  });

  it('renders DialogHeader with correct styling', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogHeader className='custom-header-class'>
            <DialogTitle>Header Test</DialogTitle>
            <DialogDescription>Header description</DialogDescription>
          </DialogHeader>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-header"]')
      .should('exist')
      .and('have.class', 'custom-header-class')
      .and('have.class', 'flex')
      .and('have.class', 'flex-col')
      .and('have.class', 'gap-2');
  });

  it('renders DialogFooter with correct styling', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Footer Test</DialogTitle>
          <div>Content</div>
          <DialogFooter className='custom-footer-class'>
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-footer"]')
      .should('exist')
      .and('have.class', 'custom-footer-class')
      .and('have.class', 'flex')
      .and('have.class', 'flex-col-reverse')
      .and('have.class', 'gap-2');
  });

  it('renders DialogOverlay with correct styling', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Overlay Test</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-overlay"]')
      .should('exist')
      .and('have.class', 'fixed')
      .and('have.class', 'inset-0')
      .and('have.class', 'z-50')
      .and('have.class', 'bg-black/50');
  });

  it('renders DialogContent with correct positioning and styling', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Content Test</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-content"]')
      .should('exist')
      .and('have.class', 'fixed')
      .and('have.class', 'top-[50%]')
      .and('have.class', 'left-[50%]')
      .and('have.class', 'z-50')
      .and('have.class', 'rounded-lg')
      .and('have.class', 'border')
      .and('have.class', 'shadow-lg');
  });

  it('renders DialogTrigger correctly', () => {
    cy.mount(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Triggered Dialog</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-trigger"]')
      .should('exist')
      .and('contain.text', 'Open Dialog');
  });

  it('renders DialogClose button with correct styling and accessibility', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Close Button Test</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-close"]')
      .should('exist')
      .and('have.class', 'absolute')
      .and('have.class', 'top-4')
      .and('have.class', 'right-4')
      .and('have.class', 'rounded-xs');

    // Check for screen reader text
    cy.get('[data-slot="dialog-close"]').should('contain.text', 'Close');
  });

  it('applies custom className to DialogContent', () => {
    cy.mount(
      <Dialog open>
        <DialogContent className='my-custom-dialog'>
          <DialogTitle>Custom Class Test</DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-content"]').should(
      'have.class',
      'my-custom-dialog',
    );
  });

  it('applies custom className to DialogHeader', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogHeader className='my-custom-header'>
            <DialogTitle>Custom Header Class</DialogTitle>
          </DialogHeader>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-header"]').should(
      'have.class',
      'my-custom-header',
    );
  });

  it('applies custom className to DialogFooter', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Custom Footer Class</DialogTitle>
          <div>Content</div>
          <DialogFooter className='my-custom-footer'>
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-footer"]').should(
      'have.class',
      'my-custom-footer',
    );
  });

  it('applies custom className to DialogTitle', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle className='my-custom-title'>
            Custom Title Class
          </DialogTitle>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-title"]').should(
      'have.class',
      'my-custom-title',
    );
  });

  it('applies custom className to DialogDescription', () => {
    cy.mount(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription className='my-custom-description'>
            Custom Description Class
          </DialogDescription>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    cy.get('[data-slot="dialog-description"]').should(
      'have.class',
      'my-custom-description',
    );
  });
});
