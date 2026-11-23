import React from 'react';
import ToolingTable from '~/pages/tools/components/ToolingTable';
import type {
  BowtieImplementation,
  JSONSchemaTool,
} from '~/pages/tools/JSONSchemaTool';
import type { ToolBowtieInfo } from '~/pages/tools/lib/bowtie';
import {
  DEFAULT_TRANSFORM,
  type Transform,
} from '~/pages/tools/lib/transformTools';

const implementation: BowtieImplementation = {
  id: 'js-on-bowtie',
  name: 'on-bowtie',
  language: 'javascript',
  source: 'https://github.com/example/on-bowtie',
  dialects: ['https://json-schema.org/draft/2020-12/schema'],
};

const onBowtie: ToolBowtieInfo = {
  kind: 'tested',
  implementation,
  draft: '2020-12',
  result: {
    implementation,
    draft: '2020-12',
    badgeUrl:
      'https://bowtie.report/badges/js-on-bowtie/compliance/draft2020-12.json',
    badge: {
      label: 'Draft 2020-12',
      message: '100% Passing',
      color: '006400',
    },
    compliance: 100,
  },
};

const notOnBowtie: ToolBowtieInfo = { kind: 'not-on-bowtie' };

// More tools than the page used to show before asking to "Load More".
const tools: JSONSchemaTool[] = [
  {
    name: 'on-bowtie',
    toolingTypes: ['validator', 'schema-to-code'],
    languages: ['JavaScript', 'TypeScript'],
    license: 'MIT',
    source: implementation.source,
    bowtie: { identifier: implementation.id },
    supportedDialects: { draft: ['2020-12', '7'] },
  },
  ...Array.from({ length: 7 }, (_, index) => ({
    name: `validator-${index}`,
    toolingTypes: ['validator'],
    languages: ['Go'],
    license: 'Apache-2.0',
    status: index === 0 ? ('obsolete' as const) : undefined,
  })),
  // The tooling data has the odd duplicate entry
  { name: 'validator-1', toolingTypes: ['validator'] },
];

// The single entry for a project with a tool for each of several languages
const project: JSONSchemaTool = {
  name: 'polyglot',
  project: 'polyglot',
  toolingTypes: ['validator'],
  languages: ['Go', 'JavaScript', 'TypeScript'],
  members: [tools[0], tools[2]],
};

const getBowtieInfo = (tool: JSONSchemaTool) =>
  tool.name === 'on-bowtie' ? onBowtie : notOnBowtie;

const mountTable = (
  transform: Partial<Transform> = {},
  listed: JSONSchemaTool[] = tools,
) => {
  const setTransform = cy.stub().as('setTransform');

  cy.mount(
    <ToolingTable
      tools={listed}
      transform={{ ...DEFAULT_TRANSFORM, ...transform }}
      setTransform={setTransform}
      getBowtieInfo={getBowtieInfo}
    />,
  );
};

