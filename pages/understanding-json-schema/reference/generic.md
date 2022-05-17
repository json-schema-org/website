---
title: "Generic keywords"
---

This chapter lists some miscellaneous properties that are available for
all JSON types.

## Annotations[#annotation]

JSON Schema includes a few keywords, that aren\'t strictly used for
validation, but are used to describe parts of a schema. None of these
\"annotation\" keywords are required, but they are encouraged for good
practice, and can make your schema \"self-documenting\".

The `title` and `description` keywords must be strings. A \"title\" will
preferably be short, whereas a \"description\" will provide a more
lengthy explanation about the purpose of the data described by the
schema.

The `default` keyword specifies a default value. This value is not used
to fill in missing values during the validation process. Non-validation
tools such as documentation generators or form generators may use this
value to give hints to users about how to use a value. However,
`default` is typically used to express that if a value is missing, then
the value is semantically the same as if the value was present with the
default value. The value of `default` should validate against the schema
in which it resides, but that isn\'t required.

<Star label="New in draft 6" />
The `examples` keyword is a place to provide an array of examples that
validate against the schema. This isn\'t used for validation, but may
help with explaining the effect and purpose of the schema to a reader.
Each entry should validate against the schema in which it resides, but
that isn\'t strictly required. There is no need to duplicate the
`default` value in the `examples` array, since `default` will be treated
as another example.

<Star label="New in draft 7" />
The boolean keywords `readOnly` and `writeOnly` are typically used in an
API context. `readOnly` indicates that a value should not be modified.
It could be used to indicate that a `PUT` request that changes a value
would result in a `400 Bad Request` response. `writeOnly` indicates that
a value may be set, but will remain hidden. In could be used to indicate
you can set a value with a `PUT` request, but it would not be included
when retrieving that record with a `GET` request.

<Star label="New in draft 2019-09" />
The `deprecated` keyword is a boolean that indicates that the instance
value the keyword applies to should not be used and may be removed in
the future.

```json
// props { "isSchema": true }
{
  "title": "Match anything",
  "description": "This is a schema that matches anything.",
  "default": "Default value",
  "examples": [
    "Anything",
    4035
  ],
  "deprecated": true,
  "readOnly": true,
  "writeOnly": false
}
```

## Comments

<Star label="New in draft 7" />

The `$comment` keyword is strictly intended for adding comments to a
schema. Its value must always be a string. Unlike the annotations
`title`, `description`, and `examples`, JSON schema implementations
aren\'t allowed to attach any meaning or behavior to it whatsoever, and
may even strip them at any time. Therefore, they are useful for leaving
notes to future editors of a JSON schema, but should not be used to
communicate to users of the schema.

### Enumerated values[#enum]

The `enum` keyword is used to restrict a value to a fixed set of values.
It must be an array with at least one element, where each element is
unique.

The following is an example for validating street light colors:

```json
// props { "isSchema": true }
{
  "enum": ["red", "amber", "green"]
}
```
```json
// props { "indent": true, "valid": true }
"red"
```
```json
// props { "indent": true, "valid": false }
"blue"
```

You can use `enum` even without a type, to accept values of different
types. Let\'s extend the example to use `null` to indicate \"off\", and
also add 42, just for fun.

```json
// props { "isSchema": true }
{
  "enum": ["red", "amber", "green", null, 42]
}
```
```json
// props { "indent": true, "valid": true }
"red"
```
```json
// props { "indent": true, "valid": true }
null
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": false }
0
```

## Constant values[#const]

<Star label="New in draft 6" />

The `const` keyword is used to restrict a value to a single value.

For example, if you only support shipping to the United States for
export reasons:

```json
// props { "isSchema": true }
{
  "properties": {
    "country": {
      "const": "United States of America"
    }
  }
}
```
```json
// props { "indent": true, "valid": true }
{ "country": "United States of America" }
```
```json
// props { "indent": true, "valid": false }
{ "country": "Canada" }
```
