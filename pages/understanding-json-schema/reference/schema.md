---
title: "Dialect and vocabulary declaration"
section: docs
prev: 
  label: string
  url: /understanding-json-schema/reference/string
next: 
  label: Enumerated and constant values
  url: /understanding-json-schema/reference/generic
---

A version of JSON Schema is called a [dialect](../../learn/glossary#dialect). A dialect represents the
set of [keywords](../../learn/glossary#keyword) and semantics that can be used to evaluate a schema.
Each JSON Schema release is a new dialect of JSON Schema. JSON Schema
provides a way for you to declare which dialect a schema conforms to and
provides ways to describe your own custom dialects.

<Keywords label="single: \$schema single: schema; keyword" />

## $schema[#schema]

The `$schema` keyword is used to declare which dialect of JSON Schema
the schema was written for. The value of the `$schema` keyword is also
the identifier for a schema that can be used to verify that the schema
is valid according to the dialect `$schema` identifies. A schema that
describes another schema is called a [\"meta-schema\"](../../learn/glossary#meta-schema).

`$schema` applies to the entire document and must be at the root level.
It does not apply to externally referenced (`$ref`, `$dynamicRef`)
documents. Those schemas need to declare their own `$schema`.

If `$schema` is not used, an [implementation](../../learn/glossary#implementation) might allow you to specify a
value externally or it might make assumptions about which specification
version should be used to evaluate the schema. It\'s recommended that
all JSON Schemas have a `$schema` keyword to communicate to readers and
[tooling](../../learn/glossary#tooling) which specification version is intended. Therefore most of the
time, you\'ll want this at the root of your schema:

```
"$schema": "https://json-schema.org/draft/2020-12/schema"
```

[tabs-start "Draft-specific info"]

[tab "Draft 4"]
The identifier for Draft 4 is ``http://json-schema.org/draft-04/schema#``.

Draft 4 defined a value for ``$schema`` without a specific dialect
(``http://json-schema.org/schema#``) which meant, use the latest
dialect. This has since been deprecated and should no longer be
used.

You might come across references to Draft 5. There is no Draft 5
release of JSON Schema. Draft 5 refers to a no-change revision of
the Draft 4 release. It does not add, remove, or change any
functionality. It only updates references, makes clarifications,
and fixes bugs. Draft 5 describes the Draft 4 release. If you came
here looking for information about Draft 5, you'll find it under
Draft 4. We no longer use the "draft" terminology to refer to
patch releases to avoid this confusion.
[tab "Draft 6"]
The identifier for Draft 6 is ``http://json-schema.org/draft-06/schema#``.
[tab "Draft 7"]
The identifier for Draft 7 is ``http://json-schema.org/draft-07/schema#``.
[tab "Draft 2019-09"]
The identifier for Draft 2019-09 is ``https://json-schema.org/draft/2019-09/schema``.

[tabs-end]

<Keywords label="single: \$vocabularies single: schema; \$vocabularies" />

## Vocabularies

<Star label="New in draft 2019-09" />

Documentation Coming Soon

<Infobox label="Draft-specific info">
Before the introduction of Vocabularies, you could still extend
   JSON Schema with your custom keywords but the process was much less
   formalized. The first thing you'll need is a meta-schema that
   includes your custom keywords. The best way to do this is to make a
   copy of the meta-schema for the version you want to extend and make
   your changes to your copy. You will need to choose a custom URI to
   identify your custom version. This URI must not be one of the URIs
   used to identify official JSON Schema specification drafts and
   should probably include a domain name you own. You can use this URI
   with the ``$schema`` keyword to declare that your schemas use your
   custom version.

</Infobox>

> Not all implementations support custom meta-schemas and custom
keyword implementations.

<Keywords label="single: \$vocabularies single: schema; \$vocabularies; guidelines" />

### Guidelines

One of the strengths of JSON Schema is that it can be written in JSON
and used in a variety of environments. For example, it can be used for
both front-end and back-end HTML Form validation. The problem with using
custom vocabularies is that every environment where you want to use your
schemas needs to understand how to evaluate your vocabulary\'s keywords.
Meta-schemas can be used to ensure that schemas are written correctly,
but each implementation will need custom code to understand how to
evaluate the vocabulary\'s keywords.

Meta-data keywords are the most interoperable because they don\'t affect
validation. For example, you could add a `units` keyword. This will
always work as expecting with an compliant validator.

```json
// props { "isSchema": true }
{
  "type": "number",
  "units": "kg"
}
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": false }
"42"
```

The next best candidates for custom keywords are keywords that don\'t
apply other schemas and don\'t modify the behavior of existing keywords.
An `isEven` keyword is an example. In contexts where some validation is
better than no validation such as validating an HTML Form in the
browser, this schema will perform as well as can be expected. Full
validation would still be required and should use a validator that
understands the custom keyword.

```json
// props { "isSchema": true }
{
  "type": "integer",
  "isEven": true
}
```
```json
// props { "indent": true, "valid": true }
2
```
This passes because the validator doesn't understand ``isEven``

```json
// props { "indent": true, "valid": true }
3
```
The schema isn't completely impaired because it doesn't understand ``isEven``

```json
// props { "indent": true, "valid": false }
"3"
```

The least interoperable type of custom keyword is one that applies other
schemas or modifies the behavior of existing keywords. An example would
be something like `requiredProperties` that declares properties and
makes them required. This example shows how the schema becomes almost
completely useless when evaluated with a validator that doesn\'t
understand the custom keyword. That doesn\'t necessarily mean that
`requiredProperties` is a bad idea for a keyword, it\'s just not the
right choice if the schema might need to be used in a context that
doesn\'t understand custom keywords.

```json
// props { "isSchema": true }
{
  "type": "object",
  "requiredProperties": {
    "foo": { "type": "string" }
  }
}
```
```json
// props { "indent": true, "valid": true }
{ "foo": "bar" }
```
This passes because ``requiredProperties`` is not understood

```json
// props { "indent": true, "valid": true }
{}
```
This passes because ``requiredProperties`` is not understood

```json
// props { "indent": true, "valid": true }
{ "foo": 42 }
```