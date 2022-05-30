---
title: "Validating OpenAPI and JSON Schema"
date: "2021-12-08"
type: Engineering
tags:
  - OpenAPI
  - validation
  - vocabulary
  - dynamic reference
cover: /img/posts/2021/validating-openapi-and-json-schema/cover.webp
authors:
  - name: Jason Desrosiers
    photo: /img/avatars/jasondesrosiers.jpeg
    twitter: jasondesrosiers
    byline: JSON Schema Specification Contributor
excerpt: "Dynamic references make it possible to validate the schemas in an OpenAPI document even though OpenAPI does not constrain which JSON Schema dialects can be used."
---

Starting with the release of OpenAPI 3.1, the dialect of JSON Schema used in
OpenAPI documents is configurable. By default, you get the OpenAPI 3.1 Schema
dialect, but you can choose to use draft 2020-12 or any other dialect if you
choose. This brings up the question of how to validate an OpenAPI 3.1 document
if one of its components (JSON Schema) is open-ended. In this article, we'll
cover how to configure the default JSON Schema dialect of an OpenAPI 3.1
document and how to validate that document, including JSON Schemas, no matter
which dialect(s) you choose to use.

## What is a JSON Schema dialect?

Because not everyone is familiar with the term "dialect" in this context, let's
take a moment to define it before moving on. A JSON Schema dialect is any unique
incarnation of JSON Schema. This includes any official release of JSON Schema
such as draft-07 or draft 2020-12, but it also includes custom versions of JSON
Schema. OpenAPI has effectively had three dialects of JSON Schema introduced
with 2.0, 3.0, and 3.1. JSON Schema Dialects are compatible with the core
architecture of JSON Schema but may add keywords, remove keywords, or modify the
behavior of keywords.

## The OpenAPI 3.1 Schema dialect

By default, schemas in OpenAPI 3.1 are assumed to use OpenAPI 3.1's custom JSON
Schema dialect. This dialect includes full support for all draft 2020-12
features plus a few additional keywords and `format` values.

## Validating with the default dialect

There are two schemas available for validating OpenAPI 3.1 documents.
`https://spec.openapis.org/oas/3.1/schema` includes all the constraints for
validating the document except for schemas. You aren't expected to validate your
OpenAPI documents against this schema by itself. Think of this schema as an
abstract schema that is intended to be extended to include schema validation
support for the JSON Schema dialect you're using.

That's why there's also `https://spec.openapis.org/oas/3.1/schema-base` that
extends the abstract schema with validation support for the OpenAPI 3.1 Schema
dialect. If you're using plain out-of-the-box OpenAPI 3.1, this is the schema
you want to validate your document against. If you want to use a different
dialect, keep reading to see how to extend the main schema to get validation
support for your chosen dialect.

This is made possible by dynamic references which were added in JSON Schema
2020-12. The details of how dynamic references work is out of scope for this
article, but we'll cover enough for you to make your own concrete schemas for
any dialect you choose to use in your OpenAPI 3.1 documents.

### Examples

