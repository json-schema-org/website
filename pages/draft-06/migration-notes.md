---
title: Draft 04 to Draft 06
section: docs
---


### Introduction

Draft-06 of the JSON Schema specification introduced a number of changes over Draft-04 that improve keyword clarity, validation flexibility, and alignment with common development practices. Migration from Draft-04 to Draft-06 involves both structural and behavioral adjustments to keywords, formats, and validation logic. This guide covers the key differences and provides practical steps for implementers updating their schemas and tooling.

### Keyword Changelog

| Keyword (Draft-04)                               | Keyword (Draft-06)                              | Specification | Keyword Type       | Behavior Details                                                                            |
| ------------------------------------------------ | ----------------------------------------------- | ------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| `id`                                             | `$id`                                           | Core          | Identifier         | Replaces `id` with `$id` to align with JSON-LD and emphasize its identifier role.           |
| `exclusiveMinimum`, `exclusiveMaximum` (boolean) | `exclusiveMinimum`, `exclusiveMaximum` (number) | Validation    | Numeric Boundaries | Previously booleans tied to `minimum`/`maximum`; now standalone numeric values.             |
| `definitions`                                    | `definitions`                                   | Core          | Schema Reuse       | Still available but less emphasized in later drafts in favor of `$defs` (introduced later). |
| `patternProperties`                              | `patternProperties`                             | Validation    | Object Constraints | Behavior unchanged but formalized with stricter regex requirements.                         |
| `required`                                       | `required`                                      | Validation    | Array Constraint   | Unchanged but clarified that values must be unique.                                         |
| `type`                                           | `type`                                          | Validation    | Data Type          | Expanded to accept boolean schemas as valid types.                                          |
| not present                                      | `propertyNames`                                 | Validation    | Object Constraint  | Newly introduced: restricts allowed property names using a subschema.                       |
| not present                                      | `contains`                                      | Validation    | Array Constraint   | Newly introduced: checks if at least one array element matches a schema.                    |
| not present                                      | `const`                                         | Validation    | Value Constraint   | Newly introduced: matches instance against a single fixed value.                            |

### Migration Steps

#### 1. Update the `$schema` Declaration

Update the `$schema` URI in your schema file to point to Draft-06:

**Before (Draft-04):**

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#"
}
```

**After (Draft-06):**

```json
{
  "$schema": "http://json-schema.org/draft-06/schema#"
}
```

#### 2. Replace `id` with `$id`

Draft-06 deprecates `id` in favor of `$id` for clearer semantics and JSON-LD compatibility.

**Before:**

```json
{
  "id": "http://example.com/schema"
}
```

**After:**

```json
{
  "$id": "http://example.com/schema"
}
```

#### 3. Adjust `exclusiveMinimum` and `exclusiveMaximum`

These keywords are no longer booleans but numeric values directly defining exclusive bounds.

**Before:**

```json
{
  "minimum": 5,
  "exclusiveMinimum": true
}
```

**After:**

```json
{
  "exclusiveMinimum": 5
}
```

#### 4. Use `const` for Fixed Values

Use the new `const` keyword if you want a value to equal exactly a specific value.

**Before (workaround using `enum`):**

```json
{
  "enum": ["fixedValue"]
}
```

**After:**

```json
{
  "const": "fixedValue"
}
```

#### 5. Introduce `contains` and `propertyNames` If Needed

These are new validation keywords that add expressive power:

* `contains`: Ensures at least one item in an array matches a subschema.
* `propertyNames`: Applies a schema to property names in an object.

**Example:**

```json
{
  "type": "array",
  "contains": { "type": "string" }
}
```

```json
{
  "type": "object",
  "propertyNames": { "pattern": "^[a-z]+$" }
}
```

### Conclusion

Migrating from Draft-04 to Draft-06 involves changes that improve clarity, expressiveness, and alignment with standards. The most impactful updates include the move to `$id`, numeric-exclusive limits, and the addition of `const`, `contains`, and `propertyNames`. Most existing schemas can be updated with minimal changes, and migration sets the foundation for adopting more modern drafts like Draft-07 and beyond.

For more on Draft-06:

* [Official Specification](https://json-schema.org/draft-06/draft-wright-json-schema-01)

