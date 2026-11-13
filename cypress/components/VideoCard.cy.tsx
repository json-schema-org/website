/* eslint-disable linebreak-style */
import React from 'react';
import VideoCard from '~/components/VideoCard';
import {
  VideoResource,
  validateVideoResources,
  canonicalizeUrl,
} from '~/lib/videoResources';

describe('VideoCard Component', () => {
  const sampleVideo: VideoResource = {
    title: 'Building Scalable APIs with JSON Schema',
    description:
      'Learn how JSON Schema validates API payloads effectively and simplifies contracts.',
    url: 'https://www.youtube.com/watch?v=sample123',
  };

  it('should render the video card details correctly', () => {
    cy.mount(<VideoCard video={sampleVideo} />);

    // Verify card wrapper
    cy.get('[data-testid="video-card"]').should('exist');

    // Semantic h3 heading
    cy.get('[data-testid="video-card-title"]')
      .should('have.prop', 'tagName', 'H3')
      .and('have.text', sampleVideo.title);

    // Plain text description
    cy.get('[data-testid="video-card-description"]').should(
      'have.text',
      sampleVideo.description,
    );

    // Link attributes and accessible name
    cy.get('[data-testid="video-card-link"]')
      .should('have.attr', 'href', sampleVideo.url)
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
      .and(
        'have.attr',
        'aria-label',
        `Watch video: ${sampleVideo.title} (opens in a new tab)`,
      );

    cy.get('[data-testid="video-card-link"]')
      .contains('Watch video')
      .should('be.visible');
  });

  it('should render contributor HTML-like strings as safe plain text, not executed HTML', () => {
    const maliciousVideo: VideoResource = {
      title: '<script>alert("xss")</script>Safe Title',
      description:
        '<b>Bold attempt</b> and <img src="x" onerror="evil()" /> description',
      url: 'https://example.com/watch?v=test',
    };

    cy.mount(<VideoCard video={maliciousVideo} />);

    // Must be literal text content, not parsed into DOM elements
    cy.get('[data-testid="video-card-title"]').should(
      'have.text',
      '<script>alert("xss")</script>Safe Title',
    );
    cy.get('[data-testid="video-card-title"]')
      .find('script')
      .should('not.exist');

    cy.get('[data-testid="video-card-description"]').should(
      'have.text',
      '<b>Bold attempt</b> and <img src="x" onerror="evil()" /> description',
    );
    cy.get('[data-testid="video-card-description"]')
      .find('b')
      .should('not.exist');
    cy.get('[data-testid="video-card-description"]')
      .find('img')
      .should('not.exist');
  });

  it('should be keyboard focusable and have visible focus styling', () => {
    cy.mount(<VideoCard video={sampleVideo} />);

    cy.get('[data-testid="video-card-link"]').focus();
    cy.get('[data-testid="video-card-link"]').should('have.focus');
    cy.get('[data-testid="video-card-link"]').should(
      'have.class',
      'focus-visible:ring-2',
    );
  });
});

