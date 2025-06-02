import React from 'react';
import { mount } from 'cypress/react18';
import SearchBar from '@/pages/tools/components/SearchBar';

describe('SearchBar Component', () => {
  const mockTransform = {
    query: '',
  };

  beforeEach(() => {
    mount(<SearchBar transform={mockTransform} />);
  });

  it('renders the search input', () => {
    cy.get('input[type="text"]').should('exist');
    cy.get('input[type="text"]').should('have.attr', 'placeholder', 'Search');
  });

  it('updates input value when typing', () => {
    const testQuery = 'test search';
    cy.get('input[type="text"]').type(testQuery);
    cy.get('input[type="text"]').should('have.value', testQuery);
  });

  it('updates when transform.query changes', () => {
    const newQuery = 'new search query';
    mount(<SearchBar transform={{ query: newQuery }} />);
    cy.get('input[type="text"]').should('have.value', newQuery);
  });
}); 