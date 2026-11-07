import React from 'react';
import ToolingTable from '~/pages/tools/components/ToolingTable';
import {
  groupTools,
  OTHER_GROUP,
  type Transform,
} from '~/pages/tools/hooks/useToolsTransform';
import type { JSONSchemaTool } from '~/pages/tools/JSONSchemaTool';
import mockNextRouter from '../plugins/mockNextRouterUtils';

const transform: Transform = {
  query: '',
  sortBy: 'name',
  sortOrder: 'ascending',
  groupBy: 'languages',
  licenses: [],
  languages: [],
  drafts: [],
  toolingTypes: [],
  environments: [],
  showObsolete: 'false',
  supportsBowtie: 'false',
};

const tools: JSONSchemaTool[] = [
  {
    name: 'Multi Language Validator',
    toolingTypes: ['validator', 'linter'],
    languages: ['Python', 'JavaScript'],
  },
  {
    name: 'Online Validator',
    toolingTypes: ['validator'],
  },
  {
    name: 'Schema Editor',
    toolingTypes: ['editor'],
    languages: [],
  },
  {
    name: 'Go Validator',
    toolingTypes: ['validator'],
    languages: ['Go'],
  },
];

describe('groupTools', () => {
  it('should group tools without languages under the Other group, listed last', () => {
    const { numberOfTools, toolsByGroup } = groupTools(tools, transform);

    expect(Object.keys(toolsByGroup)).to.deep.equal([
      'Go',
      'JavaScript',
      'Python',
      OTHER_GROUP,
    ]);
    expect(toolsByGroup[OTHER_GROUP].map((tool) => tool.name)).to.deep.equal([
      'Online Validator',
      'Schema Editor',
    ]);
    expect(numberOfTools).to.equal(tools.length);
  });

  it('should keep grouping by tooling type unchanged', () => {
    const { numberOfTools, toolsByGroup } = groupTools(tools, {
      ...transform,
      groupBy: 'toolingTypes',
    });

    expect(Object.keys(toolsByGroup)).to.deep.equal([
      'validator',
      'editor',
      'linter',
    ]);
    expect(toolsByGroup).not.to.have.property(OTHER_GROUP);
    expect(numberOfTools).to.equal(tools.length);
  });
});

describe('ToolingTable Component', () => {
  beforeEach(() => {
    mockNextRouter();
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      { body: {} },
    );
  });

  it('should show tools without languages and count each tool only once', () => {
    const onVisibleToolCountChange = cy.stub().as('onVisibleToolCountChange');
    const { numberOfTools, toolsByGroup } = groupTools(tools, transform);

    cy.mount(
      <ToolingTable
        toolsByGroup={toolsByGroup}
        transform={transform}
        setTransform={cy.stub()}
        numberOfTools={numberOfTools}
        onVisibleToolCountChange={onVisibleToolCountChange}
      />,
    );

    cy.get(`#group-${OTHER_GROUP}`)
      .should('contain.text', OTHER_GROUP)
      .and('contain.text', 'Online Validator')
      .and('contain.text', 'Schema Editor');
    cy.get('section').last().should('have.id', `group-${OTHER_GROUP}`);
    cy.get('@onVisibleToolCountChange').should(
      'have.always.been.calledWith',
      tools.length,
    );
  });
});
