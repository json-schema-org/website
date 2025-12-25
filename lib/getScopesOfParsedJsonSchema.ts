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

  let scopes: JsonSchemaPathWithScope[] = [
    {
      jsonPath,
      scope: JsonSchemaScope.TypeDefinition,
    },
  ];

  // 1. Objects where each value is a subschema
  const mapKeywords = [
    'properties',
    'patternProperties',
    'definitions',
    '$defs',
    'dependentSchemas',
  ];

  mapKeywords.forEach((keyword) => {
    const map = parsedJsonSchema[keyword];
    if (map && typeof map === 'object' && !Array.isArray(map)) {
      Object.keys(map).forEach((key) => {
        scopes = [
          ...scopes,
          ...getScopesOfParsedJsonSchema(
            map[key],
            `${jsonPath}['${keyword}']['${key}']`,
          ),
        ];
      });
    }
  });

  // 2. Arrays where each item is a subschema
  const arrayKeywords = ['allOf', 'anyOf', 'oneOf', 'prefixItems'];

  arrayKeywords.forEach((keyword) => {
    const list = parsedJsonSchema[keyword];
    if (Array.isArray(list)) {
      list.forEach((subschema: any, index: number) => {
        scopes = [
          ...scopes,
          ...getScopesOfParsedJsonSchema(
            subschema,
            `${jsonPath}['${keyword}'][${index}]`,
          ),
        ];
      });
    }
  });

  // 3. Single subschemas
  const singleKeywords = [
    'items',
    'not',
    'if',
    'then',
    'else',
    'additionalProperties',
    'propertyNames',
    'unevaluatedProperties',
    'additionalItems',
    'unevaluatedItems',
  ];

  singleKeywords.forEach((keyword) => {
    const subschema = parsedJsonSchema[keyword];
    // In JSON Schema, a subschema can be an object or a boolean (true/false)
    if (typeof subschema === 'object' && subschema !== null) {
      scopes = [
        ...scopes,
        ...getScopesOfParsedJsonSchema(subschema, `${jsonPath}['${keyword}']`),
      ];
    } else if (typeof subschema === 'boolean') {
      scopes.push({
        jsonPath: `${jsonPath}['${keyword}']`,
        scope: JsonSchemaScope.TypeDefinition,
      });
    }
  });

  // Special case: "items" as an array (pre-Draft 2020-12 style)
  if (Array.isArray(parsedJsonSchema.items)) {
    parsedJsonSchema.items.forEach((subschema: any, index: number) => {
      scopes = [
        ...scopes,
        ...getScopesOfParsedJsonSchema(
          subschema,
          `${jsonPath}['items'][${index}]`,
        ),
      ];
    });
  }

  return scopes;
}
