import React from 'react';
import StyledMarkdown from '~/components/StyledMarkdown';
import { StyledMarkdownBlock } from '~/components/StyledMarkdownBlock';
import {
  TableOfContent,
  TableOfContentMarkdown,
} from '~/components/TableOfContentMarkdown';
import { FullMarkdownContext } from '~/context';
import mockNextRouter from '../plugins/mockNextRouterUtils';

const headings = '# Overview\n\n## Rules\n\n### Strings\n\n#### Length';
const tabs = `[tabs-start "Examples"]
[tab "String"]
String example
[tab "Number"]
Number example
[tab-end]
[tabs-end]`;

describe('Markdown used by blog articles', () => {
  beforeEach(() => mockNextRouter());

  it('handles absent content and switches between tab examples', () => {
    cy.mount(
      <div data-testid='empty'>
        <StyledMarkdown />
      </div>,
    );
    cy.get('[data-testid="empty"]').should('be.empty');
    cy.mount(
      <StyledMarkdown
        markdown={`Before\n\n${tabs}\n\nAfter\n\n${tabs.replace('Examples', 'More examples')}`}
      />,
    );
    cy.contains('Before').should('be.visible');
    cy.contains('After').should('be.visible');
    cy.contains('More examples:').should('be.visible');
    cy.contains('div', 'Number').click();
    cy.contains('Number example').should('be.visible');
  });

  it('renders text, links, tables and collapsible explanations', () => {
    const markdown = `${headings}

**Required** and <italic>italic</italic> and <bold>bold</bold>.

<specialBox>Special explanation</specialBox>

[External](https://json-schema.org) and [Internal](/docs).

<a>Plain label</a>

<a href="https://json-schema.org/docs" className="plausible-event-name=Docs">Tracked link</a>

1. Ordered item

- Unordered item

| Name | Kind |
| --- | --- |
| title | string |

<table><thead></thead><tbody><tr><td>Body only</td></tr></tbody></table>

> Quoted explanation

<details><summary>More details</summary>Hidden explanation</details>

<userevent type="tracked"><span>Tracked child</span></userevent>

<Star label="Star label" />
<StarInline label="Inline label" />
<Warning label="Warning label">Warning text</Warning>
<Infobox label="Information label">Information text</Infobox>
<Tip label="Tip label">Tip text</Tip>
<Danger label="Danger label">Danger text</Danger>
<Bigquote>Large quote</Bigquote>
<Regularquote>Regular quote</Regularquote>
<Keywords>Hidden keyword</Keywords>
<tableofcontent depth={4} />`;
    cy.mount(<StyledMarkdownBlock markdown={markdown} />);
    cy.get('h1').should('contain.text', 'Overview');
    cy.get('strong').should('contain.text', 'Required');
    cy.get('i').should('contain.text', 'italic');
    cy.get('b').should('contain.text', 'bold');
    cy.get('a[href="/docs"]').should('have.attr', 'rel', 'noopener noreferrer');
    cy.contains('a', 'Tracked link').should(
      'have.class',
      'plausible-event-name=Docs',
    );
    cy.contains('Plain label').should('be.visible');
    cy.get('ol li').should('contain.text', 'Ordered item');
    cy.get('ul li').should('contain.text', 'Unordered item');
    cy.get('thead th').should('have.length', 2);
    cy.contains('td', 'Body only').should('be.visible');
    cy.contains('summary', 'More details').click();
    cy.get('details').should('have.attr', 'open');
    cy.contains('Tracked child').should('have.class', 'tracked');
    [
      'Special explanation',
      'Star label',
      'Inline label',
      'Warning text',
      'Information text',
      'Tip text',
      'Danger text',
      'Large quote',
      'Regular quote',
    ].forEach((text) => cy.contains(text).should('be.visible'));
    cy.contains('Table of Contents').should('be.visible');
    cy.mount(
      <div data-testid='keywords'>
        <StyledMarkdownBlock markdown='<Keywords>Hidden keyword</Keywords>' />
      </div>,
    );
    cy.get('[data-testid="keywords"]').should('be.empty');
  });

  it('renders inline, JSON, JSONC and ordinary code examples', () => {
    const markdown =
      'Inline `type` and <code className="lang-text">literal</code>\n\n```json\n{"type":"string"}\n```\n\n```jsonc\n// explanation\n{"type":"number"}\n```\n\n```javascript\nconst value = 1;\n```';
    cy.mount(<StyledMarkdownBlock markdown={markdown} />);
    cy.get('code').should('contain.text', 'type');
    cy.contains('literal').should('exist');
    cy.contains('string').should('exist');
    cy.contains('number').should('exist');
    cy.contains('const value').should('exist');
  });

  it('uses heading depth and context to build the table of contents', () => {
    cy.mount(
      <div data-testid='empty-toc'>
        <TableOfContent />
      </div>,
    );
    cy.get('[data-testid="empty-toc"]').should('be.empty');
    cy.mount(
      <FullMarkdownContext.Provider value={headings}>
        <TableOfContent depth={4} />
      </FullMarkdownContext.Provider>,
    );
    ['overview', 'rules', 'strings', 'length'].forEach((slug) =>
      cy.get(`a[href="#${slug}"]`).should('exist'),
    );
    cy.mount(<TableOfContentMarkdown markdown={headings} />);
    cy.get('a[href="#rules"]').should('exist');
    cy.get('a[href="#strings"]').should('not.exist');
    cy.mount(<TableOfContentMarkdown markdown={headings} depth={1} />);
    cy.get('a[href="#rules"]').should('not.exist');
    cy.mount(<TableOfContentMarkdown markdown={headings} depth={3} />);
    cy.get('a[href="#strings"]').should('exist');
    cy.get('a[href="#length"]').should('not.exist');
    cy.mount(<TableOfContentMarkdown markdown={headings} depth={0} />);
    cy.get('a[href="#rules"]').should('exist');
  });
});
