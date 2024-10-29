---
title: Migrating from older drafts
section: docs
---

### Introduction

Just as your schemas evolve over time, the JSON Schema specification does as well. This guide provides useful information to make upgrading your schemas across versions of the specification a breeze.

Learn how to use our migration guides and tooling ([AlterSchema](https://alterschema.sourcemeta.com/)) to bring your work with you.

### Keywords Overview

Here is a comprehensive overview to get you going.

| All Keywords            | Specification | Draft introduction | Removed | Changed                        |
| ----------------------- | ------------- | ------------------ | ------- | ------------------------------ |
| `$anchor`               | Core          | 2019-09            | No      | No (updated in 2020)           |
| `$comment`              | Core          | 07                 | No     |                                |
| `$id`                   | Core          | 06                 | No      | Replaced `id`                  |
| `$defs`                 | Core          | 2019-09            | No      | Replaced `definitions`         |
| `$dynamicAnchor`        | Core          | 2020-12            | No      | Replaced `$recursiveAnchor`    |
| `$dynamicRef`           | Core          | 2020-12            | No      | Replaced `$recursiveRef`       |
| `$recursiveAnchor`      | Core          | 2019-09            | 2020-12 | Replaced by `$dynamicAnchor`   |
| `$recursiveRef`         | Core          | 2019-09            | 2020-12 | Replaced by `$dynamicRef`      |
| `$ref` (legacy)         | Core          | 03                 | 2019-09 | Replaced by `$ref`             |
| `$ref`                  | Core          | 2019-09            | No      | Replaced `$ref` (legacy)       |
| `$schema`               | Core          | 03                 | No      | No                             |
| `$vocabulary`           | Core          | 2019-09            | No      | No                             |
| `additionalItems`       | Core          | 03                 | 2020-12 | Replaced by `items`            |
| `allOf`                 | Core          | 04                 | No      | No                             |
| `anyOf`                 | Core          | 04                 | No      | No                             |
| `const`                 | Validation    | 06                 | No      | No                             |
| `contains`              | Core          | 06                 | No      | No                             |
| `contentEncoding`       | Validation    | 07                 | No      | No                             |
| `contentMediaType`      | Validation    | 07                 | No      | No                             |
| `contentSchema`         | Validation    | 2019-09            | No      | No                             |
| `definitions`           | Validation    | 04                 | No      | Replaced by` $defs`            |
| `default`               | Validation    | 01                 | No      | No                             |
| `dependencies`          | Core          | 03                 | No      | No                             |
| `dependentRequired`     | Validation    | 2019-09            | No      | No                             |
| `dependentSchemas`      | Core          | 2019-09            | No      | Replaced `dependencies`        |
| `deprecated`            | Validation    | 2019-09            | No      | No                             |
| `disallow`              | Validation    | 03                 | Yes     | No                             |
| `divisibleBy`           | Validation    | 02                 | No      | Replaced by `multipleOf`       |
| `else`                  | Core          | 07                 | No      | No                             |
| `enum`                  | Validation    | 01                 | No      | No                             |
| `examples`              | Validation    | 06                 | No      | No                             |
| `exclusiveMaximum`      | Validation    | 03                 | No      | Replaced `maximumCanEqual`     |
| `exclusiveMinimum`      | Validation    | 03                 | No      | Replaced `minimumCanEqual`     |
| `extends`               | Validation    | 03                 | Yes     | No                             |
| `format`                | Validation    | 02                 | No      | -                              |
| `id`                    | Core          | 04                 | No      | Replaced by `$id`              |
| `if`                    | Core          | 07                 | No      | No                             |
| `items`                 | Core          | 2019-09            | No      | Replaced by `prefixItems`      |
| `maxContains`           | Validation    | 2019-09            | No      | No                             |
| `maxProperties`         | Validation    | 04                 | No      | No                             |
| `maximumCanEqual`       | Validation    | 02                 | No      | Replaced by `exclusiveMaximum` |
| `minimumCanEqual`       | Validation    | 02                 | No      | Replaced by `exclusiveMinimum` |
| `minContains`           | Validation    | 2019-09            | No      | No                             |
| `minProperties`         | Validation    | 04                 | No      | No                             |
| `multipleOf`            | Validation    | 04                 | No      | Replaced `divisibleBy`         |
| `not`                   | Core          | 04                 | No      | No                             |
| `oneOf`                 | Core          | 04                 | No      | No                             |
| `optional`              | Validation    | 02                 | No      | Replaced by `required`         |
| `pattern`               | Core          | 03                 | No      | No                             |
| `patternProperties`     | Core          | 03                 | No      | No                             |
| `prefixItems`           | Core          | 2020-12            | No      | Replaced `items`               |
| `propertyNames`         | Core          | 06                 | No      | No                             |
| `readOnly`              | Validation    | 07                 | No      | No                             |
| `required`              | Validation    | 03                 | No      | No                             |
| `requires`              | Validation    | 02                 | Yes     | -                              |
| `title`                 | Validation    | 01                 | No      | No                             |
| `then`                  | Core          | 07                 | No      | No                             |
| `type`                  | Validation    | 02                 | No      | No                             |
| `unevaluatedItems`      | Core          | 2019-09            | No      | No                             |
| `unevaluatedProperties` | Core          | 2019-09            | No      | No                             |
| `uniqueItems`           | Assertion     | 02                 | Yes     | No                             |
| `writeOnly`             | Validation    | 07                 | No      | No                             |

For a detailed read-through about all the changes see each Draft migration guide.
