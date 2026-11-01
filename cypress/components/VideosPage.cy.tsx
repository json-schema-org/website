/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import VideosPage from '~/pages/learn/videos.page';
import { VideoResource } from '~/lib/videoResources';
import mockNextRouter from '../plugins/mockNextRouterUtils';

describe('VideosPage Component', () => {
  beforeEach(() => {
    mockNextRouter();
    // Stub next-themes
    cy.stub(require('next-themes'), 'useTheme').returns({
      resolvedTheme: 'light',
      theme: 'light',
      setTheme: cy.stub(),
    });
  });

  it('should render the empty state when no videos exist', () => {
    cy.mount(<VideosPage videos={[]} />);

    cy.get('h1').should('have.text', 'JSON Schema videos');
    cy.get('[data-testid="videos-empty-state"]').should('be.visible');
    cy.contains('No community videos yet').should('be.visible');

    // Verify contribution link
    cy.get('[data-testid="videos-empty-state"]')
      .contains('Contribute a video')
      .should('have.attr', 'href')
      .and('include', 'CONTRIBUTING.md');

    // Verify tracking issue #2623 link
    cy.get('[data-testid="videos-empty-state"]')
      .contains('Tracking issue #2623')
      .should(
        'have.attr',
        'href',
        'https://github.com/json-schema-org/website/issues/2623',
      );
  });

  it('should render populated video cards when video fixtures are provided', () => {
    const fixtureVideos: VideoResource[] = [
      {
        title: 'Fixtured Video 1',
        description: 'Description of the first educational video.',
        url: 'https://example.com/video-1',
      },
      {
        title: 'Fixtured Video 2',
        description: 'Description of the second educational video.',
        url: 'https://example.com/video-2',
      },
    ];

    cy.mount(<VideosPage videos={fixtureVideos} />);

    cy.get('[data-testid="videos-empty-state"]').should('not.exist');
    cy.get('[data-testid="videos-grid"]').should('be.visible');
    cy.get('[data-testid="video-card"]').should('have.length', 2);

    cy.contains('Fixtured Video 1').should('be.visible');
    cy.contains('Fixtured Video 2').should('be.visible');
  });

  it('should render cleanly across mobile and desktop viewports', () => {
    const fixtureVideos: VideoResource[] = [
      {
        title: 'Responsive Test Video',
        description: 'Testing responsiveness across different viewport widths.',
        url: 'https://example.com/responsive-test',
      },
    ];

    // Mobile viewport
    cy.viewport(375, 667);
    cy.mount(<VideosPage videos={fixtureVideos} />);
    cy.get('[data-testid="video-card"]').should('be.visible');

    // Desktop viewport
    cy.viewport(1280, 800);
    cy.mount(<VideosPage videos={fixtureVideos} />);
    cy.get('[data-testid="video-card"]').should('be.visible');
  });
});
