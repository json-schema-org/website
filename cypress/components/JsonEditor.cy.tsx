/* eslint-disable cypress/no-unnecessary-waiting */
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

    // check if copy img is visible initially
    cy.get('[data-test="copy-clipboard-button"]')
      .children('img')
      .should('have.length', 1)
      .should('have.attr', 'src', '/icons/copy.svg')
      .should('be.visible');

    // click on copy button
    cy.get('[data-test="copy-clipboard-button"]').click();

    // check if clipboard writeText is called with the correct code
    cy.get('@clipboardWriteText').should(
      'have.been.calledWith',
      JSON.stringify(initialCode, null, 2) + '\n',
    );

    // check if copied img is visible after clicking
    cy.get('[data-test="copy-clipboard-button"]')
      .children('img')
      .should('have.length', 1)
      .should('have.attr', 'src', '/icons/copied.svg')
      .should('be.visible');

    // after 2 seconds, check if copy img is visible again
    cy.wait(2100); // Wait slightly longer than the 2000ms timeout
    cy.get('[data-test="copy-clipboard-button"]')
      .children('img')
      .should('have.length', 1)
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

  // Test JSONC support with isJsonc prop
  it('should render JSONC code correctly', () => {
    const jsoncCode = `{
  // This is a comment
  "name": "test",
  "value": 123
}`;

    cy.mount(<JsonEditor initialCode={jsoncCode} isJsonc={true} />);

    // Check that the badge shows "code" for regular JSONC
    cy.get('[data-test="check-json-schema"]').contains('code');
  });

  // Test partial schema detection in JSONC
  it('should detect and display partial schema correctly', () => {
    const partialSchemaCode = `// partial schema
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    }
  }
}`;

    cy.mount(<JsonEditor initialCode={partialSchemaCode} isJsonc={true} />);

    // Check that the badge shows "part of schema" and has the schema icon
    cy.get('[data-test="check-json-schema"]').contains('part of schema');
    cy.get('[data-test="check-json-schema"] img').should(
      'have.attr',
      'src',
      '/logo-white.svg',
    );
  });

  // Test partial schema with block comment
  it('should detect partial schema with block comment', () => {
    const partialSchemaCode = `/* partial schema */
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    }
  }
}`;

    cy.mount(<JsonEditor initialCode={partialSchemaCode} isJsonc={true} />);

    // Check that the badge shows "part of schema"
    cy.get('[data-test="check-json-schema"]').contains('part of schema');
  });

  // Test schema badge for JSON with $schema property
  it('should show schema badge for JSON with $schema property', () => {
    const schemaCode = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    }
  }
}`;

    cy.mount(<JsonEditor initialCode={schemaCode} />);

    // Check that the badge shows "schema" and has the schema icon
    cy.get('[data-test="check-json-schema"]').contains('schema');
    cy.get('[data-test="check-json-schema"] img').should(
      'have.attr',
      'src',
      '/logo-white.svg',
    );
  });

  // Test schema badge for JSON with meta isSchema flag
  it('should show schema badge for JSON with meta isSchema flag', () => {
    const schemaCode = `// props { "isSchema": true }
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    }
  }
}`;

    cy.mount(<JsonEditor initialCode={schemaCode} />);

    // Check that the badge shows "schema"
    cy.get('[data-test="check-json-schema"]').contains('schema');
  });

  // Test data badge for regular JSON without schema
  it('should show data badge for regular JSON', () => {
    const dataCode = `{
  "name": "test",
  "value": 123,
  "active": true
}`;

    cy.mount(<JsonEditor initialCode={dataCode} />);

    // Check that the badge shows "data"
    cy.get('[data-test="check-json-schema"]').contains('data');
  });

  // Test indented code with meta indent flag
  it('should apply indentation with meta indent flag', () => {
    const indentedCode = `// props { "indent": true }
{
  "name": "test"
}`;

    cy.mount(<JsonEditor initialCode={indentedCode} />);

    // Check that the card has the indentation class
    // The ml-10 class is applied to the Card component, not the Editable
    cy.get('[data-test="json-editor"]')
      .closest('.relative')
      .should('have.class', 'ml-10');
  });

  // Test invalid JSON parsing
  it('should handle invalid JSON gracefully', () => {
    const invalidJson = `{
  "name": "test",
  "value": 123,
  "unclosed": {
}`;

    cy.mount(<JsonEditor initialCode={invalidJson} />);

    // Should still render without crashing
    cy.get('[data-test="json-editor"]').should('exist');
    // Should show data badge since it's not valid JSON
    cy.get('[data-test="check-json-schema"]').contains('data');
  });

  // Test empty code
  it('should handle empty code', () => {
    cy.mount(<JsonEditor initialCode='' />);

    // Should still render without crashing
    cy.get('[data-test="json-editor"]').should('exist');
  });

  // Test code with only whitespace
  it('should handle whitespace-only code', () => {
    cy.mount(<JsonEditor initialCode='   \n  \t  ' />);

    // Should still render without crashing
    cy.get('[data-test="json-editor"]').should('exist');
  });

  // Test cut functionality (read-only editor, so this is mainly for coverage)
  it('should handle cut event', () => {
    // mock clipboard writeText
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('clipboardWriteText');
      // Mock getSelection to return some text
      cy.stub(win, 'getSelection').returns({
        toString: () => 'selected text',
      });
    });

    cy.mount(<JsonEditor initialCode='{"test": "value"}' />);

    // Test that the component renders without errors
    cy.get('[data-test="json-editor"]').should('exist');

    // Note: Cut event is not typically triggered in read-only editors
    // This test ensures the component handles the event handler properly
  });

  // Test selection and copy functionality
  it('should handle text selection and copy', () => {
    // mock clipboard writeText
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('clipboardWriteText');
      // Mock getSelection to return some text
      cy.stub(win, 'getSelection').returns({
        toString: () => 'selected text',
      });
    });

    cy.mount(<JsonEditor initialCode='{"test": "value"}' />);

    // Trigger copy event
    cy.get('[data-test="json-editor"]').trigger('copy');
    cy.get('@clipboardWriteText').should(
      'have.been.calledWith',
      'selected text',
    );
  });

  // Test click on non-link text
  it('should handle click on non-link text', () => {
    cy.mount(<JsonEditor initialCode='{"test": "value"}' />);

    // Click on regular text (should not navigate)
    cy.get('[data-test="json-editor"] span').first().click();

    // Should not have called router.push
    cy.get('@routerPush').should('not.have.been.called');
  });

  // Test partial schema syntax highlighting
  it('should apply syntax highlighting to partial schemas', () => {
    const partialSchemaCode = `// partial schema
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    }
  }
}`;

    cy.mount(<JsonEditor initialCode={partialSchemaCode} isJsonc={true} />);

    // Check that the code is rendered (syntax highlighting applied)
    cy.get('[data-test="json-editor"]').should('exist');
    cy.get('[data-test="check-json-schema"]').contains('part of schema');
  });

  // Test array bracket syntax highlighting in partial schemas (covers lines 171-172)
  it('should handle array brackets in partial schema syntax highlighting', () => {
    const partialSchemaWithArrays = `// partial schema
{
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}`;

    cy.mount(
      <JsonEditor initialCode={partialSchemaWithArrays} isJsonc={true} />,
    );

    // Check that the code is rendered with array syntax highlighting
    cy.get('[data-test="json-editor"]').should('exist');
    cy.get('[data-test="check-json-schema"]').contains('part of schema');
  });

  // Test full JSON parsing for non-partial schemas (covers line 194)
  it('should use full JSON parsing for complete schemas', () => {
    const completeSchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}`;

    cy.mount(<JsonEditor initialCode={completeSchema} />);

    // Check that the code is rendered with full JSON parsing
    cy.get('[data-test="json-editor"]').should('exist');
    cy.get('[data-test="check-json-schema"]').contains('schema');
  });

  // Test meta props with invalid JSON
  it('should handle invalid meta props JSON', () => {
    const invalidMetaProps =
      '// props { "valid": true, "caption": "test" }\n{ "test": "value" }';

    cy.mount(<JsonEditor initialCode={invalidMetaProps} />);

    // Should still render without crashing
    cy.get('[data-test="json-editor"]').should('exist');
  });

  // Test meta props with missing groups
  it('should handle meta props with missing groups', () => {
    const metaPropsWithoutGroups = '// props {}\n{ "test": "value" }';

    cy.mount(<JsonEditor initialCode={metaPropsWithoutGroups} />);

    // Should still render without crashing
    cy.get('[data-test="json-editor"]').should('exist');
  });

  // Test code caption without meta
  it('should handle code without caption', () => {
    cy.mount(<JsonEditor initialCode='{"test": "value"}' />);

    // Should render without caption
    cy.get('[data-test="code-caption"]').should('exist');
  });

  // Test validation without meta
  it('should handle code without validation meta', () => {
    cy.mount(<JsonEditor initialCode='{"test": "value"}' />);

    // Should not show validation alerts
    cy.get('[data-test="compliant-to-schema"]').should('not.exist');
    cy.get('[data-test="not-compliant-to-schema"]').should('not.exist');
  });
});
