/* eslint-disable cypress/no-unnecessary-waiting */
import React from 'react';
import { SidebarLayout, DocsNav } from '~/components/Sidebar';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

describe('Sidebar Component', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = mockNextRouter();
    cy.mount(
      <SidebarLayout>
        <div data-test='sidebar-content'>
          <h1>Test Content</h1>
          <p>This is test content for the sidebar layout</p>
        </div>
      </SidebarLayout>,
    );
  });

  describe('SidebarLayout', () => {
    it('should render the sidebar layout correctly', () => {
      cy.get('[data-test="sidebar-content"]').should('exist');
      cy.get('[data-test="sidebar-content"] h1').should(
        'have.text',
        'Test Content',
      );
      cy.get('[data-test="sidebar-content"] p').should(
        'have.text',
        'This is test content for the sidebar layout',
      );
    });

    it('should render the sidebar navigation on desktop', () => {
      cy.viewport(1024, 768); // Desktop viewport
      cy.get('#sidebar').should('be.visible');
      cy.get('#sidebar').should('have.class', 'lg:mt-8');
    });

    it('should hide sidebar navigation on mobile initially', () => {
      cy.viewport(375, 667); // Mobile viewport
      // The sidebar container should be hidden on mobile
      cy.get('.hidden.lg\\:block').should('exist');
      // The mobile menu overlay should be initially closed (translated off-screen)
      cy.get('.transform.-translate-x-full').should('exist');
    });

    it('should show mobile menu toggle button', () => {
      cy.viewport(375, 667); // Mobile viewport
      // Check for the mobile header bar
      cy.get('.lg\\:hidden').should('exist');
      // Check for the mobile chevron icon
      cy.get('svg[height="24"]').should('exist'); // Mobile chevron
    });
  });

  describe('DocsNav Component', () => {
    beforeEach(() => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);
    });

    it('should render all navigation sections', () => {
      cy.contains('Introduction').should('exist');
      cy.contains('Get Started').should('exist');
      cy.contains('Guides').should('exist');
      cy.contains('Reference').should('exist');
      cy.contains('Specification').should('exist');
    });

    it('should render navigation icons', () => {
      cy.get('img[alt="eye icon"]').should('exist');
      cy.get('img[alt="compass icon"]').should('exist');
      cy.get('img[alt="grad cap icon"]').should('exist');
      cy.get('img[alt="book icon"]').should('exist');
      cy.get('img[alt="clipboard icon"]').should('exist');
    });

    it('should render collapsible arrows', () => {
      cy.get('svg[id="arrow"]').should('have.length', 5);
      cy.get('svg[id="arrow"]').each(($arrow) => {
        cy.wrap($arrow).should('have.attr', 'width', '25');
        cy.wrap($arrow).should('have.attr', 'height', '25');
      });
    });
  });

  describe('Collapsible Sections', () => {
    beforeEach(() => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);
    });

    describe('Introduction Section', () => {
      it('should expand and collapse Introduction section', () => {
        // Click to expand
        cy.contains('Introduction').click();
        // Wait for animation and check arrow rotation
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .first()
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Click to collapse
        cy.contains('Introduction').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .first()
          .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
      });

      it('should show Introduction section links when expanded', () => {
        // Click to expand
        cy.contains('Introduction').click();
        cy.wait(200); // Wait for animation to complete

        // Check that links are visible
        cy.get('a[href="/docs"]').should('be.visible');
        cy.get('a[href="/overview/what-is-jsonschema"]').should('be.visible');
        cy.get('a[href="/overview/roadmap"]').should('be.visible');
        cy.get('a[href="/overview/sponsors"]').should('be.visible');
        cy.get('a[href="/overview/use-cases"]').should('be.visible');
        cy.get('a[href="/overview/case-studies"]').should('be.visible');
        cy.get('a[href="/overview/faq"]').should('be.visible');
        cy.get('a[href="/overview/pro-help"]').should('be.visible');
        cy.get('a[href="/overview/similar-technologies"]').should('be.visible');
        cy.get('a[href="https://landscape.json-schema.org"]').should(
          'be.visible',
        );
        cy.get('a[href="/overview/code-of-conduct"]').should('be.visible');
      });
    });

    describe('Get Started Section', () => {
      it('should expand and collapse Get Started section', () => {
        // Click to expand
        cy.contains('Get Started').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(1)
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Click to collapse
        cy.contains('Get Started').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(1)
          .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
      });

      it('should show Get Started section links when expanded', () => {
        // Click to expand
        cy.contains('Get Started').click();
        cy.wait(200); // Wait for animation to complete

        // Check that links are visible
        cy.get('a[href="/learn"]').should('be.visible');
        cy.get('a[href="/understanding-json-schema/about"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/basics"]').should(
          'be.visible',
        );
        cy.get('a[href="/learn/getting-started-step-by-step"]').should(
          'be.visible',
        );
        cy.get('a[href="https://tour.json-schema.org/"]').should('be.visible');
        cy.get('a[href="/learn/glossary"]').should('be.visible');
        cy.get('a[href="/learn/miscellaneous-examples"]').should('be.visible');
        cy.get('a[href="/learn/file-system"]').should('be.visible');
        cy.get('a[href="/learn/json-schema-examples"]').should('be.visible');
      });
    });

    describe('Guides Section', () => {
      it('should expand and collapse Guides section', () => {
        // Click to expand
        cy.contains('Guides').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(2)
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Click to collapse
        cy.contains('Guides').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(2)
          .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
      });

      it('should show Guides section links when expanded', () => {
        // Click to expand
        cy.contains('Guides').click();
        cy.wait(200); // Wait for animation to complete

        // Check that links are visible
        cy.get('a[href="/learn/guides"]').should('be.visible');
        cy.get('a[href="/implementers"]').should('be.visible');
        cy.get('a[href="/implementers/interfaces"]').should('be.visible');
      });
    });

    describe('Reference Section', () => {
      it('should expand and collapse Reference section', () => {
        // Click to expand
        cy.contains('Reference').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(3)
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Click to collapse
        cy.contains('Reference').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(3)
          .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
      });

      it('should show Reference section links when expanded', () => {
        // Click to expand
        cy.contains('Reference').click();
        cy.wait(200); // Wait for animation to complete

        // Check that key links are visible (not all due to overflow)
        cy.get('a[href="/understanding-json-schema/reference"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/keywords"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/reference/type"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/reference/array"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/reference/boolean"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/reference/null"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/reference/numeric"]').should(
          'be.visible',
        );
        cy.get('a[href="/understanding-json-schema/reference/object"]').should(
          'be.visible',
        );
        cy.get(
          'a[href="/understanding-json-schema/reference/regular_expressions"]',
        ).should('be.visible');
        cy.get('a[href="/understanding-json-schema/reference/string"]').should(
          'be.visible',
        );
      });
    });

    describe('Specification Section', () => {
      it('should expand and collapse Specification section', () => {
        // Click to expand
        cy.contains('Specification').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(4)
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Click to collapse
        cy.contains('Specification').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(4)
          .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
      });

      it('should show Specification section links when expanded', () => {
        // Click to expand
        cy.contains('Specification').click();
        cy.wait(200); // Wait for animation to complete

        // Check that links are visible
        cy.get('a[href="/specification"]').should('be.visible');
        cy.get('a[href="/draft/2020-12"]').should('be.visible');
        cy.get('a[href="/draft/2019-09"]').should('be.visible');
        cy.get('a[href="/draft-07"]').should('be.visible');
        cy.get('a[href="/draft-06"]').should('be.visible');
        cy.get('a[href="/draft-05"]').should('be.visible');
        cy.get('a[href="/specification-links"]').should('be.visible');
        cy.get('a[href="/specification/migration"]').should('be.visible');
        cy.get('a[href="/specification/release-notes"]').should('be.visible');
        cy.get('a[href="/specification/json-hyper-schema"]').should(
          'be.visible',
        );
      });
    });
  });

  describe('Navigation Links', () => {
    beforeEach(() => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);
    });

    it('should have proper link styling', () => {
      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').should('have.class', 'text-sm');
      cy.get('a[href="/docs"]').should('have.class', 'block');
      cy.get('a[href="/docs"]').should('have.class', 'py-1');
      cy.get('a[href="/docs"]').should('have.class', 'pl-2');
    });

    it('should have hover effects on links', () => {
      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').trigger('mouseover');
      cy.get('a[href="/docs"]').should('have.class', 'hover:scale-105');
    });

    it('should handle external links correctly', () => {
      cy.contains('Introduction').click();
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.attr',
        'target',
        '_blank',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.attr',
        'rel',
        'noopener noreferrer',
      );
    });
  });

  describe('Responsive Behavior', () => {
    it('should show mobile menu when toggled', () => {
      cy.viewport(375, 667); // Mobile viewport
      cy.mount(
        <SidebarLayout>
          <div data-test='sidebar-content'>Test content</div>
        </SidebarLayout>,
      );

      // Initially the mobile menu should be closed (translated off-screen)
      cy.get('.transform.-translate-x-full').should('exist');

      // Click the mobile menu toggle
      cy.get('svg[height="24"]').parent().click();

      // The mobile menu should be visible (translated to visible position)
      cy.get('.transform.-translate-x-0').should('exist');
    });

    it('should show desktop sidebar when resized to desktop', () => {
      cy.viewport(375, 667); // Start with mobile
      cy.mount(
        <SidebarLayout>
          <div data-test='sidebar-content'>Test content</div>
        </SidebarLayout>,
      );

      // Open mobile menu
      cy.get('svg[height="24"]').parent().click();
      cy.get('.transform.-translate-x-0').should('exist');

      // Resize to desktop
      cy.viewport(1024, 768);
      // Wait for viewport change to be processed
      cy.wait(100);

      // On desktop, the mobile menu header should be hidden by CSS
      cy.get('.lg\\:hidden').should('exist');
      // The desktop sidebar should be visible
      cy.get('.hidden.lg\\:block').should('exist');
      // The desktop sidebar should contain the navigation
      cy.get('.hidden.lg\\:block #sidebar').should('exist');
    });
  });

  describe('Active State Management', () => {
    it('should highlight active section based on current route', () => {
      mockRouter.asPath = '/docs';
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      // Introduction section should be active
      cy.contains('Introduction').parent().should('have.class', 'bg-slate-200');
    });

    it('should highlight active link within section', () => {
      mockRouter.asPath = '/docs';
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').should('have.class', 'text-primary');
      cy.get('a[href="/docs"]').should('have.class', 'font-bold');
      cy.get('a[href="/docs"]').should('have.class', 'border-l-2');
    });
  });
});
