import getScopesOfParsedJsonSchema, {
  JsonSchemaScope,
} from '../../lib/getScopesOfParsedJsonSchema';

describe('getScopesOfParsedJsonSchema', () => {
  it('scopes a plain type definition', () => {
    const scopes = getScopesOfParsedJsonSchema({ type: 'string' });
    expect(scopes).to.deep.equal([
      { jsonPath: '$', scope: JsonSchemaScope.TypeDefinition },
    ]);
  });

  it('scopes object properties', () => {
    const scopes = getScopesOfParsedJsonSchema({
      type: 'object',
      properties: { name: { type: 'string' } },
    });
    expect(scopes).to.deep.equal([
      { jsonPath: '$', scope: JsonSchemaScope.TypeDefinition },
      {
        jsonPath: `$['properties']['${'name'}']`,
        scope: JsonSchemaScope.TypeDefinition,
      },
    ]);
  });

  it('scopes a single items schema', () => {
    const scopes = getScopesOfParsedJsonSchema({
      type: 'array',
      items: { type: 'number' },
    });
    expect(scopes).to.deep.equal([
      { jsonPath: '$', scope: JsonSchemaScope.TypeDefinition },
      { jsonPath: `$['${'items'}']`, scope: JsonSchemaScope.TypeDefinition },
    ]);
  });

  it('scopes each schema in a tuple items array', () => {
    const scopes = getScopesOfParsedJsonSchema({
      type: 'array',
      items: [{ type: 'number' }, { type: 'string' }],
    });
    expect(scopes).to.deep.equal([
      { jsonPath: '$', scope: JsonSchemaScope.TypeDefinition },
      { jsonPath: `$['items'][${0}]`, scope: JsonSchemaScope.TypeDefinition },
      { jsonPath: `$['items'][${1}]`, scope: JsonSchemaScope.TypeDefinition },
    ]);
  });

  it('scopes nested properties inside a tuple items array', () => {
    const scopes = getScopesOfParsedJsonSchema({
      type: 'array',
      items: [{ type: 'object', properties: { id: { type: 'number' } } }],
    });
    expect(scopes).to.deep.equal([
      { jsonPath: '$', scope: JsonSchemaScope.TypeDefinition },
      { jsonPath: `$['items'][${0}]`, scope: JsonSchemaScope.TypeDefinition },
      {
        jsonPath: `$['items'][${0}]['properties']['${'id'}']`,
        scope: JsonSchemaScope.TypeDefinition,
      },
    ]);
  });
});
