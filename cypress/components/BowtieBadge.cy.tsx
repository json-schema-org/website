import React from 'react';
import BowtieBadge from '~/pages/tools/components/BowtieBadge';
import type { BowtieImplementation } from '~/pages/tools/JSONSchemaTool';
import type {
  BowtieBadgeData,
  BowtieResult,
  ToolBowtieInfo,
} from '~/pages/tools/lib/bowtie';

const implementation = (id: string): BowtieImplementation => ({
  id,
  name: id,
  language: 'javascript',
  source: 'https://example.com',
  dialects: ['https://json-schema.org/draft/2020-12/schema'],
});

const result = (
  id: string,
  badge: BowtieBadgeData | null | undefined,
): BowtieResult => ({
  implementation: implementation(id),
  draft: '2020-12',
  badgeUrl: `https://bowtie.report/badges/${id}/compliance/draft2020-12.json`,
  badge,
  compliance: null,
});

const tested = (result: BowtieResult): ToolBowtieInfo => ({
  kind: 'tested',
  implementation: result.implementation,
  draft: '2020-12',
  result,
});

const passing: BowtieBadgeData = {
  label: 'Draft 2020-12',
  message: '98% Passing',
  color: '016300',
};

describe('BowtieBadge Component', () => {
  it('shows the compliance badge as a link to the report on Bowtie', () => {
    cy.mount(<BowtieBadge info={tested(result('js-ajv', passing))} />);

    cy.get('[data-test="bowtie-badge-result"]')
      .should(
        'have.attr',
        'href',
        'https://bowtie.report/#/implementations/js-ajv',
      )
      .and('have.attr', 'target', '_blank')
      .and('contain.text', 'Draft 2020-12')
      .and('contain.text', '98% Passing');
    cy.contains('span', '98% Passing').should(
      'have.css',
      'background-color',
      'rgb(1, 99, 0)',
    );
  });

  it('does not open the row it is in when followed', () => {
    const onRowClick = cy.stub().as('rowClick');
    cy.mount(
      <div onClick={onRowClick}>
        <BowtieBadge info={tested(result('js-ajv', passing))} />
      </div>,
    );

    // Stay on the page: only where the click ends up is of interest
    cy.get('[data-test="bowtie-badge-result"]').then(($link) => {
      $link[0].addEventListener('click', (event) => event.preventDefault());
    });
    cy.get('[data-test="bowtie-badge-result"]').click();
    cy.get('@rowClick').should('not.have.been.called');
  });

  it('says which validator the results are for, for a tool built on one', () => {
    cy.mount(
      <BowtieBadge
        info={{
          ...tested(result('js-ajv', passing)),
          engine: { name: 'ajv', toolingTypes: ['validator'] },
        }}
      />,
    );

    cy.get('[data-test="bowtie-badge-result"]').should(
      'have.attr',
      'href',
      'https://bowtie.report/#/implementations/js-ajv',
    );
    cy.get('[data-test="bowtie-badge-engine"]').should('have.text', 'via ajv');
  });

  it('names no engine for a tool Bowtie tests itself', () => {
    cy.mount(<BowtieBadge info={tested(result('js-ajv', passing))} />);

    cy.get('[data-test="bowtie-badge-engine"]').should('not.exist');
  });

  it('still links to the report while a badge is loading or unavailable', () => {
    cy.mount(<BowtieBadge info={tested(result('js-ajv', undefined))} />);
    cy.get('[data-test="bowtie-badge-loading"]').should(
      'have.attr',
      'href',
      'https://bowtie.report/#/implementations/js-ajv',
    );

    cy.mount(<BowtieBadge info={tested(result('js-ajv', null))} />);
    cy.get('[data-test="bowtie-badge-unavailable"]')
      .should('contain.text', 'see report')
      .and(
        'have.attr',
        'href',
        'https://bowtie.report/#/implementations/js-ajv',
      );
  });

  it('says when Bowtie does not test the selected dialect', () => {
    cy.mount(
      <BowtieBadge
        info={{
          kind: 'untested',
          implementation: implementation('js-ajv'),
          draft: '3',
        }}
      />,
    );

    cy.get('[data-test="bowtie-badge-untested"]')
      .should('contain.text', 'Draft 3')
      .and('contain.text', 'not tested')
      .and(
        'have.attr',
        'href',
        'https://bowtie.report/#/implementations/js-ajv',
      );
  });

  it('shows a "not on Bowtie" badge for validators Bowtie does not test', () => {
    cy.mount(<BowtieBadge info={{ kind: 'not-on-bowtie' }} />);

    cy.get('[data-test="bowtie-badge-not-on-bowtie"]')
      .should('have.text', 'not on Bowtie')
      .and('have.attr', 'href')
      .and('include', 'docs.bowtie.report');
  });

  it('shows no badge for tools Bowtie cannot test', () => {
    cy.mount(<BowtieBadge info={{ kind: 'not-applicable' }} />);

    cy.get('[data-test="bowtie-badge-not-applicable"]').should(
      'contain.text',
      'Not applicable',
    );
    cy.get('a').should('not.exist');
  });

  it('shows no badge when Bowtie cannot be reached', () => {
    cy.mount(<BowtieBadge info={{ kind: 'unknown' }} />);

    cy.get('[data-test="bowtie-badge-unknown"]').should(
      'contain.text',
      'Not available',
    );
  });

  it('shows a placeholder while finding out what is on Bowtie', () => {
    cy.mount(<BowtieBadge info={{ kind: 'unknown' }} isLoading />);

    cy.get('[data-test="bowtie-badge-skeleton"]').should('exist');
  });
});
