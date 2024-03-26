---
title: "Type-specific keywords"
section: docs
---

The `type` keyword is fundamental to JSON Schema. It specifies the data
type for a schema.

At its core, JSON Schema defines the following basic types:

* [string](../../understanding-json-schema/reference/string)
* [number](../../understanding-json-schema/reference/numeric#number)
* [integer](../../understanding-json-schema/reference/numeric#integer)
* [object](../../understanding-json-schema/reference/object)
* [array](../../understanding-json-schema/reference/array)
* [boolean](../../understanding-json-schema/reference/boolean)
* [null](../../understanding-json-schema/reference/null)

These types have analogs in most programming languages, though they may
go by different names.

[tabs-start "Language-specific info"]

[tab "Python"]

The following table maps from the names of JSON types to their
analogous types in Python:

| JSON    | Python       |
|---------|--------------|
| string  | string *1    |
| number  | int/float *2 |
| object  | dict         |
| array   | list         |
| boolean | bool         |
| null    | None         |

#### Footnotes

[#1] Since JSON strings always support unicode, they are
analogous to `unicode` on Python 2.x and `str` on
Python 3.x.

[#2] JSON does not have separate types for integer and
floating-point.

[tab "Ruby"]

The following table maps from the names of JSON types to their
analogous types in Ruby:

| JSON    | Ruby                 |
|---------|----------------------|
| string  | String               |
| number  | Integer/Float *3     |
| object  | Hash                 |
| array   | Array                |
| boolean | TrueClass/FalseClass |
| null    | NilClass             |

#### Footnotes

[#3] JSON does not have separate types for integer and
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
| boolean | NSNumber     |
|         | [#4]_        |
| null    | NSNull       |

#### Footnotes

[#4] `NSJSONSerialization` represents JavaScript numbers and booleans
as `NSNumber`. To distinguish them, we need to check an `NSNumber`
value for identity (pointer equality) to `@YES` and `@NO` constants.

[tab "Swift"]

The following table maps from the names of JavaScript types to
their analogous types in Swift:

| JSON    | Swift      |
|---------|------------|
| string  | String     |
| number  | Int/Double |
|         | [#5]_      |
| object  | Dictionary |
| array   | Array      |
| boolean | Bool       |
| null    | Optional   |

#### Footnotes

[#5] While JavaScript does not have separate types for integer and
floating-point, Swift ``JSONDecoder`` throws an error on attempt
to decode ``Int`` from a non-integer number in JSON.

[tabs-end]

The `type` keyword may either be a string or an array:

-   If it\'s a string, it is the name of one of the basic types above.
-   If it is an array, it must be an array of strings, where each string
    is the name of one of the basic types, and each element is unique.
    In this case, the JSON snippet is valid if it matches *any* of the
    given types.

Here is a simple example of using the `type` keyword:

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

In the following example, we accept strings and numbers, but not
structured data types:

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

For each of these types, there are keywords that only apply to those
types. For example, numeric types have a way of specifying a numeric
range, that would not be applicable to other types. In this reference,
these validation keywords are described along with each of their
corresponding types in the following chapters.
