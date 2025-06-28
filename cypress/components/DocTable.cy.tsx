import React from 'react';
import DocTable from '~/components/DocTable';

interface DocTableProps {
  frontmatter: {
    Specification: string;
    Published: string;
    authors: string[];
    Metaschema: string;
  };
}

const mockFrontmatter: DocTableProps['frontmatter'] = {
  Specification: 'https://json-schema.org/draft/2020-12/schema',
  Published: '2021-12-01',
  authors: ['John Doe', 'Jane Smith', 'Bob Johnson'],
  Metaschema: 'https://json-schema.org/draft/2020-12/meta/core',
};

const mockFrontmatterSingleAuthor: DocTableProps['frontmatter'] = {
  Specification: 'https://json-schema.org/draft/2019-09/schema',
  Published: '2019-09-01',
  authors: ['Single Author'],
  Metaschema: 'https://json-schema.org/draft/2019-09/meta/core',
};

describe('DocTable Component', () => {
  // Render the DocTable component with multiple authors
  it('should render DocTable correctly with multiple authors', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check if the header is rendered correctly
    cy.get('[data-slot="card-title"]').should('have.text', 'Specification Details');
    
    // Check if all table rows are rendered
    cy.get('[data-slot="card-content"]').within(() => {
      // Check Specification row
      cy.contains('Specification').should('exist');
      cy.get('a[href="https://json-schema.org/draft/2020-12/schema"]')
        .should('exist')
        .and('have.text', 'https://json-schema.org/draft/2020-12/schema');
      
      // Check Published row
      cy.contains('Published').should('exist');
      cy.contains('2021-12-01').should('exist');
      
      // Check Authors row
      cy.contains('Authors').should('exist');
      cy.contains('John Doe, Jane Smith, Bob Johnson').should('exist');
      
      // Check Metaschema row
      cy.contains('Metaschema').should('exist');
      cy.get('a[href="https://json-schema.org/draft/2020-12/meta/core"]')
        .should('exist')
        .and('have.text', 'https://json-schema.org/draft/2020-12/meta/core');
    });
  });

  // Render the DocTable component with single author
  it('should render DocTable correctly with single author', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatterSingleAuthor} />);
    
    // Check if the header is rendered correctly
    cy.get('[data-slot="card-title"]').should('have.text', 'Specification Details');
    
    // Check Authors row with single author
    cy.contains('Authors').should('exist');
    cy.contains('Single Author').should('exist');
    
    // Verify no comma is added for single author
    cy.get('[data-slot="card-content"]').should('not.contain', 'Single Author,');
  });

  // Test link functionality
  it('should have working external links', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check that links have correct attributes
    cy.get('a[href="https://json-schema.org/draft/2020-12/schema"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
    
    cy.get('a[href="https://json-schema.org/draft/2020-12/meta/core"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  // Test styling classes
  it('should have correct styling classes', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check card styling
    cy.get('[data-slot="card"]')
      .should('have.class', 'w-full')
      .and('have.class', 'overflow-hidden')
      .and('have.class', 'border-2')
      .and('have.class', 'border-primary')
      .and('have.class', 'shadow-lg');
    
    // Check header styling
    cy.get('[data-slot="card-header"]')
      .should('have.class', 'bg-primary')
      .and('have.class', 'text-primary-foreground');
    
    // Check title styling
    cy.get('[data-slot="card-title"]')
      .should('have.class', 'text-xl')
      .and('have.class', 'font-semibold');
    
    // Check content styling
    cy.get('[data-slot="card-content"]').should('have.class', 'p-0');
  });

  // Test label styling
  it('should have correct label styling', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check that all labels have the correct styling
    cy.get('[data-slot="card-content"]').within(() => {
      cy.contains('Specification').should('have.class', 'font-semibold').and('have.class', 'text-base');
      cy.contains('Published').should('have.class', 'font-semibold').and('have.class', 'text-base');
      cy.contains('Authors').should('have.class', 'font-semibold').and('have.class', 'text-base');
      cy.contains('Metaschema').should('have.class', 'font-semibold').and('have.class', 'text-base');
    });
  });

  // Test link styling
  it('should have correct link styling', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check that links have the correct styling
    cy.get('a[href="https://json-schema.org/draft/2020-12/schema"]')
      .should('have.class', 'text-primary')
      .and('have.class', 'hover:underline');
    
    cy.get('a[href="https://json-schema.org/draft/2020-12/meta/core"]')
      .should('have.class', 'text-primary')
      .and('have.class', 'hover:underline');
  });

  // Test responsive layout
  it('should have correct responsive layout', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check that the layout uses flexbox with correct width distribution
    cy.get('[data-slot="card-content"]').within(() => {
      cy.get('.flex').should('have.length', 4); // 4 rows
      
      // Check that each row has the correct width distribution
      cy.get('[class*="w-1/3"]').should('have.length', 4); // 4 label columns
      cy.get('[class*="w-2/3"]').should('have.length', 4); // 4 value columns
    });
  });

  // Test border styling
  it('should have correct border styling', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check that rows have border separators
    cy.get('[data-slot="card-content"]').within(() => {
      cy.get('.border-b').should('have.length', 3); // 3 rows with bottom borders
    });
  });

  // Test background styling
  it('should have correct background styling', () => {
    cy.mount(<DocTable frontmatter={mockFrontmatter} />);
    
    // Check the background color classes
    cy.get('[data-slot="card-content"]').within(() => {
      cy.get('.bg-\\[\\#e2e8f0\\]').should('exist');
    });
  });
}); 