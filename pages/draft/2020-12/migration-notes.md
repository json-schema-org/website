---
title: Draft 2019-09 to Draft 2020-12
section: docs
---

### Introduction

JSON Schema Draft 2020-12 introduces key improvements over Draft 2019-09, focusing on improved modularity and cross-referencing capabilities. This means improvements for schema resuse, being able to define features a schema supports, etc. This guide covers all major changes and how to migrate from Draft 2019-09 to Draft 2020-12.

### Keyword changelog

| Keyword (Draft 2019-09) | Keyword (Draft 2020-12) | Specification | Keyword Type | Behavior Details |
| --- | --- | --- | --- | --- |
| $anchor | remained $anchor | Core |  | In 2019-09, $anchor could use a colon and not start with an underscore, but in 2020-12, the upgrade in syntax rule can't use a colon. |
| $schema | remained $schema | Core |  | The behavior was updated to use dialect 2020-12  |
| $recursiveAnchor | `$dynamicAnchor` | Core | Identifier | Similar to `$anchor`, but supports `$dynamicRef` for flexible schema resolution and $dynamicAnchor now has its own syntax. |
| $recursiveRef | `$dynamicRef` | Core | Applicator | Works with `$dynamicAnchor` to allow referencing dynamically resolved schemas at runtime. |
| $vocabulary | `$vocabulary` | Core | | Specifies which vocabularies a schema uses in 2019-09, but the update now uses format-annotation aiding compatibility and extensibility. |
| `items` (used for both lists and tuples) | `prefixItems` | Core | Applicator | Separates tuple validation (`prefixItems`) from list validation (`items`). Now, `items` applies only to additional elements beyond `prefixItems`. |

### Tutorial


#### Migration Steps

##### 1. Updating `$schema` Declaration

Reference the correct Draft 2020-12 meta-schema to ensure compatibility:

**Before (Draft 2019-09):**

```
{
  "$schema": "https://json-schema.org/draft/2019-09/schema"
}
```

**After (Draft 2020-12):**

```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema"
}
```

##### 2. Using `$dynamicAnchor` and `$dynamicRef`

Switch to `$dynamicAnchor` when defining recursive schemas:

**Before (Draft 2019-09):**

```
{
  "$recursiveAnchor": true
}
```

**After (Draft 2020-12):**

```
{
  "$dynamicAnchor": "mySchema"
}
```

Use `$dynamicRef` instead of `$recursiveRef` for dynamic references:

**Example:**

```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$dynamicAnchor": "baseSchema"
}
```

To reference dynamically:

```
{
  "$dynamicRef": "#baseSchema"
}
```

##### 3. Declaring Supported Vocabularies with `$vocabulary`

For your custom dialects, you'll need to update a couple of vocabulary declarations.

If you're using `format` as annotations (the default), you'll make the following change.

**Before (Draft 2019-09):**

```json
{
  "$vocabulary": {
    "https://json-schema.org/draft/2019-09/vocab/format": false
  }
}
```

**After (Draft 2020-12):**

```json
{
  "$vocabulary": {
    "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
  }
}
```

If you're using `format` as annotations, do this instead,

**Before (Draft 2019-09):**

```json
{
  "$vocabulary": {
    "https://json-schema.org/draft/2019-09/vocab/format": true
  }
}
```

**After (Draft 2020-12):**

```json
{
  "$vocabulary": {
    "https://json-schema.org/draft/2020-12/vocab/format-assertion": true
  }
}
```

Next, update your Applicator vocabulary declaration to include Unevaluated.

**Before (Draft 2019-09):**

```json
{
  "$vocabulary": {
    "https://json-schema.org/draft/2019-09/vocab/applicator": true
  }
}
```

**After (Draft 2020-12):**

```json
{
  "$vocabulary": {
    "https://json-schema.org/draft/2020-12/vocab/applicator": true,
    "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
  }
}
```

##### 4. Replacing `items` with `prefixItems` for Tuple Validation

For fixed-length arrays (tuples), replace `items` with `prefixItems`:

**Before (Draft 2019-09):**

```
{
  "type": "array",
  "items": [
    { "type": "string" },
    { "type": "number" }
  ]
}
```

**After (Draft 2020-12):**

```
{
  "type": "array",
  "prefixItems": [
    { "type": "string" },
    { "type": "number" }
  ]
}
```

To validate additional items beyond `prefixItems`, `items` can still be used:

```
{
  "type": "array",
  "prefixItems": [
    { "type": "string" },
    { "type": "number" }
  ],
  "items": { "type": "boolean" }
}
```

These improvements ensure compliance with the latest JSON Schema standards while improving maintainability and extensibility of your schemas.