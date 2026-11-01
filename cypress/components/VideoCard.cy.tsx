/* eslint-disable linebreak-style */
import React from 'react';
import VideoCard from '~/components/VideoCard';
import { VideoResource } from '~/lib/videoResources';

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
