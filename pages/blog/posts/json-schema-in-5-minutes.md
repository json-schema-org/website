---
title: "JSON Schema in 5 minutes"
date: "2022-01-21"
tags:
  - Fundamentals
type: Engineering
cover: /img/posts/2022/json-schema-in-5-minutes/cover.webp
authors:
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    twitter: relequestual
    byline: JSON Schema Specification Lead @Postman
excerpt: "Everyone needs good fundamentals, and understanding the basics of JSON Schema changes how you read, reason, and develop Schemas."
---

If you have never heard of JSON Schema till now, then you are in the right place to learn more.
If you are confident in using JSON Schema, this article still holds some value for you, and you'll likely still learn something new.

By the end of this article, you will:

- Understand what JSON Schema is
- Know what JSON Schema can do
- Understand some key terminology for talking about JSON Schema
- Know some of the basics of how JSON Schema works
- Outshine even those with years of JSON Schema experience (hopefully)

Although this is a technical introduction, we won't cover writing any code today. But we will link you to a list of implementations in almost any programming language.

## JSON What?
Primarily, JSON Schema is used to validate data.
The sorts of data JSON Schema can validate is data encoded in JSON.

JSON stands for JavaScript Object Notation and is a subset of Javascript.
JSON is both human and machine-readable, making it a popular format choice for data interchange.

JSON Schema is both the name given to the project and the artefact (A JSON Schema) that defines the required validation. The validation rules are expressed by defining constraints against the JSON data.

The JSON data you are validating is called a "JSON instance".

