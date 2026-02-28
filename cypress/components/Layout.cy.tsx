/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */
import React from 'react';
import Layout from '~/components/Layout';
import { ThemeProvider } from 'next-themes';
import { SectionContext } from '~/context';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

describe('Layout Component', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = mockNextRouter();
    // Mock the useTheme hook
    cy.stub(require('next-themes'), 'useTheme').returns({
      resolvedTheme: 'light',
      theme: 'light',
      setTheme: cy.stub(),
    });
  });

  const mountLayout = (props = {}) => {
    cy.mount(
      <ThemeProvider>
        <SectionContext.Provider value='docs'>
          <Layout {...props}>
            <div data-testid='content'>Test content</div>
          </Layout>
        </SectionContext.Provider>
      </ThemeProvider>,
    );
  };

  describe('Basic Rendering', () => {
    it('should render the layout with children', () => {
      mountLayout();
      cy.get('[data-testid="content"]').should('contain', 'Test content');
    });

    // Skipping title test as Next.js Head component doesn't work reliably in Cypress component tests
    // it('should render with custom meta title', () => {
    //   mountLayout({ metaTitle: 'Test Page' });
    //   cy.get('title').should('contain', 'JSON Schema - Test Page');
    // });

    it('should render with white background when whiteBg is true', () => {
      mountLayout({ whiteBg: true });
      cy.get('main').parent().should('have.class', 'bg-white');
    });

    it('should render with custom main className', () => {
      mountLayout({ mainClassName: 'custom-main-class' });
      cy.get('main').should('have.class', 'custom-main-class');
    });
  });

  describe('Header', () => {
    it('should render the header with correct styling', () => {
      mountLayout();
      cy.get('header')
        .should('have.class', 'w-full')
        .and('have.class', 'bg-white')
        .and('have.class', 'dark:bg-slate-800')
        .and('have.class', 'fixed')
        .and('have.class', 'top-0')
        .and('have.class', 'z-[170]')
        .and('have.class', 'shadow-xl')
        .and('have.class', 'drop-shadow-lg');
    });

    it('should render the logo', () => {
      mountLayout();
      cy.get('header')
        .find('img[alt="JSON Schema logo - Return to homepage"]')
        .should('exist');
    });

    it('should have logo link to home page', () => {
      mountLayout();
      cy.get('header').find('a[href="/"]').should('exist');
    });
  });

  describe('Main Navigation', () => {
    const navigationLinks = [
      { label: 'Specification', uri: '/specification' },
      { label: 'Docs', uri: '/docs' },
      {
        label: 'Tools',
        uri: '/tools?query=&sortBy=name&sortOrder=ascending&groupBy=toolingTypes&licenses=&languages=&drafts=&toolingTypes=&environments=',
      },
      { label: 'Blog', uri: '/blog' },
      { label: 'Community', uri: '/community' },
    ];

    it('should render all main navigation links', () => {
      mountLayout();
      navigationLinks.forEach((link) => {
        cy.get('header').contains(link.label).should('exist');
      });
    });

    it('should have correct href attributes for navigation links', () => {
      mountLayout();
      navigationLinks.forEach((link) => {
        cy.get('header')
          .contains(link.label)
          .closest('a')
          .should('have.attr', 'href', link.uri);
      });
    });

    it('should hide navigation links on mobile', () => {
      mountLayout();
      cy.get('header').contains('Specification').should('have.class', 'hidden');
      cy.get('header').contains('Docs').should('have.class', 'hidden');
      cy.get('header').contains('Tools').should('have.class', 'hidden');
      cy.get('header').contains('Blog').should('have.class', 'hidden');
      cy.get('header').contains('Community').should('have.class', 'hidden');
    });

    it('should show navigation links on large screens', () => {
      mountLayout();
      cy.get('header')
        .contains('Specification')
        .should('have.class', 'lg:block');
      cy.get('header').contains('Docs').should('have.class', 'lg:block');
      cy.get('header').contains('Tools').should('have.class', 'lg:block');
      cy.get('header').contains('Blog').should('have.class', 'lg:block');
      cy.get('header').contains('Community').should('have.class', 'lg:block');
    });
  });

  describe('Search Component', () => {
    it('should render the search component', () => {
      mountLayout();
      // DocSearch component doesn't have a specific data-testid, so we check for the container
      cy.get('header').find('.rounded-md').should('exist');
    });

    it('should have correct styling for search container', () => {
      mountLayout();
      cy.get('header')
        .find('.rounded-md')
        .should('have.class', 'dark:hover:bg-gray-700')
        .and('have.class', 'hover:bg-gray-100')
        .and('have.class', 'focus:bg-gray-100')
        .and('have.class', 'focus:outline-none')
        .and('have.class', 'transition')
        .and('have.class', 'duration-150');
    });
  });

  describe('Dark Mode Toggle', () => {
    it('should render the dark mode toggle', () => {
      mountLayout();
      cy.get('header').find('[data-test="dark-mode-toggle"]').should('exist');
    });
  });

  describe('GitHub Star Button', () => {
    it('should render the GitHub star button', () => {
      mountLayout();
      cy.get('header').find('[data-testid="Button-link"]').should('exist');
    });

    it('should have correct GitHub link', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .should(
          'have.attr',
          'href',
          'https://github.com/json-schema-org/json-schema-spec',
        );
    });

    it('should open GitHub link in new tab', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .should('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer');
    });

    it('should contain GitHub icon', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .find('svg')
        .should('exist')
        .and('have.class', 'w-6')
        .and('have.class', 'h-6')
        .and('have.class', 'size-7');
    });

    it('should contain "Star on GitHub" text', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .should('contain', 'Star on GitHub');
    });

    it('should have correct button styling', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .should('have.class', 'bg-primary')
        .and('have.class', 'hover:bg-blue-700')
        .and('have.class', 'text-white')
        .and('have.class', 'transition-all')
        .and('have.class', 'duration-500')
        .and('have.class', 'ease-in-out')
        .and('have.class', 'rounded-md')
        .and('have.class', 'px-3')
        .and('have.class', 'text-sm')
        .and('have.class', 'font-medium')
        .and('have.class', 'tracking-heading')
        .and('have.class', 'py-2.5')
        .and('have.class', 'ml-2');
    });

    it('should be hidden on mobile screens', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .should('have.class', 'hidden');
    });

    it('should be visible on large screens', () => {
      mountLayout();
      cy.get('header')
        .find('[data-testid="Button-link"]')
        .should('have.class', 'lg:flex');
    });
  });

  describe('Mobile Navigation', () => {
    it('should render hamburger menu on mobile', () => {
      mountLayout();
      cy.get('header').find('.block.lg\\:hidden').should('exist');
    });

    it('should show mobile navigation when hamburger is clicked', () => {
      mountLayout();
      // Click hamburger menu
      cy.get('header').find('.block.lg\\:hidden').click();

      // Check if mobile nav is visible
      cy.get('.flex.flex-col.lg\\:hidden').should('be.visible');
    });

    it('should hide mobile navigation when close button is clicked', () => {
      mountLayout();
      // Open mobile nav
      cy.get('header').find('.block.lg\\:hidden').click();

      // Click close button
      cy.get('header').find('.h-6.w-6.lg\\:hidden').click();

      // Check if mobile nav is hidden - it should not exist in DOM when hidden
      cy.get('.flex.flex-col.lg\\:hidden').should('not.exist');
    });

    it('should render mobile navigation links', () => {
      mountLayout();
      // Open mobile nav
      cy.get('header').find('.block.lg\\:hidden').click();

      // Check mobile nav links
      cy.get('.flex.flex-col.lg\\:hidden')
        .contains('Specification')
        .should('exist');
      cy.get('.flex.flex-col.lg\\:hidden').contains('Docs').should('exist');
      cy.get('.flex.flex-col.lg\\:hidden').contains('Tools').should('exist');
      cy.get('.flex.flex-col.lg\\:hidden').contains('Blog').should('exist');
      cy.get('.flex.flex-col.lg\\:hidden')
        .contains('Community')
        .should('exist');
    });
  });

  describe('Footer', () => {
    it('should render the footer', () => {
      mountLayout();
      cy.get('footer').should('exist');
    });

    it('should have correct footer styling', () => {
      mountLayout();
      cy.get('footer')
        .should('have.class', 'z-10')
        .and('have.class', 'h-[350px]')
        .and('have.class', 'md:h-[300px]')
        .and('have.class', 'bg-gradient-to-r')
        .and('have.class', 'from-startBlue')
        .and('have.class', 'to-endBlue')
        .and('have.class', 'dark:from-[#002C34]')
        .and('have.class', 'dark:to-[#023e8a]')
        .and('have.class', 'clip-top')
        .and('have.class', 'grid')
        .and('have.class', 'items-center');
    });

    it('should render the white logo in footer', () => {
      mountLayout();
      cy.get('footer').find('img[alt="logo-white"]').should('exist');
    });

    it('should render social media links', () => {
      mountLayout();
      cy.get('footer').contains('Slack').should('exist');
      cy.get('footer').contains('X').should('exist');
      cy.get('footer').contains('LinkedIn').should('exist');
      cy.get('footer').contains('Youtube').should('exist');
      cy.get('footer').contains('GitHub').should('exist');
    });

    it('should have correct social media links', () => {
      mountLayout();
      cy.get('footer')
        .find('a[href="https://json-schema.org/slack"]')
        .should('exist');
      cy.get('footer')
        .find('a[href="https://x.com/jsonschema"]')
        .should('exist');
      cy.get('footer')
        .find('a[href="https://linkedin.com/company/jsonschema/"]')
        .should('exist');
      cy.get('footer')
        .find('a[href="https://www.youtube.com/@JSONSchemaOrgOfficial"]')
        .should('exist');
      cy.get('footer')
        .find('a[href="https://github.com/json-schema-org"]')
        .should('exist');
    });

    it('should render Open Collective link', () => {
      mountLayout();
      cy.get('footer').contains('Open Collective').should('exist');
      cy.get('footer')
        .find('a[href="https://opencollective.com/json-schema"]')
        .should('exist');
    });

    it('should render Code of Conduct link', () => {
      mountLayout();
      cy.get('footer').contains('Code of Conduct').should('exist');
      cy.get('footer')
        .find('a[href="/overview/code-of-conduct"]')
        .should('exist');
    });

    it('should render copyright text', () => {
      mountLayout();
      cy.get('footer').should('contain', 'Copyright');
      cy.get('footer').should('contain', 'JSON Schema');
      cy.get('footer').should('contain', 'All rights reserved.');
    });

    it('should display current year in copyright', () => {
      mountLayout();
      const currentYear = new Date().getFullYear();
      cy.get('footer').should('contain', currentYear.toString());
    });
  });

  describe('Analytics Script', () => {
    it('should include Plausible analytics script', () => {
      mountLayout();
      cy.get(
        'script[src="https://plausible.io/js/script.tagged-events.js"]',
      ).should('exist');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive header layout', () => {
      mountLayout();
      cy.get('header')
        .find('.flex.w-full.md\\:justify-between')
        .should('exist');
    });

    it('should have responsive footer layout', () => {
      mountLayout();
      cy.get('footer')
        .find('.grid.grid-cols-1.md\\:grid-cols-2')
        .should('exist');
    });

    it('should have responsive main content', () => {
      mountLayout();
      cy.get('main').should('have.class', 'z-10');
    });
  });

  describe('Theme Integration', () => {
    it('should support dark mode classes', () => {
      mountLayout();
      cy.get('header').should('have.class', 'dark:bg-slate-800');
      cy.get('footer').should('have.class', 'dark:from-[#002C34]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      mountLayout();
      cy.get('img[alt="JSON Schema logo - Return to homepage"]').should(
        'exist',
      );
      cy.get('img[alt="logo-white"]').should('exist');
      cy.get('img[alt="Slack logo"]').should('exist');
      cy.get('img[alt="X logo"]').should('exist');
      cy.get('img[alt="LinkedIn logo"]').should('exist');
      cy.get('img[alt="YouTube logo"]').should('exist');
      cy.get('img[alt="GitHub logo"]').should('exist');
    });

    it('should have proper link attributes', () => {
      mountLayout();
      cy.get('a[target="_blank"]').each(($el) => {
        cy.wrap($el).should('have.attr', 'rel', 'noopener noreferrer');
      });
    });
  });
});
