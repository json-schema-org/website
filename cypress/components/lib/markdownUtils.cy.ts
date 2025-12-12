import { hiddenElements } from '~/lib/markdownUtils';

type HiddenComponents = Record<string, { component: () => null }>;

// Describe what we're testing
describe('hiddenElements', () => {
  // Test 1: Basic functionality
  it('creates an object with a component for each element name', () => {
    // Arrange: What we're testing with
    const elementNames = ['Header', 'Footer', 'Sidebar'];

    // Act: Call the function
    const result = hiddenElements(...elementNames) as HiddenComponents;

    // Assert: Check the result
    // Should have 3 keys
    expect(Object.keys(result)).to.have.length(3);

    // Each key should exist
    expect(result).to.have.property('Header');
    expect(result).to.have.property('Footer');
    expect(result).to.have.property('Sidebar');

    // Each value should have a component function
    expect(result.Header).to.have.property('component');
    expect(result.Header.component).to.be.a('function');

    // Component should return null
    expect(result.Header.component()).to.be.null;
  });

  it('returns empty object when no elements provided', () => {
    const result = hiddenElements();
    expect(result).to.deep.equal({});
  });

  it('handles single element', () => {
    const result = hiddenElements('Navbar') as Record<
      string,
      { component: () => null }
    >;
    expect(Object.keys(result)).to.have.length(1);
    expect(result.Navbar.component()).to.be.null;
  });
});
