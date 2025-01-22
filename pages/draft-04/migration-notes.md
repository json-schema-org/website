---
title: Migrating from Draft 03 to Draft 04
section: docs
---

### Introduction

The migration from Draft 3 to Draft 4 of JSON Schema introduces changes in how schemas are defined and validated. Draft 4, published on January 31, 2013, introduced new keywords and revised the behaviours of existing ones.

This guide will help you adapt your JSON Schemas to align with Draft 4 requirements, covering keyword changes, updates, and behavioural modifications.

### Keyword changelog

Below is a summary table highlighting keyword changes between Draft 3 and Draft 4.

| Keyword (Draft 3) | Keyword (Draft 4) | Specification | Keyword type      | Behavior Details                                                                                                                                                       |
| ----------------- | ----------------- | ------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`         | `$schema`         | Core          | Identifier        | Change in the dialect (Uses the latest Draft4 dialect)                                                                                                                 |
| `type`            | `type`            | Validation    | Assertion         | This change no longer accepts the `any` type, restricting instances to the seven core primitive types only.                                                            |
| `disallow`        | removed           | Validation    | Applicator        | The `disallow` keyword specifies types or schemas that an instance must not match, although removed; this functionality has been replaced by the `not` keyword.        |
| `required`        | `required`        | Validation    | Assertion         | The `required` keyword shifted from being a boolean within each property to a standalone keyword that takes an array of required property names outside of properties. |
| `divisibleBy`     | `multipleOf`      | Validation    | Assertion         | `divisibleBy` was renamed to `multipleOf` with a stricter requirement that its value must be greater than 0.                                                           |
| `extends`         | removed           | Validation    | Applicator        | The `extends` keyword was removed; allOf was added as a new keyword to achieve similar functionality.                                                                  |
| `format`          | `format`          | Validation    | Annotation        | -                                                                                                                                                                      |
| `dependencies`    | `dependencies`    | Core          | Assertion         | The `dependencies` member values were changed to require an array of strings or a schema, eliminating the use of single strings.                                       |
| `id`              | `id`              | Core          | Identifier        | -                                                                                                                                                                      |
| Not present       | `allOf`           | Core          | Applicator        | -                                                                                                                                                                      |
| Not present       | `anyOf`           | Core          | Applicator        | -                                                                                                                                                                      |
| Not present       | `definitions`     | Validation    | Reserved Location | -                                                                                                                                                                      |
| Not present       | `maxProperties`   | Validation    | Assertion         | -                                                                                                                                                                      |
| Not present       | `minProperties`   | Validation    | Assertion         | -                                                                                                                                                                      |
| Not present       | `not`             | Core          | Applicator        | -                                                                                                                                                                      |
| Not present       | `oneOf`           | Core          | Applicator        | -                                                                                                                                                                      |

#### Helpful notes for Keyword changelog

1. `type`

In Draft-03, the `type` keyword could hold a simple value like "string" or "number" and an entire schema as its value.

For example:

```json
{
  "type": {
    "type": "array",
    "items": { "type": "string" }
  }
}
```

This feature was in Draft-03 but changed in later versions of JSON Schema, where `type` is limited to simpler values like strings or arrays of strings.

The `allOf` keyword has now replaced the previous type schema functionality.

<Infobox label="Note"> Starting with Draft 4, schema identifiers that use an empty URI "" or a fragment-only URI "#" are no longer allowed.

In Draft 3, these identifiers were considered valid:

```
id: ""
id: "#"
```

However, this format is now prohibited from Draft 4 onwards.
</Infobox>

<Infobox label="Note">
Before Draft 3, the JSON Schema only included the Core specification, which outlined the foundational elements for schema structure. With Draft 4, the specification expanded to incorporate Validation, establishing rules for data format, structure, and type requirements. This addition enabled schema authors to define and enforce validation constraints directly within their schemas, making it easier for implementers to ensure data integrity and compatibility as schemas evolved.
</Infobox>

### Tutorial

This tutorial walks you through key steps and considerations to help you successfully migrate your JSON schemas from Draft 3 to Draft 4.

#### Step 1: Review Core Changes

Start by familiarizing yourself with the updates in the [Draft 4 Core schema specification](https://json-schema.org/draft-04/draft-zyp-json-schema-04.html). Note the revised `type`, `required`, and `dependencies` keywords, which might affect your schemas if you rely on polymorphic types or cross-schema references.

#### Step 2: Update Validation Keywords

Draft 4 has introduced new keywords such as `oneOf`, `not`, `anyOf`, and `allOf`. Review each of these additions, and update your schemas to use these keywords if relevant. For instance:

- If you have properties that must always be present, use `required` to define these properties explicitly.
- For schemas that contain nested dependencies, consider restructuring them using `dependencies` to improve schema maintainability.

Validate and test your updated schemas manually, or with your preferred tool.
