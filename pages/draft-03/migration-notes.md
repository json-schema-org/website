---
title: Draft 02 to Draft 03
section: docs
---

### Introduction

The migration from Draft 2 to Draft 3 of JSON Schema introduced significant updates in schema definition and validation behaviors. Draft 3 refined existing keywords, added new ones, and adjusted validation rules to improve schema precision and consistency. This guide will assist you in updating your JSON Schemas to meet Draft 3 requirements, detailing keyword replacements, vocabulary changes, and modifications in validation behaviors.

### Keyword changelog

| Keyword(Draft 2)  | Keyword(Draft 3)    | Specification | Keyword type | Behavior Details                                                                                                                                                                                    |
| ----------------- | ------------------- | ------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`         | `$schema`           | `core`        | Identifier   | Change in the dialect                                                                                                                                                                               |
| not present       | `$ref`              | `core`        | Applicator   | `$ref` key references an external schema URI for validation.                                                                                     |
| not present       | `id`                | `core`        | Identifier   | This keyword defines the schema's current URI (a "self" link). The URI can be relative or absolute and is resolved against the parent schema's URI. If there is no parent schema, it is resolved against the URI used to retrieve the schema. |
| `optional`        | `required`          | `core`        | Assertion    | This change ensures that properties must have defined values for validation.                                                                                                                        |
| `minimumCanEqual` | `exclusiveMinimum`  | `core`        | Assertion    | Specifies that instance values must be strictly greater than the minimum when `exclusiveMinimum` is `true`.                                                                                         |
| `maximumCanEqual` | `exclusiveMaximum`  | `core`        | Assertion    | This ensures that instance values fall below the maximum when `exclusiveMaximum` is `true`.                                                                                                         |
| `format`          | `format`            | `core`        | Annotation   | This update refined format handling by adding and removing specific types, offering clearer guidance for expected data formats.                                                                     |
| not present       | `patternProperties` | `core`        | Applicator   | Enforces schema validation on properties with names matching specified regex patterns. Each property matching a pattern must conform to the schema defined for that pattern in `patternProperties`. |
| `requires`        | `dependencies`      | `core`        | Assertion    | Defines property dependencies - if an instance includes a property named in this attribute, that property must meet additional validation requirements defined by its dependency value.             |
| not present       | `additionalItems`   | `core`        | Applicator   | Defines rules for extra items in an array - can be set to false to disallow extra items beyond specified tuples, or to a schema that additional items must follow.                                  |
| `alternate`       | removed             | `core`        |              | -                                                                                                                                                                                                   |

### Tutorial

#### Step 1: Review Core Changes:

Start by understanding the key differences between Draft 2 and Draft 3, especially regarding core changes in $schema, $ref, and validation keywords.

- `$schema`: In Draft 3, this remains the same but is now more standardized to handle the schema dialect and the version of the specification being used.
- `$ref`: Draft 3 introduces the `$ref` keyword, which allows referencing external schemas for validation. This will enable more modular and reusable schema definitions.

#### Step 2: Update Validation Keywords:

Draft 3 introduces new validation keywords that improve flexibility in schema definitions. Notable changes include:

- `optional` to `required`: Draft 3 removes the `optional` keyword and introduces `required`, which specifies the required properties for an object.
- `minimumCanEqual` to `exclusiveMinimum`: For numerical validation, `exclusiveMinimum` enforces that the value must be strictly greater than the given minimum value.
- `maximumCanEqual` to `exclusiveMaximum`: Similarly, `exclusiveMaximum` ensures the value is strictly less than the maximum allowed value.
- `patternProperties`: Draft 3 introduces `patternProperties`, which allows you to define schema rules for properties whose names match a regular expression.

#### Step 3: Refactor $ref Usage

Draft 3 introduces `$ref`, which allows you to reference external schemas using **URIs**. This improves schema modularity and enables better reuse of schema definitions.

Validate and test your updated schemas manually, or with your preferred tool.
