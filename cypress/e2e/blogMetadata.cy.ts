import type { getStaticProps } from '~/pages/blog/posts/[slug].page';

describe('Blog Metadata and Client Navigation Tests', () => {
  const PRODUCTION_ORIGIN = 'https://json-schema.org';
  const BASE_URL = Cypress.config('baseUrl') || 'http://localhost:3000';

  before(() => {
    // Warm up the local dev server so that cy.request calls succeed
    cy.visit(`${BASE_URL}/`, {
      retryOnStatusCodeFailure: true,
      timeout: 60000,
    });
  });

  describe('Server-Side Article Metadata', () => {
    const apostrophe = String.fromCharCode(39);
    const cases = [
      {
        slug: 'json-schema-in-5-minutes',
        title: 'JSON Schema in 5 minutes',
        description:
          'Everyone needs good fundamentals, and understanding the basics of JSON Schema changes how you read, reason, and develop Schemas.',
        canonicalUrl: `${PRODUCTION_ORIGIN}/blog/posts/json-schema-in-5-minutes`,
      },
      {
        slug: 'hyperborea',
        title: 'Astonishing Serializations & Schemas of Hyperborea',
        description:
          'Using JSON Schema for validating role-playing character sheets.',
        canonicalUrl: 'https://techblog.babyl.ca/entry/hyperborea-character',
      },
      {
        slug: 'ietf-cooperation',
        title: 'JSON Schema and IETF',
        description: `An update on JSON Schema${apostrophe}s discussions with the IETF, specification publication plans, and the community${apostrophe}s next steps.`,
        canonicalUrl: `${PRODUCTION_ORIGIN}/blog/posts/ietf-cooperation`,
      },
    ];

    cases.forEach(({ slug, title, description, canonicalUrl }) => {
      it(`prepares article props and metadata for ${slug}`, () => {
        cy.request(`${BASE_URL}/blog/posts/${slug}`);
        cy.task<{
          result: Awaited<ReturnType<typeof getStaticProps>>;
          coverage: Record<string, unknown>;
        }>('blogStaticProps', slug).then(({ result, coverage }) => {
          expect(result.props.hasCustomSeo).to.eq(true);
          expect(result.props.frontmatter.title).to.eq(title);
          expect(result.props.content).to.be.a('string').and.not.be.empty;
          expect(result.props.metadata.title).to.eq(title);
          expect(result.props.metadata.pageUrl).to.eq(
            `${PRODUCTION_ORIGIN}/blog/posts/${slug}`,
          );
          expect(result.props.metadata.canonicalUrl).to.eq(canonicalUrl);
          expect(result.props.metadata.description).to.eq(description);
          cy.task('combineCoverage', JSON.stringify(coverage), { log: false });
        });
      });
    });
  });

  describe('Raw HTML and Direct Navigation Verification', () => {
    it('serves normal article with exactly one title, description, and self-canonical', () => {
      cy.request(`${BASE_URL}/blog/posts/json-schema-in-5-minutes`).then(
        (response) => {
          expect(response.status).to.eq(200);
          const html = response.body;

          // Exactly one title matching article
          const titleMatches =
            html.match(/<title[^>]*>([^<]+)<\/title>/g) || [];
          expect(titleMatches.length).to.eq(1);
          expect(titleMatches[0]).to.contain('JSON Schema in 5 minutes');

          // Exactly one meta description matching excerpt, not generic
          const descMatches =
            html.match(/<meta\s+name=["']description["'][^>]*>/gi) || [];
          expect(descMatches.length).to.eq(1);
          expect(descMatches[0]).to.not.contain('content="JSON Schema"');
          expect(descMatches[0]).to.contain('content=');

          // Exactly one canonical tag pointing to production self-canonical
          const canonicalMatches =
            html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
          expect(canonicalMatches.length).to.eq(1);
          expect(canonicalMatches[0]).to.contain(
            `href="${PRODUCTION_ORIGIN}/blog/posts/json-schema-in-5-minutes"`,
          );

          // Open Graph and Twitter tags
          expect(html).to.match(
            /<meta\s+property=["']og:type["']\s+content=["']article["']/i,
          );
          expect(html).to.match(
            /<meta\s+property=["']og:title["']\s+content=["']JSON Schema in 5 minutes["']/i,
          );
          const ogUrlMatches =
            html.match(/<meta\s+property=["']og:url["'][^>]*>/gi) || [];
          expect(ogUrlMatches.length).to.eq(1);
          expect(ogUrlMatches[0]).to.contain(
            `content="${PRODUCTION_ORIGIN}/blog/posts/json-schema-in-5-minutes"`,
          );
          expect(html).to.match(
            /<meta\s+name=["']twitter:card["']\s+content=["'](summary_large_image|summary)["']/i,
          );
        },
      );
    });

    it('preserves external canonicalLink override for hyperborea', () => {
      cy.request(`${BASE_URL}/blog/posts/hyperborea`).then((response) => {
        expect(response.status).to.eq(200);
        const html = response.body;

        const expectedCanonical =
          'https://techblog.babyl.ca/entry/hyperborea-character';
        const canonicalMatches =
          html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
        expect(canonicalMatches.length).to.eq(1);
        expect(canonicalMatches[0]).to.contain(`href="${expectedCanonical}"`);

        // og:url must match the canonical URL
        const ogUrlMatches =
          html.match(/<meta\s+property=["']og:url["'][^>]*>/gi) || [];
        expect(ogUrlMatches.length).to.eq(1);
        expect(ogUrlMatches[0]).to.contain(`content="${expectedCanonical}"`);
      });
    });

    it('preserves external canonicalLink override for get-started-with-json-schema-in-node-js', () => {
      cy.request(
        `${BASE_URL}/blog/posts/get-started-with-json-schema-in-node-js`,
      ).then((response) => {
        expect(response.status).to.eq(200);
        const html = response.body;

        const expectedCanonical =
          'https://simonplend.com/get-started-with-validation-in-node-js/';
        const canonicalMatches =
          html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
        expect(canonicalMatches.length).to.eq(1);
        expect(canonicalMatches[0]).to.contain(`href="${expectedCanonical}"`);

        const ogUrlMatches =
          html.match(/<meta\s+property=["']og:url["'][^>]*>/gi) || [];
        expect(ogUrlMatches.length).to.eq(1);
        expect(ogUrlMatches[0]).to.contain(`content="${expectedCanonical}"`);
      });
    });

    it('preserves external canonicalLink override for postman-case-study', () => {
      cy.request(`${BASE_URL}/blog/posts/postman-case-study`).then(
        (response) => {
          expect(response.status).to.eq(200);
          const html = response.body;

          const expectedCanonical =
            'https://blog.postman.com/how-postman-uses-json-schema/';
          const canonicalMatches =
            html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
          expect(canonicalMatches.length).to.eq(1);
          expect(canonicalMatches[0]).to.contain(`href="${expectedCanonical}"`);

          const ogUrlMatches =
            html.match(/<meta\s+property=["']og:url["'][^>]*>/gi) || [];
          expect(ogUrlMatches.length).to.eq(1);
          expect(ogUrlMatches[0]).to.contain(`content="${expectedCanonical}"`);
        },
      );
    });

    it('uses content-derived seoDescription for ietf-cooperation', () => {
      cy.request(`${BASE_URL}/blog/posts/ietf-cooperation`).then((response) => {
        expect(response.status).to.eq(200);
        const html = response.body;

        const apostrophe = String.fromCharCode(39);
        const expectedDesc = `An update on JSON Schema${apostrophe}s discussions with the IETF, specification publication plans, and the community${apostrophe}s next steps.`;
        const descMatches =
          html.match(/<meta\s+name=["']description["'][^>]*>/gi) || [];
        expect(descMatches.length).to.eq(1);
        expect(descMatches[0].replace(/&#x27;/g, apostrophe)).to.contain(
          expectedDesc,
        );

        expect(html.replace(/&#x27;/g, apostrophe)).to.contain(
          `property="og:description" content="${expectedDesc}"`,
        );
        expect(html.replace(/&#x27;/g, apostrophe)).to.contain(
          `name="twitter:description" content="${expectedDesc}"`,
        );
      });
    });

    it('retains default generic title and description on non-blog pages', () => {
      cy.request(`${BASE_URL}/docs`).then((response) => {
        expect(response.status).to.eq(200);
        const html = response.body;

        const titleMatches = html.match(/<title[^>]*>([^<]+)<\/title>/g) || [];
        expect(titleMatches.length).to.eq(1);
        expect(titleMatches[0]).to.contain('Welcome');

        const descMatches =
          html.match(/<meta\s+name=["']description["'][^>]*>/gi) || [];
        expect(descMatches.length).to.eq(1);
        expect(descMatches[0]).to.contain('content="JSON Schema');

        // No article tags on docs page
        expect(html).to.not.contain('property="og:type" content="article"');
      });
    });
  });

  describe('Client-Side Navigation and Metadata Cleanup', () => {
    it('updates metadata upon entering an article and cleans up stale tags when navigating away', () => {
      // 1. Visit the blog index
      cy.visit(`${BASE_URL}/blog`);

      // 2. Set sentinel on window object to prove client-side transition without full page reload
      cy.window().then((win: any) => {
        win.__CLIENT_NAV_SENTINEL__ = 'active-session-12345';
      });

      // 3. Navigate into an article via Next.js Link
      cy.get('a[href^="/blog/posts/"]').first().click();

      // 4. Verify URL has changed
      cy.url().should('include', '/blog/posts/');

      // 5. Verify the sentinel is still intact (no full page reload occurred)
      cy.window().should((win: any) => {
        expect(win.__CLIENT_NAV_SENTINEL__).to.eq('active-session-12345');
      });

      // 6. Verify article-specific metadata is now active
      cy.title().should('not.eq', 'JSON Schema Blog');
      cy.get('meta[name="description"]').should('exist');
      cy.get('link[rel="canonical"]').should('exist');
      cy.get('meta[property="og:type"]').should(
        'have.attr',
        'content',
        'article',
      );
      cy.get('meta[property="og:url"]').should('exist');
      cy.get('meta[name="twitter:card"]').should('exist');

      // 7. Click internal "Go back to blog" link to navigate away
      cy.contains('Go back to blog').click();

      // 8. Verify URL is back to /blog
      cy.url().should('include', '/blog');

      // 9. Sentinel must still be intact
      cy.window().should((win: any) => {
        expect(win.__CLIENT_NAV_SENTINEL__).to.eq('active-session-12345');
      });

      // 10. Stale article-only tags must be removed
      cy.get('link[rel="canonical"]').should('not.exist');
      cy.get('meta[property="og:type"]').should('not.exist');
      cy.get('meta[property="og:url"]').should('not.exist');
      cy.get('meta[name="twitter:card"]').should('not.exist');

      // 11. Generic metadata restored on /blog
      cy.title().should('eq', 'JSON Schema Blog');
      cy.get('meta[name="description"]').should(
        'have.attr',
        'content',
        'JSON Schema',
      );
    });
  });

  describe('Crawl All 49 Exported Blog Articles', () => {
    const articles = [
      '6-river-systems-case-study',
      'GSOD-docs-project-2024',
      'advanced-json-schema-with-slashdb',
      'and-then-there-were-three',
      'apidays-paris-2023-recap',
      'apidays-paris-2024-recap',
      'apidays-paris-2025-recap',
      'applicability-json-schema-fundamentals-part-1',
      'bowtie-intro',
      'bundling-json-schema-compound-documents',
      'code-of-conduct-for-json-schema',
      'cookpad-case-study-en',
      'cookpad-case-study-jp',
      'custom-annotations-will-continue',
      'dottxt-case-study',
      'dynamicref-and-generics',
      'fixing-json-schema-output',
      'future-of-json-schema',
      'get-started-with-json-schema-in-node-js',
      'github-case-study',
      'gsoc24-wrapup',
      'gsoc25-wrapup',
      'hello-2023--hello-json-schema-community',
      'hello-world-hello-postman',
      'hyperborea',
      'ietf-cooperation',
      'interpreting-output',
      'joining-postman',
      'json-schema-adopters',
      'json-schema-ambassadors',
      'json-schema-in-5-minutes',
      'json-schema-joins-the-openjsf',
      'manfred-case-study-es',
      'manfred-case-study',
      'modelling-inheritance',
      'new-website',
      'oracle-case-study',
      'postman-case-study',
      'remote-case-study',
      'rxdb-case-study',
      'schema-static-analysis',
      'stable-json-schema',
      'the-architectural-scope-of-json-schema',
      'the-last-breaking-change',
      'tyler-technologies-case-study',
      'understanding-lexical-dynamic-scopes',
      'validating-openapi-and-json-schema',
      'w3c-wot-case-study',
      'website-analytics-snapshot-2023',
    ];

    it(`verifies all ${articles.length} articles have exactly 1 title, 1 description, 1 canonical and og tags`, () => {
      articles.forEach((slug) => {
        cy.request(`${BASE_URL}/blog/posts/${slug}`).then((res) => {
          expect(res.status).to.eq(200);
          const body = res.body;

          // Exactly 1 title
          const titles = body.match(/<title[^>]*>([^<]+)<\/title>/g) || [];
          expect(titles.length, `Title count for ${slug}`).to.eq(1);

          // Exactly 1 description
          const descs =
            body.match(/<meta\s+name=["']description["'][^>]*>/gi) || [];
          expect(descs.length, `Description count for ${slug}`).to.eq(1);
          expect(
            descs[0],
            `Non-generic description for ${slug}`,
          ).to.not.contain('content="JSON Schema"');

          // Exactly 1 canonical
          const canonicals =
            body.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
          expect(canonicals.length, `Canonical count for ${slug}`).to.eq(1);

          // Open Graph type = article
          expect(body, `OG type for ${slug}`).to.match(
            /<meta\s+property=["']og:type["']\s+content=["']article["']/i,
          );
        });
      });
    });
  });
});
