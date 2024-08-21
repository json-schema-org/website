import React from 'react';
import Faq from '~/components/Faq';
import mockNextRouter, { MockRouter } from '../plugins/mockNextRouterUtils';
import faqData from '~/data/faq.json';

interface FaqData {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const mockFaqData: FaqData[] = [
  {
    id: 1,
    question: 'What is JSON Schema?',
    answer:
      'JSON Schema is a specification for defining the structure of JSON data. It provides a standardized way to annotate, describe, and validate JSON data. JSON Schema defines content, structure, data types, and other expected constraints within a JSON document.',
    category: 'fundamentals',
  },
  {
    id: 2,
    question: 'How do I create a simple JSON Schema?',
    answer:
      'You can create a simple JSON Schema using a JSON object with properties like "type", "properties", and "required". These define the data type, properties, and mandatory fields of your JSON document.',
    category: 'implementation',
  },
  {
    id: 3,
    question: 'What is the purpose of "type" in JSON Schema?',
    answer:
      'The "type" keyword defines the data type of the schema and guarantees that the validated data complies with the specified type. JSON Schema defines these types; "string", "number", "integer", "object", "array", "boolean", and "null". The type keyword primarily functions for data validation, compatibility across systems, and restriction of JSON documents.',
    category: 'validation',
  },
  {
    id: 4,
    question: 'How can I validate a JSON document against a JSON Schema?',
    answer:
      'You can use various tools and libraries, such as AJV (Another JSON Schema Validator), to validate a JSON document against a JSON Schema. It ensures the JSON data adheres to the expected format and constraints defined in the schema.',
    category: 'tooling',
  },
];

describe('Faq Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockRouter: MockRouter;
  /* We are not using mockRouter here but it need here in order to run the test the component */

  beforeEach(() => {
    mockRouter = mockNextRouter();
    // mock the faqData filter method
    cy.stub(faqData, 'filter').callsFake((predicate) => {
      return mockFaqData.filter(predicate);
    });
  });

  /* Testing faq component with different categories */

  // Should render the component with 'fundamentals' category
  it('should render the component with fundamentals category', () => {
    cy.mount(<Faq category='fundamentals' />);
  });

  // Should render the component with 'implementation' category
  it('should render the component with implementation category', () => {
    cy.mount(<Faq category='implementation' />);
  });

  // Should render the component with 'validation' category
  it('should render the component with validation category', () => {
    cy.mount(<Faq category='validation' />);
  });

  // Should render the component with 'tooling' category
  it('should render the component with tooling category', () => {
    cy.mount(<Faq category='tooling' />);
  });
});
