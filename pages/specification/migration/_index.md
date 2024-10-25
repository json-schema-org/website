---
title: Migrating from older drafts
section: docs
---

### Introduction

Migrations are like version control for your system, allowing your team to define and share the schema progressions. If you have ever had to figure out when a keyword was introduced and how it behaved, you've faced the problem that migration guides solve.

If you're moving from one Draft to another, learn how to use our migration guides and tooling ([AlterSchema](https://alterschema.sourcemeta.com/)) to bring your work with you.

### Keywords Overview

Here is a comprehensive overview to get you going.

| All Keywords          | Specification          | Draft introduction | Removed | Changed                       |
| --------------------- | ---------------------- | ------------------ | ------- | ----------------------------- |
| $anchor               | Core                   | 2019-09            | No      | No (updated in 2020)          |
| `$comment`              | Core                   | 07                 | Yes     | -                             |
| $id                   | Core                   | 06                 | No      | Updated from id               |
| $defs                 | Core                   | 2019-09            | No      | Updated from definitions      |
| $dynamicAnchor        | Core                   | 2020-12            | No      | Updated from $recursiveAnchor |
| $dynamicRef           | Core                   | 2020-12            | No      | Updated from $recursiveRef    |
| $recursiveAnchor      | Core                   | 2019-09            | No      | Updated to $dynamicAnchor     |
| $recursiveRef         | Core                   | 2019-09            | No      | Updated to $dynamicRef        |
| $ref                  | Core                   | 2019-09            | No      | No                            |
| $schema               | Core                   | 02                 | No      | No                            |
| $vocabualry           | Core                   | 2019-09            | No      | No                            |
| additionalItems       | Validation             | 03                 | No      | No                            |
| allOf                 | Validation             | 04                 | No      | No                            |
| anyOf                 | Validation             | 04                 | No      | No                            |
| const                 | Validation             | 06                 | No      | No                            |
| contains              | Validation             | 06                 | No      | No                            |
| contentEncoding       | Validation             | 07                 | No      | No                            |
| contentMediaType      | Validation             | 07                 | No      | No                            |
| contentSchema         | Content                | 2019-09            | No      | No                            |
| definitions           | Validation             | 04                 | No      | Updated to $defs              |
| default               | Annotation             | 01                 | No      | No                            |
| dependencies          | Core                   | 03                 | No      | No                            |
| dependentRequired     | Validation             | 2019-09            | No      | No                            |
| dependentSchemas      | Applicator             | 2019-09            | No      | Updated from dependencies     |
| deprecated            | Annotation             | 2019-09            | No      | No                            |
| disallow              | Validation             | 03                 | Yes     | No                            |
| divisibleBy           | Validation             | 02                 | No      | Updated to multipleOf         |
| else                  | Validation             | 07                 | No      | No                            |
| enum                  | Assertion              | 01                 | No      | No                            |
| examples              | Validation             | 06                 | No      | No                            |
| exclusiveMaximum      | Validation             | 03                 | No      | Updated from maximumCanEqual  |
| exclusiveMinimum      | Validation             | 03                 | No      | Updated from minimumCanEqual  |
| extends               | Validation             | 03                 | Yes     | No                            |
| format                | Annotation             | 02                 | No      | -                             |
| id                    | Core                   | 04                 | No      | Updated to $id                |
| if                    | Validation             | 07                 | No      | No                            |
| items                 | Applicator             | 2019-09            | No      | Updated to prefixItems        |
| maxContains           | Validation             | 2019-09            | No      | No                            |
| maxProperties         | Validation             | 04                 | No      | No                            |
| maximumCanEqual       | Validation             | 02                 | No      | Updated to exclusiveMaximum   |
| minimumCanEqual       | Validation             | 02                 | No      | Updated to exclusiveMinimum   |
| minContains           | Validation             | 2019-09            | No      | No                            |
| minProperties         | Validation             | 04                 | No      | No                            |
| multipleOf            | Validation             | 04                 | No      | Updated from divisibleBy      |
| not                   | Validation             | 04                 | No      | No                            |
| oneOf                 | Validation             | 04                 | No      | No                            |
| optional              | Validation             | 02                 | No      | Updated to (required)         |
| pattern               | Core                   | 03                 | No      | No                            |
| patternProperties     | Validation             | 03                 | No      | No                            |
| prefixItems           | Applicator             | 2020-12            | No      | Updated from items            |
| propertyNames         | Validation             | 06                 | No      | No                            |
| readOnly              | Validation             | 07                 | No      | No                            |
| required              | Validation             | 03                 | No      | No                            |
| requires              | Validation             | 02                 | Yes     | -                             |
| title                 | Annotation             | 01                 | No      | No                            |
| then                  | Validation             | 07                 | No      | No                            |
| type                  | Validation             | 02                 | No      | No                            |
| unevaluatedItems      | Applicator, Annotation | 2019-09            | No      | No                            |
| unevaluatedProperties | Applicator, Annotation | 2019-09            | No      | No                            |
| uniqueItems           | Assertion              | 02                 | Yes     | No                            |
| writeOnly             | Validation             | 07                 | No      | No                            |

For a detailed read-through about all the changes see each Draft migration guide.
