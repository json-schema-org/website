const jsonSchemaReferences: Record<string, Record<string, string>> = {
  objectProperty: {
    type: '/understanding-json-schema/reference/type',
    properties: '/understanding-json-schema/reference/object#properties',
    pattern: '/understanding-json-schema/reference/string#regexp',
    minimum: '/understanding-json-schema/reference/numeric#range',
    exclusiveMinimum: '/understanding-json-schema/reference/numeric#range',
    maximum: '/understanding-json-schema/reference/numeric#range',
    exclusiveMaximum: '/understanding-json-schema/reference/numeric#range',
    minLength: '/understanding-json-schema/reference/string#length',
    maxLength: '/understanding-json-schema/reference/string#length',
    enum: '/understanding-json-schema/reference/generic#enum',
    title: '/understanding-json-schema/reference/generic#annotation',
    description: '/understanding-json-schema/reference/generic#annotation',
    default: '/understanding-json-schema/reference/generic#annotation',
    $id: '/understanding-json-schema/basics#declaring-a-unique-identifier',
    $schema: '/understanding-json-schema/basics#declaring-a-json-schema',
    multipleOf: '/understanding-json-schema/reference/numeric#multiples',
    required: '/understanding-json-schema/reference/object#required',
    patternProperties:
      '/understanding-json-schema/reference/object#patternProperties',
    additionalProperties:
      '/understanding-json-schema/reference/object#additionalproperties',
    dependentRequired:
      '/understanding-json-schema/reference/conditionals#dependentRequired',
    dependentSchemas:
      '/understanding-json-schema/reference/conditionals#dependentSchemas',
    items: '/understanding-json-schema/reference/array#items',
    $ref: '/understanding-json-schema/structuring#dollarref',
  },
  stringValue: {
    '"null"': '/understanding-json-schema/reference/null',
    '"integer"': '/understanding-json-schema/reference/numeric#integer',
    '"string"': '/understanding-json-schema/reference/string',
    '"object"': '/understanding-json-schema/reference/object',
    '"number"': '/understanding-json-schema/reference/numeric#number',
  },
};

export default jsonSchemaReferences;
