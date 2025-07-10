import React from 'react';
import { DocsHelp } from '~/components/DocsHelp';
import mockNextRouter from '../plugins/mockNextRouterUtils';

describe('DocsHelp Coverage Tests', () => {
    beforeEach(() => {
        mockNextRouter();
        cy.viewport(1200, 800);
    });

    // Test for line 93-94: Empty comment validation
    it('should validate empty comments on form submission', () => {
        cy.mount(<DocsHelp />);
        cy.get('[data-test="feedback-survey-yes-button"]').click();
        cy.get('[data-test="feedback-form"]').should('be.visible');

        // Try to submit with empty comment
        cy.get('[data-test="feedback-form-input"]').clear();
        cy.get('[data-test="feedback-submit-button"]').click();

        // Verify error state
        cy.get('[data-test="feedback-form-input"]').should('have.class', 'border-red-500');
        cy.contains('Please provide feedback before submitting').should('be.visible');
    });

    // Test for line 133-134: Successful feedback submission
    it('should handle successful feedback submission and reset form', () => {
        cy.mount(<DocsHelp />);

        // Intercept API call
        cy.intercept(
            'POST',
            'https://script.google.com/macros/s/AKfycbx9KA_BwTdsYgOfTLrHAxuhHs_wgYibB5_Msj9XP1rL5Ip4A20g1O609xAuTZmnbhRv/exec',
            {
                statusCode: 200,
                body: { success: true },
            }
        ).as('feedback');

        // Fill and submit form
        cy.get('[data-test="feedback-survey-yes-button"]').click();
        cy.get('[data-test="feedback-form-input"]').type('Test feedback');
        cy.get('[data-test="feedback-submit-button"]').click();

        // Wait for API response
        cy.wait('@feedback');

        // Verify success message and form reset
        cy.get('[data-test="feedback-form-success-message"]').should('be.visible');
        cy.get('[data-test="feedback-form"]').should('not.exist');
    });

    // Test for line 277: Direct URL in getGitRedirect
    it('should use direct URL when fileRenderType is a URL', () => {
        const directUrl = 'https://example.com/direct-url';
        cy.mount(<DocsHelp fileRenderType={directUrl} />);

        // Verify the URL is used directly
        cy.get('[data-test="edit-on-github-link"]')
            .should('have.attr', 'href', directUrl);
    });

    // Test for GitHub issue creation with empty comment
    it('should validate empty comments when creating GitHub issue', () => {
        cy.mount(<DocsHelp />);
        cy.get('[data-test="feedback-survey-yes-button"]').click();

        // Try to create issue with empty comment
        cy.get('[data-test="create-github-issue-button"]').click();

        // Verify error state
        cy.get('[data-test="feedback-form-input"]').should('have.class', 'border-red-500');
        cy.contains('Please provide feedback before submitting').should('be.visible');
    });
}); 