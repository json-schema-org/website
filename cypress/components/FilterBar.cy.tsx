import React from 'react';
import FilterBar from '~/pages/tools/components/FilterBar';
import {
  DEFAULT_TRANSFORM,
  type Transform,
} from '~/pages/tools/lib/transformTools';

const filterCriteria = {
  languages: ['.NET', 'JavaScript', 'TypeScript'],
  drafts: ['2020-12', '2019-09', '7'],
  toolingTypes: ['schema-to-code', 'validator'],
  licenses: ['MIT'],
  environments: ['CLI'],
};

const mountFilterBar = (transform: Partial<Transform> = {}) => {
  const setTransform = cy.stub().as('setTransform');
  const resetTransform = cy.stub().as('resetTransform');
  const onMoreFilters = cy.stub().as('onMoreFilters');

  cy.mount(
    <FilterBar
      filterCriteria={filterCriteria}
      transform={{ ...DEFAULT_TRANSFORM, ...transform }}
      setTransform={setTransform}
      resetTransform={resetTransform}
      onMoreFilters={onMoreFilters}
    />,
  );
};

describe('FilterBar Component', () => {
  it('offers a language, a dialect and a tool type to choose', () => {
    mountFilterBar();

    cy.get('select[name="languages"] option').then(($options) => {
      expect([...$options].map((option) => option.textContent)).to.deep.equal([
        'All languages',
        '.NET',
        'JavaScript',
        'TypeScript',
      ]);
    });
    cy.get('select[name="drafts"] option').then(($options) => {
      expect([...$options].map((option) => option.textContent)).to.deep.equal([
        'All dialects',
        'Draft 2020-12',
        'Draft 2019-09',
        'Draft 7',
      ]);
    });
    cy.get('select[name="toolingTypes"] option').then(($options) => {
      expect([...$options].map((option) => option.textContent)).to.deep.equal([
        'All tool types',
        'Schema To Code',
        'Validator',
      ]);
    });
    cy.contains('label', 'Language').should(
      'have.attr',
      'for',
      'tools-filter-languages',
    );
  });

  it('starts out showing everything', () => {
    mountFilterBar();

    cy.get('select[name="languages"]').should('have.value', '');
    cy.get('select[name="drafts"]').should('have.value', '');
    cy.get('select[name="toolingTypes"]').should('have.value', '');
    cy.get('[data-test="tools-reset-filters"]').should('not.exist');
  });

  it('filters by the chosen language, dialect and tool type', () => {
    mountFilterBar();

    cy.get('select[name="languages"]').select('JavaScript');
    cy.get('@setTransform').should('have.been.calledWith', {
      languages: ['JavaScript'],
    });

    cy.get('select[name="drafts"]').select('Draft 2020-12');
    cy.get('@setTransform').should('have.been.calledWith', {
      drafts: ['2020-12'],
    });

    cy.get('select[name="toolingTypes"]').select('Validator');
    cy.get('@setTransform').should('have.been.calledWith', {
      toolingTypes: ['validator'],
    });
  });

  it('shows what is being filtered by, and clears a filter', () => {
    mountFilterBar({ languages: ['javascript'], drafts: ['7'] });

    cy.get('select[name="languages"]').should('have.value', 'JavaScript');
    cy.get('select[name="drafts"]').should('have.value', '7');

    cy.get('select[name="languages"]').select('All languages');
    cy.get('@setTransform').should('have.been.calledWith', { languages: [] });
  });

  it('says when several values have been selected in the drawer', () => {
    mountFilterBar({ languages: ['JavaScript', 'TypeScript'] });

    cy.get('select[name="languages"] option:selected').should(
      'have.text',
      '2 selected',
    );
  });

  it('searches as you type, without filling up the history', () => {
    mountFilterBar();

    cy.get('input[name="query"]').type('ajv');
    cy.get('@setTransform').should(
      'have.been.calledOnceWith',
      { query: 'ajv' },
      { history: 'replace' },
    );
  });

  it('opens the drawer with the rest of the filters', () => {
    mountFilterBar();

    cy.get('[data-test="tools-more-filters"]').click();
    cy.get('@onMoreFilters').should('have.been.calledOnce');
  });

  it('resets the filters once there are some', () => {
    mountFilterBar({ toolingTypes: ['validator'] });

    cy.get('[data-test="tools-reset-filters"]').click();
    cy.get('@resetTransform').should('have.been.calledOnce');
  });
});
