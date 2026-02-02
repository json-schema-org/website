import React from 'react';
import GettingStarted from '../../components/GettingStarted';

describe('GettingStarted Component', () => {
  const mockSchemaData = {
    title: 'Person',
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      age: { type: 'integer' }
    }
  };

  const mockInstanceData = {
    firstName: 'John',
    lastName: 'Doe',
    age: 21
  };

  const mockExamples = [
    {
      name: 'Person',
      default: true,
      file: '/data/person-schema.json',
      instances: [
        {
          name: 'John Doe',
          default: true,
          file: '/data/person-instance.json',
          details: 'Valid person',
          valid: true
        },
        {
          name: 'Invalid Person',
          default: false,
          file: '/data/invalid-person.json',
          details: 'Invalid person',
          valid: false
        }
      ]
    },
    {
      name: 'Address',
      default: false,
      file: '/data/address-schema.json',
      instances: []
    }
  ];

  beforeEach(() => {
    // Stub fetch
    cy.stub(window, 'fetch').callsFake((url) => {
      if (url.includes('/data/getting-started-examples.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockExamples),
        });
      }
      if (url.includes('schema.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockSchemaData),
        });
      }
      if (url.includes('instance.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockInstanceData),
        });
      }
      return Promise.reject('Unknown URL: ' + url);
    });
  });

  it('should render and fetch data on mount', () => {
    cy.mount(<GettingStarted />);
    
    // Check headings
    cy.contains('JSON Schema').should('exist');
    cy.contains('JSON Instance').should('exist');
    cy.contains('Validation Result').should('exist');
    
    // Check initial data loading
    cy.contains('Person').should('exist'); // Schema name in select
    cy.contains('John Doe').should('exist'); // Instance name in select
    
    // Check code blocks content (simplified check)
    cy.contains('"title": "Person"').should('exist');
    cy.contains('"firstName": "John"').should('exist');
    
    // Check validation result
    cy.contains('Valid person').should('exist');
  });

  it('should handle schema selection change', () => {
    cy.mount(<GettingStarted />);
    
    // Wait for initial load
    cy.contains('Person').should('exist');
    
    // Select Address schema
    cy.get('select').first().select('Address');
    
    // Should update schema view (mock returns same schema data for simplicity, but we check if select changed)
    cy.get('select').first().should('have.value', '/data/address-schema.json');
  });

  it('should handle instance selection change', () => {
    cy.mount(<GettingStarted />);
    
    // Wait for initial load
    cy.contains('John Doe').should('exist');
    
    // Select Invalid Person instance
    cy.get('select').last().select('Invalid Person');
    
    // Should update instance view
    cy.get('select').last().should('have.value', '/data/invalid-person.json');
  });
});
