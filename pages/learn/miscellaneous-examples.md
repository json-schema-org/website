---
section: docs
title: Miscellaneous Examples
---

## Basic

This example provides a typical minimum you are likely to see in JSON Schema. It contains:

* [`$id`](https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.8.2.1) keyword
* [`$schema`](https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.8.1.1) keyword
* [`title`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.9.1) annotation keyword
* [`type`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.1.1) instance data model
* [`properties`](https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.10.3.2.1) validation keyword
* Three keys: `firstName`, `lastName` and `age` each with their own:
  * [`description`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.9.1) annotation keyword.
  * `type` instance data model (see above).
* [`minimum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.2.4) validation keyword on the `age` key.

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


## Describing geographical coordinates

In this schema, we define an object representing geographical coordinates. This example also introduces the following keywords:

* [`required`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.5.3) validation keyword
* [`minimum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.2.4) validation keyword
* [`maximum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.2.2) validation keyword

```json
{
  "$id": "https://example.com/geographical-location.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Longitude and Latitude Values",
  "description": "A geographical coordinate.",
  "required": [ "latitude", "longitude" ],
  "type": "object",
  "properties": {
    "latitude": {
      "type": "number",
      "minimum": -90,
      "maximum": 90
    },
    "longitude": {
      "type": "number",
      "minimum": -180,
      "maximum": 180
    }
  }
}
```

**Data**

```json
{
  "latitude": 48.858093,
  "longitude": 2.294694
}
```

The provided data contains the latitude and longitude values, both falling within the specified minimum and maximum ranges.


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

This example introduces the [enum]() validation keyword and defines an object with a property called "status" that only allows specific enumerated values: "active", "inactive", and "pending".

```json
{
  "$id": "https://example.com/enumerated-values.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Enumerated Values",
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "pending"]
    }
  }
}
```

**Data**

```json
{
  "status": "active"
}
```

The provided data adheres to the schema by using the value "active" for the `status` property.


## Regular expression pattern

This example introduces the [pattern]() keyword and defines an object with a property called `code` that must match a specific regular expression pattern: `^[A-Z]{3}-\d{3}$`. The pattern here requires three uppercase letters followed by a hyphen and three digits.

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


## Conditional validation with dependencies

The schema below defines an object with two properties: `isMember` and `membershipNumber`. The `membershipNumber` property is required and must have a length of 10 characters only when the `isMember` property is set to true.

```json
{
  "$id": "https://example.com/conditional-validation.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Conditional Validation",
  "type": "object",
  "properties": {
    "isMember": {
      "type": "boolean"
    },
    "membershipNumber": {
      "type": "string",
      "maxLength": 10,
      "minLength": 10,
      "dependencies": {
        "isMember": true
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

The `dependencies` keyword is used to enforce the presence of the `membershipNumber` property when `isMember` is set to true. The provided data satisfies these conditions.


## Conditional validation with if-else

In this schema, we have two properties: `isMember` and `membershipNumber`. The conditional validation is based on the value of the `isMember` property. Here's how the validation works:

If the value of `isMember` is true:
* The then block is applied, which specifies that the `membershipNumber` property should be a string with a minimum length of 10 and a maximum length of 10.

If the value of `isMember` is anything other than true:
* The else block is applied, which specifies that the `membershipNumber` property can be any string.

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
        "type": "string"
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
  "membershipNumber": "ABC123"
}
```

In this case, the `isMember` property is false, so the else block is applied. The `membershipNumber` property can be any string, so it satisfies the validation.