/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { SidebarLayout, DocsNav } from '~/components/Sidebar';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

describe('Sidebar Component', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = mockNextRouter();
    cy.stub(require('next-themes'), 'useTheme').returns({
      resolvedTheme: 'light',
      theme: 'light',
      setTheme: cy.stub(),
    });
  });

  describe('SidebarLayout', () => {
    it('should render sidebar layout correctly', () => {
      cy.mount(
        <SidebarLayout>
          <div data-testid='content'>Test Content</div>
        </SidebarLayout>,
      );

      cy.get('[data-testid="content"]')
        .should('exist')
        .and('contain', 'Test Content');
      cy.get('.max-w-\\[1400px\\]').should('exist');
    });

    it('should render mobile menu container', () => {
      cy.mount(
        <SidebarLayout>
          <div data-testid='content'>Test Content</div>
        </SidebarLayout>,
      );

      cy.viewport(768, 1024);
      cy.get('.lg\\:hidden').should('exist');
      cy.get('.lg\\:hidden').should('be.visible');
    });

    it('should handle mobile menu toggle correctly', () => {
      cy.mount(
        <SidebarLayout>
          <div data-testid='content'>Test Content</div>
        </SidebarLayout>,
      );

      cy.viewport(768, 1024);
      cy.get('.lg\\:hidden').should('exist');

      // Click on mobile menu trigger (the arrow header)
      cy.get('.lg\\:hidden').first().click();

      // Check that sidebar panel becomes visible
      cy.get('.translate-x-0').should('exist');
    });

    it('should show correct section title based on current path', () => {
      mockRouter.asPath = '/docs';
      cy.mount(
        <SidebarLayout>
          <div data-testid='content'>Test Content</div>
        </SidebarLayout>,
      );
      cy.viewport(768, 1024);
      cy.get('.lg\\:hidden h3').should('contain', 'Introduction');
    });

    it('should close mobile menu on window resize', () => {
      cy.mount(
        <SidebarLayout>
          <div data-testid='content'>Test Content</div>
        </SidebarLayout>,
      );

      cy.viewport(768, 1024);
      cy.get('.lg\\:hidden').first().click();
      cy.get('.translate-x-0').should('exist');

      // Resize to desktop
      cy.viewport(1025, 768);

      // Menu should be closed on desktop resize
      cy.get('.-translate-x-full').should('exist');
    });
  });

  describe('DocsNav', () => {
    let mockSetOpen: any;

    beforeEach(() => {
      mockSetOpen = cy.stub().as('setOpen');
    });

    it('should render all navigation sections', () => {
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      cy.contains('Introduction').should('exist');
      cy.contains('Get Started').should('exist');
      cy.contains('Guides').should('exist');
      cy.contains('Reference').should('exist');
      cy.contains('Specification').should('exist');
    });

    it('should render section icons correctly', () => {
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      cy.get('img[alt="eye icon"]').should('exist');
      cy.get('img[alt="compass icon"]').should('exist');
      cy.get('img[alt="grad cap icon"]').should('exist');
      cy.get('img[alt="book icon"]').should('exist');
      cy.get('img[alt="clipboard icon"]').should('exist');
    });

    it('should handle accordion behavior correctly', () => {
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      // Open Introduction section
      cy.contains('Introduction').parent().click();
      cy.contains('Overview').should('be.visible');
      cy.get('[data-state="open"]').should('contain', 'Introduction');

      // Open Get Started - Introduction should close (accordion behavior)
      cy.contains('Get Started').parent().click();
      cy.contains('Overview').should('not.be.visible');
      cy.contains('What is a schema?').should('be.visible');
      cy.get('[data-state="open"]').should('contain', 'Get Started');

      // Open Reference - Get Started should close
      cy.contains('Reference').parent().click();
      cy.contains('What is a schema?').should('not.be.visible');
      cy.contains('JSON data types').should('be.visible');
      cy.get('[data-state="open"]').should('contain', 'Reference');
    });

    it('should show correct active section based on current path', () => {
      mockRouter.asPath = '/docs';
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);
      cy.get('[data-state="open"]').should('exist');
    });

    it('should render key navigation links correctly', () => {
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      // Test Introduction section
      cy.contains('Introduction').parent().click();
      cy.contains('Overview').should('be.visible');
      cy.contains('What is JSON Schema?').should('be.visible');

      // Test Get Started section
      cy.contains('Get Started').parent().click();
      cy.contains('What is a schema?').should('be.visible');
      cy.contains('The basics').should('be.visible');

      // Test Reference section
      cy.contains('Reference').parent().click();
      cy.contains('JSON data types').should('be.visible');
      cy.contains('array').should('be.visible');
    });

    it('should handle external links correctly', () => {
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      cy.contains('Introduction').parent().click();
      cy.contains('Landscape').should('be.visible');

      cy.contains('Landscape').trigger('click', { force: true });
      cy.get('@setOpen').should('have.been.calledWith', false);
    });

    it('should show active link styling correctly', () => {
      mockRouter.asPath = '/docs';
      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      cy.contains('Introduction').parent().click();
      cy.contains('Overview').should('have.class', 'font-bold');
    });

    it('should handle dark theme icons', () => {
      // Mock dark theme
      cy.stub(require('next-themes'), 'useTheme').returns({
        resolvedTheme: 'dark',
        theme: 'dark',
        setTheme: cy.stub(),
      });

      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      cy.get('img[alt="eye icon"]').should('exist');
      cy.get('img[alt="compass icon"]').should('exist');
      cy.get('img[alt="book icon"]').should('exist');
      cy.get('img[alt="clipboard icon"]').should('exist');
      cy.get('img[alt="grad cap icon"]').should('exist');
    });

    it('should handle light theme icons', () => {
      // Mock light theme
      cy.stub(require('next-themes'), 'useTheme').returns({
        resolvedTheme: 'light',
        theme: 'light',
        setTheme: cy.stub(),
      });

      cy.mount(<DocsNav open={false} setOpen={mockSetOpen} />);

      cy.get('img[alt="eye icon"]').should('exist');
      cy.get('img[alt="compass icon"]').should('exist');
      cy.get('img[alt="book icon"]').should('exist');
      cy.get('img[alt="clipboard icon"]').should('exist');
      cy.get('img[alt="grad cap icon"]').should('exist');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub()} />);

      cy.get('button').should('exist');
      cy.get('[data-state]').should('exist');
    });

    it('should be keyboard navigable', () => {
      cy.mount(<DocsNav open={false} setOpen={cy.stub()} />);

      cy.get('button').should('exist');
      cy.contains('Introduction').parent().click();
      cy.get('a').should('exist');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to different screen sizes', () => {
      cy.mount(
        <SidebarLayout>
          <div data-testid='content'>Test Content</div>
        </SidebarLayout>,
      );

      // Test mobile view
      cy.viewport(375, 667);
      cy.get('.lg\\:hidden').should('be.visible');
      cy.get('.hidden.lg\\:block').should('not.be.visible');

      // Test tablet view
      cy.viewport(768, 1024);
      cy.get('.lg\\:hidden').should('be.visible');
      cy.get('.hidden.lg\\:block').should('not.be.visible');

      // Test desktop view
      cy.viewport(1025, 768);
      cy.get('.lg\\:hidden').should('not.be.visible');
      cy.get('.hidden.lg\\:block').should('be.visible');
    });
  });
});
