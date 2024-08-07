---
section: docs
title: Miscellaneous Examples
---

In this page, you will find miscellaneous examples illustrating different uses cases to help you get the most out of your JSON Schemas. Each example comes with accompanying JSON data and explanation.

- [A typical minimum schema](#basic)
- [Arrays of things](#arrays-of-things)
- [Enumerated values](#enumerated-values)
- [Regular expression pattern](#regular-expression-pattern)
- [Complex object with nested properties](#complex-object-with-nested-properties)
- [Conditional validation with dependentRequired](#conditional-validation-with-dependentrequired)
- [Conditional validation with dependentSchemas](#conditional-validation-with-dependentschemas)
- [Conditional validation with if-else](#conditional-validation-with-if-else)

## Basic

This example provides a typical minimum you are likely to see in JSON Schema. It contains:

* [`$id`](https://json-schema.org/draft/2020-12/json-schema-core.html#section-8.2.1) keyword
* [`$schema`](https://json-schema.org/draft/2020-12/json-schema-core.html#section-8.1.1) keyword
* [`title`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-9.1) annotation keyword
* [`type`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-6.1.1) instance data model
* [`properties`](https://json-schema.org/draft/2020-12/json-schema-core.html#section-10.3.2.1) validation keyword
* Three keys: `firstName`, `lastName` and `age` each with their own:
  * [`description`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-9.1) annotation keyword.
  * `type` instance data model (see above).
* [`minimum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-6.2.4) validation keyword on the `age` key.

```json
{
  "$id": "https://example.com/person.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "description": "The person's first name."
    },
    "lastName": {
      "type": "string",
      "description": "The person's last name."
    },
    "age": {
      "description": "Age in years which must be equal to or greater than zero.",
      "type": "integer",
      "minimum": 0
    }
  }
}
```

**Data**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 21
}
```

In the data example, we provide values for the `firstName`, `lastName`, and `age` properties. The values match the defined schema, where `firstName` is a string, `lastName` is a string, and `age` is an integer greater than or equal to zero.


## Arrays of things

Arrays are fundamental structures in JSON -- here we demonstrate a couple of ways they can be described:

* An array of string values.
* An array of objects.

We also introduce the following with this example:

* [`$defs`](https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.8.2.4) keyword
* [`$ref`](https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.8.2.3.1) keyword

For the `fruits` property:

* `type` is set to "array" to indicate it's an array.
* `items` describes the items within the array. In this case, they should be of type "string".

For the `vegetables` property:

* `type` is also set to "array" to indicate it's an array.
* `items` references the `$defs/veggie` definition, indicating that the items in the array should conform to the "veggie" schema defined in the `$defs` section.

```json
{
  "$id": "https://example.com/arrays.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a person, company, organization, or place",
  "type": "object",
  "properties": {
    "fruits": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "vegetables": {
      "type": "array",
      "items": { "$ref": "#/$defs/veggie" }
    }
  },
  "$defs": {
    "veggie": {
      "type": "object",
      "required": [ "veggieName", "veggieLike" ],
      "properties": {
        "veggieName": {
          "type": "string",
          "description": "The name of the vegetable."
        },
        "veggieLike": {
          "type": "boolean",
          "description": "Do I like this vegetable?"
        }
      }
    }
  }
}
```

**Data**

```json
{
  "fruits": [ "apple", "orange", "pear" ],
  "vegetables": [
    {
      "veggieName": "potato",
      "veggieLike": true
    },
    {
      "veggieName": "broccoli",
      "veggieLike": false
    }
  ]
}
```

The data example shows the usage of arrays. The `fruits` property contains an array of strings, while the `vegetables` property contains an array of objects, each adhering to the "veggie" schema definition.


## Enumerated values

This example introduces the `enum` validation keyword which is used with an array of values that includes an integer (`42`), a boolean (`true`), a string (`"hello"`), `null`, and an array (`[1, 2, 3]`). This demonstrates how `enum` can be used to specify a set of allowed values of different types.

```json
{
  "$id": "https://example.com/enumerated-values.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Enumerated Values",
  "type": "object",
  "properties": {
    "data": {
      "enum": [42, true, "hello", null, [1, 2, 3]]
    }
  }
}
```

**Data**

```json
{
  "data": [1, 2, 3]
}
```

The provided data adheres to the schema by using the exact values specified in the enum array: `[1, 2, 3]`.


## Regular expression pattern

This example introduces the [pattern](https://json-schema.org/draft/2020-12/json-schema-core.html#name-regular-expressions) keyword and defines an object with a property called `code` that must match a specific regular expression pattern: `^[A-Z]{3}-\d{3}$`. The pattern here requires three uppercase letters followed by a hyphen and three digits.

```json
{
  "$id": "https://example.com/regex-pattern.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Regular Expression Pattern",
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "pattern": "^[A-Z]{3}-\\d{3}$"
    }
  }
}
```

**Data**

```json
{
  "code": "ABC-123"
}
```

The provided data, "ABC-123", satisfies this pattern defined in the schema.


## Complex object with nested properties

The schema below represents a complex object with various properties including `name`, `age`, `address`, and `hobbies`. The `address` property is an object with nested properties, and the `hobbies` property is an array of strings. The `name` and `age` properties are required.

```json
{
  "$id": "https://example.com/complex-object.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Complex Object",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "postalCode": {
          "type": "string",
          "pattern": "\\d{5}"
        }
      },
      "required": ["street", "city", "state", "postalCode"]
    },
    "hobbies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["name", "age"]
}
```

**Data**

```json
{
  "name": "John Doe",
  "age": 25,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001"
  },
  "hobbies": ["reading", "running"]
}
```

The provided data conforms to the schema by including values for the required properties and ensuring the `age` is an integer greater than or equal to zero. The `address` object contains all the necessary properties, and the `hobbies` property is an array of strings.


## Conditional validation with dependentRequired

In this example, the `dependentRequired` keyword is used to specify that the property `bar` is required when the property `foo` is present. The schema enforces the condition that if `foo` exists, then `bar` must also be present.

```json
{
  "$id": "https://example.com/conditional-validation-dependentRequired.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Conditional Validation with dependentRequired",
  "type": "object",
  "properties": {
    "foo": {
      "type": "boolean"
    },
    "bar": {
      "type": "string"
    }
  },
  "dependentRequired": {
    "foo": ["bar"]
  }
}
```

**Data**

```json
{
  "foo": true,
  "bar": "Hello World"
}
```

As per the schema, when the `foo` property is present (`true`), the `bar` property becomes required. The `bar` property is provided with the value "Hello World", satisfying the requirement of being a string and ensuring compliance with the `dependentRequired` condition.

```json
{
}
```

Since both `foo` and `bar` are missing, the instance is still valid and in compliance with the `dependentRequired` condition as well.

```json
{
  "foo": true
}
```

The above schema is invalid, since the `foo` property is present, but `bar` is not, which invalidates the condition of the `dependentRequired` keyword. 


## Conditional validation with dependentSchemas

The given schema showcases the use of the `dependentSchemas` keyword. It allows defining a subschema that must be satisfied if a certain property is present. 

* In this example, the schema defines an object with two properties: `foo` and `propertiesCount`. The `foo` property is of boolean type, while the `propertiesCount` property is of integer type with a minimum value of 0.
* According to the subschema, when the `foo` property is present, the `propertiesCount` property becomes required, and must be an integer with a minimum value of 7.

```json
{
  "$id": "https://example.com/conditional-validation-dependentSchemas.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Conditional Validation with dependentSchemas",
  "type": "object",
  "properties": {
    "foo": {
      "type": "boolean"
    },
    "propertiesCount": {
      "type": "integer",
      "minimum": 0
    }
  },
  "dependentSchemas": {
    "foo": {
      "required": ["propertiesCount"],
      "properties": {
        "propertiesCount": {
          "minimum": 7
        }
      }
    }
  }
}
```

**Data**

```json
{
  "foo": true,
  "propertiesCount": 10
}
```

Here, the `foo` property is set to true, indicating its presence. As per the schema, when `foo` is present, the `propertiesCount` property becomes required. In this case, the `propertiesCount` property is provided with a value of 10, which satisfies the requirement of being an integer and having a minimum value of 7.

```json
{
  "propertiesCount": 5
}
```

In the above data, `propertiesCount` is 5 but since `foo` is missing, `propertiesCount` does not need to be 7 or more than 7, it only needs to be greater than or equal to 0. Hence, this instance is valid.

```json
{
  "foo": true,
  "propertiesCount": 5
}
```

In this, we have `foo` as true, but `propertiesCount` is 5, and in the schema, `propertiesCount` is set to have minimum 7 as the input according to the `dependentSchemas`. Hence, this is an invalid instance. 


## Conditional validation with if-else

In this schema, we have two properties: `isMember` and `membershipNumber`. The conditional validation is based on the value of the `isMember` property. The validation keywords [if](https://json-schema.org/draft/2020-12/json-schema-core.html#section-10.2.2.1), [then](https://json-schema.org/draft/2020-12/json-schema-core.html#name-then), and [else](https://json-schema.org/draft/2020-12/json-schema-core.html#name-else).

Here's how the validation works in this example:

If the value of `isMember` is true:
* The `then` block is applied, which specifies that the `membershipNumber` property should be a string with a minimum length of 10 and a maximum length of 10.

If the value of `isMember` is anything other than true:
* The `else` block is applied, which specifies that the `membershipNumber` property can be any string.

```json
{
  "$id": "https://example.com/conditional-validation-if-else.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Conditional Validation with If-Else",
  "type": "object",
  "properties": {
    "isMember": {
      "type": "boolean"
    },
    "membershipNumber": {
      "type": "string"
    }
  },
  "required": ["isMember"],
  "if": {
    "properties": {
      "isMember": {
        "const": true
      }
    }
  },
  "then": {
    "properties": {
      "membershipNumber": {
        "type": "string",
        "minLength": 10,
        "maxLength": 10
      }
    }
  },
  "else": {
    "properties": {
      "membershipNumber": {
        "type": "string",
        "minLength": 15
      }
    }
  }
}

```

**Data**

```json
{
  "isMember": true,
  "membershipNumber": "1234567890"
}
```

In this case, the `isMember` property is set to true, so the then block is applied. The `membershipNumber` property is a string with a length of 10 characters, satisfying the validation.

```json
{
  "isMember": false,
  "membershipNumber": "GUEST1234567890"
}
```

In this case, the `isMember` property is false, so the else block is applied. The `membershipNumber` property can be any string with minimum length greater than or equal to 15, so it satisfies the validation.
