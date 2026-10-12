import React from 'react';
import DarkModeToggle from '~/components/DarkModeToggle';

import { ThemeProvider } from 'next-themes';

describe('DarkModeToggle Component', () => {
  const TOGGLE_BUTTON = '[data-test="dark-mode-toggle"]';
  const MENU_BUTTON = '[data-test="theme-menu-button"]';
  const THEME_DROPDOWN = '[data-test="theme-dropdown"]';
  const THEME_ICON = '[data-test="theme-icon"]';

  const stubSystemTheme = (system: 'light' | 'dark') => {
    cy.window().then((win) => {
      win.localStorage.removeItem('theme');

      const matchMedia = (query: string) =>
        ({
          matches:
            system === 'dark' &&
            String(query).includes('prefers-color-scheme: dark'),
          media: query,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList;

      if ((win.matchMedia as unknown as { restore?: () => void }).restore) {
        (win.matchMedia as unknown as { restore: () => void }).restore();
      }

      cy.stub(win, 'matchMedia').callsFake(matchMedia);
    });
  };

  const mountComponent = (system: 'light' | 'dark' = 'light') => {
    stubSystemTheme(system);
    cy.mount(
      <div
        className='dark dark:text-white light:text-black'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#03303a',
        }}
      >
        <ThemeProvider>
          <DarkModeToggle />
        </ThemeProvider>
      </div>,
    );
  };

  beforeEach(() => {
    mountComponent('light');
  });

  // Should render the component
  it('should render the component', () => {
    // check if the toggle button exists
    cy.get(TOGGLE_BUTTON).should('exist');
    cy.get(MENU_BUTTON).should('exist');
  });

  // Test Theme Dropdown Menu Functionality
  describe('Theme Dropdown Menu', () => {
    // Should close the menu on arrow click when open
    it('should open and close the menu on arrow click', () => {
      cy.get(MENU_BUTTON).click();

      cy.get(THEME_DROPDOWN).should('be.visible');

      cy.get(MENU_BUTTON).click();

      cy.get(THEME_DROPDOWN).should('not.be.visible');
    });

    it('should not open the menu when the main button is clicked', () => {
      cy.get('[data-resolved-theme="light"]').should('exist');
      cy.get(TOGGLE_BUTTON).click();
      cy.get(THEME_DROPDOWN).should('not.be.visible');
    });

    it('should close the menu when the main button flips the theme', () => {
      cy.get(MENU_BUTTON).click();
      cy.get(THEME_DROPDOWN).should('be.visible');

      cy.get(TOGGLE_BUTTON).click();

      cy.get(THEME_DROPDOWN).should('not.be.visible');
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/moon.svg');
    });

    // Should close the menu on mouse leave
    it('should close the menu on mouse leave', () => {
      cy.get(MENU_BUTTON).click();

      cy.get(THEME_DROPDOWN).should('be.visible');

      // simulate mouse leave event on the menu
      cy.get(THEME_DROPDOWN).then(($el) => {
        const mouseOutEvent = new Event('mouseout', { bubbles: true });
        $el[0].dispatchEvent(mouseOutEvent);
      });

      cy.get(THEME_DROPDOWN).should('not.be.visible');
    });

    // Should close the menu when clicking outside
    it('should close the menu when clicking outside', () => {
      cy.get(MENU_BUTTON).click();

      cy.get(THEME_DROPDOWN).should('be.visible');

      // Simulate clicking outside the dropdown
      cy.get('body').click(0, 0);

      cy.get(THEME_DROPDOWN).should('not.be.visible');
    });
  });

  // Test Theme Selection Functionality
  describe('Theme Selection', () => {
    const themes = [
      {
        name: 'system',
        selector: '[data-test="select-system-theme"]',
        icon: '/icons/theme-switch.svg',
      },
      {
        name: 'dark',
        selector: '[data-test="select-dark-theme"]',
        icon: '/icons/moon.svg',
      },
      {
        name: 'light',
        selector: '[data-test="select-light-theme"]',
        icon: '/icons/sun.svg',
      },
    ];

    // Iterate over each theme and test if the theme changes
    themes.forEach((theme) => {
      it(`should change the theme to ${theme.name}`, () => {
        cy.get(MENU_BUTTON).click();

        cy.get(THEME_DROPDOWN).should('have.css', 'display', 'block');

        cy.get(theme.selector).click();

        cy.get(THEME_ICON).should('have.attr', 'src', theme.icon);

        cy.get(THEME_DROPDOWN).trigger('mouseout');

        cy.get(THEME_DROPDOWN).should('have.css', 'display', 'none');
      });
    });

    // Initial theme should be system theme
    it('should initially have system theme', () => {
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/theme-switch.svg');
      cy.window().then((win) => {
        const stored = win.localStorage.getItem('theme');
        expect(stored === null || stored === 'system').to.eq(true);
      });
    });
  });

  describe('Main button flip', () => {
    it('should switch to dark when the system theme is light', () => {
      cy.get('[data-resolved-theme="light"]').should('exist');
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/theme-switch.svg');
      cy.get(TOGGLE_BUTTON).should(
        'have.attr',
        'aria-label',
        'Switch to dark theme',
      );

      cy.get(TOGGLE_BUTTON).click();

      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/moon.svg');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme')).to.eq('dark');
      });
    });

    it('should switch to light when the system theme is dark', () => {
      mountComponent('dark');

      cy.get('[data-resolved-theme="dark"]').should('exist');
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/theme-switch.svg');
      cy.get(TOGGLE_BUTTON).should(
        'have.attr',
        'aria-label',
        'Switch to light theme',
      );

      cy.get(TOGGLE_BUTTON).click();

      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/sun.svg');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme')).to.eq('light');
      });
    });

    it('should flip back to light after a dark choice', () => {
      cy.get('[data-resolved-theme="light"]').should('exist');
      cy.get(TOGGLE_BUTTON).click();
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/moon.svg');

      cy.get(TOGGLE_BUTTON).click();

      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/sun.svg');
    });
  });
});
