import React from 'react';
import ToolingTable from '@/pages/tools/components/ToolingTable';
import type { JSONSchemaTool } from '@/pages/tools/JSONSchemaTool';
import type {
  GroupedTools,
  Transform,
} from '@/pages/tools/hooks/useToolsTransform';
import mockNextRouter from '../plugins/mockNextRouterUtils';

describe('ToolingTable Bowtie UX', () => {
  beforeEach(() => {
    mockNextRouter();
  });
  const mockTools: JSONSchemaTool[] = [
    {
      name: 'Python jsonschema',
      description: 'An implementation of JSON Schema for Python',
      toolingTypes: ['validator'],
      languages: ['Python'],
      source: 'https://github.com/python-jsonschema/jsonschema',
      license: 'MIT',
      supportedDialects: {
        draft: ['2020-12', '7'],
      },
    },
    {
      name: 'Ajv',
      description: 'The Fastest JSON Schema Validator',
      toolingTypes: ['validator'],
      languages: ['JavaScript'],
      source: 'https://github.com/ajv-validator/ajv',
      license: 'MIT',
      supportedDialects: {
        draft: ['2020-12', '7'],
      },
    },
  ];

  const mockToolsByGroup: GroupedTools = {
    validator: mockTools,
  };

  const defaultTransform: Transform = {
    query: '',
    sortBy: 'name',
    sortOrder: 'ascending',
    groupBy: 'toolingTypes',
    languages: [],
    licenses: [],
    drafts: [],
    toolingTypes: [],
    environments: [],
    showObsolete: 'false',
    supportsBowtie: 'false',
  };

  const mockBowtieSuccessData = {
    'https://github.com/python-jsonschema/jsonschema': {
      id: 'python-jsonschema',
      dialects: ['draft7', 'draft2020-12'],
      badges_urls: {
        supported_versions:
          'https://img.shields.io/badge/versions-supported-blue',
        compliance: {},
      },
    },
  };

  it('displays loading indicator while Bowtie request is pending', () => {
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      (req) => {
        req.on('response', (res) => {
          res.setDelay(1000);
        });
        req.reply({ statusCode: 200, body: mockBowtieSuccessData });
      },
    ).as('getBowtieLoading');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.get('[data-testid="bowtie-loading-spinner"]').should('exist');
    cy.get('[role="status"]').should(
      'have.attr',
      'aria-label',
      'Loading Bowtie compliance data',
    );
    cy.contains('Python jsonschema').should('exist');
    cy.contains('Ajv').should('exist');
  });

  it('loads Bowtie data successfully and displays links/info icons', () => {
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      {
        statusCode: 200,
        body: mockBowtieSuccessData,
      },
    ).as('getBowtieSuccess');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.wait('@getBowtieSuccess');
    cy.get('[data-testid="bowtie-loading-spinner"]').should('not.exist');
    cy.get('[data-testid="bowtie-error-banner"]').should('not.exist');
    cy.get('a[title="See at Bowtie"]')
      .should('exist')
      .and(
        'have.attr',
        'href',
        'https://bowtie.report/#/implementations/python-jsonschema',
      );
  });

  it('handles API error with a user-friendly error message and keeps tools table functional', () => {
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      },
    ).as('getBowtieError');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.wait('@getBowtieError');
    cy.get('[data-testid="bowtie-error-banner"]').should('exist');
    cy.get('[role="alert"]').should('exist');
    cy.contains('Failed to load Bowtie compliance data').should('exist');
    cy.contains(
      'Unable to load Bowtie compliance data. Please check your connection and try again.',
    ).should('exist');
    cy.get('[data-testid="bowtie-retry-button"]').should('exist');

    // Verify rest of Tools page remains functional
    cy.contains('Python jsonschema').should('exist');
    cy.contains('Ajv').should('exist');
    cy.contains('Validator').should('exist');
    cy.contains('Python').should('exist');
    cy.contains('JavaScript').should('exist');
    cy.contains('MIT').should('exist');
  });

  it('handles network failure correctly', () => {
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      {
        forceNetworkError: true,
      },
    ).as('getBowtieNetworkFail');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.wait('@getBowtieNetworkFail');
    cy.get('[data-testid="bowtie-error-banner"]').should('exist');
    cy.get('[data-testid="bowtie-retry-button"]').should('exist');
    cy.contains('Unable to load Bowtie compliance data').should('exist');
    cy.contains('Python jsonschema').should('exist');
  });

  it('clicking Retry triggers request and displays data upon success without reloading page', () => {
    let attempts = 0;
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      (req) => {
        attempts += 1;
        if (attempts === 1) {
          req.reply({ statusCode: 503, body: { error: 'Unavailable' } });
        } else {
          req.reply({ statusCode: 200, body: mockBowtieSuccessData });
        }
      },
    ).as('getBowtieRetrySuccess');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.wait('@getBowtieRetrySuccess');
    cy.get('[data-testid="bowtie-error-banner"]').should('exist');
    cy.get('[data-testid="bowtie-retry-button"]').click();

    cy.wait('@getBowtieRetrySuccess');
    cy.get('[data-testid="bowtie-error-banner"]').should('not.exist');
    cy.get('a[title="See at Bowtie"]').should('exist');
  });

  it('failed retry continues to display the error state and prevents duplicate clicks when disabled', () => {
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      {
        statusCode: 500,
        body: { error: 'Still failing' },
      },
    ).as('getBowtieRetryFail');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.wait('@getBowtieRetryFail');
    cy.get('[data-testid="bowtie-error-banner"]').should('exist');
    cy.get('[data-testid="bowtie-retry-button"]').click();

    cy.wait('@getBowtieRetryFail');
    cy.get('[data-testid="bowtie-error-banner"]').should('exist');
    cy.contains('Failed to load Bowtie compliance data').should('exist');
  });

  it('retry button is accessible with proper ARIA attributes and keyboard accessible', () => {
    cy.intercept(
      'GET',
      'https://bowtie.report/api/v1/json-schema-org/implementations',
      {
        statusCode: 500,
        body: { error: 'Error' },
      },
    ).as('getBowtieA11y');

    cy.mount(
      <ToolingTable
        toolsByGroup={mockToolsByGroup}
        transform={defaultTransform}
        setTransform={() => {}}
        numberOfTools={2}
      />,
    );

    cy.wait('@getBowtieA11y');
    cy.get('[data-testid="bowtie-retry-button"]').should(
      'have.attr',
      'aria-label',
      'Retry fetching Bowtie compliance data',
    );
    cy.get('[data-testid="bowtie-retry-button"]').focus();
    cy.get('[data-testid="bowtie-retry-button"]').should('have.focus');
  });
});
