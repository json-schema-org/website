import React from 'react';
import Code from '~/components/Code';

describe('Code Component', () => {
  const testCodeRendering = (props: { children: string }) => {
    cy.mount(<Code {...props} />);
    cy.get('[data-test="code"]').should('have.text', props.children);
  };

  it('should render code correctly', () => {
    testCodeRendering({ children: 'const foo = "bar";' });
  });
});
