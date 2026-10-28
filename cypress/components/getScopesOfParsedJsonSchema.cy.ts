import getScopesOfParsedJsonSchema from '../../lib/getScopesOfParsedJsonSchema';

describe('getScopesOfParsedJsonSchema', () => {
  it('handles tuple validation (array of items) correctly', () => {
    const schema = {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
    };
    const scopes = getScopesOfParsedJsonSchema(schema);

    expect(scopes).to.have.length(3);
    // eslint-disable-next-line quotes
    expect(scopes[1].jsonPath).to.equal("$['items'][0]");
    // eslint-disable-next-line quotes
    expect(scopes[2].jsonPath).to.equal("$['items'][1]");
  });
});
