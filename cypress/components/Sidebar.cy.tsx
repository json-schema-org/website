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

    it('should have proper mobile header styling', () => {
      cy.viewport(375, 667); // Mobile viewport
      cy.get('.bg-primary').should('exist');
      cy.get('.dark\\:bg-slate-900').should('exist');
      cy.get('.h-12').should('exist');
      cy.get('.mt-\\[4\\.5rem\\]').should('exist');
    });

    it('should have proper desktop sidebar styling', () => {
      cy.viewport(1024, 768); // Desktop viewport
      cy.get('.sticky').should('exist');
      cy.get('.top-24').should('exist');
      cy.get('.h-\\[calc\\(100vh-6rem\\)\\]').should('exist');
      cy.get('.overflow-hidden').should('exist');
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

    it('should render collapsible arrows with proper styling', () => {
      cy.get('svg[id="arrow"]').should('have.length', 5);
      cy.get('svg[id="arrow"]').each(($arrow) => {
        cy.wrap($arrow).should('have.css', 'minWidth', '25px');
        cy.wrap($arrow).should('have.css', 'minHeight', '25px');
        cy.wrap($arrow).should('have.css', 'width', '25px');
        cy.wrap($arrow).should('have.css', 'height', '25px');
        // Check for transition property (browser may normalize it)
        cy.wrap($arrow)
          .should('have.css', 'transition')
          .and('include', '0.2s linear');
        cy.wrap($arrow).should('have.css', 'cursor', 'pointer');
      });
    });

    it('should have proper section styling', () => {
      cy.get('.bg-slate-200').should('exist');
      cy.get('.dark\\:bg-slate-900').should('exist');
      cy.get('.border-white').should('exist');
      cy.get('.lg\\:border-hidden').should('exist');
      cy.get('.p-3').should('exist');
      cy.get('.rounded').should('exist');
      cy.get('.transition-all').should('exist');
      cy.get('.duration-300').should('exist');
      cy.get('.group').should('exist');
    });

    it('should have proper button styling in triggers', () => {
      cy.get('button[type="button"]').should('have.class', 'flex');
      cy.get('button[type="button"]').should('have.class', 'justify-between');
      cy.get('button[type="button"]').should('have.class', 'w-full');
      cy.get('button[type="button"]').should('have.class', 'items-center');
      cy.get('button[type="button"]').should('have.class', 'h-auto');
      cy.get('button[type="button"]').should('have.class', 'p-0');
      cy.get('button[type="button"]').should(
        'have.class',
        'hover:bg-transparent',
      );
    });

    it('should have proper icon and text styling', () => {
      cy.get('img[alt="eye icon"]').should('have.class', 'mr-2');
      cy.get('img[alt="eye icon"]').should(
        'have.class',
        'transition-transform',
      );
      cy.get('img[alt="eye icon"]').should('have.class', 'duration-300');
      cy.get('img[alt="eye icon"]').should(
        'have.class',
        'group-hover:scale-110',
      );

      // Check the text styling by looking at the div containing the text
      // The text is inside a div within the button, so we need to target it correctly
      // Use a more specific selector to find the div with text styling classes
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('exist');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'text-slate-900');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'dark:text-slate-300');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'font-bold');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'text-lg');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'transition-all');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'duration-300');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'group-hover:scale-110');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'group-hover:text-blue-600');
      cy.get(
        'div.text-slate-900.dark\\:text-slate-300.font-bold.text-lg',
      ).should('have.class', 'dark:group-hover:text-[#bfdbfe]');
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

      it('should have proper collapsible content styling', () => {
        cy.contains('Introduction').click();
        cy.get('.ml-6').should('exist');
        cy.get('.transition-all').should('exist');
        cy.get('.duration-500').should('exist');
        cy.get('.ease-in-out').should('exist');
        cy.get('.overflow-hidden').should('exist');
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

      it('should show segment subtitle', () => {
        cy.contains('Get Started').click();
        cy.contains('Examples').should('exist');
        // Check for the subtitle element with its classes
        cy.contains('Examples').should('have.class', 'text-sm');
        cy.contains('Examples').should('have.class', 'italic');
        cy.contains('Examples').should('have.class', 'text-slate-900');
        cy.contains('Examples').should('have.class', 'dark:text-slate-400');
        cy.contains('Examples').should('have.class', 'mt-2');
        cy.contains('Examples').should('have.class', 'mb-2');
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

      it('should have overflow handling for Reference section', () => {
        cy.contains('Reference').click();
        cy.get('.max-h-80').should('exist');
        cy.get('.overflow-y-auto').should('exist');
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

    describe('Multiple Sections Open', () => {
      it('should allow multiple sections to be open simultaneously', () => {
        // Open Introduction section
        cy.contains('Introduction').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .first()
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Open Get Started section (should not close Introduction)
        cy.contains('Get Started').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .eq(1)
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Introduction should still be open
        cy.get('svg[id="arrow"]')
          .first()
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Both sections should have visible content
        cy.get('a[href="/docs"]').should('be.visible');
        cy.get('a[href="/learn"]').should('be.visible');
      });

      it('should handle opening and closing multiple sections independently', () => {
        // Open Introduction and Get Started
        cy.contains('Introduction').click();
        cy.contains('Get Started').click();
        cy.wait(100);

        // Close Introduction only
        cy.contains('Introduction').click();
        cy.wait(100);
        cy.get('svg[id="arrow"]')
          .first()
          .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
        cy.get('svg[id="arrow"]')
          .eq(1)
          .should('have.css', 'transform', 'matrix(-1, 0, 0, -1, 0, 0)');

        // Get Started should still be open
        cy.get('a[href="/learn"]').should('be.visible');
        // Introduction should be closed
        cy.get('a[href="/docs"]').should('not.exist');
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
      cy.get('a[href="/docs"]').should('have.class', 'hover:scale-105');
      cy.get('a[href="/docs"]').should('have.class', 'hover:text-[#007bff]');
      cy.get('a[href="/docs"]').should(
        'have.class',
        'dark:hover:text-[#bfdbfe]',
      );
      cy.get('a[href="/docs"]').should('have.class', 'dark:hover:bg-slate-800');
    });

    it('should have proper transition effects on links', () => {
      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').should('have.class', 'transition-transform');
      cy.get('a[href="/docs"]').should('have.class', 'duration-300');
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

    it('should have proper external link styling', () => {
      cy.contains('Introduction').click();
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'flex',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'text-sm',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'py-1',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'pl-2',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'transition-transform',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'duration-300',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'hover:scale-105',
      );
      cy.get('a[href="https://landscape.json-schema.org"]').should(
        'have.class',
        'hover:text-[#007bff]',
      );
    });

    it('should have external link icon styling', () => {
      cy.contains('Introduction').click();
      cy.get('a[href="https://landscape.json-schema.org"] span').should(
        'have.class',
        'dark:invert',
      );
      cy.get('a[href="https://landscape.json-schema.org"] span').should(
        'have.class',
        'flex',
      );
      cy.get('a[href="https://landscape.json-schema.org"] span').should(
        'have.class',
        'justify-center',
      );
      cy.get('a[href="https://landscape.json-schema.org"] span').should(
        'have.class',
        'items-center',
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

    it('should handle mobile menu chevron rotation', () => {
      cy.viewport(375, 667); // Mobile viewport
      cy.mount(
        <SidebarLayout>
          <div data-test='sidebar-content'>Test content</div>
        </SidebarLayout>,
      );

      // Initially chevron should not be rotated (matrix format)
      cy.get('svg[height="24"]').should(
        'have.css',
        'transform',
        'matrix(1, 0, 0, 1, 0, 0)',
      );

      // Click to open mobile menu
      cy.get('svg[height="24"]').parent().click();
      cy.wait(100);

      // Chevron should be rotated (matrix format)
      cy.get('svg[height="24"]').should(
        'have.css',
        'transform',
        'matrix(-1, 0, 0, -1, 0, 0)',
      );

      // Click to close mobile menu
      cy.get('svg[height="24"]').parent().click();
      cy.wait(100);

      // Chevron should be back to normal (matrix format)
      cy.get('svg[height="24"]').should(
        'have.css',
        'transform',
        'matrix(1, 0, 0, 1, 0, 0)',
      );
    });

    it('should have proper mobile menu styling', () => {
      cy.viewport(375, 667); // Mobile viewport
      cy.mount(
        <SidebarLayout>
          <div data-test='sidebar-content'>Test content</div>
        </SidebarLayout>,
      );

      // Check for mobile menu container classes
      cy.get('.z-\\[150\\]').should('exist');
      cy.get('.absolute').should('exist');
      cy.get('.top-10').should('exist');
      cy.get('.mt-24').should('exist');
      cy.get('.left-0').should('exist');
      cy.get('.h-full').should('exist');
      cy.get('.w-screen').should('exist');
      cy.get('.bg-white').should('exist');
      cy.get('.dark\\:shadow-lg').should('exist');
      cy.get('.filter').should('exist');
      cy.get('.drop-shadow-md').should('exist');

      // Check for dark mode classes on the mobile menu container
      cy.get('.absolute').should('have.class', 'dark:bg-slate-900');
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
      cy.get('a[href="/docs"]').should('have.class', 'dark:text-[#007bff]');
      cy.get('a[href="/docs"]').should('have.class', 'font-bold');
      cy.get('a[href="/docs"]').should('have.class', 'border-l-2');
      cy.get('a[href="/docs"]').should('have.class', 'border-l-primary');
    });

    it('should handle non-active links correctly', () => {
      mockRouter.asPath = '/docs';
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      cy.contains('Introduction').click();
      cy.get('a[href="/overview/what-is-jsonschema"]').should(
        'have.class',
        'font-medium',
      );
    });
  });

  describe('Theme Support', () => {
    it('should support dark mode styling', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      // Check for dark mode classes that exist in the component
      cy.get('.dark\\:bg-slate-900').should('exist');
      cy.get('.dark\\:text-slate-300').should('exist');

      // Check for dark mode classes on specific elements
      // Expand Get Started section to make Examples text visible
      cy.contains('Get Started').click();
      cy.contains('Examples').should('have.class', 'dark:text-slate-400');

      // Check for dark mode hover classes on links
      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').should(
        'have.class',
        'dark:hover:text-[#bfdbfe]',
      );
      cy.get('a[href="/docs"]').should('have.class', 'dark:hover:bg-slate-800');

      // Check for dark:invert class on external link icon
      cy.get('a[href="https://landscape.json-schema.org"] span').should(
        'have.class',
        'dark:invert',
      );
    });

    it('should support light mode styling', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      // Check for light mode classes that exist in the component
      cy.get('.bg-slate-200').should('exist');
      cy.get('.text-slate-900').should('exist');

      // Check for hover classes on links
      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').should('have.class', 'hover:text-[#007bff]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button accessibility', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      // Check that buttons are focusable
      cy.get('button[type="button"]').should('be.visible');
      cy.get('button[type="button"]').should('not.be.disabled');

      // Check that buttons have proper styling for interaction
      cy.get('button[type="button"]').should(
        'have.class',
        'hover:bg-transparent',
      );
    });

    it('should have proper link accessibility', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      cy.contains('Introduction').click();
      cy.get('a[href="/docs"]').should('be.visible');
      cy.get('a[href="/docs"]').should('not.be.disabled');
    });
  });

  describe('Animation and Transitions', () => {
    it('should have proper collapsible animations', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      cy.get(
        '.data-\\[state\\=closed\\]\\:animate-\\[collapsible-up_0\\.5s_ease-in-out\\]',
      ).should('exist');
      cy.get(
        '.data-\\[state\\=open\\]\\:animate-\\[collapsible-down_0\\.5s_ease-in-out\\]',
      ).should('exist');
    });

    it('should have proper arrow rotation transitions', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      cy.get('svg[id="arrow"]').each(($arrow) => {
        // Check for transition property (browser may normalize it)
        cy.wrap($arrow)
          .should('have.css', 'transition')
          .and('include', '0.2s linear');
      });
    });

    it('should have proper icon hover transitions', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub().as('setOpen')} />);

      cy.get('img[alt="eye icon"]').should(
        'have.class',
        'transition-transform',
      );
      cy.get('img[alt="eye icon"]').should('have.class', 'duration-300');
    });
  });
});
