import React from 'react';
import GettingStarted from '~/components/GettingStarted';
import { ThemeProvider } from 'next-themes';
import JSZip from 'jszip';

const mockGettingStartedExamples = [
  {
    name: 'Getting started basic schema',
    default: true,
    file: '/data/getting-started-examples/schemas/default.json',
    instances: [
      {
        name: 'Valid instance',
        default: true,
        valid: true,
        file: '/data/getting-started-examples/instances/default-ok.json',
        details: 'This is a valid JSON instance for the provided JSON Schema',
      },
      {
        name: 'Invalid instance',
        default: false,
        valid: false,
        file: '/data/getting-started-examples/instances/default-ko.json',
        details: 'Invalid: The value of price property must be a number',
      },
    ],
  },
  {
    name: 'Getting started extended schema',
    default: false,
    file: '/data/getting-started-examples/schemas/default-extended.json',
    instances: [
      {
        name: 'Extended valid instance',
        default: true,
        valid: true,
        file: '/data/getting-started-examples/instances/default-extended-ok.json',
        details: 'This is a valid extended JSON instance',
      },
    ],
  },
];

const mockDefaultSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Product',
  type: 'object',
  properties: {
    productId: { type: 'integer' },
    productName: { type: 'string' },
    price: { type: 'number', exclusiveMinimum: 0 },
  },
  required: ['productId', 'productName', 'price'],
};

const mockDefaultOkInstance = {
  productId: 1,
  productName: 'An ice sculpture',
  price: 12.5,
};

const mockDefaultKoInstance = {
  productId: 1,
  productName: 'An ice sculpture',
  price: 'invalid_price',
};

const mockExtendedSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Extended Product',
  type: 'object',
  properties: {
    productId: { type: 'integer' },
    tags: { type: 'array', items: { type: 'string' } },
  },
};

const mockExtendedOkInstance = {
  productId: 2,
  tags: ['cool', 'new'],
};

