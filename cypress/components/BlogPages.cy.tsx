/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import Article from '~/pages/blog/posts/[slug].page';
import Blog from '~/pages/blog/index.page';
import Home from '~/pages/index.page';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';
import type { BlogFixture } from '../plugins/blogMetadataTasks';

describe('Blog page metadata and existing page behavior', () => {
  let posts: BlogFixture[];
  let router: MockRouter;
  let theme: any;

  before(() =>
    cy.task<BlogFixture[]>('blogFixtures').then((value) => {
      posts = value;
    }),
  );
  beforeEach(() => {
    router = mockNextRouter();
    theme = cy
      .stub(require('next-themes'), 'useTheme')
      .returns({ resolvedTheme: 'light', theme: 'light', setTheme: cy.stub() });
  });

  it('keeps the article title and content when optional metadata is absent', () => {
    const post = posts.find(
      (post) => post.slug === 'json-schema-in-5-minutes',
    )!;
    const updateHead = cy.spy().as('updateHead');
    cy.mount(
      <HeadManagerContext.Provider
        value={{ mountedInstances: new Set(), updateHead }}
      >
        <Article frontmatter={post.frontmatter} content={post.content} />
      </HeadManagerContext.Provider>,
    );
    cy.get('h1').should('contain.text', post.frontmatter.title);
    cy.get('a[href="https://x.com/relequestual"]').should('exist');
    cy.get('@updateHead')
      .should('have.been.called')
      .then((spy: any) => {
        expect(
          spy.lastCall.args[0].some(
            (entry: React.ReactElement) =>
              entry.type === 'title' &&
              entry.props.children === post.frontmatter.title,
          ),
        ).to.eq(true);
      });
  });

  it('paginates and combines or clears category filters', () => {
    cy.mount(<Blog blogPosts={posts} filterTag='All' />);
    cy.contains('button', 'Next').click();
    cy.contains('Page 2 of').should('be.visible');
    cy.contains('button', 'Previous').click();
    cy.contains('Page 1 of').should('be.visible');
    cy.get('button[value="Engineering"]').click();
    cy.get('button[value="Community"]').click();
    cy.get('button[value="Engineering"]').click();
    cy.get('button[value="Community"]').click();
    cy.get('button[value="All"]').should('have.class', 'bg-blue-800');
    cy.get('button[value="Engineering"]').click();
    cy.get('button[value="All"]').click();
    cy.contains('Page 1 of').should('be.visible');
    cy.get('section')
      .first()
      .find('a')
      .find('.flex.flex-wrap.gap-2 > div')
      .first()
      .click();
    cy.get('button[value="All"]').should('not.have.class', 'bg-blue-800');
  });

  it('honors initial and router filters and ranks multiple category matches first', () => {
    const mixed = posts.map((post, index) => {
      if (index !== 0) return post;
      return {
        ...post,
        frontmatter: {
          ...post.frontmatter,
          categories: ['Community', 'Engineering'],
        },
      };
    });
    router.query = { type: 'Community,Engineering' };
    cy.mount(<Blog blogPosts={mixed} filterTag='Engineering' />);
    cy.get('button[value="Engineering"]').should('have.class', 'bg-blue-800');
    cy.get('button[value="Community"]').click();
    cy.get('section')
      .first()
      .should('contain.text', mixed[0].frontmatter.title);
    cy.get('button[value="All"]').click();
    cy.contains('button', 'Next').click();
    cy.get('button[value="Opinion"]').click();
    cy.contains('Page 1 of').should('be.visible');
  });

  it('falls back safely for repeated query parameters and missing categories', () => {
    router.query = { type: ['Engineering', 'Community'] };
    const first = posts[0];
    const withoutCategory = {
      ...first,
      frontmatter: {
        ...first.frontmatter,
        type: undefined,
        categories: undefined,
      },
    };
    cy.mount(<Blog blogPosts={[withoutCategory]} filterTag='All' />);
    cy.get('section').should('have.length', 1);
    cy.contains('Page 1 of 1').should('be.visible');
  });

  it('shows a two-name summary for articles with several authors', () => {
    const post = posts.find((post) => post.frontmatter.authors.length > 2)!;
    cy.mount(<Blog blogPosts={[post]} filterTag='All' />);
    cy.get('section')
      .should('contain.text', post.frontmatter.authors[0].name)
      .and('contain.text', post.frontmatter.authors[1].name)
      .and('contain.text', '...');
  });

  it('renders the home page in both themes and opens search from the hero button', () => {
    const single = posts.find((post) => post.frontmatter.authors.length === 1)!;
    cy.mount(
      <Home
        blogPosts={[single]}
        datesInfo={[
          { day: '19', title: 'Office Hours', time: '14:00', timezone: 'UTC' },
        ]}
      />,
    );
    cy.contains('Upcoming events').parent().should('contain.text', '14:00');
    cy.get('.DocSearch-Button').then(($button) => {
      cy.stub($button[0], 'click').as('openSearch');
    });
    cy.get('.herobtn').click();
    cy.get('@openSearch').should('have.been.called');
    const multiple = posts.find((post) => post.frontmatter.authors.length > 2)!;
    theme.returns({
      resolvedTheme: 'dark',
      theme: 'dark',
      setTheme: cy.stub(),
    });
    cy.mount(<Home blogPosts={[multiple]} datesInfo={[]} />);
    cy.contains(multiple.frontmatter.authors[0].name).should('exist');
    cy.contains(multiple.frontmatter.authors[1].name).should('exist');
  });
});
