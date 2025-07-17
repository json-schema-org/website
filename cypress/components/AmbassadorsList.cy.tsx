import React from 'react';
import AmbassadorList from '../../components/AmbassadorsList';

const mockAmbassadorList = {
  contents: [
    {
      title: 'Community Building',
      icon: '/img/community/community-icon.svg',
      details:
        'Help build and grow the JSON Schema community through events, meetups, and online engagement.',
    },
    {
      title: 'Documentation',
      icon: '/img/community/docs-icon.svg',
      details:
        'Contribute to documentation, tutorials, and educational content to help others learn JSON Schema.',
    },
    {
      title: 'Technical Support',
      icon: '/img/community/support-icon.svg',
      details:
        'Provide technical support and guidance to community members on JSON Schema implementation.',
    },
  ],
};

const singleAmbassadorList = {
  contents: [
    {
      title: 'Single Ambassador',
      icon: '/img/community/single-icon.svg',
      details: 'This is a single ambassador test item.',
    },
  ],
};

describe('AmbassadorList Component', () => {
  beforeEach(() => {
    // Mock image loading
    cy.intercept('GET', '/img/community/*', {
      statusCode: 200,
      body: 'mocked-image-data',
    }).as('imageLoad');
  });

  it('should render the ambassador list with correct content', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check that all ambassador items are rendered
    cy.contains('Community Building').should('exist');
    cy.contains('Documentation').should('exist');
    cy.contains('Technical Support').should('exist');

    // Check details text
    cy.contains('Help build and grow the JSON Schema community').should(
      'exist',
    );
    cy.contains('Contribute to documentation, tutorials').should('exist');
    cy.contains('Provide technical support and guidance').should('exist');
  });

  it('should render images with correct attributes', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check that images are rendered
    cy.get('img').should('have.length', 3);

    // Check image attributes
    cy.get('img')
      .first()
      .should('have.attr', 'src', '/img/community/community-icon.svg');
    cy.get('img').first().should('have.attr', 'alt', 'Community Building');
    cy.get('img').first().should('have.class', 'w-[150px]');
    cy.get('img').first().should('have.class', 'object-contain');
  });

  it('should have proper grid layout', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check grid container
    cy.get('ul').should('have.class', 'grid');
    cy.get('ul').should('have.class', 'grid-cols-1');
    cy.get('ul').should('have.class', 'sm:grid-cols-2');
    cy.get('ul').should('have.class', 'lg:grid-cols-3');
    cy.get('ul').should('have.class', 'xl:grid-cols-3');
    cy.get('ul').should('have.class', 'gap-8');
  });

  it('should have proper card styling', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check card elements
    cy.get('[data-slot="card"]').should('have.length', 3);
    cy.get('[data-slot="card"]').first().should('have.class', 'w-full');
    cy.get('[data-slot="card"]').first().should('have.class', 'h-full');
    cy.get('[data-slot="card"]').first().should('have.class', 'bg-white');
    cy.get('[data-slot="card"]')
      .first()
      .should('have.class', 'dark:bg-gray-800');
    cy.get('[data-slot="card"]').first().should('have.class', 'rounded-lg');
    cy.get('[data-slot="card"]').first().should('have.class', 'shadow-lg');
  });

  it('should have proper hover animations', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check hover effects
    cy.get('[data-slot="card"]').first().should('have.class', 'transform');
    cy.get('[data-slot="card"]').first().should('have.class', 'transition');
    cy.get('[data-slot="card"]')
      .first()
      .should('have.class', 'hover:scale-105');
  });

  it('should have proper text styling', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check title styling
    cy.get('[data-slot="card-title"]').first().should('have.class', 'text-lg');
    cy.get('[data-slot="card-title"]')
      .first()
      .should('have.class', 'md:text-xl');
    cy.get('[data-slot="card-title"]')
      .first()
      .should('have.class', 'font-semibold');
    cy.get('[data-slot="card-title"]')
      .first()
      .should('have.class', 'text-gray-900');
    cy.get('[data-slot="card-title"]')
      .first()
      .should('have.class', 'dark:text-white');

    // Check description styling
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'text-sm');
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'md:text-base');
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'text-gray-700');
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'dark:text-slate-100');
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'leading-relaxed');
  });

  it('should have proper spacing and layout', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check container spacing
    cy.get('ul').should('have.class', 'mt-10');
    cy.get('ul').should('have.class', 'px-5');

    // Check card padding
    cy.get('[data-slot="card"]').first().should('have.class', 'p-5');

    // Check content spacing
    cy.get('[data-slot="card-content"]').first().should('have.class', 'p-0');
  });

  it('should have proper accessibility attributes', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check test ID
    cy.get('[data-testid="Ambassadors-list"]').should('have.length', 3);

    // Check image alt text
    cy.get('img').first().should('have.attr', 'alt', 'Community Building');
    cy.get('img').eq(1).should('have.attr', 'alt', 'Documentation');
    cy.get('img').last().should('have.attr', 'alt', 'Technical Support');
  });

  it('should handle single ambassador item', () => {
    cy.mount(<AmbassadorList ambassadorList={singleAmbassadorList} />);

    // Check single item rendering
    cy.contains('Single Ambassador').should('exist');
    cy.contains('This is a single ambassador test item.').should('exist');

    // Check that only one card is rendered
    cy.get('[data-slot="card"]').should('have.length', 1);
    cy.get('img').should('have.length', 1);
  });

  it('should have proper dark mode support', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check dark mode classes
    cy.get('[data-slot="card"]')
      .first()
      .should('have.class', 'dark:bg-gray-800');
    cy.get('[data-slot="card"]')
      .first()
      .should('have.class', 'dark:border-gray-700');

    // Check text colors for dark mode
    cy.get('[data-slot="card-title"]')
      .first()
      .should('have.class', 'dark:text-white');
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'dark:text-slate-100');
  });

  it('should have proper responsive design', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check responsive grid classes
    cy.get('ul').should('have.class', 'grid-cols-1');
    cy.get('ul').should('have.class', 'sm:grid-cols-2');
    cy.get('ul').should('have.class', 'lg:grid-cols-3');
    cy.get('ul').should('have.class', 'xl:grid-cols-3');

    // Check responsive text sizing
    cy.get('[data-slot="card-title"]').first().should('have.class', 'text-lg');
    cy.get('[data-slot="card-title"]')
      .first()
      .should('have.class', 'md:text-xl');

    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'text-sm');
    cy.get('[data-slot="card-description"]')
      .first()
      .should('have.class', 'md:text-base');
  });

  it('should have proper image sizing and positioning', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check image container
    cy.get('img').first().should('have.class', 'w-[150px]');
    cy.get('img').first().should('have.class', 'h-auto');
    cy.get('img').first().should('have.class', 'object-contain');
    cy.get('img').first().should('have.class', 'mb-5');
    cy.get('img').first().should('have.class', 'mx-auto');
  });

  it('should have proper list item structure', () => {
    cy.mount(<AmbassadorList ambassadorList={mockAmbassadorList} />);

    // Check list item structure
    cy.get('li').should('have.length', 3);
    cy.get('li').first().should('have.class', 'flex');
    cy.get('li').first().should('have.class', 'flex-col');
    cy.get('li').first().should('have.class', 'items-center');
    cy.get('li').first().should('have.class', 'text-center');
  });
});
