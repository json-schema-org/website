/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */
import React from 'react';
import ToolingTable from '~/pages/tools/components/ToolingTable';
import type {
  GroupedTools,
  Transform,
} from '~/pages/tools/hooks/useToolsTransform';
import type { JSONSchemaTool } from '~/pages/tools/JSONSchemaTool';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

const mockTools: JSONSchemaTool[] = [
  {
    name: 'Test Tool 1',
    toolingTypes: ['validator'],
    languages: ['JavaScript'],
    license: 'MIT',
    source: 'https://github.com/test/tool1',
    supportedDialects: { draft: ['2020-12'] },
    status: 'obsolete',
  },
  {
    name: 'Test Tool 2',
    toolingTypes: ['editor'],
    languages: ['Python'],
    license: 'Apache-2.0',
    source: 'https://github.com/test/tool2',
    supportedDialects: { draft: ['2019-09'] },
  },
];

const mockToolsByGroup: GroupedTools = {
  validator: [mockTools[0]],
  editor: [mockTools[1]],
};

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

describe('ToolingTable Component', () => {
  let setTransformStub: any;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = mockNextRouter();
    cy.stub(global, 'fetch').resolves({
      json: () => Promise.resolve({}),
    } as Response);
    setTransformStub = cy.stub().as('setTransform');
  });

  it('renders grouped tools correctly', () => {
    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={mockTransform}
        setTransform={setTransformStub}
        numberOfTools={2}
      />,
    );

    cy.contains('Validator').should('exist');
    cy.contains('Editor').should('exist');
    cy.contains('Test Tool 1').should('exist');
    cy.contains('Test Tool 2').should('exist');
  });

  it('shows obsolete status and tool details', () => {
    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={mockTransform}
        setTransform={setTransformStub}
        numberOfTools={2}
      />,
    );

    cy.contains('obsolete').should('exist');
    cy.contains('JavaScript').should('exist');
    cy.contains('MIT').should('exist');
    cy.contains('2020-12').should('exist');
  });

  it('handles sorting and modal interactions', () => {
    cy.viewport(1200, 800); // Set large viewport to show desktop table

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={mockTransform}
        setTransform={setTransformStub}
        numberOfTools={2}
      />,
    );

    cy.get('.hidden.lg\\:block')
      .first()
      .within(() => {
        cy.contains('Name').click();
        cy.get('@setTransform').should('have.been.called');

        cy.get('tbody tr').first().click();
      });

    cy.get('[role="dialog"]').should('exist');
  });

  it('displays empty state when no tools', () => {
    cy.mount(
      <ToolingTable
        toolsByGroup={{}}
        transform={mockTransform}
        setTransform={setTransformStub}
        numberOfTools={0}
      />,
    );

    cy.contains('No Tools Found :(').should('exist');
  });

  it('renders both desktop and mobile tables', () => {
    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={mockTransform}
        setTransform={setTransformStub}
        numberOfTools={2}
      />,
    );

    cy.get('.hidden.lg\\:block').should('exist');
    cy.get('.lg\\:hidden').should('exist');
  });
});
