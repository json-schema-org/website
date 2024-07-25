import React from 'react';
import Card from '../../components/Card';
import '../../styles/globals.css';
import { CardProps } from '../../components/Card';

const RoadmapProps: CardProps = {
  icon: '/icons/roadmap.svg',
  title: 'Roadmap',
  body: 'Explore our exciting plans and upcoming milestones. 🚀',
  headerSize: 'large',
  bodyTextSize: 'medium',
  link: 'https://github.com/orgs/json-schema-org/discussions/427',
};

const OverviewProps: CardProps = {
  icon: '/icons/eye.svg',
  title: 'Overview',
  body: 'Our Overview provides a high level view of the project, its benefits, the roadmap and other relevant details.',
  headerSize: 'medium',
  bodyTextSize: 'small',
  link: '/overview/what-is-jsonschema',
};

describe('Card Component', () => {
  const testCardRendering = (props: CardProps) => {
    cy.mount(<Card {...props} />);
    cy.get('[data-test="card-image"]').should('not.exist');
    cy.get('[data-test="card-icon"]').should('have.attr', 'src', props.icon);
    cy.get('[data-test="card-title"]').should('have.text', props.title);
    cy.get('[data-test="card-body"]').should('have.text', props.body);
    cy.get('[data-test="card-read-more"]').should('have.text', 'Read More');
    cy.get('[data-test="card-link"]').should('have.attr', 'href', props.link);
  };

  // Render the Roadmap Card with the correct header and body text sizes
  it('should render Roadmap Card correctly', () => {
    testCardRendering(RoadmapProps);
    cy.get('[data-test="card-title"]').should('have.class', 'text-[2rem]');
    cy.get('[data-test="card-body"]').should('have.class', 'text-[1rem]');
  });

  // Render the Overview Card with the correct header and body text sizes
  it('should render Overview Card correctly', () => {
    testCardRendering(OverviewProps);
    cy.get('[data-test="card-title"]').should('have.class', 'text-[1.3rem]');
    cy.get('[data-test="card-body"]').should('have.class', 'text-[0.85rem]');
  });

  // Render the Card with some missing props
  it('should render card with some missing props correctly', () => {
    const missingProps = { ...RoadmapProps, icon: undefined, link: undefined };
    cy.mount(<Card {...missingProps} />);
    cy.get('[data-test="card-icon"]').should('not.exist');
    cy.get('[data-test="card-read-more"]').should('not.exist');
    cy.get('[data-test="card-link"]').should('not.exist');
  });
});
