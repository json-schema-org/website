/* eslint-disable quotes */
import React from 'react';
import AmbassadorBanner from '../../components/AmbassadorsBanner';

describe('AmbassadorBanner Component', () => {
  beforeEach(() => {
    // Mock window.open for external links
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('should render the banner with correct content', () => {
    cy.mount(<AmbassadorBanner />);

    // Check main heading
    cy.contains('Become a JSON Schema Ambassador').should('exist');

    // Check description text
    cy.contains(
      'The JSON Schema Ambassador program is now open for applications',
    ).should('exist');
    cy.contains(
      "you'll join JSON Schema's mission of helping community members",
    ).should('exist');

    // Check buttons
    cy.contains('Become Ambassador').should('exist');
    cy.contains('Learn More').should('exist');
  });

  it('should have proper link functionality', () => {
    cy.mount(<AmbassadorBanner />);

    // Check Become Ambassador link
    cy.get('a[href*="become-a-json-schema-ambassador"]')
      .should('exist')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');

    // Check Learn More link
    cy.get('a[href*="programs/ambassadors"]')
      .should('exist')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('should have proper styling and layout', () => {
    cy.mount(<AmbassadorBanner />);

    // Check card container
    cy.get('[data-slot="card"]').should('exist');

    // Check responsive classes
    cy.get('[data-slot="card"]').should('have.class', 'w-full');
    cy.get('[data-slot="card"]').should('have.class', 'sm:w-5/6');
    cy.get('[data-slot="card"]').should('have.class', 'md:w-4/5');
    cy.get('[data-slot="card"]').should('have.class', 'lg:w-2/3');
    cy.get('[data-slot="card"]').should('have.class', 'xl:w-1/2');

    // Check hover effects (these are custom classes, not shadcn defaults)
    cy.get('[data-slot="card"]').should('have.class', 'hover:bg-slate-100');
    cy.get('[data-slot="card"]')
      .invoke('attr', 'class')
      .should('include', 'hover:dark:bg-slate-900/30');
  });

  it('should have proper button styling', () => {
    cy.mount(<AmbassadorBanner />);

    // Check Become Ambassador button styling (renders as anchor with button classes)
    cy.get('a[href*="become-a-json-schema-ambassador"]').should(
      'have.class',
      'bg-blue-600',
    );
    cy.get('a[href*="become-a-json-schema-ambassador"]').should(
      'have.class',
      'hover:bg-blue-700',
    );
    cy.get('a[href*="become-a-json-schema-ambassador"]').should(
      'have.class',
      'text-white',
    );

    // Check Learn More button styling (renders as anchor with secondary variant)
    cy.get('a[href*="programs/ambassadors"]').should(
      'have.class',
      'bg-gray-300',
    );
    cy.get('a[href*="programs/ambassadors"]').should(
      'have.class',
      'hover:bg-gray-400',
    );
    cy.get('a[href*="programs/ambassadors"]').should(
      'have.class',
      'text-slate-700',
    );
  });

  it('should have proper grid layout for buttons', () => {
    cy.mount(<AmbassadorBanner />);

    // Check button container grid
    cy.get('a[href*="become-a-json-schema-ambassador"]')
      .parent()
      .should('have.class', 'grid');
    cy.get('a[href*="become-a-json-schema-ambassador"]')
      .parent()
      .should('have.class', 'grid-cols-1');
    cy.get('a[href*="become-a-json-schema-ambassador"]')
      .parent()
      .should('have.class', 'sm:grid-cols-2');
    cy.get('a[href*="become-a-json-schema-ambassador"]')
      .parent()
      .should('have.class', 'gap-4');
  });

  it('should have proper accessibility attributes', () => {
    cy.mount(<AmbassadorBanner />);

    // Check that links have proper attributes (Button with asChild renders as anchor)
    cy.get('a[href*="become-a-json-schema-ambassador"]').should(
      'have.attr',
      'target',
      '_blank',
    );
    cy.get('a[href*="become-a-json-schema-ambassador"]').should(
      'have.attr',
      'rel',
      'noopener noreferrer',
    );
    cy.get('a[href*="programs/ambassadors"]').should(
      'have.attr',
      'target',
      '_blank',
    );
    cy.get('a[href*="programs/ambassadors"]').should(
      'have.attr',
      'rel',
      'noopener noreferrer',
    );
  });

  it('should have proper dark mode support', () => {
    cy.mount(<AmbassadorBanner />);

    // Check dark mode classes
    cy.get('[data-slot="card"]').should('have.class', 'dark:bg-slate-800');
    cy.get('[data-slot="card"]').should('have.class', 'dark:shadow-slate-900');

    // Check text colors for dark mode
    cy.get('[data-slot="card-title"]').should(
      'have.class',
      'dark:text-slate-100',
    );
    cy.get('[data-slot="card-description"]').should(
      'have.class',
      'dark:text-slate-100',
    );
  });

  it('should have proper text sizing and responsive design', () => {
    cy.mount(<AmbassadorBanner />);

    // Check responsive text sizing
    cy.get('[data-slot="card-title"]').should('have.class', 'text-xl');
    cy.get('[data-slot="card-title"]').should('have.class', 'sm:text-2xl');
    cy.get('[data-slot="card-title"]').should('have.class', 'md:text-3xl');

    cy.get('[data-slot="card-description"]').should('have.class', 'text-sm');
    cy.get('[data-slot="card-description"]').should(
      'have.class',
      'sm:text-base',
    );
    cy.get('[data-slot="card-description"]').should('have.class', 'md:text-lg');
  });

  it('should have proper spacing and margins', () => {
    cy.mount(<AmbassadorBanner />);

    // Check container spacing - target the component's outer container
    cy.get('[data-slot="card"]').parent().should('have.class', 'mx-4');
    cy.get('[data-slot="card"]').parent().should('have.class', 'sm:mx-6');
    cy.get('[data-slot="card"]').parent().should('have.class', 'md:mx-10');
    cy.get('[data-slot="card"]').parent().should('have.class', 'my-8');

    // Check card padding
    cy.get('[data-slot="card"]').should('have.class', 'p-6');
    cy.get('[data-slot="card"]').should('have.class', 'sm:p-8');
  });

  it('should have proper border and shadow styling', () => {
    cy.mount(<AmbassadorBanner />);

    // Check border
    cy.get('[data-slot="card"]').should('have.class', 'border');
    cy.get('[data-slot="card"]').should('have.class', 'border-gray-200');
    cy.get('[data-slot="card"]').should('have.class', 'rounded-lg');

    // Check shadows
    cy.get('[data-slot="card"]').should('have.class', 'shadow-3xl');
    cy.get('[data-slot="card"]').should('have.class', 'dark:shadow-2xl');
  });
});
