export enum JsonSchemaScope {
  TypeDefinition = 'type-definition',
}

export type JsonSchemaPathWithScope = {
  jsonPath: string;
  scope: JsonSchemaScope;
};

interface ParsedJsonSchema {
  type?: string;
  properties?: Record<string, unknown>;
  patternProperties?: Record<string, unknown>;
  items?: unknown;
  [key: string]: unknown;
}

export default function getScopesOfParsedJsonSchema(
  parsedJsonSchema: ParsedJsonSchema | unknown,
  jsonPath = '$',
): JsonSchemaPathWithScope[] {
  if (typeof parsedJsonSchema !== 'object' || parsedJsonSchema === null)
    return [];

  const schema = parsedJsonSchema as ParsedJsonSchema;
  const typeDefinitionScope = {
    jsonPath,
    scope: JsonSchemaScope.TypeDefinition,
  };
  if (schema.type === 'object') {
    const scopesOfProperties = Object.keys(schema?.properties || {}).reduce<
      JsonSchemaPathWithScope[]
    >((acc, property) => {
      return [
        ...acc,
        ...getScopesOfParsedJsonSchema(
          schema.properties?.[property],
          `${jsonPath}['properties']['${property}']`,
        ),
      ];
    }, []);
    const scopesOfPatternProperties = Object.keys(
      schema?.patternProperties || {},
    ).reduce<JsonSchemaPathWithScope[]>((acc, property) => {
      return [
        ...acc,
        ...getScopesOfParsedJsonSchema(
          schema.patternProperties?.[property],
          `${jsonPath}['patternProperties']['${property}']`,
        ),
      ];
    }, []);
    return [
      typeDefinitionScope,
      ...scopesOfProperties,
      ...scopesOfPatternProperties,
    ];
  }
  if (schema.type === 'array') {
    return [
      typeDefinitionScope,
      ...getScopesOfParsedJsonSchema(schema.items, `${jsonPath}['items']`),
    ];
  }
  return [typeDefinitionScope];
}
