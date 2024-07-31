import React from 'react';
import Card from '../../components/Card';
import { CardProps } from '../../components/Card';

const RoadmapProps: CardProps = {
  icon: '/icons/roadmap.svg',
  title: 'Roadmap',
  body: 'Explore our exciting plans and upcoming milestones. 🚀',
  headerSize: 'large',
  bodyTextSize: 'medium',
  link: 'https://github.com/orgs/json-schema-org/discussions/427',
};

describe('Card Component', () => {
  // Render the Roadmap Card with default RoadmapProps
  it('should render Roadmap Card correctly', () => {
    cy.mount(<Card {...RoadmapProps} />);
    cy.get('[data-test="card-image"]').should('not.exist');
    cy.get('[data-test="card-icon"]').should(
      'have.attr',
      'src',
      RoadmapProps.icon,
    );
    cy.get('[data-test="card-title"]').should('have.text', RoadmapProps.title);
    cy.get('[data-test="card-body"]').should('have.text', RoadmapProps.body);
    cy.get('[data-test="card-read-more"]').should('have.text', 'Read More');
    cy.get('[data-test="card-link"]').should(
      'have.attr',
      'href',
      RoadmapProps.link,
    );
    cy.get('[data-test="card-title"]').should('have.class', 'text-[2rem]');
    cy.get('[data-test="card-body"]').should('have.class', 'text-[1rem]');
  });

  // Render the Roadmap card with default header and body sizes
  it('should render Roadmap card with default header and body sizes', () => {
    const missingSizes = {
      ...RoadmapProps,
      headerSize: undefined,
      bodyTextSize: undefined,
    };
    cy.mount(<Card {...missingSizes} />);
    cy.get('[data-test="card-title"]').should('have.class', 'text-[1.3rem]');
    cy.get('[data-test="card-body"]').should('have.class', 'text-[1rem]');
  });

  // Render the Roadmap card with extended body text
  it('should render Roadmap card with extended body text', () => {
    const extendedBody = { ...RoadmapProps, extended: true };
    cy.mount(<Card {...extendedBody} />);
    cy.get('[data-test="card-body"]').find('span').should('exist');
  });

  // Render the Roadmap card with image
  it('should render Roadmap card with image', () => {
    const imageProps = { ...RoadmapProps, image: '/icons/roadmap.svg' };
    cy.mount(<Card {...imageProps} />);
    cy.get('[data-test="card-image"]').should(
      'have.attr',
      'src',
      imageProps.image,
    );
  });

  // Render the Roadmap Card with some missing props
  it('should render Roadmap card with some missing props correctly', () => {
    const missingProps = { ...RoadmapProps, icon: undefined, link: undefined };
    cy.mount(<Card {...missingProps} />);
    cy.get('[data-test="card-icon"]').should('not.exist');
    cy.get('[data-test="card-link"]').should('not.exist');
  });
});
