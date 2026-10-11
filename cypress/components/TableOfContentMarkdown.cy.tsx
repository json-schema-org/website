import React from 'react';
import {
  TableOfContent,
  TableOfContentMarkdown,
} from '~/components/TableOfContentMarkdown';
import { FullMarkdownContext } from '~/context';

const markdown = `# Page Title

## First Section

## Second Section
`;

describe('TableOfContentMarkdown scroll spy', () => {
  afterEach(() => {
    cy.window().scrollTo(0, 0, { ensureScrollable: false });
    cy.window().then((win) => {
      win.location.hash = '';
    });
  });

  it('highlights the active section in the TOC while scrolling', () => {
    cy.mount(
      <>
        <h1 id='page-title'>Page Title</h1>
        <TableOfContentMarkdown markdown={markdown} depth={2} />
        <div style={{ height: '1200px' }} />
        <h2 id='first-section'>First Section</h2>
        <div style={{ height: '1200px' }} />
        <h2 id='second-section'>Second Section</h2>
        <div style={{ height: '1200px' }} />
      </>,
    );

    cy.get('[data-toc-link]').should('have.length', 3);
    cy.get('[data-toc-link]')
      .eq(0)
      .should('have.class', 'text-blue-600')
      .should('have.attr', 'aria-current', 'true');

    cy.window().scrollTo(0, 1400);
    cy.get('[data-toc-link]')
      .eq(1)
      .should('have.class', 'text-blue-600')
      .should('have.attr', 'aria-current', 'true');
    cy.get('[data-toc-link]').eq(0).should('not.have.class', 'text-blue-600');

    cy.window().scrollTo('bottom');
    cy.get('[data-toc-link]')
      .eq(2)
      .should('have.class', 'text-blue-600')
      .should('have.attr', 'aria-current', 'true');

    cy.window().scrollTo(0, 2500);
    cy.get('[data-toc-link]').eq(2).should('have.class', 'text-blue-600');
  });

  it('renders h2, h3 and h4 links according to the depth prop', () => {
    cy.mount(
      <>
        <h2 id='flat-section'>Flat section</h2>
        <TableOfContentMarkdown markdown={'## Flat section'} depth={0} />
      </>,
    );
    cy.get('[data-toc-link]')
      .should('have.length', 1)
      .and('contain', 'Flat section');

    cy.mount(
      <>
        <h3 id='nested-a'>Nested A</h3>
        <TableOfContentMarkdown
          markdown={'### Nested A\n\n#### Nested B'}
          depth={4}
        />
        <div style={{ height: '400px' }} />
        <h4 id='nested-b'>Nested B</h4>
        <div style={{ height: '600px' }} />
      </>,
    );
    cy.get('[data-toc-link]').should('have.length', 2);
    cy.get('[data-toc-link]').eq(0).should('have.class', 'text-blue-600');
    cy.window().scrollTo(0, 400);
    cy.get('[data-toc-link]').eq(1).should('have.class', 'text-blue-600');
  });

  it('renders no links for headings deeper than the depth prop', () => {
    cy.mount(
      <>
        <h2 id='flat-section'>Flat section</h2>
        <TableOfContentMarkdown markdown={'## Flat section'} depth={1} />
      </>,
    );
    cy.get('[data-toc-link]').should('have.length', 0);

    cy.mount(
      <>
        <h3 id='nested-a'>Nested A</h3>
        <h4 id='nested-b'>Nested B</h4>
        <TableOfContentMarkdown
          markdown={'### Nested A\n\n#### Nested B'}
          depth={2}
        />
      </>,
    );
    cy.get('[data-toc-link]').should('have.length', 0);
  });

  it('filters out stray headings and href-less toc links', () => {
    cy.mount(
      <>
        <a data-toc-link>Rogue</a>
        <h2 id='stray-section'>Stray</h2>
        <TableOfContentMarkdown markdown={'# Page Title'} depth={2} />
      </>,
    );
    cy.get('[data-toc-link]').should('have.length', 2);
  });

  it('falls back to the URL hash when no section is scrolled into view', () => {
    cy.window().then((win) => {
      win.location.hash = 'second-section';
    });
    cy.mount(
      <>
        <header style={{ height: '60px' }}>Header</header>
        <div style={{ height: '2000px' }} />
        <h1 id='page-title'>Page Title</h1>
        <TableOfContentMarkdown markdown={markdown} depth={2} />
        <div style={{ height: '2000px' }} />
        <h2 id='second-section'>Second Section</h2>
      </>,
    );
    cy.get('[data-toc-link]').eq(2).should('have.class', 'text-blue-600');
  });

  it('keeps no link active when the hash does not match a section', () => {
    cy.window().then((win) => {
      win.location.hash = 'missing-section';
    });
    cy.mount(
      <>
        <div style={{ height: '1000px' }} />
        <h1 id='page-title'>Page Title</h1>
        <TableOfContentMarkdown markdown={'# Page Title'} depth={2} />
      </>,
    );
    cy.get('[data-toc-link]').should('not.have.class', 'text-blue-600');
  });

  it('coalesces rapid scroll events', () => {
    cy.mount(
      <>
        <h1 id='page-title'>Page Title</h1>
        <TableOfContentMarkdown markdown={'# Page Title'} depth={2} />
      </>,
    );
    cy.window().then((win) => {
      win.dispatchEvent(new Event('scroll'));
      win.dispatchEvent(new Event('scroll'));
    });
    cy.get('[data-toc-link]').eq(0).should('have.class', 'text-blue-600');
  });
});

describe('TableOfContent wrapper', () => {
  it('renders the TOC when markdown context is available', () => {
    cy.mount(
      <FullMarkdownContext.Provider value={'# Page Title'}>
        <TableOfContent />
      </FullMarkdownContext.Provider>,
    );
    cy.get('[data-toc-link]').should('have.length', 1);
  });

  it('renders nothing without markdown context', () => {
    cy.mount(<TableOfContent depth={2} />);
    cy.get('[data-toc-link]').should('not.exist');
  });
});
