import React from 'react';
import dedupeHeadingIds from '~/lib/dedupeHeadingIds';
import StyledMarkdown from '~/components/StyledMarkdown';
import { TableOfContentMarkdown } from '~/components/TableOfContentMarkdown';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

const nonJsonData = [
  '## contentMediaType and contentEncoding',
  '',
  '### Example ',
  '',
  'first example',
  '',
  '### Example',
  '',
  'second example',
  '',
  '## Full example',
].join('\n');

describe('dedupeHeadingIds', () => {
  it('should leave markdown without repeated headings untouched', () => {
    const markdown = '# Title\n\n## One\n\ntext\n\n### Two\n';
    expect(dedupeHeadingIds(markdown)).to.equal(markdown);
    expect(dedupeHeadingIds('')).to.equal('');
    expect(dedupeHeadingIds('## Only one')).to.equal('## Only one');
  });

  it('should give repeated headings a numbered id and keep the first one', () => {
    expect(dedupeHeadingIds(nonJsonData)).to.equal(
      [
        '## contentMediaType and contentEncoding',
        '',
        '### Example ',
        '',
        'first example',
        '',
        '### Example[#example-1]',
        '',
        'second example',
        '',
        '## Full example',
      ].join('\n'),
    );
  });

  it('should number three or more repeats in order', () => {
    expect(
      dedupeHeadingIds('#### See also\n\n#### See also\n\n#### See also'),
    ).to.equal(
      '#### See also\n\n#### See also[#see-also-1]\n\n#### See also[#see-also-2]',
    );
  });

  it('should treat headings at different levels as repeats too', () => {
    expect(dedupeHeadingIds('## Example\n\n#### Example')).to.equal(
      '## Example\n\n#### Example[#example-1]',
    );
  });

  it('should not reuse an id that another heading already has', () => {
    expect(
      dedupeHeadingIds('## Example\n\n## Example\n\n## Example 1'),
    ).to.equal('## Example\n\n## Example[#example-2]\n\n## Example 1');
  });

  it('should ignore headings inside fenced code blocks', () => {
    const markdown = [
      '## Example',
      '```md',
      '## Example',
      '```',
      '~~~',
      '## Example',
      '~~~',
    ].join('\n');
    expect(dedupeHeadingIds(markdown)).to.equal(markdown);
  });

  it('should leave explicit [#id] headings alone but count them', () => {
    expect(
      dedupeHeadingIds('## Example[#example]\n\n## Example\n\n## Foo [#foo]'),
    ).to.equal(
      '## Example[#example]\n\n## Example[#example-1]\n\n## Foo [#foo]',
    );
    expect(dedupeHeadingIds('## A [#same]\n\n## B [#same]')).to.equal(
      '## A [#same]\n\n## B [#same]',
    );
  });

  it('should strip closing hashes and keep CRLF line endings', () => {
    expect(dedupeHeadingIds('## Example ##\r\n\r\n## Example ##\r\n')).to.equal(
      '## Example ##\r\n\r\n## Example[#example-1]\r\n',
    );
  });

  it('should handle headings with inline code and special characters', () => {
    expect(
      dedupeHeadingIds('### The `$ref` keyword\n\n### The `$ref` keyword'),
    ).to.match(/\n### The `\$ref` keyword\[#[\w-]+-1\]$/);
    expect(dedupeHeadingIds('## Q: why?\n\n## Q: why?')).to.equal(
      '## Q: why?\n\n## Q: why?',
    );
  });

  it('should not glue the id onto a heading that ends with brackets', () => {
    expect(dedupeHeadingIds('## Items []\n\n## Items []')).to.equal(
      '## Items []\n\n## Items [] \\[#items-1]',
    );
  });

  it('should skip headings that slug to nothing and h5/h6', () => {
    expect(dedupeHeadingIds('## 挑戦\n\n## 挑戦')).to.equal(
      '## 挑戦\n\n## 挑戦',
    );
    expect(dedupeHeadingIds('##### Five\n\n##### Five')).to.equal(
      '##### Five\n\n##### Five',
    );
  });

  it('should be idempotent', () => {
    const once = dedupeHeadingIds(nonJsonData);
    expect(dedupeHeadingIds(once)).to.equal(once);
  });
});

describe('Repeated headings on a page', () => {
  let mockRouter: MockRouter;
  beforeEach(() => {
    mockRouter = mockNextRouter();
    cy.window().then((win) => {
      win.history.replaceState(null, '', win.location.pathname);
    });
  });

  it('should render a unique id for each Example heading', () => {
    cy.mount(<StyledMarkdown markdown={nonJsonData} />);
    cy.get('h3').should('have.length', 2);
    cy.get('h3').eq(0).should('have.attr', 'id', 'example');
    cy.get('h3').eq(1).should('have.attr', 'id', 'example-1');
    cy.get('h3').eq(1).should('have.text', 'Example');
    cy.get('h2').eq(1).should('have.attr', 'id', 'full-example');
  });

  it('should go to the clicked Example and only highlight that one', () => {
    cy.mount(<StyledMarkdown markdown={nonJsonData} />);
    cy.get('h3').eq(1).click();
    cy.get('@routerPush').should('have.been.calledWith', '/#example-1');

    cy.window().then((win) => {
      win.location.hash = '#example-1';
    });
    cy.get('[data-test="headline-anchor"]').should('have.length', 1);
    cy.get('h3').eq(1).find('[data-test="headline-anchor"]').should('exist');
    cy.get('h3')
      .eq(0)
      .find('[data-test="headline-anchor"]')
      .should('not.exist');
  });

  it('should keep the first Example highlighted on #example', () => {
    mockRouter.asPath = '/#example';
    cy.window().then((win) => {
      win.location.hash = '#example';
    });
    cy.mount(<StyledMarkdown markdown={nonJsonData} />);
    cy.get('[data-test="headline-anchor"]').should('have.length', 1);
    cy.get('h3').eq(0).find('[data-test="headline-anchor"]').should('exist');
  });

  it('should keep ids unique across tab groups', () => {
    const markdown = [
      '## Example',
      '',
      '[tabs-start "Language"]',
      '',
      '[tab "One"]',
      '',
      '## Example',
      '',
      '[tabs-end]',
    ].join('\n');
    cy.mount(<StyledMarkdown markdown={markdown} />);
    cy.get('h2#example').should('have.length', 1);
    cy.get('h2#example-1').should('have.length', 1);
  });

  it('should render repeated headings with brackets and inline code', () => {
    cy.mount(
      <StyledMarkdown
        markdown={
          '## Items []\n\n## Items []\n\n## The `$ref` keyword\n\n## The `$ref` keyword'
        }
      />,
    );
    cy.get('h2').should('have.length', 4);
    cy.get('h2').eq(1).should('have.attr', 'id', 'items-1');
    cy.get('h2').eq(1).should('not.contain.text', '[#');
    cy.get('h2')
      .eq(1)
      .invoke('text')
      .should('match', /^Items \[\]\s*$/);
    cy.get('h2')
      .eq(3)
      .invoke('attr', 'id')
      .then((id) => {
        cy.get('h2').eq(2).invoke('attr', 'id').should('not.equal', id);
        expect(id).to.match(/-1$/);
      });
    cy.get('h2').eq(3).find('code').should('have.text', '$ref');
    cy.get('h2').eq(3).should('not.contain.text', '[#');
  });

  it('should point the table of contents at the same ids', () => {
    cy.mount(
      <TableOfContentMarkdown
        markdown={'## Intro\n\n### Example\n\n### Example'}
        depth={3}
      />,
    );
    cy.get('a').eq(1).should('have.attr', 'href', '#example');
    cy.get('a').eq(2).should('have.attr', 'href', '#example-1');
    cy.get('a').eq(2).should('not.contain.text', '[#');
  });
});