describe('GettingStarted Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/getting-started-examples.json', {
      statusCode: 200,
      body: mockGettingStartedExamples,
    }).as('getExamples');

    cy.intercept('GET', '/data/getting-started-examples/schemas/default.json', {
      statusCode: 200,
      body: mockDefaultSchema,
    }).as('getDefaultSchema');

    cy.intercept(
      'GET',
      '/data/getting-started-examples/instances/default-ok.json',
      {
        statusCode: 200,
        body: mockDefaultOkInstance,
      },
    ).as('getDefaultOkInstance');

    cy.intercept(
      'GET',
      '/data/getting-started-examples/instances/default-ko.json',
      {
        statusCode: 200,
        body: mockDefaultKoInstance,
      },
    ).as('getDefaultKoInstance');

    cy.intercept(
      'GET',
      '/data/getting-started-examples/schemas/default-extended.json',
      {
        statusCode: 200,
        body: mockExtendedSchema,
      },
    ).as('getExtendedSchema');

    cy.intercept(
      'GET',
      '/data/getting-started-examples/instances/default-extended-ok.json',
      {
        statusCode: 200,
        body: mockExtendedOkInstance,
      },
    ).as('getExtendedOkInstance');
  });

  const mountComponent = () => {
    cy.mount(
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
      >
        <GettingStarted />
      </ThemeProvider>,
    );
    cy.wait('@getExamples');
    cy.wait('@getDefaultSchema');
    cy.wait('@getDefaultOkInstance');
  };

  describe('Initial Rendering', () => {
    it('should render headers and controls when mounted', () => {
      mountComponent();

      cy.contains('h2', 'JSON Schema').should('be.visible');
      cy.contains('h2', 'JSON Instance').should('be.visible');
      cy.contains('h2', 'Validation Result').should('be.visible');

      cy.contains('label', 'Select a Schema:').should('be.visible');
      cy.contains('label', 'Select an Instance:').should('be.visible');
      cy.contains('button', 'Download').should('be.visible');
    });

    it('should populate schema and instance dropdowns with initial options', () => {
      mountComponent();

      cy.get('select#Examples')
        .should('exist')
        .find('option')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Getting started basic schema');

      cy.get('select')
        .eq(1)
        .should('exist')
        .find('option')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Valid instance');
    });

    it('should render default schema and instance code blocks', () => {
      mountComponent();

      cy.contains('Product').should('exist');
      cy.contains('An ice sculpture').should('exist');
      cy.contains('12.5').should('exist');
    });

    it('should display valid status with green tick icon initially', () => {
      mountComponent();

      cy.contains(
        'This is a valid JSON instance for the provided JSON Schema',
      ).should('be.visible');
      cy.get('img[alt="green tick"]').should('be.visible');
      cy.get('img[alt="red cross"]').should('not.exist');
    });
  });

  describe('Instance Switching', () => {
    it('should update code block and display red cross when an invalid instance is selected', () => {
      mountComponent();

      cy.get('select')
        .eq(1)
        .select('/data/getting-started-examples/instances/default-ko.json');
      cy.wait('@getDefaultKoInstance');

      cy.contains('must be a number').should('be.visible');
      cy.get('img[alt="red cross"]').should('be.visible');
      cy.get('img[alt="green tick"]').should('not.exist');
      cy.contains('invalid_price').should('exist');
    });

    it('should clear fetched instance when an unknown instance is selected', () => {
      mountComponent();

      cy.get('select')
        .eq(1)
        .then(($select) => {
          $select.val('unknown-instance-path');
        })
        .trigger('change');

      cy.get('select').eq(1).should('exist');
    });
  });

  describe('Schema Switching', () => {
    it('should load new schema, update instance dropdown, and display extended schema content', () => {
      mountComponent();

      cy.get('select#Examples').select(
        '/data/getting-started-examples/schemas/default-extended.json',
      );
      cy.wait('@getExtendedSchema');
      cy.wait('@getExtendedOkInstance');

      cy.contains('Extended Product').should('exist');
      cy.contains('cool').should('exist');

      cy.get('select')
        .eq(1)
        .find('option')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Extended valid instance');
    });

    it('should reset instances and clear fetched schema when an unknown schema is selected', () => {
      mountComponent();

      cy.get('select#Examples')
        .then(($select) => {
          $select.val('unknown-schema-path');
        })
        .trigger('change');

      cy.get('select').eq(1).find('option').should('have.length', 0);
    });
  });

  describe('Theming', () => {
    it('should render correctly with dark theme styling', () => {
      cy.mount(
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
        >
          <GettingStarted />
        </ThemeProvider>,
      );
      cy.wait('@getExamples');
      cy.wait('@getDefaultSchema');
      cy.wait('@getDefaultOkInstance');

      cy.contains('h2', 'JSON Schema').should('be.visible');
      cy.contains('Product').should('exist');
      cy.get('pre')
        .first()
        .should('have.css', 'border-color', 'rgb(55, 65, 81)');
    });
  });

  describe('Download Feature', () => {
    it('should render the download button with correct styling and respond to clicks', () => {
      mountComponent();

      cy.contains('button', 'Download')
        .should('be.visible')
        .and('have.class', 'bg-blue-600')
        .click();
    });

    it('should catch and handle zip generation errors gracefully', () => {
      mountComponent();

      cy.stub(JSZip.prototype, 'file').throws(new Error('Mock zip error'));
      cy.spy(console, 'log').as('consoleLog');

      cy.contains('button', 'Download').click();
      cy.get('@consoleLog').should(
        'have.been.calledWithMatch',
        'Error zipping files',
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch failure gracefully without breaking the layout', () => {
      cy.intercept('GET', '/data/getting-started-examples.json', {
        forceNetworkError: true,
      }).as('getExamplesFail');

      cy.mount(
        <ThemeProvider>
          <GettingStarted />
        </ThemeProvider>,
      );

      cy.wait('@getExamplesFail');
      cy.get('select#Examples').should('not.exist');
    });
  });
});
