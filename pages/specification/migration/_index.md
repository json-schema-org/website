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
| `contentEncoding` (legacy) | Core          | 01                 | 04      | Replaced by `media`.`binaryEncoding`                 |
| `media`                    | Validation    | 04                 | 07      | Replaced `conentEncoding` (legacy) and replaced by `contentEncoding` and `contentMediaType` |
| `contentEncoding`          | Validation    | 07                 | No      | Replaced `media`.`binaryEncoding`                    |
| `contentMediaType`         | Validation    | 07                 | No      | Replaced `media`.`type`                              |
| `contentSchema`         | Validation    | 2019-09            | No      | No                             |
| `definitions`           | Validation    | 04                 | 2019-09 | Replaced by` $defs`            |
| `default`               | Validation    | 01                 | No      | No                             |
| `dependencies`          | Validation    | 03                 | 2019-09  | Replaced `requires` and replaced by `dependentSchemas` and `dependentRequired` |
| `dependentRequired`     | Validation    | 2019-09            | No      | Partially replaced `dependencies`                      |
| `dependentSchemas`      | Core          | 2019-09            | No      | Partially replaced `dependencies`                      |
| `deprecated`            | Validation    | 2019-09            | No      | No                             |
| `disallow`              | Core          | 01                 | 04      | Replaced by `not`              |
| `divisibleBy`           | Validation    | 02                 | No      | Replaced by `multipleOf`       |
| `else`                  | Core          | 07                 | No      | No                             |
| `enum`                  | Validation    | 01                 | No      | No                             |
| `examples`              | Validation    | 06                 | No      | No                             |
| `exclusiveMaximum` (legacy) | Validation    | 03                 | 06      | Replaced `maximumCanEqual`           |
| `exclusiveMaximum`          | Validation    | 06                 | No      | Replaced `exclusiveMaximum` (legacy) |
| `exclusiveMinimum` (legacy) | Validation    | 03                 | 06      | Replaced `minimumCanEqual`           |
| `exclusiveMinimum`          | Validation    | 06                 | No      | Replaced `exclusiveMinimum` (legacy) |
| `extends`               | Core          | 01                 | 04      | Replaced by `allOf`            |
| `format`                | Validation    | 01                 | No      | -                              |
| `id`                    | Core          | 03                 | 06      | Replaced by `$id`              |
| `if`                    | Core          | 07                 | No      | No                             |
| `items` (legacy)        | Core          | 01                 | 2020-12 | Replaced by `prefixItems`                       |
| `items`                 | Core          | 2020-12            | No      | Replaced `additionalItems` and `items` (legacy) |
| `maxContains`           | Validation    | 2019-09            | No      | No                             |
| `maxProperties`         | Validation    | 04                 | No      | No                             |
| `maximumCanEqual`       | Validation    | 01                 | 03      | Replaced by `exclusiveMaximum` |
| `minimumCanEqual`       | Validation    | 01                 | 03      | Replaced by `exclusiveMinimum` |
| `minContains`           | Validation    | 2019-09            | No      | No                             |
| `minProperties`         | Validation    | 04                 | No      | No                             |
| `multipleOf`            | Validation    | 04                 | No      | Replaced `divisibleBy`         |
| `not`                   | Core          | 04                 | No      | No                             |
| `oneOf`                 | Core          | 04                 | No      | No                             |
| `optional`              | Core          | 02                 | No      | Replaced by `required`         |
| `pattern`               | Core          | 01                 | No      | No                             |
| `patternProperties`     | Core          | 03                 | No      | No                             |
| `prefixItems`           | Core          | 2020-12            | No      | Replaced `items`               |
| `propertyNames`         | Core          | 06                 | No      | No                             |
| `readOnly`              | Validation    | 01                 | No      | No                             |
| `required`              | Validation    | 03                 | No      | No                             |
| `requires`              | Core          | 01                 | 03      | Replaced by `dependencies`     |
| `title`                 | Validation    | 01                 | No      | No                             |
| `then`                  | Core          | 07                 | No      | No                             |
| `type` (legacy)         | Core          | 01                 | 04      | Replaced by `type`             |
| `type`                  | Validation    | 04                 | No      | Replaced `type` (legacy)       |
| `unevaluatedItems`      | Core          | 2019-09            | No      | No                             |
| `unevaluatedProperties` | Core          | 2019-09            | No      | No                             |
| `uniqueItems`           | Core          | 02                 | Yes     | No                             |
| `writeOnly`             | Validation    | 07                 | No      | No                             |

For a detailed read-through about all the changes see each Draft migration guide.
