import React from 'react';
import DarkModeToggle from '~/components/DarkModeToggle';

import { ThemeProvider } from 'next-themes';

describe('DarkModeToggle Component', () => {
  const TOGGLE_BUTTON = '[data-test="dark-mode-toggle"]';
  const THEME_DROPDOWN = '[data-test="theme-dropdown"]';
  const THEME_ICON = '[data-test="theme-icon"]';

  const mountComponent = () => {
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

  beforeEach(mountComponent);

  // Should render the component
  it('should render the component', () => {
    // check if the toggle button exists
    cy.get(TOGGLE_BUTTON).should('exist');
  });

  // Test Theme Dropdown Menu Functionality
  describe('Theme Dropdown Menu', () => {
    // Should close the menu on button click when open
    it('should open and close the menu on button click', () => {
      // click on the toggle button to open the menu
      cy.get(TOGGLE_BUTTON).click();

      // check if the menu is open
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'block');

      // click on the toggle button again to close the menu
      cy.get(TOGGLE_BUTTON).click();

      // check if the menu is closed
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'none');
    });

    // Should close the menu on mouse leave
    it('should close the menu on mouse leave', () => {
      // click on the toggle button to open the menu
      cy.get(TOGGLE_BUTTON).click();

      // check if the menu is open
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'block');

      // trigger mouse leave event on the menu
      cy.get(THEME_DROPDOWN).trigger('mouseout');

      // check if the menu is closed
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'none');
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
        // click on the toggle button to open the menu
        cy.get(TOGGLE_BUTTON).click();

        // check if the menu is open
        cy.get(THEME_DROPDOWN).should('have.css', 'display', 'block');

        // click on the theme option
        cy.get(theme.selector).click();

        // check if the theme icon has changed
        cy.get(THEME_ICON).should('have.attr', 'src', theme.icon);

        // trigger mouse leave event on the menu
        cy.get(THEME_DROPDOWN).trigger('mouseout');

        // check if the menu is closed
        cy.get(THEME_DROPDOWN).should('have.css', 'display', 'none');
      });
    });

    // Initial theme should be system theme
    it('should initially have system theme', () => {
      // check if the theme icon is the system theme icon
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/theme-switch.svg');
    });
  });
});
