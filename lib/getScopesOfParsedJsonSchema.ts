export enum JsonSchemaScope {
  TypeDefinition = 'type-definition',
}

export type JsonSchemaPathWithScope = {
  jsonPath: string;
  scope: JsonSchemaScope;
};

export default function getScopesOfParsedJsonSchema(
  parsedJsonSchema: any,
  jsonPath = '$',
): JsonSchemaPathWithScope[] {
  if (typeof parsedJsonSchema !== 'object' || parsedJsonSchema === null)
    return [];
  const typeDefinitionScope = {
    jsonPath,
    scope: JsonSchemaScope.TypeDefinition,
  };
  if (parsedJsonSchema.type === 'object') {
    const scopesOfProperties = Object.keys(
      parsedJsonSchema?.properties || {},
    ).reduce<JsonSchemaPathWithScope[]>((acc, property) => {
      return [
        ...acc,
        ...getScopesOfParsedJsonSchema(
          parsedJsonSchema.properties?.[property],
          `${jsonPath}['properties']['${property}']`,
        ),
      ];
    }, []);
    const scopesOfPatternProperties = Object.keys(
      parsedJsonSchema?.patternProperties || {},
    ).reduce<JsonSchemaPathWithScope[]>((acc, property) => {
      return [
        ...acc,
        ...getScopesOfParsedJsonSchema(
          parsedJsonSchema.patternProperties?.[property],
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
  if (parsedJsonSchema.type === 'array') {
    return [
      typeDefinitionScope,
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.items,
        `${jsonPath}['items']`,
      ),
    ];
  }
  return [typeDefinitionScope];
}
