import React from 'react';
import StyledMarkdown from '~/components/StyledMarkdown';

describe('StyledMarkdown - Reference Links', () => {
  it('should correctly transform standard reference links', () => {
    const markdown = `
[JSON Schema][json-schema]

[json-schema]: https://json-schema.org/
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://json-schema.org/');
    cy.get('a').should('have.text', 'JSON Schema');
  });

  it('should correctly transform implicit reference links', () => {
    const markdown = `
[json-schema][]

[json-schema]: https://json-schema.org/
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://json-schema.org/');
    // For implicit links [json-schema][], the text is 'json-schema'
    cy.get('a').should('have.text', 'json-schema');
  });

  it('should correctly transform collapsed reference links', () => {
    const markdown = `
[json-schema]

[json-schema]: https://json-schema.org/
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://json-schema.org/');
    cy.get('a').should('have.text', 'json-schema');
  });

  it('should correctly handle images as reference links', () => {
    const markdown = `
![JSON Schema Logo][logo]

[logo]: https://json-schema.org/img/logo-blue.svg
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('img').should(
      'have.attr',
      'src',
      'https://json-schema.org/img/logo-blue.svg',
    );
    cy.get('img').should('have.attr', 'alt', 'JSON Schema Logo');
  });

  it('should not break standard inline links', () => {
    const markdown = `
[Inline Link](https://example.com)
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://example.com');
    cy.get('a').should('have.text', 'Inline Link');
  });

  it('should handle reference links with an optional space', () => {
    const markdown = `
[JSON Schema] [json-schema]

[json-schema]: https://json-schema.org/
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://json-schema.org/');
    cy.get('a').should('have.text', 'JSON Schema');
  });

  it('should handle implicit reference links with an optional space', () => {
    const markdown = `
[json-schema] []

[json-schema]: https://json-schema.org/
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://json-schema.org/');
    cy.get('a').should('have.text', 'json-schema');
  });

  it('should prioritize the second bracket as the link ID', () => {
    const markdown = `
[Text][actual-id]

[text]: https://wrong.com/
[actual-id]: https://right.com/
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('a').should('have.attr', 'href', 'https://right.com/');
    cy.get('a').should('have.text', 'Text');
  });

  it('should ignore links without definitions', () => {
    const markdown = `
[Missing Definition]
[Missing Implicit][]
[Link][missing-id]
`;
    cy.mount(<StyledMarkdown markdown={markdown} />);
    // These should NOT be transformed into anchor tags if they are just raw text now
    // But since the regex returns the original string if no link is found,
    // they will be rendered as plain text by the markdown parser.
    cy.get('a').should('not.exist');
  });
});