## JSON Schema
JSON Schema the project is located [on GitHub](https://github.com/json-schema-org) under the organization name "json-schema-org". It is comprised of several git repositories used to track changes and enable collaboration on the specification and supporting resources.

The JSON Schema specification is made up of technical specification documents currently published canonically through the Internet Engineering Task Force (IETF) as a series of "personal drafts". A "personal draft" is the category given to documents published on the IETF which are from an IETF working group.

A JSON Schema document is written in JSON itself. Being written in JSON means that it can be read by almost every programming language, making it an interoperable validation solution. It can also be written using other formats which translate to JSON, or using code that can serialize to JSON.

## A JSON Schema (document)
We mentioned JSON Schema is itself JSON. It used to be that JSON had to be an Object or an Array at the root level, but today, it can also be any of the allowed values.

A JSON Schema may be an Object or a Boolean. The Boolean form results in the same value as the validation assertion result. The Object form allows for keywords and values to express constraints for validation.

JSON Schema is constraints based, meaning that anything not defined (or constrained) is allowed and considered valid.

It may seem odd to allow Boolean values for a Schema, but we will explore why that's useful later. For now, let's look at our very first example Schemas.

## Introduction to constraints

```json
// props { "caption": "An empty Object"}
{}
```

```json
// props { "caption": "A \"true\" Boolean value"}
true
```

```json
// props { "caption": "A \"false\" Boolean value"}
false
```

```json
// props { "caption": "Not, empty Object"}
{ "not": { } }
```

Let's take each Schema in turn and explain the validation result.

The empty Object Schema expresses no constraints. Any instance data will always be considered valid.
The "true" Boolean Schema will always assert that the instance data is valid.

As you may have guessed, the inverse is true for the remaining two Schemas. The "false" Boolean Schema will always assert false, and the "Not, empty Object" Schema will have the same result.

The `not` keyword takes a JSON Schema as its value. These "schema values" are called subschemas. The subschema is applied to the instance data, and the resulting assertion is inverted. As we now know, the empty Object schema results in a "true" assertion, so the inverse is "false".

## The Object Schema
The keys in an Object Schema are the JSON Schema keywords. These keywords have four classes: Identifiers, Applicators, Assertions, and Annotations. Some keywords don't fit into these classes, as they have unique functions.

The `$schema` keyword has a unique function. The value of this keyword is a URI that identifies the JSON Schema Dialect to use when processing the schema.

You can think of a JSON Schema Dialect as a set of keywords with a defined meaning. In most cases, the different dialects you will deal with are merely different versions (or "drafts") of JSON Schema.

It is best practice to define the JSON Schema Dialect in use using the `$schema` keyword. In doing so, implementations should throw an error if they find a version of JSON Schema that they do not support.

If your Schema does not define the Dialect of JSON Schema it is using, implementations may pick any dialect. This may result in false positives when used with an implementation that does not support that version.

In this introduction, we will use the 2020-12 version of JSON Schema, however, most of what you will learn applies to almost all of the versions used in production today.

The 2020-12 JSON Schema Dialect URI is `https://json-schema.org/draft/2020-12/schema`.

## Assertions
Remembering that JSON Schema provides constraints based validation, JSON Schema defines keywords that, when applied to the instance, provide an assertion result (pass or fail).

### The "const" keyword

The simplest assertion keyword is `const`. The value can be any valid JSON. To pass validation data must be the same as the value of `const`. Here's an example:

```json
// props { "isSchema": true}
{ "const": 1234 }
```

```json
// props { "valid": true, "caption": "valid - It is exactly the same" }
1234
```

```json
// props { "valid": false, "caption": "invalid - It is not the same" }
"foobar"
```

### The "type" keyword

Another assertion keyword is `type`. Its value is an array of strings that are the allowed types. The types are the six primitive types defined by JSON, plus "integer". Let's look at an example.

```json
// props { "isSchema": true}
{ "type": ["object", "boolean", "null"] }
```

```json
// props { "valid": true, "caption": "valid - An Object is allowed." }
{ "ok": "yes" }
```
```json
// props { "valid": true, "caption": "valid - A Boolean is allowed." }
true
```
```json
// props { "valid": true, "caption": "valid - Null is allowed." }
null
```

```json
// props { "valid": false, "caption": "invalid - A Number is not allowed." }
123
```
```json
// props { "valid": false, "caption": "invalid - A string is not allowed." }
"foobar"
```

These two assertion keywords are applicable to ANY type of data in JSON, but some assertion keywords are only applicable to specific types. If a keyword is NOT applicable to the instance data, it is ignored and performs no validation.

### The "required" keyword

`required` is an assertion keyword that is only applicable for Objects. Let's explore the implications of this with some examples.

`{ "required": ["name"] }` - Our JSON Schema
`{ "name": "Bob" }` - valid - "name" is in the Object.
`{ "fullName": "Bob" }` - invalid - "name" is missing from the Object.
`"Bob"` - valid - The `required` keyword only applies to an Object.
`true` - valid - Same as above.

This may be surprising, but it allows for the composition of constraints that only logically otherwise make sense given a specific type of data.

You should combine using `type` with other keywords in the same Schema to avoid type expectation mismatch.

## Applicators

Validation begins by applying the root Schema to the complete instance document. Applicator keywords apply subschemas to the instance location.

### The "properties" keyword
The most commonly used applicator keyword is `properties`, which has an object value, where the values are subschemas. Let's see it in action.

```json
// props { "caption": "Our JSON Schema", "isSchema": true }
{
  "properties": {
    "name": {
      "type": ["string"]
    }
  }
}
```

```json
// props { "caption": "instance has name, which is a string", "valid": true }
{
  "name": "Alice"
}
```

```json
// props { "caption": "instance object has no `name` property", "valid": true }
{
  "fullName": "Alice"
}
```

```json
// props { "caption": "instance is not an object, therefore `properties` isn't applicable", "valid": true }
[ "name", 123 ]
```


The subschemas are only applied to the instance location where the key matches a key in the instance locations object.

If you want to make sure the instance data is an Object, use the `type` keyword.

If you want to make sure that the Object has the "name" property, use the `required` keyword.

## Recap
The most common reason a JSON Schema appears to not be working is the lack of the fully required constraints.

JSON Schema is "constraints based", and keywords may only be applicable to the correct data types.
Using multiple keywords to tighten constraints allows you to make sure type-specific keyword mismatch is handled by a different keyword.

Identifying subschemas, and knowing that Schemas can always be Boolean values allows you to confirm assumptions about correct applicability. Subschemas can always be tested on their own if required.

## Next steps / Further Reading
I hope you've found this very brief introduction to the fundamentals of JSON Schema beneficial in how you read, reason, and develop JSON Schemas.

My recommendation for writing JSON Schemas today is to use VSCode. When a file is in JSON language mode, and a `$schema` value is added to a root object, VSCode provides auto-complete and IntelliSense  (Although this is limited to draft-07).

Here are some places you may find helpful moving forward:

- [Up to date getting started guide](/learn/getting-started-step-by-step)
- [Weekly Office Hours (Tuesday, 15:00 UTC)](https://github.com/json-schema-org/community/discussions/34)
- [Open Community Slack Server](/slack)
- [Community GitHub Discussions](https://github.com/json-schema-org/community/discussions)
- [List of implementations](/implementations)
- [Human-friendly documentation for understanding JSON Schema](/understanding-json-schema)
- [JSON Schema live playground (ajv) for draft-07 with shareable links](https://jsonschema.dev)
- [JSON Schema live playground (hyperjump validator) for all drafts (from draft-04)](https://json-schema.hyperjump.io)
- [Links to RFC specification documents](/specification)

Photo by <a href="https://unsplash.com/@saadx?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Saad Salim</a> on <a href="https://unsplash.com/s/photos/construction?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
