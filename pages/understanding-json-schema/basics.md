---
title: The basics
section: docs
---

In [What is a schema?](../understanding-json-schema/about), we described what a schema is,
and hopefully justified the need for schema languages. Here, we proceed
to write a simple JSON Schema.

## Hello, World!

When learning any new language, it\'s often helpful to start with the
simplest thing possible. In JSON Schema, an empty object is a completely
valid schema that will accept any valid JSON.

```json
// props { "isSchema": true }
{}
```

This accepts anything, as long as it's valid JSON

```json
// props { "valid": true, "indent": true }
42
```

```json
// props { "valid": true, "indent": true }
"I'm a string"
```

```json
// props { "valid": true, "indent": true }
{ "an": [ "arbitrarily", "nested" ], "data": "structure" }
```

<Star label="New in draft 6" />

You can also use `true` in place of the empty object to represent a
schema that matches anything, or `false` for a schema that matches
nothing.

This accepts anything, as long as it's valid JSON:

```json
// props { "isSchema": true }
true
```

```json
// props { "valid": true, "indent": true }
42
```
```json
// props { "valid": true, "indent": true }
"I'm a string"
```
```json
// props { "valid": true, "indent": true }
{ "an": [ "arbitrarily", "nested" ], "data": "structure" }
```

Documents for this schema will always be invalid: 

```json
// props { "isSchema": true }
false
```


```json
// props { "valid": false, "indent": true }
"Resistance is futile...  This will always fail!!!"
```

## The type keyword

Of course, we wouldn\'t be using JSON Schema if we wanted to just accept
any JSON document. The most common thing to do in a JSON Schema is to
restrict to a specific type. The `type` keyword is used for that.

> When this book refers to JSON Schema "keywords", it means the
"key" part of the key/value pair in an object.  Most of the work
of writing a JSON Schema involves mapping a special "keyword" to a
value within an object.

For example, in the following, only strings are
accepted:

```json
// props { "isSchema": true }
{ "type": "string" }
```
```json
// props { "valid": true, "indent": true }
"I'm a string"
```
```json
// props { "valid": false, "indent": true }
42
```

The `type` keyword is described in more detail in [here](../understanding-json-schema/reference/type).

## Declaring a JSON Schema

It\'s not always easy to tell which draft a JSON Schema is using. You
can use the `$schema` keyword to declare which version of the JSON
Schema specification the schema is written to. See [$schema](../understanding-json-schema/reference/schema#schema)
for more information. It\'s generally good practice to include it,
though it is not required.

> For brevity, the `$schema` keyword isn\'t included in most of the
examples in this book, but it should always be used in the real world.

```json
// props { "isSchema": true }
{ "$schema": "https://json-schema.org/draft/2020-12/schema" }
```

<Infobox label="Draft-specific info">
In Draft 4, a `$schema` value of
`http://json-schema.org/schema#` referred to the latest version
of JSON Schema. This usage has since been deprecated and the use
of specific version URIs is required.
</Infobox>

## Declaring a unique identifier

<Star label="New in draft 6" />

It is also best practice to include an `$id` property as a unique
identifier for each schema. For now, just set it to a URL at a domain
you control, for example:

```json
// props { "isSchema": true }
{ "$id": "http://yourdomain.com/schemas/myschema.json" }
```

The details of `$id` become more apparent when you start [structuring a complex schema](../../understanding-json-schema/structuring#dollarid).

<Infobox label="Draft-specific info">
In Draft 4, `$id` is just `id` (without the dollar-sign).
</Infobox>