These examples use the [@hyperjump/oas-schema-validator](https://www.npmjs.com/package/@hyperjump/oas-schema-validator)
to validate OpenAPI documents. It's just an extension of [@hyperjump/json-schema](https://www.npmjs.com/package/@hyperjump/json-schema)
with support for the OpenAPI 3.1 dialect and all the OpenAPI 3.1 schemas
pre-packaged. Beware that dynamic references are a new feature of JSON Schema
and many validators don't yet support them, or have limited support, or have
bugs.

#### Without schema validation
```javascript
const OasSchema = require("@hyperjump/oas-schema-validator");
const example = require("./example.openapi.json");

(async function () {
  const schema = await OasSchema.get(
    "https://spec.openapis.org/oas/3.1/schema"
  );
  const validate = await OasSchema.validate(schema);

  const result = validate(example);
  console.log(result.valid);
}());
```

#### With OpenAPI Schema dialect schema validation
```javascript
const OasSchema = require("@hyperjump/oas-schema-validator");
const example = require("./example.openapi.json");

(async function () {
  const schema = await OasSchema.get(
    "https://spec.openapis.org/oas/3.1/schema-base"
  );
  const validate = await OasSchema.validate(schema);

  const result = validate(example);
  console.log(result.valid);
}());
```

### How does it work?

To get an idea about how this works, let's take a look at a few selections from
of the OpenAPI 3.1 schemas.

This is where the Schema Object is defined. The `$dynamicAnchor` declares this
sub-schema to be something that can be effectively overridden by another schema.
If it's not overridden, the default behavior is to validate that the value is an
object or a boolean. No other validation is performed on the schema.

```yaml
$defs:
  schema:
    $dynamicAnchor: meta
    type:
      - object
      - boolean
```

When something in this schema wants to reference the Schema Object, instead of
referencing `#/$defs/schema` like normal, it uses a dynamic reference to the
"meta" dynamic anchor set in the previous selection. Now instead of always
resolving to `#/$defs/schema`, another schema can potentially override where it
resolves to.

```yaml
$defs:
  components:
    type: object
    properties:
      schemas:
        type: object
        additionalProperties:
          $dynamicRef: '#meta'
```

## Validating Schema Objects against the default dialect

With those vague building blocks in mind let's derive a schema that "extends"
the abstract schema to create a schema that validates Schema Objects using the
default dialect meta-schema.

The first step is to include the abstract schema.

```yaml
$schema: 'https://json-schema.org/draft/2020-12/schema'

$ref: 'https://spec.openapis.org/oas/3.1/schema/2021-09-28'
```

Then we need to add a `$dynamicAnchor` that matches the one in the abstract
schema to override where dynamic references to "meta" will resolve to. From
there we can reference the meta schema for the default dialect.

```yaml
$schema: 'https://json-schema.org/draft/2020-12/schema'

$ref: 'https://spec.openapis.org/oas/3.1/schema/2021-09-28'

$defs:
  schema:
    $dynamicAnchor: meta
    $ref: 'https://spec.openapis.org/oas/3.1/dialect/base'
```

That's enough to get the Schema Object validation we were after, but there are a
few loose ends we'll want to tie up as well. The `jsonSchemaDialect` field in
the OpenAPI 3.1 document can be used to change the dialect used. Since this
schema only supports the default dialect, we want to restrict people from
changing that to something else. If they need to change it, they'll need a
different schema to validate against. We also don't want people using the
`$schema` keyword to change the dialect of individual schemas.

```yaml
$schema: 'https://json-schema.org/draft/2020-12/schema'

$ref: 'https://spec.openapis.org/oas/3.1/schema'
properties:
  jsonSchemaDialect:
    $ref: '#/$defs/dialect'

$defs:
  dialect:
    const: 'https://spec.openapis.org/oas/3.1/dialect/base'
  schema:
    $dynamicAnchor: meta
    $ref: 'https://spec.openapis.org/oas/3.1/dialect/base'
    properties:
      $schema:
        $ref: '#/$defs/dialect'
```

With that, we have exactly what you'll find in the official
`https://spec.openapis.org/oas/3.1/schema-base` schema.

## Supporting multiple dialects

With the adoption of JSON Schema 2020-12 came support for the `$id` and
`$schema` keywords, which together allows us to override the default JSON Schema
dialect for a schema. Let's assume we have an OpenAPI 3.1 document where we use
JSON Schema 2020-12 by default, but we also have some legacy JSON Schema
draft-07 schemas that we want to use as well.

```yaml
jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema'
components:
  schemas:
    foo:
      type: object
      properties:
        foo:
          $ref: '#/components/schemas/baz'
      unevaluatedProperties: false
    bar:
      $id: './schemas/bar'
      $schema: 'http://json-schema.org/draft-07/schema#'
      type: object
      properties:
        bar:
          $ref: '#/definitions/number'
      definitions:
        number:
          type: number
    baz:
      type: string
```

### What's going on here

First, we use the `jsonSchemaDialect` field to set the default dialect for the
document. By setting the default dialect to JSON Schema 2020-12, by default,
schema will not understand the keywords added in the OpenAPI 3.1 vocabulary such
as `discriminator`. Only standard JSON Schema 2020-12 keywords will be
recognized.

The `/components/schemas/foo` schema is understood to be interpreted as JSON
Schema 2020-12 because that's what we set to be the default.

The `/components/schemas/bar` schema changes the dialect of that schema to be
JSON Schema draft-07. There are a couple of things working together to make this
possible. The `$schema` keyword sets the dialect for the schema, but `$schema`
is only allowed at the root of the document it appears in. That's why we also
need to include the `$id` keyword. The `$id` keyword effectively makes that
schema a separate document with its own identifier and that location as the
root. It's an independent document embedded inside the OpenAPI 3.1 document. You
can think of it like an iframe in HTML.

A consequence of this is that `/components/schemas/bar` can't use a local
reference like `#/components/schemas/foo` to reference another schema in
`/components/schemas` because it's now technically in a different document.
There are two ways to get around this. One option is to use an external
reference to the OpenAPI 3.1 document, such as
`myapi.openapi.yml#/components/schemas/foo`. The other option is to give
`/components/schemas/foo` an `$id` as well and reference that instead,
`./schemas/foo`.

### Validating

Now that we understand how this works, let's derive the schema to validate an
OpenAPI 3.1 document with JSON Schema 2020-12 as the default dialect and JSON
Schema draft-07 as an allowed alternative.

```yaml
$schema: 'https://json-schema.org/draft/2020-12/schema'

$ref: 'https://spec.openapis.org/oas/3.1/schema'
properties:
  jsonSchemaDialect:
    const: 'https://json-schema.org/draft/2020-12/schema'
required:
  - jsonSchemaDialect

$defs:
  schema:
    $dynamicAnchor: meta
    properties:
      $schema:
        enum:
          - 'https://json-schema.org/draft/2020-12/schema'
          - 'http://json-schema.org/draft-07/schema#'
    allOf:
      - if:
          properties:
            $schema:
              const: 'https://json-schema.org/draft/2020-12/schema'
        then:
          $ref: 'https://json-schema.org/draft/2020-12/schema'
      - if:
          type: object
          properties:
            $schema:
              const: 'http://json-schema.org/draft-07/schema#'
          required:
            - $id
            - $schema
        then:
          $ref: 'http://json-schema.org/draft-07/schema'
```

The first change is that the `jsonSchemaDialect` field is now required because
we are no longer using the default.

Next, we have to update the schema definition to only allow `$schema` values for
the dialects we want to allow.

The first `if`/`then` will validate the schema as a JSON Schema 2020-12 schema
if there is no `$schema` keyword used, or `$schema` is set to JSON Schema
2020-12. Of course it's unnecessary to use `$schema` in this case, but it is
allowed.

The second `if`/`then` will validate the schema as a JSON Schema draft-07 schema
if there is an `$id` and a `$schema` indicating draft-07.

You can extend this pattern for any number of dialects you want to support.

Photo by <a href="https://unsplash.com/@gonchifacello?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gonzalo Facello</a> on <a href="https://unsplash.com/collections/8799947/json-schema-posts/c9d98f0b917af1758a609d674392502f?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
