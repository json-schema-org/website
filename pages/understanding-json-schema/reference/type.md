---
title: "JSON data types"
section: docs
---

The `type` [keyword](../../learn/glossary#keyword) is fundamental to JSON Schema because it specifies the data type that a schema should expect.

At its core, JSON Schema defines the following basic types:

- [array](../../understanding-json-schema/reference/array)
- [boolean](../../understanding-json-schema/reference/boolean)
- [null](../../understanding-json-schema/reference/null)
- [numeric types](../../understanding-json-schema/reference/numeric)
- [object](../../understanding-json-schema/reference/object)
- [regular expressions](../../understanding-json-schema/reference/regular_expressions.md)
- [string](../../understanding-json-schema/reference/string)


These types have analogs in most programming languages, though they may
go by different names.

[tabs-start "Language-specific info"]

[tab "Python"]

The following table maps from the names of JSON types to their
analogous types in Python:

| JSON    | Python       |
|---------|--------------|
| string  | string [1]   |
| number  | int/float [2]|
| object  | dict         |
| array   | list         |
| boolean | bool         |
| null    | None         |

#### Footnotes

[1] Since JSON strings always support unicode, they are
analogous to `unicode` on Python 2.x and `str` on
Python 3.x.

[2] JSON does not have separate types for integer and
floating-point.

[tab "Ruby"]

The following table maps from the names of JSON types to their
analogous types in Ruby:

| JSON    | Ruby                 |
|---------|----------------------|
| string  | String               |
| number  | Integer/Float [3]    |
| object  | Hash                 |
| array   | Array                |
| boolean | TrueClass/FalseClass |
| null    | NilClass             |

#### Footnotes

[3] JSON does not have separate types for integer and
floating-point.

[tab "Perl"]

The following table maps from the names of JSON types to
their analogous types in Objective-C:

| JSON    | Perl                                             |
|---------|--------------------------------------------------|
| string  | scalar (SV)                                      |
| number  | scalar (NV or IV), or Math::BigNum, Math::BigInt |
| object  | reftype=HASH                                     |
| array   | reftype=ARRAY                                    |
| boolean | scalar or JSON::PP::Boolean                      |
| null    | scalar (`undef`)                                 |

[tab "Objective-C"]

The following table maps from the names of JavaScript types to
their analogous types in Objective-C:

| JSON    | Objective-C  |
|---------|--------------|
| string  | NSString     |
| number  | NSNumber     |
| object  | NSDictionary |
| array   | NSArray      |
| boolean | NSNumber  [4]|
| null    | NSNull       |

#### Footnotes

[4] `NSJSONSerialization` represents JavaScript numbers and booleans
as `NSNumber`. To distinguish them, we need to check an `NSNumber`
value for identity (pointer equality) to `@YES` and `@NO` constants.

[tab "Swift"]

The following table maps from the names of JavaScript types to
their analogous types in Swift:

| JSON    | Swift      |
|---------|------------|
| string  | String     |
| number  | Int/Double [5]|
| object  | Dictionary |
| array   | Array      |
| boolean | Bool       |
| null    | Optional   |

#### Footnotes

[5] While JavaScript does not have separate types for integer and
floating-point, Swift ``JSONDecoder`` throws an error on attempt
to decode ``Int`` from a non-integer number in JSON.

[tabs-end]

The `type` keyword can take two forms:

1. **A single string**. When it is a single string, it must be one of the types mentioned above (`array`, `boolean`, `integer`, `number`, `null`, `object`, `regular expressions`, or `string`). This specifies that the instance data is only valid when it matches that specific type. 

Here is an example of using the `string` keyword as a single string:

```json
// props { "isSchema": true }
{ "type": "number" }
```

```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": true }
42.0
```

```json
// props { "indent": true, "valid": false }
"42"
```

2. **An array of strings**. When `type` is used as an array, it contains more than one string specifying the types mentioned above. In this case, the instance data is valid if it matches _any_ of the given types.

Here is an example using the `type` keyword as an array of strings, where instance data of the type `string` and `number` are valid but `array` isn't:

```json
// props { "isSchema": true }
{ "type": ["number", "string"] }
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": true }
"Life, the universe, and everything"
```
```json
// props { "indent": true, "valid": false }
["Life", "the universe", "and everything"]
```

JSON Schema offers a variety of keywords to validate data against specific types. The following table outlines keywords that are specifically designed for each basic data type:

| Type Keyword | Specific Keywords | Description |
|---|---|---|
| [array](../../understanding-json-schema/reference/array)        | `items`, `additionalItems`, `minItems`, `maxItems`, `uniqueItems` | Define item schemas, additional item handling, item count constraints, and uniqueness. |
| [number](../../understanding-json-schema/reference/numeric)       | `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf` | Define numeric ranges, including exclusive bounds and divisibility. |
| [object](../../understanding-json-schema/reference/object)      | `required`, `properties`, `additionalProperties`, `patternProperties`, `minProperties`, `maxProperties`, `dependencies` | Define required properties, property schemas, additional property handling, pattern-based property matching, and property count constraints. |
| [string](../../understanding-json-schema/reference/string)       | `minLength`, `maxLength`, `pattern`, `format`| Restrict string length, pattern matching, and format validation (e.g., email, date). |


Understanding these basic data types gives you a strong foundation for building more complex JSON Schemas.

<!--Remove the text below from this document and add it to the overview of the reference docs-->
Dive deeper into our reference and explore JSON Schema's flexibility for creating complex data structures:

- [Value restrictions](/understanding-json-schema/reference/generic). Define precise limitations for data, ensuring accuracy and consistency. 
- [Conditional schema validation](/understanding-json-schema/reference/conditionals). Validate schemas dynamically based on specific conditions.
- [Schema composition](/understanding-json-schema/reference/generic). Build modular and reusable schemas, making your validation process more efficient and maintainable.

By utilizing these advanced features, you can create robust and flexible JSON Schemas that meet your exact needs.