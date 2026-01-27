import React from 'react';
import { DocsHelp } from '~/components/DocsHelp';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockRouter: MockRouter;
  const extractPathWithoutFragment = (path: any) => path.split('#')[0];
  // Note: we are not using the mockRouter in this test file, but it is required to mock the router in the component file

  beforeEach(() => {
    const fileRenderType = 'indexmd';
    mockRouter = mockNextRouter();
    cy.viewport(1200, 800);
    cy.mount(<DocsHelp fileRenderType={fileRenderType} />);
  });

  // should render the component correctly
  it('should render the component correctly', () => {
    // Check if the main component wrapper is present
    cy.mount(<DocsHelp />);
    cy.get(DOCS_HELP).should('exist');

    // "Need Help?" header
    cy.get('[data-test="need-help-heading"]')
      .should('have.prop', 'tagName', 'H2')
      .and('contain.text', 'Need Help?');

    // Main feedback question
    cy.get('[data-test="feedback-main-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Did you find these docs helpful?');

    // Feedback form element
    cy.get(FEEDBACK_FORM).should('have.prop', 'tagName', 'FORM');

    // "Help us improve" section header
    cy.get('[data-test="contribute-docs-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Help us make our docs great!');

    // Contribution encouragement text
    cy.get('[data-test="contribute-docs-description"]')
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'At JSON Schema, we value docs contributions');

    // "Edit on GitHub" link
    cy.get('[data-test="edit-on-github-link"]')
      .should('have.prop', 'tagName', 'A')
      .and('contain.text', 'Edit this page on Github');

    // "Learn to contribute" link
    cy.get('[data-test="learn-to-contribute-link"]')
      .should('have.prop', 'tagName', 'A')
      .and(
        'have.attr',
        'href',
        'https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md',
      )
      .and('contain.text', 'Learn how to contribute');

    // "Still Need Help?" section header
    cy.get('[data-test="additional-help-heading"]')
      .should('have.prop', 'tagName', 'H3')
      .and('contain.text', 'Still Need Help?');

    // Additional help description
    cy.get('[data-test="additional-help-description"]')
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Learning JSON Schema is often confusing');

    // GitHub community link
    cy.get('[ data-test="ask-on-github-link"]')
      .should('have.prop', 'tagName', 'A')
      .and(
        'have.attr',
        'href',
        'https://github.com/orgs/json-schema-org/discussions/new?category=q-a',
      )
      .and('contain.text', 'Ask the community on GitHub');

    // Slack community link
    cy.get('[data-test="ask-on-slack-link"]')
      .should('have.prop', 'tagName', 'A')
      .and('have.attr', 'href', 'https://json-schema.org/slack')
      .and('contains', /Ask the community on Slack/i);
  });

  // test that empty feedback submission is prevented
  it('should show error when submitting empty feedback', () => {
    // click on yes button to open the form
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // try to submit without entering any comment
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    // check if error message is displayed
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Feedback comment cannot be empty.');

    // form should still be visible (not submitted)
    cy.get(FEEDBACK_FORM).should('be.visible');
  });

  // test that empty feedback submission is prevented for whitespace-only input
  it('should show error when submitting whitespace-only feedback', () => {
    // click on yes button to open the form
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // type only whitespace
    cy.get(FEEDBACK_FORM_INPUT).type('   ');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    // check if error message is displayed
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Feedback comment cannot be empty.');

    // form should still be visible (not submitted)
    cy.get(FEEDBACK_FORM).should('be.visible');
  });

  // test that empty feedback prevents creating GitHub issue
  it('should show error when creating GitHub issue with empty feedback', () => {
    // click on yes button to open the form
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // try to create GitHub issue without entering any comment
    cy.get(CREATE_GITHUB_ISSUE_BUTTON).click();

    // check if error message is displayed
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contain.text', 'Feedback comment cannot be empty.');

    // form should still be visible (not submitted)
    cy.get(FEEDBACK_FORM).should('be.visible');
  });

  // test feedback form funtionality works correctly
  it('should handle successful feedback submission', () => {
    // mocking the feedback api call
    cy.intercept(
      'POST',
      'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
      {
        statusCode: 200,
        body: { success: true },
      },
    ).as('feedback');

    /* click on yes button and check if feedback form is visible
       Note: checking both yes and no button to cover both scenarios */
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM_NO_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // now type in feedback form and submit
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    // check if response status code is 200
    cy.wait('@feedback').its('response.statusCode').should('eq', 200);

    // check if clicking on submit button should show success message
    cy.get(FEEDBACK_FORM_SUCCESS_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contains', /Thank you for your feedback!/i);
  });

  /* test feedback form functionality when status code is 500
    Note: This is case when server returns an error response | eg: INTERNAL SERVER ERROR */
  it('should handle API error response', () => {
    // check if clicking on yes button should show feedback form
    cy.intercept(
      'POST',
      'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
      {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      },
    ).as('feedback');

    // click on yes button and check if feedback form is visible
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // now type in feedback form and submit
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    // check if response status code is 500
    cy.wait('@feedback').its('response.statusCode').should('eq', 500);

    // check if clicking on submit button should show error message
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contains', /An error occurred. Please try again later./i);
  });

  /* test feedback form functionality when network error occurs
    Note: This is case when network error occurs while sending request to server | eg: NO INTERNET CONNECTION */
  it('should handle network error', () => {
    // check if clicking on yes button should show feedback form
    cy.intercept(
      'POST',
      'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
      {
        forceNetworkError: true,
      },
    ).as('feedback');

    // click on yes button and check if feedback form is visible
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // now type in feedback form and submit
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(FEEDBACK_FORM_SUBMIT_BUTTON).click();

    // check if clicking on submit button should show error message
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contains', /An error occurred. Please try again later./i);
  });

  // test create github issue functionality when submitting feedback
  it('should open github issue page', () => {
    // mock window.open function
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    // check if clicking on yes button should show feedback form
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // now type in feedback form and submit
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(CREATE_GITHUB_ISSUE_BUTTON).click();

    // check if clicking on submit button should show success message
    cy.get(FEEDBACK_FORM_GITHUB_SUCCESS_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and(
        'contains',
        /Thanks for creating an issue! Let's continue the discussion there!/i,
      );
  });

  // test show error message when github issue page fails to open
  it('should handle error while opening github issue page', () => {
    // mock window.open function with error
    cy.window().then((win) => {
      cy.stub(win, 'open').throws(new Error('Test error'));
    });

    // check if clicking on yes button should show feedback form
    cy.get(FEEDBACK_FORM_YES_BUTTON).click();
    cy.get(FEEDBACK_FORM).should('be.visible');

    // now type in feedback form and submit
    cy.get(FEEDBACK_FORM_INPUT).type('JSON Schema is awesome');
    cy.get(CREATE_GITHUB_ISSUE_BUTTON).click();

    // check if clicking on submit button should show error message
    cy.get(FEEDBACK_ERROR_MESSAGE)
      .should('have.prop', 'tagName', 'P')
      .and('contains', /An error occurred. Please try again later./i);
  });

  // This test is to check component render correctly with different markdown files
  it('should render component with different markdown files and validate gitredirect', () => {
    const fileRenderTypes: ('tsx' | 'indexmd' | '_indexmd' | '_md')[] = [
      'tsx',
      '_indexmd',
      'indexmd',
      '_md',
    ];

    fileRenderTypes.forEach((type) => {
      let expectedGitRedirect = '';
      if (typeof type === 'string' && type.startsWith('https://')) {
        expectedGitRedirect = type;
      } else if (type === 'tsx') {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment(mockRouter.asPath) + '/index.page.tsx'}`;
      } else if (type === '_indexmd') {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment(mockRouter.asPath) + '/_index.md'}`;
      } else if (type === 'indexmd') {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment(mockRouter.asPath) + '/index.md'}`;
      } else {
        expectedGitRedirect = `https://github.com/json-schema-org/website/blob/main/pages${extractPathWithoutFragment(mockRouter.asPath) + '.md'}`;
      }
      cy.mount(<DocsHelp fileRenderType={type} />);

      cy.get('[data-test="edit-on-github-link"]').should(
        'have.attr',
        'href',
        expectedGitRedirect,
      );
    });
    const customLink = 'https://example.com/custom-docs';
    cy.mount(<DocsHelp fileRenderType={customLink} />);
    cy.get('[data-test="edit-on-github-link"]').should(
      'have.attr',
      'href',
      customLink,
    );
  });
  // Check if the "Edit on GitHub" link is present when showEditOption is true
  it('should render the "Edit on GitHub" link when showEditOption is true', () => {
    cy.mount(<DocsHelp fileRenderType='indexmd' showEditOption={true} />);
    cy.get('[data-test="edit-on-github-link"]').should('exist');
  });
  // Check if the "Edit on GitHub" link is not present when showEditOption is false
  it('should not render the "Edit on GitHub" link when showEditOption is false', () => {
    cy.mount(<DocsHelp fileRenderType='indexmd' showEditOption={false} />);
    cy.get('[data-test="edit-on-github-link"]').should('not.exist');
  });
});
