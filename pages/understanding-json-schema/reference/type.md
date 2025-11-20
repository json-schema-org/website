---
title: "Type-specific Keywords"
section: docs
prev: 
  label: JSON Schema Keywords
  url: /understanding-json-schema/keywords
next: 
  label: Array
  url: /understanding-json-schema/reference/array
---

The `type` [keyword](../../learn/glossary#keyword) is fundamental to JSON Schema because it specifies the data type that a schema should expect.

At its core, JSON Schema defines the following basic types:

- [array](../../understanding-json-schema/reference/array)
- [boolean](../../understanding-json-schema/reference/boolean)
- [null](../../understanding-json-schema/reference/null)
- [numeric types](../../understanding-json-schema/reference/numeric)
- [object](../../understanding-json-schema/reference/object)
- [regular expressions](../../understanding-json-schema/reference/regular_expressions)
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

Here is an example of using the `number` keyword as a single number:

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

## Format[#format]

The `format` keyword conveys semantic information for values that may be difficult or impossible to describe using JSON Schema. Typically, this semantic information is described by other documents. The JSON Schema Validation specification defines several formats, but this keyword also allows schema authors to define their own formats.

For example, because JSON doesn't have a "DateTime" type, dates need to be encoded as strings. `format` allows the schema author to indicate that the string value should be interpreted as a date. By default, `format` is just an annotation and does not affect validation.

Optionally, validator [implementations](../../learn/glossary#implementation) can provide a configuration option to enable `format` to function as an assertion rather than just an annotation. That means that validation fails when, for example, a value with a `date` format isn't in a form that can be parsed as a date. This allows values to be constrained beyond what other tools in JSON Schema, including [Regular Expressions](../../understanding-json-schema/reference/regular_expressions), can do.

> Implementations may provide validation for only a subset of the built-in formats or do partial validation for a given format. For example, some implementations may consider a string an email if it contains an `@`, while others might perform additional checks for other aspects of a well-formed email address.

The JSON Schema specification has a bias toward networking-related formats due to its roots in web technologies. However, custom formats may also be used if the parties exchanging the JSON documents share information about the custom format types. A JSON Schema validator will ignore any format type it does not understand.

### Built-in Formats

It should be noted that `format` is not limited to a specific set of valid values or types. Users may define their own custom keywords including ones that work with JSON data types other than `string`, such as `number`. Below, we cover the formats specified in the JSON Schema specification.

#### Dates and Times

Dates and times are represented in [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). RFC 3339 is a specification from the Internet Engineering Task Force (IETF).

- `"date-time"`: Date and time together, for example, `2018-11-13T20:20:39+00:00`.
- `"time"`: <StarInline label="New in draft 7" /> Time, for example, `20:20:39+00:00`.
- `"date"`: <StarInline label="New in draft 7" /> Date, for example, `2018-11-13`.
- `"duration"`: <StarInline label="New in draft 2019-09" /> A duration as defined by the [ISO 8601 ABNF for "duration"](https://datatracker.ietf.org/doc/html/rfc3339#appendix-A). For example, `P3D` expresses a duration of 3 days.

#### Email Addresses

- `"email"`: Internet email address, see [RFC 5321, section 4.1.2](http://tools.ietf.org/html/rfc5321#section-4.1.2).
- `"idn-email"`: <StarInline label="New in draft 7" /> The internationalized form of an Internet email address, see [RFC 6531](https://tools.ietf.org/html/rfc6531).

#### Hostnames

- `"hostname"`: Internet host name, see [RFC 1123, section 2.1](https://datatracker.ietf.org/doc/html/rfc1123#section-2.1).
- `"idn-hostname"`: <StarInline label="New in draft 7" /> An internationalized Internet host name, see [RFC5890, section 2.3.2.3](https://tools.ietf.org/html/rfc5890#section-2.3.2.3).

#### IP Addresses

- `"ipv4"`: IPv4 address, according to dotted-quad ABNF syntax as defined in [RFC 2673, section 3.2](http://tools.ietf.org/html/rfc2673#section-3.2).
- `"ipv6"`: IPv6 address, as defined in [RFC 2373, section 2.2](http://tools.ietf.org/html/rfc2373#section-2.2).

#### Resource Identifiers

- `"uuid"`: <StarInline label="New in draft 2019-09" /> A Universally Unique Identifier as defined by [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122). Example: `3e4666bf-d5e5-4aa7-b8ce-cefe41c7568a`.
- `"uri"`: A universal resource identifier (URI), according to [RFC3986](http://tools.ietf.org/html/rfc3986).
- `"uri-reference"`: <StarInline label="New in draft 6" /> A URI Reference (either a URI or a relative-reference), according to [RFC3986, section 4.1](http://tools.ietf.org/html/rfc3986#section-4.1).
- `"iri"`: <StarInline label="New in draft 7" /> The internationalized equivalent of a "uri", according to [RFC3987](https://tools.ietf.org/html/rfc3987).
- `"iri-reference"`: <StarInline label="New in draft 7" /> The internationalized equivalent of a "uri-reference", according to [RFC3987](https://tools.ietf.org/html/rfc3987).

#### URI Template

- `"uri-template"`: <StarInline label="New in draft 6" /> A URI Template (of any level) according to [RFC6570](https://tools.ietf.org/html/rfc6570). If you don\'t already know what a URI Template is, you probably don\'t need this value.

#### JSON Pointer

- `"json-pointer"`: <StarInline label="New in draft 6" /> A JSON Pointer, according to [RFC6901](https://tools.ietf.org/html/rfc6901). There is more discussion on using JSON Pointer within JSON Schema in [Structuring a complex schema](../../understanding-json-schema/structuring). Note that this should be used only when the entire string contains only JSON Pointer content, e.g., `/foo/bar`. JSON Pointer URI fragments, e.g., `#/foo/bar/` should use `"uri-reference"`.
- `"relative-json-pointer"`: <StarInline label="New in draft 7" /> A [relative JSON pointer](https://tools.ietf.org/html/draft-handrews-relative-json-pointer-01).

#### Regular Expressions

- `"regex"`: <StarInline label="New in draft 7" /> A regular expression that should be valid according to the [ECMA 262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) [dialect](../../learn/glossary#dialect). Be careful, in practice, JSON Schema validators are only required to accept the safe subset of [regular expressions](../../understanding-json-schema/reference/regular_expressions) described elsewhere in this document.
