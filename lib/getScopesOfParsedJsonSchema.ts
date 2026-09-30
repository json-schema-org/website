export enum JsonSchemaScope {
  TypeDefinition = 'type-definition',
}

export type JsonSchemaPathWithScope = {
  jsonPath: string;
  scope: JsonSchemaScope;
};
/**
 * Recursively parses a JSON Schema to map JSON paths to their corresponding scope types.
 * This is primarily used to bind interactive UI elements to specific schema definitions
 * in the schema editor.
 * 
 * @param parsedJsonSchema - The parsed JSON Schema object or sub-schema.
 * @param jsonPath - The current JSON path prefix (defaults to the root '$').
 * @returns An array of objects mapping the calculated JSON paths to their scopes.
 */
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
