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

  const scopes: JsonSchemaPathWithScope[] = [
    {
      jsonPath,
      scope: JsonSchemaScope.TypeDefinition,
    },
  ];

  // Helper function to process object properties (properties, patternProperties, definitions, etc.)
  const processObjectProperties = (
    keyword: string,
    properties: Record<string, any>,
  ): JsonSchemaPathWithScope[] => {
    return Object.keys(properties || {}).reduce<JsonSchemaPathWithScope[]>(
      (acc, propertyName) => {
        return [
          ...acc,
          ...getScopesOfParsedJsonSchema(
            properties[propertyName],
            `${jsonPath}['${keyword}']['${propertyName}']`,
          ),
        ];
      },
      [],
    );
  };

  // Helper function to process array of schemas (oneOf, anyOf, allOf, items as array)
  const processSchemasArray = (
    keyword: string,
    schemas: any[],
  ): JsonSchemaPathWithScope[] => {
    return schemas.reduce<JsonSchemaPathWithScope[]>((acc, schema, index) => {
      return [
        ...acc,
        ...getScopesOfParsedJsonSchema(
          schema,
          `${jsonPath}['${keyword}'][${index}]`,
        ),
      ];
    }, []);
  };

  // 1. Handle properties and patternProperties (existing behavior)
  if (parsedJsonSchema.properties) {
    scopes.push(
      ...processObjectProperties('properties', parsedJsonSchema.properties),
    );
  }

  if (parsedJsonSchema.patternProperties) {
    scopes.push(
      ...processObjectProperties(
        'patternProperties',
        parsedJsonSchema.patternProperties,
      ),
    );
  }

  // 2. Handle definitions and $defs
  if (parsedJsonSchema.definitions) {
    scopes.push(
      ...processObjectProperties('definitions', parsedJsonSchema.definitions),
    );
  }

  if (parsedJsonSchema.$defs) {
    scopes.push(...processObjectProperties('$defs', parsedJsonSchema.$defs));
  }

  // 3. Handle combinators (oneOf, anyOf, allOf)
  ['oneOf', 'anyOf', 'allOf'].forEach((keyword) => {
    if (Array.isArray(parsedJsonSchema[keyword])) {
      scopes.push(...processSchemasArray(keyword, parsedJsonSchema[keyword]));
    }
  });

  // 4. Handle items (can be single schema or array of schemas for tuples)
  if (parsedJsonSchema.items) {
    if (Array.isArray(parsedJsonSchema.items)) {
      // Tuple validation: items is an array of schemas
      scopes.push(...processSchemasArray('items', parsedJsonSchema.items));
    } else {
      // Standard array: items is a single schema
      scopes.push(
        ...getScopesOfParsedJsonSchema(
          parsedJsonSchema.items,
          `${jsonPath}['items']`,
        ),
      );
    }
  }

  // 5. Handle prefixItems (Draft 2020-12)
  if (Array.isArray(parsedJsonSchema.prefixItems)) {
    scopes.push(
      ...processSchemasArray('prefixItems', parsedJsonSchema.prefixItems),
    );
  }

  // 6. Handle additionalProperties
  if (
    parsedJsonSchema.additionalProperties &&
    typeof parsedJsonSchema.additionalProperties === 'object'
  ) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.additionalProperties,
        `${jsonPath}['additionalProperties']`,
      ),
    );
  }

  // 7. Handle additionalItems
  if (
    parsedJsonSchema.additionalItems &&
    typeof parsedJsonSchema.additionalItems === 'object'
  ) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.additionalItems,
        `${jsonPath}['additionalItems']`,
      ),
    );
  }

  // 8. Handle conditional schemas (if/then/else)
  if (parsedJsonSchema.if) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(parsedJsonSchema.if, `${jsonPath}['if']`),
    );
  }

  if (parsedJsonSchema.then) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.then,
        `${jsonPath}['then']`,
      ),
    );
  }

  if (parsedJsonSchema.else) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.else,
        `${jsonPath}['else']`,
      ),
    );
  }

  // 9. Handle dependentSchemas (Draft 2019-09+)
  if (parsedJsonSchema.dependentSchemas) {
    scopes.push(
      ...processObjectProperties(
        'dependentSchemas',
        parsedJsonSchema.dependentSchemas,
      ),
    );
  }

  // 10. Handle not
  if (parsedJsonSchema.not) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.not,
        `${jsonPath}['not']`,
      ),
    );
  }

  // 11. Handle contains (for arrays)
  if (parsedJsonSchema.contains) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.contains,
        `${jsonPath}['contains']`,
      ),
    );
  }

  // 12. Handle propertyNames
  if (
    parsedJsonSchema.propertyNames &&
    typeof parsedJsonSchema.propertyNames === 'object'
  ) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.propertyNames,
        `${jsonPath}['propertyNames']`,
      ),
    );
  }

  // 13. Handle unevaluatedProperties (Draft 2019-09+)
  if (
    parsedJsonSchema.unevaluatedProperties &&
    typeof parsedJsonSchema.unevaluatedProperties === 'object'
  ) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.unevaluatedProperties,
        `${jsonPath}['unevaluatedProperties']`,
      ),
    );
  }

  // 14. Handle unevaluatedItems (Draft 2019-09+)
  if (
    parsedJsonSchema.unevaluatedItems &&
    typeof parsedJsonSchema.unevaluatedItems === 'object'
  ) {
    scopes.push(
      ...getScopesOfParsedJsonSchema(
        parsedJsonSchema.unevaluatedItems,
        `${jsonPath}['unevaluatedItems']`,
      ),
    );
  }

  return scopes;
}
