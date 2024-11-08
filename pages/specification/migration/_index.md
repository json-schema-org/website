---
title: Migrating from older drafts
section: docs
---

### Introduction

As your schemas evolve over time, so does JSON Schema specification. This guide provides useful information help you smoothly upgrade your schemas across different specification versions

Learn how to use our migration guides and tooling ([AlterSchema](https://alterschema.sourcemeta.com/)) to bring your work with you.

Alterschema is a tool designed to facilitate the automatic migration and transformation of JSON schemas as specifications evolve. It helps simplify schema maintenance, supports backward compatibility, and streamlines schema adjustment across versions. [Read more about using AlterSchema](https://github.com/sourcemeta/alterschema?tab=readme-ov-file).

### Keywords Overview

This table provides an overview of keyword changes and removals in JSON Schema specifications from Draft 01 to the latest draft.

| All Keywords            | Specification | Draft introduction | Removed | Changed                                                                                      |
| ----------------------- | ------------- | ------------------ | ------- | -------------------------------------------------------------------------------------------- |
| `$anchor`               | Core          | 2019-09            | No      | Partially replaced `$id`                                                                     |
| `$comment`              | Core          | 07                 | No      |                                                                                              |
| `$id`                   | Core          | 06                 | No      | Replaced `id`                                                                                |
| `$defs`                 | Core          | 2019-09            | No      | Replaced `definitions`                                                                       |
| `$dynamicAnchor`        | Core          | 2020-12            | No      | Replaced `$recursiveAnchor`                                                                  |
| `$dynamicRef`           | Core          | 2020-12            | No      | Replaced `$recursiveRef`                                                                     |
| `$recursiveAnchor`      | Core          | 2019-09            | 2020-12 | Replaced by `$dynamicAnchor`                                                                 |
| `$recursiveRef`         | Core          | 2019-09            | 2020-12 | Replaced by `$dynamicRef`                                                                    |
| `$ref`                  | Core          | 2019-09            | No      | Replaced `$ref` (legacy)                                                                     |
| `$schema`               | Core          | 03                 | No      | No                                                                                           |
| `$vocabulary`           | Core          | 2019-09            | No      | No                                                                                           |
| `additionalItems`       | Core          | 03                 | 2020-12 | Replaced by `items`                                                                          |
| `additionalProperties`  | Core          | 01                 | No      | No                                                                                           |
| `allOf`                 | Core          | 04                 | No      | No                                                                                           |
| `anyOf`                 | Core          | 04                 | No      | No                                                                                           |
| `const`                 | Validation    | 06                 | No      | No                                                                                           |
| `contains`              | Core          | 06                 | No      | No                                                                                           |
| `contentEncoding`       | Validation    | 07                 | No      | Replaced `media`.`binaryEncoding`                                                            |
| `contentMediaType`      | Validation    | 07                 | No      | Replaced `media`.`type`                                                                      |
| `contentSchema`         | Validation    | 2019-09            | No      | No                                                                                           |
| `definitions`           | Validation    | 04                 | 2019-09 | Replaced by` $defs`                                                                          |
| `default`               | Validation    | 01                 | No      | No                                                                                           |
| `dependencies`          | Validation    | 03                 | 2019-09 | Replaced `requires` and replaced by `dependentSchemas` and `dependentRequired`               |
| `dependentRequired`     | Validation    | 2019-09            | No      | Partially replaced `dependencies`                                                            |
| `dependentSchemas`      | Core          | 2019-09            | No      | Partially replaced `dependencies`                                                            |
| `deprecated`            | Validation    | 2019-09            | No      | No                                                                                           |
| `description`           | Validation    | 01                 | No      | No                                                                                           |
| `disallow`              | Core          | 01                 | 04      | Replaced by `not`                                                                            |
| `divisibleBy`           | Validation    | 02                 | Yes     | Replaced by `multipleOf`                                                                     |
| `else`                  | Core          | 07                 | No      | No                                                                                           |
| `enum`                  | Validation    | 01                 | No      | No                                                                                           |
| `examples`              | Validation    | 06                 | No      | No                                                                                           |
| `exclusiveMaximum`      | Validation    | 06                 | No      | Replaced `exclusiveMaximum` (legacy)                                                         |
| `exclusiveMinimum`      | Validation    | 06                 | No      | Replaced `exclusiveMinimum` (legacy)                                                         |
| `extends`               | Core          | 01                 | 04      | Replaced by `allOf`                                                                          |
| `format`                | Validation    | 01                 | No      | -                                                                                            |
| `id`                    | Core          | 03                 | 06      | Replaced by `$id`                                                                            |
| `if`                    | Core          | 07                 | No      | No                                                                                           |
| `items`                 | Core          | 2020-12            | No      | Replaced `additionalItems` and `items` (legacy)                                              |
| `maxContains`           | Validation    | 2019-09            | No      | No                                                                                           |
| `maxDecimals`           | Validation    | 01                 | Yes     | Replaced by `divisibleBy`                                                                    |
| `maxProperties`         | Validation    | 04                 | No      | No                                                                                           |
| `maximumCanEqual`       | Validation    | 01                 | 03      | Replaced by `exclusiveMaximum`                                                               |
| `media`                 | Hyper-Schema  | 04                 | 07      | Replaced `contentEncoding` (legacy) and replaced by `contentEncoding` and `contentMediaType` |
| `minimumCanEqual`       | Validation    | 01                 | 03      | Replaced by `exclusiveMinimum`                                                               |
| `minContains`           | Validation    | 2019-09            | No      | No                                                                                           |
| `minProperties`         | Validation    | 04                 | No      | No                                                                                           |
| `multipleOf`            | Validation    | 04                 | No      | Replaced `divisibleBy`                                                                       |
| `not`                   | Core          | 04                 | No      | No                                                                                           |
| `oneOf`                 | Core          | 04                 | No      | No                                                                                           |
| `optional`              | Core          | 02                 | Yes     | Replaced by `required`                                                                       |
| `pattern`               | Core          | 01                 | No      | No                                                                                           |
| `patternProperties`     | Core          | 03                 | No      | No                                                                                           |
| `prefixItems`           | Core          | 2020-12            | No      | Replaced `items`                                                                             |
| `properties`            | Core          | 01                 | No      | No                                                                                           |
| `propertyNames`         | Core          | 06                 | No      | No                                                                                           |
| `readOnly`              | Validation    | 01                 | No      | No                                                                                           |
| `required`              | Validation    | 03                 | No      | No                                                                                           |
| `requires`              | Core          | 01                 | 03      | Replaced by `dependencies`                                                                   |
| `title`                 | Validation    | 01                 | No      | No                                                                                           |
| `then`                  | Core          | 07                 | No      | No                                                                                           |
| `type`                  | Validation    | 04                 | No      | Replaced `type` (legacy)                                                                     |
| `unevaluatedItems`      | Core          | 2019-09            | No      | No                                                                                           |
| `unevaluatedProperties` | Core          | 2019-09            | No      | No                                                                                           |
| `uniqueItems`           | Validation    | 02                 | No      | No                                                                                           |
| `writeOnly`             | Validation    | 07                 | No      | No                                                                                           |

For a detailed read-through about all the changes see each Draft migration guide.
