import React from 'react';
import BlogPage from '~/pages/blog/index.page';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

const createPost = (type: string, date: string) => ({
  slug: `${type.toLowerCase()}-post`,
  content: `A short ${type} post.`,
  frontmatter: {
    title: `${type} post`,
    type,
    date,
    excerpt: `Excerpt of the ${type} post.`,
    cover: '/img/posts/2022/json-schema-in-5-minutes/cover.webp',
    authors: [{ name: 'Ben Hutton', photo: '/img/avatars/benhutton.webp' }],
  },
});

const blogPosts = [
  createPost('Engineering', '2024-03-01'),
  createPost('Community', '2024-02-01'),
  createPost('Update', '2024-01-01'),
];

describe('Blog Page', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = mockNextRouter();
  });

  it('should show every post when the URL has no type filter', () => {
    cy.mount(<BlogPage blogPosts={blogPosts} />);
    cy.get('section').should('have.length', 3);
  });

  it('should show only the posts of the category in the type query', () => {
    mockRouter.query = { type: 'Engineering' };
    cy.mount(<BlogPage blogPosts={blogPosts} />);
    cy.get('section').should('have.length', 1);
    cy.get('section').should('contain.text', 'Engineering post');
    cy.get('button[value="Engineering"]').should('have.class', 'bg-blue-800');
  });

  it('should support several comma-separated categories', () => {
    mockRouter.query = { type: 'Engineering,Update' };
    cy.mount(<BlogPage blogPosts={blogPosts} />);
    cy.get('section').should('have.length', 2);
    cy.get('section').should('not.contain.text', 'Community post');
  });

  it('should ignore unknown categories in the type query', () => {
    mockRouter.query = { type: 'Unknown,Engineering' };
    cy.mount(<BlogPage blogPosts={blogPosts} />);
    cy.get('section').should('have.length', 1);
    cy.get('section').should('contain.text', 'Engineering post');
  });
});
