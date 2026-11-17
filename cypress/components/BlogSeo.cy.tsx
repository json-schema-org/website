import React from 'react';
import BlogSeo from '~/components/BlogSeo';
import {
  normalizeBlogMetadata,
  sanitizePlainText,
  normalizeCanonicalUrl,
  normalizeAssetUrl,
  PRODUCTION_ORIGIN,
  type BlogMetadata,
} from '~/lib/blogMetadata';

describe('Blog Metadata Normalization and BlogSeo Component', () => {
  describe('Plain Text Sanitization', () => {
    it('strips markdown links, bold, code, and HTML tags', () => {
      const raw =
        '<p>A <strong>great</strong> post with [a link](https://example.com) and `inline code` &amp; &quot;quotes&quot;.</p>';
      const cleaned = sanitizePlainText(raw);
      expect(cleaned).to.equal(
        'A great post with a link and inline code & "quotes".',
      );
    });

    it('collapses multiple whitespace characters and newlines', () => {
      const raw = '   Line 1\n\n   Line 2\t\twith   spaces.   ';
      const cleaned = sanitizePlainText(raw);
      expect(cleaned).to.equal('Line 1 Line 2 with spaces.');
    });
  });

  describe('Canonical URL Normalization', () => {
    it('preserves clean HTTP and HTTPS URLs including trailing slashes', () => {
      const urlWithSlash =
        'https://simonplend.com/get-started-with-validation-in-node-js/';
      expect(normalizeCanonicalUrl(urlWithSlash)).to.equal(urlWithSlash);

      const urlWithoutSlash =
        'https://techblog.babyl.ca/entry/hyperborea-character';
      expect(normalizeCanonicalUrl(urlWithoutSlash)).to.equal(urlWithoutSlash);
    });

    it('strips query parameters and fragments under clean-URL policy', () => {
      const dirtyUrl =
        'https://blog.postman.com/how-postman-uses-json-schema/?utm_source=twitter&ref=feed#introduction';
      expect(normalizeCanonicalUrl(dirtyUrl)).to.equal(
        'https://blog.postman.com/how-postman-uses-json-schema/',
      );
    });

    it('rejects malformed URLs or unsafe schemes', () => {
      expect(() => normalizeCanonicalUrl('javascript:alert(1)')).to.throw(
        'Unsupported protocol',
      );
      expect(() =>
        normalizeCanonicalUrl('data:text/html;base64,PHNjcmlwdD4='),
      ).to.throw('Unsupported protocol');
      expect(() => normalizeCanonicalUrl('not-a-valid-url')).to.throw(
        'Malformed canonicalLink',
      );
    });
  });

  describe('Cover Asset URL Normalization', () => {
    it('resolves root-relative paths against production origin', () => {
      const relative = '/img/posts/2026/ietf-cooperation/cover.webp';
      expect(normalizeAssetUrl(relative)).to.equal(
        `${PRODUCTION_ORIGIN}${relative}`,
      );
    });

    it('preserves valid absolute external image URLs', () => {
      const external = 'https://images.example.com/cover.png';
      expect(normalizeAssetUrl(external)).to.equal(external);
    });

    it('returns null for empty or invalid paths', () => {
      expect(normalizeAssetUrl('')).to.be.null;
      expect(normalizeAssetUrl(null)).to.be.null;
      expect(normalizeAssetUrl('   ')).to.be.null;
    });
  });

  describe('Metadata Precedence and Fallbacks', () => {
    it('prefers explicit seoDescription over excerpt', () => {
      const meta = normalizeBlogMetadata('test-post', {
        title: 'Test Article',
        seoDescription: 'Explicit SEO Description',
        excerpt: 'Visible Excerpt',
      });
      expect(meta.description).to.equal('Explicit SEO Description');
    });

    it('falls back to excerpt when seoDescription is omitted or empty', () => {
      const meta = normalizeBlogMetadata('test-post', {
        title: 'Test Article',
        excerpt: 'Fallback Excerpt Text',
      });
      expect(meta.description).to.equal('Fallback Excerpt Text');
    });

    it('falls back to excerpt when seoDescription is whitespace-only', () => {
      const meta = normalizeBlogMetadata('test-post', {
        title: 'Test Article',
        seoDescription: '   \n\t  ',
        excerpt: 'Fallback Excerpt Text',
      });
      expect(meta.description).to.equal('Fallback Excerpt Text');
    });

    it('throws an actionable build-time diagnostic when both description sources are missing', () => {
      expect(() =>
        normalizeBlogMetadata('missing-desc-post', {
          title: 'Article Without Description',
        }),
      )
        .to.throw()
        .with.property('message')
        .that.matches(
          /Missing description for blog post "missing-desc-post": provide either 'seoDescription' or 'excerpt' in frontmatter\./,
        );
    });

    it('throws an actionable build-time diagnostic when title is missing', () => {
      expect(() =>
        normalizeBlogMetadata('missing-title-post', {
          excerpt: 'Some excerpt',
        }),
      )
        .to.throw()
        .with.property('message')
        .that.matches(
          /Missing title for blog post "missing-title-post": provide 'title' in frontmatter\./,
        );
    });
  });

  describe('Original-Publication Canonical Overrides', () => {
    it('preserves the three known original-publication overrides', () => {
      const hyperborea = normalizeBlogMetadata('hyperborea', {
        title: 'Astonishing Serializations & Schemas of Hyperborea',
        excerpt:
          'Using JSON Schema for validating role-playing character sheets.',
        canonicalLink: 'https://techblog.babyl.ca/entry/hyperborea-character',
      });
      expect(hyperborea.pageUrl).to.equal(
        `${PRODUCTION_ORIGIN}/blog/posts/hyperborea`,
      );
      expect(hyperborea.canonicalUrl).to.equal(
        'https://techblog.babyl.ca/entry/hyperborea-character',
      );

      const nodeValidation = normalizeBlogMetadata(
        'get-started-with-json-schema-in-node-js',
        {
          title: 'Get started with JSON Schema in Node.js',
          excerpt:
            'Learn how to use JSON Schema for validation in your Node.js applications.',
          canonicalLink:
            'https://simonplend.com/get-started-with-validation-in-node-js/',
        },
      );
      expect(nodeValidation.canonicalUrl).to.equal(
        'https://simonplend.com/get-started-with-validation-in-node-js/',
      );

      const postman = normalizeBlogMetadata('postman-case-study', {
        title: 'How Postman uses JSON Schema',
        excerpt: 'Postman case study excerpt.',
        canonicalLink: 'https://blog.postman.com/how-postman-uses-json-schema/',
      });
      expect(postman.canonicalUrl).to.equal(
        'https://blog.postman.com/how-postman-uses-json-schema/',
      );
    });

    it('defaults to self-canonical for standard articles', () => {
      const ordinary = normalizeBlogMetadata('json-schema-in-5-minutes', {
        title: 'JSON Schema in 5 Minutes',
        excerpt: 'A quick tour of JSON Schema.',
      });
      expect(ordinary.pageUrl).to.equal(
        `${PRODUCTION_ORIGIN}/blog/posts/json-schema-in-5-minutes`,
      );
      expect(ordinary.canonicalUrl).to.equal(ordinary.pageUrl);
    });
  });

  describe('Author and Social Metadata Extraction', () => {
    it('extracts author names and author twitter creator', () => {
      const meta = normalizeBlogMetadata('author-test', {
        title: 'Author Test',
        excerpt: 'Excerpt text',
        authors: [
          {
            name: 'Simon Plenderleith',
            twitter: 'simonplend',
          },
          {
            name: 'Co-Author',
          },
        ],
      });
      expect(meta.authors).to.deep.equal(['Simon Plenderleith', 'Co-Author']);
      expect(meta.twitterCreator).to.equal('@simonplend');
    });

    it('handles string authors without error', () => {
      const meta = normalizeBlogMetadata('string-author-test', {
        title: 'Author Test',
        excerpt: 'Excerpt text',
        authors: ['Solo Author'],
      });
      expect(meta.authors).to.deep.equal(['Solo Author']);
      expect(meta.twitterCreator).to.be.null;
    });
  });

  describe('BlogSeo Component Mounting', () => {
    it('mounts cleanly with complete metadata', () => {
      const sampleMeta: BlogMetadata = {
        title: 'Test Article Title',
        description: 'Test Article Description',
        pageUrl: `${PRODUCTION_ORIGIN}/blog/posts/test-article`,
        canonicalUrl: `${PRODUCTION_ORIGIN}/blog/posts/test-article`,
        coverUrl: `${PRODUCTION_ORIGIN}/img/posts/cover.jpg`,
        authors: ['Test Author'],
        twitterCreator: '@testauthor',
        date: '2026-07-06T00:00:00.000Z',
        language: 'en',
      };

      cy.mount(<BlogSeo metadata={sampleMeta} />);
      // Verify component mounts without throwing
      cy.wrap(true).should('be.true');
    });
  });
});
