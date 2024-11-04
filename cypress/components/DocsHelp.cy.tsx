import React from 'react';
import { DocsHelp } from '~/components/DocsHelp';

// DocsHelp Data Test IDs
const DOCS_HELP = '[data-test="docs-help"]';
const FEEDBACK_FORM = '[data-test="feedback-form"]';
const FEEDBACK_FORM_YES_BUTTON = '[data-test="feedback-survey-yes-button"]';
const FEEDBACK_FORM_NO_BUTTON = '[data-test="feedback-survey-no-button"]';
const FEEDBACK_FORM_INPUT = '[data-test="feedback-form-input"]';
const FEEDBACK_FORM_SUBMIT_BUTTON = '[data-test="feedback-submit-button"]';
const CREATE_GITHUB_ISSUE_BUTTON = '[data-test="create-github-issue-button"]';
const FEEDBACK_FORM_SUCCESS_MESSAGE =
  '[data-test="feedback-form-success-message"]';
const FEEDBACK_ERROR_MESSAGE = '[data-test="feedback-form-error-message"]';
const FEEDBACK_FORM_GITHUB_SUCCESS_MESSAGE =
  '[data-test="feedback-form-github-success-message"]';

// DocsHelp Component
describe('DocsHelp Component', () => {
  const extractPathWithoutFragment = (path: any) => path.split('#')[0];

  beforeEach(() => {
    cy.viewport(1200, 800);
  });

  it('should render the component correctly', () => {
    cy.mount(<DocsHelp />);
    cy.get(DOCS_HELP).should('exist');

    cy.get('[data-test="need-help-heading"]')
      .should('have.prop', 'tagName', 'H2')
      .and('contain.text', 'Need Help?');

    cy.get('[data-test="feedback-main-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Did you find these docs helpful?');

    cy.get(FEEDBACK_FORM).should('have.prop', 'tagName', 'FORM');

    cy.get('[data-test="contribute-docs-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Help us make our docs great!');

    cy.get('[data-test="contribute-docs-description"]')
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'At JSON Schema, we value docs contributions');

    cy.get('[data-test="edit-on-github-link"]')
      .should('have.prop', 'tagName', 'A')
      .and('contain.text', 'Edit this page on Github');

    cy.get('[data-test="learn-to-contribute-link"]')
      .should('have.prop', 'tagName', 'A')
      .and(
        'have.attr',
        'href',
        'https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md',
      )
      .and('contain.text', 'Learn how to contribute');

    cy.get('[data-test="additional-help-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Still Need Help?');

    cy.get('[data-test="additional-help-description"]')
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Learning JSON Schema is often confusing');

    cy.get('[data-test="ask-on-github-link"]')
      .should('have.prop', 'tagName', 'A')
      .and(
        'have.attr',
        'href',
        'https://github.com/orgs/json-schema-org/discussions/new?category=q-a',
      )
      .and('contain.text', 'Ask the community on GitHub');

    cy.get('[data-test="ask-on-slack-link"]')
      .should('have.prop', 'tagName', 'A')
      .and('have.attr', 'href', 'https://json-schema.org/slack')
      .and('contain.text', 'Ask the community on Slack');
  });

  it('should handle successful feedback submission', () => {
    cy.intercept(
      'POST',
      'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
      { statusCode: 200, body: { success: true } },
    ).as('feedback');

    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM_NO_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    cy.wait('@feedback').its('response.statusCode').should('eq', 200);
    cy.get(FEEDBACK_FORM_SUCCESS_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Thank you for your feedback!');
  });

  it('should handle API error response', () => {
    cy.intercept(
      'POST',
      'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
      { statusCode: 500, body: { error: 'Internal Server Error' } },
    ).as('feedback');

    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    cy.wait('@feedback').its('response.statusCode').should('eq', 500);
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'An error occurred. Please try again later.');
  });

  it('should handle network error', () => {
    cy.intercept(
      'POST',
      'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
      { forceNetworkError: true },
    ).as('feedback');

    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'An error occurred. Please try again later.');
  });

  it('should open GitHub issue page', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(CREATE_GITHUB_ISSUE_BUTTON).click();

    cy.get(FEEDBACK_FORM_GITHUB_SUCCESS_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Thanks for creating an issue!');
  });

  it('should handle error while opening GitHub issue page', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').throws(new Error('Test error'));
    });

    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(CREATE_GITHUB_ISSUE_BUTTON).click();

    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'An error occurred. Please try again later.');
  });
  it('should render component with different markdown files and validate gitredirect', () => {
    const fileRenderTypes: ('tsx' | 'indexmd' | '_indexmd' | '_md')[] = [
      'tsx',
      '_indexmd',
      'indexmd',
      '_md',
    ];

    fileRenderTypes.forEach((type) => {
      let expectedGitRedirect = '';

      if (type === 'tsx') {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment('/some/path') + '/index.page.tsx'}`;
      } else if (type === '_indexmd') {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment('/some/path') + '/_index.md'}`;
      } else if (type === 'indexmd') {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment('/some/path') + '/index.md'}`;
      } else {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment('/some/path') + '.md'}`;
      }

      cy.mount(<DocsHelp fileRenderType={type} />);

      cy.get('[data-test="edit-on-github-link"]').should(
        'have.attr',
        'href',
        expectedGitRedirect,
      );
    });
  });
});
