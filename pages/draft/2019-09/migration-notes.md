---
title: Draft 07 to Draft 2019-09
section: docs
---


### Introduction

JSON Schema Draft 2019-09 introduces several foundational changes from Draft 7. The most notable shifts include the concept of **vocabularies**, a new **meta-schema model**, and the introduction of **recursive referencing** (`$recursiveRef`, `$recursiveAnchor`). These changes reflect greater modularity, formal extensibility, and clarity when validating recursive data structures like trees or graphs.

This guide covers the key differences and provides step-by-step migration instructions to help you transition your schemas and tooling from Draft 7 to Draft 2019-09.


### Keyword Changelog

| Keyword (Draft 7)        | Keyword (Draft 2019-09)  | Specification | Keyword Type     | Behavior Details                                                                     |
| ------------------------ | ------------------------ | ------------- | ---------------- | ------------------------------------------------------------------------------------ |
| `$schema`                | `$schema`                | Core          | Identifier       | Updated to use 2019-09 meta-schema: `"https://json-schema.org/draft/2019-09/schema"` |
| *not present*            | `$vocabulary`            | Core          | Identifier       | Declares which vocabularies a schema uses. Enables modular extensibility.            |
| *not present*            | `$recursiveRef`          | Core          | Identifier       | Replaces `$ref` in recursive contexts.                                               |
| *not present*            | `$recursiveAnchor`       | Core          | Identifier       | Used in base schemas to define recursive entry points.                               |
| `definitions`            | `definitions`            | Validation    | Object Container | Still supported but now superseded by `$defs` in 2020-12+.                           |
| `id`                     | `$id`                    | Core          | Identifier       | Already introduced in Draft 6, still used in Draft 2019-09.                          |
| `examples`               | `examples`               | Annotation    | Informational    | Remains unchanged.                                                                   |
| `readOnly` / `writeOnly` | `readOnly` / `writeOnly` | Annotation    | Informational    | Remains unchanged.                                                                   |



### Migration Tutorial

#### Step 1: Update `$schema` to use the new meta-schema

Start by updating your `$schema` declaration to reference the correct Draft 2019-09 meta-schema:

**Before (Draft 7):**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

**After (Draft 2019-09):**

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema"
}
```



#### Step 2: Add `$vocabulary` if extending or customizing the schema

Draft 2019-09 introduces a **vocabulary system** for declaring which keywords are in use. This is mostly relevant if you write custom meta-schemas or validators.

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$vocabulary": {
    "https://json-schema.org/draft/2019-09/vocab/core": true,
    "https://json-schema.org/draft/2019-09/vocab/applicator": true,
    "https://json-schema.org/draft/2019-09/vocab/validation": true,
    "https://json-schema.org/draft/2019-09/vocab/meta-data": true
  }
}
```

This helps tooling understand what features are supported in your schema. For basic schemas, it can be omitted unless you're writing meta-schemas.



#### Step 3: Use `$recursiveAnchor` and `$recursiveRef` for recursive structures

One of the biggest new features is **recursive referencing**, solving complex referencing for tree-like or self-nested structures.

**Before (Draft 7) — using `$ref` with named anchors:**

```json
{
  "$id": "node.schema.json",
  "definitions": {
    "node": {
      "type": "object",
      "properties": {
        "value": { "type": "string" },
        "children": {
          "type": "array",
          "items": { "$ref": "#/definitions/node" }
        }
      }
    }
  }
}
```

**After (Draft 2019-09) — using `$recursiveRef`:**

```json
{
  "$id": "node.schema.json",
  "$recursiveAnchor": true,
  "type": "object",
  "properties": {
    "value": { "type": "string" },
    "children": {
      "type": "array",
      "items": { "$recursiveRef": "#" }
    }
  }
}
```

This allows cleaner recursive references and helps with schema composition across documents.



#### Step 4: Continue using supported keywords like `readOnly`, `writeOnly`, `examples`

These keywords remain valid and unchanged:

```json
{
  "type": "object",
  "properties": {
    "password": {
      "type": "string",
      "writeOnly": true
    },
    "profile": {
      "type": "object",
      "readOnly": true
    }
  }
}
```

---

### What Didn’t Change

* Keywords like `type`, `enum`, `const`, `required`, `minimum`, `pattern`, and `format` remain unchanged.
* `definitions` is still allowed, though newer drafts favor `$defs` (introduced in 2020-12).
* JSON Pointer references still work (`$ref` continues for non-recursive references).



### Summary of Migration Actions

| Action                              | Required                        | Notes                                      |
| ----------------------------------- | ------------------------------- | ------------------------------------------ |
| Update `$schema` URI                |  Yes                           | Must be updated to Draft 2019-09           |
| Add `$vocabulary`                   |  Optional                     | Mostly for meta-schemas and validators     |
| Replace `$ref` with `$recursiveRef` |  Yes, if using recursion       | Enables dynamic resolution                 |
| Add `$recursiveAnchor`              |  Yes, if using `$recursiveRef` | Marks recursion entry point                |
| Keep using unchanged keywords       |  Yes                           | No changes needed for `type`, `enum`, etc. |



### Conclusion

Migrating from Draft 7 to Draft 2019-09 is primarily about introducing **recursive handling** and **vocabulary awareness**. Most validation behavior remains the same, but if you’re working with complex or nested schemas, adopting `$recursiveRef` and `$recursiveAnchor` will simplify references dramatically.

To fully align your tooling or schema authoring practices with Draft 2019-09:

*  Update your `$schema` references.
*  Use `$recursiveRef` for nested data.
*  Consider declaring `$vocabulary` for extensibility.
*  Retain familiar validation keywords as-is.



For more on Draft 2019-09

* [Official Draft 2019-09 Spec](https://json-schema.org/draft/2019-09/draft-handrews-json-schema-02)

