import React from 'react';
import AmbassadorCard, { Ambassador } from '../../components/AmbassadorsCard';

const mockAmbassador: Ambassador = {
  img: '/img/ambassadors/test-ambassador.jpg',
  name: 'John Doe',
  title: 'Senior Developer',
  bio: 'Passionate about JSON Schema and open source development.',
  company: 'Tech Corp',
  country: 'United States',
  github: 'johndoe',
  twitter: 'johndoe_twitter',
  linkedin: 'johndoe-linkedin',
  mastodon: 'johndoe@mastodon.social',
  contributions: [
    {
      title: 'JSON Schema Documentation',
      date: { month: 'January', year: 2024 },
      link: 'https://example.com/doc',
      type: 'Documentation',
    },
    {
      title: 'Schema Validation Tool',
      date: { month: 'March', year: 2024 },
      link: 'https://example.com/tool',
      type: 'Tool',
    },
  ],
};

const minimalAmbassador: Ambassador = {
  name: 'Jane Smith',
};

describe('AmbassadorCard Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/placeholder/400/320', {
      statusCode: 200,
      body: 'mocked-image-data',
    }).as('placeholderImage');
  });

  it('renders with all information', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    cy.contains(mockAmbassador.name || 'Ambassador').should('exist');
    cy.contains(mockAmbassador.title || '').should('exist');
    cy.contains(mockAmbassador.bio || '').should('exist');
    cy.contains(
      `${mockAmbassador.company || ''}, ${mockAmbassador.country || ''}`,
    ).should('exist');
    cy.get('img').should(
      'have.attr',
      'alt',
      `${mockAmbassador.name || 'Ambassador'} profile`,
    );
    cy.get('a[href*="github.com/johndoe"]').should('exist');
    cy.get('a[href*="twitter.com/johndoe_twitter"]').should('exist');
    cy.get('a[href*="linkedin.com/in/johndoe-linkedin"]').should('exist');
    cy.get('a[href="https://mastodon.social/@johndoe"]').should('exist');
    cy.get('button').should('contain.text', 'Show Full Details');
  });

  it('renders with minimal information', () => {
    cy.mount(<AmbassadorCard ambassador={minimalAmbassador} />);
    cy.contains('Jane Smith').should('exist');
    cy.get('a[href*="github.com"]').should('not.exist');
    cy.get('a[href*="twitter.com"]').should('not.exist');
    cy.get('button').should('not.exist');
  });

  it('renders social links with correct URLs and attributes', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    cy.get('a[href*="github.com/johndoe"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
    cy.get('a[href*="twitter.com/johndoe_twitter"]').should(
      'have.attr',
      'target',
      '_blank',
    );
    cy.get('a[href*="linkedin.com/in/johndoe-linkedin"]').should(
      'have.attr',
      'target',
      '_blank',
    );
    cy.get('a[href="https://mastodon.social/@johndoe"]').should(
      'have.attr',
      'target',
      '_blank',
    );
    cy.get('a[href*="github.com"]').should(
      'have.attr',
      'aria-label',
      `${mockAmbassador.name}'s github profile`,
    );
  });

  it('toggles contributions and displays content', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    cy.contains('Contributions').should('not.be.visible');
    cy.get('button').click();
    cy.contains('Contributions').should('be.visible');
    cy.contains('JSON Schema Documentation').should('be.visible');
    cy.contains('Schema Validation Tool').should('be.visible');
    cy.get('button').should('contain.text', 'Hide Details');
    cy.get('button').click();
    cy.contains('Contributions').should('not.be.visible');
  });

  it('handles image fallback logic', () => {
    cy.intercept('GET', '/img/ambassadors/test-ambassador.jpg', {
      statusCode: 404,
    }).as('imageError');
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    cy.wait('@imageError');
    cy.get('img')
      .should('have.attr', 'src')
      .and('match', /John%20Doe/);
  });

  it('has proper accessibility attributes', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    cy.get('img').should(
      'have.attr',
      'alt',
      `${mockAmbassador.name || 'Ambassador'} profile`,
    );
    cy.get('a[href*="github.com"]').should(
      'have.attr',
      'aria-label',
      `${mockAmbassador.name}'s github profile`,
    );
    cy.get('a[href*="twitter.com"]').should(
      'have.attr',
      'aria-label',
      `${mockAmbassador.name}'s twitter profile`,
    );
  });

  it('does not render mastodon link when username format is invalid', () => {
    const ambassadorWithInvalidMastodon: Ambassador = {
      ...mockAmbassador,
      mastodon: 'invalid-format',
    };
    cy.mount(<AmbassadorCard ambassador={ambassadorWithInvalidMastodon} />);
    cy.get('a[href*="mastodon"]').should('not.exist');
  });
});
