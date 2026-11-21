import React from 'react';
import { mount } from 'cypress/react18';
import SearchBar from '@/pages/tools/components/SearchBar';
import type { Transform } from '@/pages/tools/hooks/useToolsTransform';

describe('SearchBar Component', () => {
  const mockTransform: Transform = {
    query: '',
    sortBy: 'name',
    sortOrder: 'ascending',
    groupBy: 'toolingTypes',
    licenses: [],
    languages: [],
    drafts: [],
    toolingTypes: [],
    environments: [],
    showObsolete: 'false',
    supportsBowtie: 'false',
  };

  beforeEach(() => {
    mount(<SearchBar transform={mockTransform} />);
  });

  it('renders the search input', () => {
    cy.get('input[type="search"]').should('exist');
    cy.get('input[type="search"]').should(
      'have.attr',
      'placeholder',
      'Search by name',
    );
  });

  it('updates input value when typing', () => {
    const testQuery = 'test search';
    cy.get('input[type="search"]').type(testQuery);
    cy.get('input[type="search"]').should('have.value', testQuery);
  });

  it('updates when transform.query changes', () => {
    const newQuery = 'new search query';
    mount(<SearchBar transform={{ ...mockTransform, query: newQuery }} />);
    cy.get('input[type="search"]').should('have.value', newQuery);
  });

  it('reports each change as it is typed', () => {
    const onQueryChange = cy.stub().as('onQueryChange');
    mount(
      <SearchBar transform={mockTransform} onQueryChange={onQueryChange} />,
    );

    cy.get('input[type="search"]').type('ab');
    cy.get('@onQueryChange').should('have.been.calledTwice');
    cy.get('@onQueryChange').should('have.been.calledWith', 'ab');
  });

  it('waits for a pause in typing when debounced', () => {
    const onQueryChange = cy.stub().as('onQueryChange');
    mount(
      <SearchBar
        transform={mockTransform}
        onQueryChange={onQueryChange}
        debounce={200}
      />,
    );

    cy.get('input[type="search"]').type('schema');
    cy.get('@onQueryChange').should('have.been.calledOnceWith', 'schema');
  });

  it('keeps what is being typed when its own change comes back', () => {
    const Harness = () => {
      const [transform, setTransform] = React.useState(mockTransform);

      return (
        <>
          <SearchBar
            transform={transform}
            debounce={50}
            onQueryChange={(query) =>
              // The page takes a moment to reflect a change in its URL
              setTimeout(() => setTransform({ ...transform, query }), 100)
            }
          />
          <button onClick={() => setTransform(mockTransform)}>Reset</button>
        </>
      );
    };
    cy.clock();
    mount(<Harness />);

    cy.get('input[type="search"]').type('json', { delay: 0 });
    // "json" has been reported, but is not back yet when more is typed
    cy.tick(60);
    cy.get('input[type="search"]').type(' schema', { delay: 0 });
    cy.tick(100);
    cy.get('input[type="search"]').should('have.value', 'json schema');
    cy.tick(500);
    cy.get('input[type="search"]').should('have.value', 'json schema');

    cy.contains('button', 'Reset').click();
    cy.get('input[type="search"]').should('have.value', '');
  });
});