describe('ToolingTable Component', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('lists every tool, in the order given', () => {
    mountTable();

    cy.get('[data-test="tools-row"]').should('have.length', tools.length);
    cy.get('[data-test="tools-row"]')
      .first()
      .should('contain.text', 'on-bowtie');
    cy.contains('button', 'Load More').should('not.exist');
  });

  it('describes each tool', () => {
    mountTable();

    cy.get('[data-test="tools-row"]')
      .first()
      .within(() => {
        cy.contains('Validator, Schema To Code');
        cy.contains('JavaScript, TypeScript');
        cy.contains('2020-12');
        cy.contains('MIT');
      });
    cy.get('[data-test="tools-row"]').eq(1).should('contain.text', 'obsolete');
  });

  it('shows a Bowtie badge, or that a validator is not on Bowtie', () => {
    mountTable();

    cy.get('[data-test="tools-row"]')
      .first()
      .find('[data-test="bowtie-badge-result"]')
      .should('contain.text', '100% Passing')
      .and(
        'have.attr',
        'href',
        'https://bowtie.report/#/implementations/js-on-bowtie',
      );
    cy.get('[data-test="tools-row"]')
      .eq(1)
      .find('[data-test="bowtie-badge-not-on-bowtie"]')
      .should('exist');
  });

  it('shows placeholders until it is known what is on Bowtie', () => {
    const setTransform = cy.stub();
    cy.mount(
      <ToolingTable
        tools={tools}
        transform={DEFAULT_TRANSFORM}
        setTransform={setTransform}
        getBowtieInfo={getBowtieInfo}
        isBowtieLoading
      />,
    );

    cy.get(
      '[data-test="tools-table"] [data-test="bowtie-badge-skeleton"]',
    ).should('have.length', tools.length);
  });

  it('marks the column the tools are sorted by', () => {
    mountTable();

    cy.contains('th', 'Bowtie').should('have.attr', 'aria-sort', 'descending');
    cy.contains('th', 'Name').should('have.attr', 'aria-sort', 'none');
    cy.contains('th', 'Tool type').should('not.have.attr', 'aria-sort');
  });

  it('sorts by a column, and reverses the order when asked again', () => {
    mountTable();

    cy.get('[data-test="tools-sort-name"]').click();
    cy.get('@setTransform')
      .should('have.been.calledOnce')
      .then((stub: any) => {
        const update = stub.firstCall.args[0];

        expect(update(DEFAULT_TRANSFORM)).to.deep.equal({
          sortBy: 'name',
          sortOrder: 'ascending',
        });
        expect(
          update({
            ...DEFAULT_TRANSFORM,
            sortBy: 'name',
            sortOrder: 'ascending',
          }),
        ).to.deep.equal({ sortBy: 'name', sortOrder: 'descending' });
      });

    cy.get('[data-test="tools-sort-bowtie"]').click();
    cy.get('@setTransform').then((stub: any) => {
      const update = stub.secondCall.args[0];

      expect(update(DEFAULT_TRANSFORM)).to.deep.equal({
        sortBy: 'bowtie',
        sortOrder: 'ascending',
      });
      expect(update({ ...DEFAULT_TRANSFORM, sortBy: 'license' })).to.deep.equal(
        { sortBy: 'bowtie', sortOrder: 'descending' },
      );
    });
  });

  it('opens the details of a tool', () => {
    mountTable();

    cy.contains('button', 'validator-3').click();
    cy.get('h2').should('contain.text', 'validator-3');

    cy.get('body').type('{esc}');
    cy.get('h2').should('not.exist');
  });

  it('says how many tools the entry for a project stands for', () => {
    mountTable({}, [project, tools[1]]);

    cy.get('[data-test="tools-row"]')
      .first()
      .find('[data-test="tools-members-count"]')
      .should('have.text', '2 tools');
    cy.get('[data-test="tools-row"]')
      .eq(1)
      .find('[data-test="tools-members-count"]')
      .should('not.exist');
  });

  it('counts the languages of a project which is for a great many', () => {
    const languages = ['C', 'C++', 'Go', 'Java', 'Rust'];
    mountTable({}, [project, { ...project, name: 'polyglot-2', languages }]);

    cy.get('[data-test="tools-row"]')
      .first()
      .should('contain.text', 'Go, JavaScript, TypeScript');
    cy.get('[data-test="tools-row"]')
      .eq(1)
      .contains('5 languages')
      .should('have.attr', 'title', languages.join(', '));
  });

  it('opens the details of a tool of a project from those of the project', () => {
    mountTable({}, [project]);

    cy.contains('button', 'polyglot').click();
    cy.get('h2').should('contain.text', 'polyglot');
    cy.get('[data-test="tool-members"]').within(() => {
      cy.get('[data-test="bowtie-badge-result"]').should('have.length', 1);
      cy.contains('button', 'validator-1').click();
    });

    cy.get('h2').should('contain.text', 'validator-1');
    cy.get('[data-test="tool-members"]').should('not.exist');
  });

  it('opens the details from anywhere in a row', () => {
    mountTable();

    cy.get('[data-test="tools-row"]').eq(3).find('td').eq(2).click();
    cy.get('h2').should('contain.text', 'validator-2');
  });

  it('opens the details from a card on small screens', () => {
    cy.viewport(390, 800);
    mountTable();

    cy.get('[data-test="tools-list"] > li').eq(3).click('bottomLeft');
    cy.get('h2').should('contain.text', 'validator-2');
  });

  it('lists the tools as cards on small screens', () => {
    cy.viewport(390, 800);
    mountTable();

    cy.get('[data-test="tools-table"]').should('not.be.visible');
    cy.get('[data-test="tools-list"] > li').should('have.length', tools.length);
    cy.get('[data-test="tools-list"] > li')
      .first()
      .should('contain.text', 'Languages: JavaScript, TypeScript')
      .find('[data-test="bowtie-badge-result"]')
      .should('be.visible');
  });

  it('says when no tools match', () => {
    mountTable({}, []);

    cy.get('[data-test="tools-empty"]').should(
      'contain.text',
      'No tools found',
    );
    cy.get('[data-test="tools-table"]').should('not.exist');
  });
});