describe('Video Resources Validation', () => {
  const expectValidationError = (
    fn: () => void,
    expectedMessage?: string | RegExp,
  ) => {
    let thrownError: any = null;
    try {
      fn();
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError, 'Expected an error to be thrown').to.not.be.null;
    if (expectedMessage) {
      if (typeof expectedMessage === 'string') {
        expect(thrownError.message).to.include(expectedMessage);
      } else {
        expect(thrownError.message).to.match(expectedMessage);
      }
    }
  };

  it('should accept a valid empty collection', () => {
    const result = validateVideoResources([]);
    expect(result).to.deep.equal([]);
  });

  it('should accept valid video resource entries', () => {
    const validData = [
      {
        title: 'Getting Started with JSON Schema',
        description:
          'An introductory guide to JSON Schema syntax and keywords.',
        url: 'https://www.youtube.com/watch?v=sample1',
      },
      {
        title: 'Advanced JSON Schema Techniques',
        description: 'Deep dive into conditional schemas and references.',
        url: 'https://vimeo.com/12345678',
      },
    ];

    const result = validateVideoResources(validData);
    expect(result).to.have.length(2);
    expect(result[0].title).to.equal('Getting Started with JSON Schema');
    expect(result[0].url).to.equal('https://www.youtube.com/watch?v=sample1');
  });

  it('should canonicalize URLs correctly', () => {
    expect(canonicalizeUrl('https://example.com/')).to.equal(
      'https://example.com',
    );
    expect(canonicalizeUrl('https://example.com/path/')).to.equal(
      'https://example.com/path',
    );
  });

  it('should reject non-array root data', () => {
    expectValidationError(
      () => validateVideoResources(null),
      'must be an array',
    );
    expectValidationError(() => validateVideoResources({}), 'must be an array');
    expectValidationError(
      () => validateVideoResources('string'),
      'must be an array',
    );
  });

  it('should reject non-object items in array', () => {
    expectValidationError(
      () => validateVideoResources([null]),
      'Entry must be a valid object',
    );
    expectValidationError(
      () => validateVideoResources(['some string']),
      'Entry must be a valid object',
    );
    expectValidationError(
      () => validateVideoResources([[1, 2, 3]]),
      'Entry must be a valid object',
    );
  });

  it('should reject missing required fields', () => {
    expectValidationError(
      () =>
        validateVideoResources([
          {
            description: 'Desc',
            url: 'https://example.com/video',
          },
        ]),
      /field 'title'/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Title',
            url: 'https://example.com/video',
          },
        ]),
      /field 'description'/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Title',
            description: 'Desc',
          },
        ]),
      /field 'url'/,
    );
  });

  it('should reject non-string fields', () => {
    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 123,
            description: 'Desc',
            url: 'https://example.com/video',
          },
        ]),
      /Title must be a string/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Title',
            description: true,
            url: 'https://example.com/video',
          },
        ]),
      /Description must be a string/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Title',
            description: 'Desc',
            url: {},
          },
        ]),
      /URL must be a string/,
    );
  });

  it('should reject whitespace-only or empty fields', () => {
    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: '   ',
            description: 'Valid description',
            url: 'https://example.com/video',
          },
        ]),
      /Title cannot be empty/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Valid title',
            description: '  \n  ',
            url: 'https://example.com/video',
          },
        ]),
      /Description cannot be empty/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Valid title',
            description: 'Valid description',
            url: '   ',
          },
        ]),
      /URL cannot be empty/,
    );
  });

  it('should reject malformed and relative URLs', () => {
    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Title',
            description: 'Desc',
            url: 'not-a-valid-url',
          },
        ]),
      /Malformed or relative URL/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Title',
            description: 'Desc',
            url: '/relative/path/to/video',
          },
        ]),
      /Malformed or relative URL/,
    );
  });

  it('should reject non-HTTPS protocols including http, javascript, and data', () => {
    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'HTTP Video',
            description: 'Desc',
            url: 'http://example.com/video',
          },
        ]),
      /URL protocol must be "https:"/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Javascript Video',
            description: 'Desc',
            url: 'javascript:alert(1)',
          },
        ]),
      /URL protocol must be "https:"/,
    );

    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Data URL Video',
            description: 'Desc',
            url: 'data:text/html,<script>alert(1)</script>',
          },
        ]),
      /URL protocol must be "https:"/,
    );
  });

  it('should reject credential-bearing URLs', () => {
    expectValidationError(
      () =>
        validateVideoResources([
          {
            title: 'Credential Video',
            description: 'Desc',
            url: 'https://user:password@example.com/video',
          },
        ]),
      /embedded user credentials/,
    );
  });

  it('should reject duplicate URLs', () => {
    const duplicateData = [
      {
        title: 'First Video',
        description: 'First video description',
        url: 'https://example.com/video1',
      },
      {
        title: 'Second Video',
        description: 'Second video description with identical URL',
        url: 'https://example.com/video1',
      },
    ];

    expectValidationError(
      () => validateVideoResources(duplicateData),
      /Duplicate video URL detected: "https:\/\/example.com\/video1"/,
    );
  });

  it('should canonicalize URLs and reject canonical duplicates', () => {
    const canonicalDupData = [
      {
        title: 'First Video',
        description: 'Description 1',
        url: 'https://example.com/video/',
      },
      {
        title: 'Second Video',
        description: 'Description 2',
        url: 'https://example.com/video',
      },
    ];

    expectValidationError(
      () => validateVideoResources(canonicalDupData),
      /Duplicate video URL detected/,
    );
  });
});
