---
title: "Schema Composition"
section: docs
---

<Keywords label="schema composition" />

JSON Schema includes a few keywords for combining schemas together. Note
that this doesn\'t necessarily mean combining schemas from multiple
files or JSON trees, though these facilities help to enable that and are
described in [Structuring a complex schema](../../understanding-json-schema/structuring). Combining schemas may be as
simple as allowing a value to be validated against multiple criteria at
the same time.

These keywords correspond to well known boolean algebra concepts like
AND, OR, XOR, and NOT. You can often use these keywords to express
complex constraints that can\'t otherwise be expressed with standard
JSON Schema keywords.

The keywords used to combine schemas are:

- `allOf`: (AND) Must be valid against *all* of the subschemas
- `anyOf`: (OR) Must be valid against *any* of the subschemas
- `oneOf`: (XOR) Must be valid against *exactly one* of the
    subschemas

All of these keywords must be set to an array, where each item is a
schema. Be careful with recursive schemas as they can exponentially increase processing times.

In addition, there is:

- `not`: (NOT) Must *not* be valid against the given schema

<Keywords label="single: allOf single: schema composition; allOf" />

## allOf[#allOf]

To validate against `allOf`, the given data must be valid against all of the given subschemas.

```json
// props { "isSchema": true }
{
  "allOf": [
    { "type": "string" },
    { "maxLength": 5 }
  ]
}
```  
A snippet of the British royal family tree

```json
// props { "indent": true, "valid": true }
"short"
```
```json
// props { "indent": true, "valid": false }
"too long"
```

> [allOf](#allof) can not be used to \"extend\" a schema to add more
details to it in the sense of object-oriented inheritance. Instances
must independently be valid against \"all of\" the schemas in the
`allOf`. See the section on [Extending Closed Schemas](../../understanding-json-schema/reference/object#extending) for more
information.

<Keywords label="single: anyOf single: schema composition; anyOf" />

## anyOf[#anyOf]

To validate against `anyOf`, the given data must be valid against any
(one or more) of the given subschemas.

```json
// props { "isSchema": true }
{
  "anyOf": [
    { "type": "string", "maxLength": 5 },
    { "type": "number", "minimum": 0 }
  ]
}
```  
A snippet of the British royal family tree

```json
// props { "indent": true, "valid": true }
"short"
```
```json
// props { "indent": true, "valid": false }
"too long"
```
```json
// props { "indent": true, "valid": true }
12"
```
```json
// props { "indent": true, "valid": false }
-5
```

<Keywords label="single: oneOf single: schema composition; oneOf" />

## oneOf [#oneOf]

To validate against `oneOf`, the given data must be valid against
exactly one of the given subschemas.

```json
// props { "isSchema": true }
{
  "oneOf": [
    { "type": "number", "multipleOf": 5 },
    { "type": "number", "multipleOf": 3 }
  ]
}
```
```json
// props { "indent": true, "valid": true }
10
```
```json
// props { "indent": true, "valid": true }
9
```
Not a multiple of either 5 or 3.

```json
// props { "indent": true, "valid": false }
2
```
Multiple of *both* 5 and 3 is rejected.

```json
// props { "indent": true, "valid": false }
15
```

<Warning>
Careful consideration should be taken when using `oneOf` entries as the nature of it requires verification of *every* sub-schema which can lead to increased processing times. Prefer `anyOf` where possible.
</Warning>

<Keywords label="single: not single: schema composition; not" />

## not

The `not` keyword declares that an instance validates if it doesn\'t
validate against the given subschema.

For example, the following schema validates against anything that is not
a string:

```json
// props { "isSchema": true }
{ "not": { "type": "string" } }
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": true }
{ "key": "value" }
```
```json
// props { "indent": true, "valid": false }
"I am a string"
```

<Keywords label="single: not single: schema composition; subschema independence" />

## Properties of Schema Composition[#composition]

### Illogical Schemas [#illogicalschemas]

Note that it\'s quite easy to create schemas that are logical
impossibilities with these keywords. The following example creates a
schema that won\'t validate against anything (since something may not be
both a string and a number at the same time):

```json
// props { "isSchema": true }
{
  "allOf": [
    { "type": "string" },
    { "type": "number" }
  ]
}
```
```json
// props { "indent": true, "valid": false }
"No way"
```
```json
// props { "indent": true, "valid": false }
-1
```

### Factoring Schemas [#factoringschemas]

Note that it\'s possible to \"factor\" out the common parts of the
subschemas. The following two schemas are equivalent.

```json
// props { "isSchema": true }
{
  "oneOf": [
    { "type": "number", "multipleOf": 5 },
    { "type": "number", "multipleOf": 3 }
  ]
}
```
```json
// props { "isSchema": true }
{
  "type": "number",
  "oneOf": [
    { "multipleOf": 5 },
    { "multipleOf": 3 }
  ]
}
```
