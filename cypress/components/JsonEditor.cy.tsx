import JsonEditor from '~/components/JsonEditor';
import React from 'react';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

/*
 * Testing the JSON Editor Component involves testing some basic functionality,
 * such as rendering, copying text to clipboard, navigating to the reference page,
 * and schema compliance. Since the component uses a third-party library,
 * testing its functionality can be a bit tricky.
 * Note: Using istabul ignore in most of the small blocks because it is not possible to test them as * they are related to the third-party library.
 */

// initial code for json editor
const initialCode = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://example.com/product.schema.json',
  title: 'Product',
  description: 'A product from dummy catalog',
  type: 'object',
  properties: {
    productId: {
      description: 'The unique identifier for a product',
      type: 'integer',
    },
    productName: {
      description: 'Name of the product',
      type: 'string',
    },
    price: {
      description: 'The price of the product',
      type: 'number',
      exclusiveMinimum: 0,
    },
    tags: {
      description: 'Tags for the product',
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      uniqueItems: true,
    },
    dimensions: {
      type: 'object',
      properties: {
        length: {
          type: 'number',
        },
        width: {
          type: 'number',
        },
        height: {
          type: 'number',
        },
      },
      required: ['length', 'width', 'height'],
    },
    // hypothetical fields
    patternField: {
      type: 'string',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    },
    isPremium: {
      type: 'boolean',
    },
    nullField: {
      type: 'null',
    },
  },
  required: ['productId', 'productName', 'price'],
};

describe('JSON Editor Component', () => {
  // eslint-disable-next-line
  let mockRouter: MockRouter;

  beforeEach(() => {
    // Create mock router object
    cy.viewport(1200, 800);
    mockRouter = mockNextRouter();
  });

  // should render with default initial code prop
  it('should render with default initial code prop', () => {
    cy.mount(<JsonEditor initialCode={JSON.stringify(initialCode, null, 2)} />);
  });

  // should copies text to clipboard when clicked
  it('should copy text to clipboard when clicked', () => {
    // mock clipboard writeText
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('clipboardWriteText');
    });

    // mount component
    cy.mount(<JsonEditor initialCode={JSON.stringify(initialCode, null, 2)} />);

    // check if copy img is visible
    cy.get('[data-test="copy-clipboard-button"]')
      .children('img')
      .should('have.length', 2)
      .first()
      .should('have.attr', 'src', '/icons/copy.svg')
      .should('be.visible');

    // click on copy img
    cy.get('[data-test="copy-clipboard-button"]').click();

    // check if clipboard writeText is copied the correct code
    cy.get('@clipboardWriteText').should(
      'have.been.calledWith',
      JSON.stringify(initialCode, null, 2) + '\n',
    );

    // check if copied img is visible
    cy.get('[data-test="copy-clipboard-button"]')
      .children('img')
      .last()
      .should('have.attr', 'src', '/icons/copied.svg')
      .should('be.visible');

    // after 2 seconds, check if copy img is visible again
    cy.get('[data-test="copy-clipboard-button"]')
      .children('img')
      .should('have.length', 2)
      .first()
      .should('have.attr', 'src', '/icons/copy.svg')
      .should('be.visible');
  });

  // should navigate correctly to each type-keyword reference page when clicked on type-keyword
  it('should navigate correctly to each type-keyword reference page when clicked on type-keyword', () => {
    cy.mount(<JsonEditor initialCode={JSON.stringify(initialCode, null, 2)} />);

    // type keywords to test
    const type_keywords = [
      'string',
      'object',
      'boolean',
      'null',
      'array',
      'number',
      'integer',
    ];

    // iterate over each type keyword and click on it and check if each keyword navigates to the correct page
    type_keywords.forEach((type) => {
      cy.get('span')
        .contains(`"${type}"`, { matchCase: false })
        .then(($spans) => {
          $spans.each((index, span) => {
            // click on each type keyword
            cy.wrap(span).click();

            const link = `/understanding-json-schema/reference/${type == 'number' || type == 'integer' ? `numeric#${type}` : type}`;

            // check if router.push is called with correct url
            cy.get('@routerPush').should('have.been.calledWith', link);

            // reset router.push
            cy.get('@routerPush').invoke('reset');
          });
        });
    });
  });

  // should render with meta regex props and check schema compliant
  it('should render with meta regex props', () => {
    const schemaCompliantMetaProps =
      '// props { "valid": true, "caption": "valid - An Object is allowed." }\n{ "ok": "yes" }';

    cy.mount(<JsonEditor initialCode={schemaCompliantMetaProps} />);

    // check if given object have schema field
    cy.get('[data-test="check-json-schema"]').should('not.contain', 'schema');
    cy.get('[data-test="check-json-schema"]').contains('data');

    // check if given object is schema compliant
    cy.get('[data-test="compliant-to-schema"]').contains('compliant to schema');

    // check if meta props caption is present
    cy.get('[data-test="code-caption"]').contains(
      'valid - An Object is allowed.',
    );

    // Now test with invalid object and not schema compliant
    const nonSchemaCompliantMetaProps =
      '// props { "valid": false, "caption": "valid - An Object is allowed." }\n{ "123" }';
    cy.mount(<JsonEditor initialCode={nonSchemaCompliantMetaProps} />);

    // check if given object is non schema compliant
    cy.get('[data-test="not-compliant-to-schema"]').contains(
      'not compliant to schema',
    );

    // check when there is error in meta props
    const errorInMetaProps = '// props { "valid" = false }\n{ "123" }';
    cy.mount(<JsonEditor initialCode={errorInMetaProps} />);
  });

  // mock copy function of editor when using keyboard shortcut
  it('should copy selected text', () => {
    const smallInitialCode = '{ const foo = "bar"; }';

    // mock clipboard writeText
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('clipboardWriteText');
    });

    cy.mount(<JsonEditor initialCode={smallInitialCode} />);

    // copy with keyboard shortcut || mouse selection
    cy.get('[data-test="json-editor"]').trigger('copy');
    cy.get('@clipboardWriteText').should('have.been.calledWith', '');
  });
});
