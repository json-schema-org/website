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

const ambassadorWithNoImage: Ambassador = {
  name: 'No Image Ambassador',
  title: 'Developer',
  bio: 'No image provided',
};

const ambassadorWithAllSocialMedia: Ambassador = {
  name: 'Social Media Ambassador',
  github: 'socialuser',
  twitter: 'socialuser_twitter',
  linkedin: 'socialuser-linkedin',
  mastodon: 'socialuser@mastodon.social',
};

const ambassadorWithOnlyCompany: Ambassador = {
  name: 'Company Only',
  company: 'Big Corp',
};

const ambassadorWithOnlyCountry: Ambassador = {
  name: 'Country Only',
  country: 'Canada',
};

const ambassadorWithLongBio: Ambassador = {
  name: 'Long Bio Ambassador',
  bio: 'This is a very long bio that should test how the component handles longer text content. It should wrap properly and not break the layout. The bio contains multiple sentences to ensure proper text rendering.',
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
    cy.contains(mockAmbassador.name || 'Ambassador').should('exist');
    cy.contains(mockAmbassador.title || '').should('exist');
    cy.contains(mockAmbassador.bio || '').should('exist');
    cy.contains(
      `${mockAmbassador.company || ''}, ${mockAmbassador.country || ''}`,
    ).should('exist');

    // Check image
    cy.get('img').should(
      'have.attr',
      'alt',
      `${mockAmbassador.name || 'Ambassador'} profile`,
    );

    // Check social media links
    cy.get('a[href*="github.com/johndoe"]').should('exist');
    cy.get('a[href*="twitter.com/johndoe_twitter"]').should('exist');
    cy.get('a[href*="linkedin.com/in/johndoe-linkedin"]').should('exist');
    cy.get('a[href*="fosstodon.org/johndoe@mastodon.social"]').should('exist');

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

  it('should handle ambassador with no image', () => {
    cy.mount(<AmbassadorCard ambassador={ambassadorWithNoImage} />);

    // Should use placeholder image
    cy.get('img').should('have.attr', 'src').and('include', '/api/placeholder');
  });

  it('should render all social media platforms', () => {
    cy.mount(<AmbassadorCard ambassador={ambassadorWithAllSocialMedia} />);

    // Check all social media links are present
    cy.get('a[href*="github.com/socialuser"]').should('exist');
    cy.get('a[href*="twitter.com/socialuser_twitter"]').should('exist');
    cy.get('a[href*="linkedin.com/in/socialuser-linkedin"]').should('exist');
    cy.get('a[href*="fosstodon.org/socialuser@mastodon.social"]').should(
      'exist',
    );

    // Check all social media icons are rendered
    cy.get('svg').should('have.length', 4);
  });

  it('should handle ambassador with only company', () => {
    cy.mount(<AmbassadorCard ambassador={ambassadorWithOnlyCompany} />);

    cy.contains('Big Corp').should('exist');
    cy.contains('Canada').should('not.exist');
    cy.contains(',').should('not.exist'); // No comma when only company
  });

  it('should handle ambassador with only country', () => {
    cy.mount(<AmbassadorCard ambassador={ambassadorWithOnlyCountry} />);

    cy.contains('Canada').should('exist');
    cy.contains('Big Corp').should('not.exist');
    cy.contains(',').should('not.exist'); // No comma when only country
  });

  it('should handle long bio text', () => {
    cy.mount(<AmbassadorCard ambassador={ambassadorWithLongBio} />);

    cy.contains('This is a very long bio').should('exist');
    cy.contains('multiple sentences').should('exist');
  });

  it('should toggle contributions visibility when button is clicked', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);

    // Initially contributions should be hidden (but exist in DOM)
    cy.contains('Contributions').should('not.be.visible');

    // Click the button to show contributions
    cy.get('button').click();

    // Check that contributions are now visible
    cy.contains('Contributions').should('be.visible');
    cy.contains('JSON Schema Documentation').should('be.visible');
    cy.contains('Schema Validation Tool').should('be.visible');

    // Check that button text changed
    cy.get('button').should('contain.text', 'Hide Details');

    // Click the button again to hide contributions
    cy.get('button').click();

    // Check that contributions are hidden again
    cy.contains('Contributions').should('not.be.visible');
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
    cy.get('img')
      .should('have.attr', 'src')
      .and('match', /John%20Doe/);
  });

  it('should handle placeholder image fallback', () => {
    // Mock placeholder image error
    cy.intercept('GET', '/api/placeholder/400/320', {
      statusCode: 404,
    }).as('placeholderError');

    cy.mount(<AmbassadorCard ambassador={ambassadorWithNoImage} />);

    // Wait for placeholder error and check fallback
    cy.wait('@placeholderError');
    cy.get('img')
      .should('have.attr', 'src')
      .and('match', /No%20Image%20Ambassador/);
  });

  it('should handle multiple image fallbacks', () => {
    // Mock both original image and fallback image errors
    cy.intercept('GET', '/img/ambassadors/test-ambassador.jpg', {
      statusCode: 404,
    }).as('originalImageError');

    cy.intercept('GET', '/img/ambassadors/John%20Doe.jpg', {
      statusCode: 404,
    }).as('fallbackImageError');

    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);

    // Wait for both image errors
    cy.wait('@originalImageError');
    cy.wait('@fallbackImageError');

    // Check that image still has a src (even if it's the fallback)
    cy.get('img').should('have.attr', 'src');
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
    cy.get('img').should(
      'have.attr',
      'alt',
      `${mockAmbassador.name || 'Ambassador'} profile`,
    );

    // Check social media link aria-labels
    cy.get('a[href*="github.com"]').should(
      'have.attr',
      'aria-label',
      `${mockAmbassador.name || 'Ambassador'}'s github profile`,
    );
    cy.get('a[href*="twitter.com"]').should(
      'have.attr',
      'aria-label',
      `${mockAmbassador.name || 'Ambassador'}'s twitter profile`,
    );

    // Check external link attributes
    cy.get('a[href*="github.com"]').should('have.attr', 'target', '_blank');
    cy.get('a[href*="github.com"]').should(
      'have.attr',
      'rel',
      'noopener noreferrer',
    );
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

  it('should have decorative corner elements', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);

    // Check that decorative elements are present
    cy.get('div').should('have.class', 'absolute');
    cy.get('div').should('have.class', 'bg-gray-400');
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

  it('should handle undefined contributions', () => {
    const ambassadorWithUndefinedContributions: Ambassador = {
      ...mockAmbassador,
      contributions: undefined,
    };

    cy.mount(
      <AmbassadorCard ambassador={ambassadorWithUndefinedContributions} />,
    );

    // Check that contributions button is not rendered
    cy.get('button').should('not.exist');
  });

  it('should test button animation states', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);

    // Check initial button state
    cy.get('button').should('have.class', 'scale-100');
    cy.get('button').should('have.class', 'shadow-md');

    // Click button to show contributions
    cy.get('button').click();

    // Check expanded button state
    cy.get('button').should('have.class', 'scale-105');
    cy.get('button').should('have.class', 'shadow-lg');
    cy.get('button').should('have.class', 'shadow-blue-500/50');

    // Click button again to hide contributions
    cy.get('button').click();

    // Check button returned to initial state
    cy.get('button').should('have.class', 'scale-100');
    cy.get('button').should('have.class', 'shadow-md');
  });

  it('should test contribution animation timing', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);

    // Click button to show contributions
    cy.get('button').click();

    // Check that contributions container has animation classes
    cy.get('div').should('have.class', 'overflow-hidden');
    cy.get('div').should('have.class', 'transition-all');
    cy.get('div').should('have.class', 'duration-500');
    cy.get('div').should('have.class', 'ease-in-out');
  });

  it('should test social media URL generation', () => {
    cy.mount(<AmbassadorCard ambassador={mockAmbassador} />);

    // Check that all social media URLs are correctly generated
    cy.get('a[href*="github.com/johndoe"]').should('exist');
    cy.get('a[href*="twitter.com/johndoe_twitter"]').should('exist');
    cy.get('a[href*="linkedin.com/in/johndoe-linkedin"]').should('exist');
    cy.get('a[href*="fosstodon.org/johndoe@mastodon.social"]').should('exist');
  });

  it('should handle undefined social media usernames', () => {
    const ambassadorWithUndefinedSocial: Ambassador = {
      name: 'No Social Media',
      github: undefined,
      twitter: undefined,
      linkedin: undefined,
      mastodon: undefined,
    };

    cy.mount(<AmbassadorCard ambassador={ambassadorWithUndefinedSocial} />);

    // Check that no social media links are rendered
    cy.get('a[href*="github.com"]').should('not.exist');
    cy.get('a[href*="twitter.com"]').should('not.exist');
    cy.get('a[href*="linkedin.com"]').should('not.exist');
    cy.get('a[href*="fosstodon.org"]').should('not.exist');

    // Check that no social media icons are rendered
    cy.get('svg').should('not.exist');
  });
});
