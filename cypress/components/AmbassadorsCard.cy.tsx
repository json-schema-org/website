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
    // Mock Next.js Image component
    cy.intercept('GET', '/api/placeholder/400/320', {
      statusCode: 200,
      body: 'mocked-image-data',
    }).as('placeholderImage');
  });

  it('should debug the rendered structure', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    cy.get('body').then(($body) => {
      cy.log('Full HTML:', $body.html());
    });
  });

  it('should render ambassador card with all information', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    
    // Check basic information - using more flexible selectors
    cy.contains(mockAmbassador.name).should('exist');
    cy.contains(mockAmbassador.title).should('exist');
    cy.contains(mockAmbassador.bio).should('exist');
    cy.contains(`${mockAmbassador.company}, ${mockAmbassador.country}`).should('exist');
    
    // Check image
    cy.get('img').should('have.attr', 'alt', `${mockAmbassador.name} profile`);
    
    // Check social media links
    cy.get('a[href*="github.com/johndoe"]').should('exist');
    cy.get('a[href*="twitter.com/johndoe_twitter"]').should('exist');
    cy.get('a[href*="linkedin.com/in/johndoe-linkedin"]').should('exist');
    cy.get('a[href*="fosstodon.org/johndoe"]').should('exist');
    
    // Check contributions button
    cy.get('button').should('contain.text', 'Show Full Details');
  });

  it('should render ambassador card with minimal information', () => {
    cy.mount(<AmbassadorCard ambassador={minimalAmbassador} />);
    
    // Check default name
    cy.contains('Jane Smith').should('exist');
    
    // Check that optional elements are not present
    cy.contains('Senior Developer').should('not.exist');
    cy.contains('Passionate about JSON Schema').should('not.exist');
    
    // Check that social media links are not present
    cy.get('a[href*="github.com"]').should('not.exist');
    cy.get('a[href*="twitter.com"]').should('not.exist');
    
    // Check that contributions button is not present
    cy.get('button').should('not.exist');
  });

  it('should toggle contributions visibility when button is clicked', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    
    // Initially contributions should be hidden
    cy.contains('Contributions').should('not.exist');
    
    // Click the button to show contributions
    cy.get('button').click();
    
    // Check that contributions are now visible
    cy.contains('Contributions').should('exist');
    cy.contains('JSON Schema Documentation').should('exist');
    cy.contains('Schema Validation Tool').should('exist');
    
    // Check that button text changed
    cy.get('button').should('contain.text', 'Hide Details');
    
    // Click the button again to hide contributions
    cy.get('button').click();
    
    // Check that contributions are hidden again
    cy.contains('Contributions').should('not.exist');
    cy.get('button').should('contain.text', 'Show Full Details');
  });

  it('should handle image error and fallback to local image', () => {
    // Mock image error
    cy.intercept('GET', '/img/ambassadors/test-ambassador.jpg', {
      statusCode: 404,
    }).as('imageError');
    
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    
    // Wait for image error and check fallback
    cy.wait('@imageError');
    cy.get('img').should('have.attr', 'src').and('match', /John%20Doe/);
  });

  it('should render ambassador with only some social media links', () => {
    const partialSocialAmbassador: Ambassador = {
      ...mockAmbassador,
      twitter: undefined,
      mastodon: undefined,
    };
    
    cy.mount(<AmbassadorCard ambassador={partialSocialAmbassador} />);
    
    // Check that only available social links are rendered
    cy.get('a[href*="github.com/johndoe"]').should('exist');
    cy.get('a[href*="linkedin.com/in/johndoe-linkedin"]').should('exist');
    cy.get('a[href*="twitter.com"]').should('not.exist');
    cy.get('a[href*="fosstodon.org"]').should('not.exist');
  });

  it('should render ambassador with only company or only country', () => {
    const companyOnly: Ambassador = {
      ...mockAmbassador,
      country: undefined,
    };
    
    cy.mount(<AmbassadorCard ambassador={companyOnly} />);
    cy.contains('Tech Corp').should('exist');
    cy.contains('United States').should('not.exist');
    
    const countryOnly: Ambassador = {
      ...mockAmbassador,
      company: undefined,
    };
    
    cy.mount(<AmbassadorCard ambassador={countryOnly} />);
    cy.contains('United States').should('exist');
    cy.contains('Tech Corp').should('not.exist');
  });

  it('should render contributions without dates', () => {
    const contributionsWithoutDates: Ambassador = {
      ...mockAmbassador,
      contributions: [
        {
          title: 'Test Contribution',
          link: 'https://example.com/test',
          type: 'Test',
        },
      ],
    };
    
    cy.mount(<AmbassadorCard ambassador={contributionsWithoutDates} />);
    cy.get('button').click();
    cy.contains('Test Contribution').should('exist');
    cy.contains('January 2024').should('not.exist');
  });

  it('should have proper accessibility attributes', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    
    // Check image alt text
    cy.get('img').should('have.attr', 'alt', `${mockAmbassador.name} profile`);
    
    // Check social media link aria-labels
    cy.get('a[href*="github.com"]').should('have.attr', 'aria-label', `${mockAmbassador.name}'s github profile`);
    cy.get('a[href*="twitter.com"]').should('have.attr', 'aria-label', `${mockAmbassador.name}'s twitter profile`);
    
    // Check external link attributes
    cy.get('a[href*="github.com"]').should('have.attr', 'target', '_blank');
    cy.get('a[href*="github.com"]').should('have.attr', 'rel', 'noopener noreferrer');
  });

  it('should have proper CSS classes for styling', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);
    
    // Check card container classes
    cy.get('[data-slot="card"]').should('have.class', 'max-w-md');
    cy.get('[data-slot="card"]').should('have.class', 'bg-white');
    cy.get('[data-slot="card"]').should('have.class', 'dark:bg-gray-800');
    
    // Check image container classes
    cy.get('img').parent().should('have.class', 'h-80');
    cy.get('img').parent().should('have.class', 'rounded-2xl');
    
    // Check button classes
    cy.get('button').should('have.class', 'bg-blue-600');
    cy.get('button').should('have.class', 'hover:bg-blue-700');
  });

  it('should handle empty contributions array', () => {
    const ambassadorWithoutContributions: Ambassador = {
      ...mockAmbassador,
      contributions: [],
    };
    
    cy.mount(<AmbassadorCard ambassador={ambassadorWithoutContributions} />);
    
    // Check that contributions button is not rendered
    cy.get('button').should('not.exist');
  });
}); 