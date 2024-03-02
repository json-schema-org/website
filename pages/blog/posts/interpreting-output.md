---
title: "Interpreting JSON Schema Output"
date: "2023-11-08"
tags:
  - Questions
  - Output
type: Engineering
cover: /img/posts/2023/interpreting-output/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @ Postman
excerpt: Why does my passing validation contain errors?
---

I've received a lot of questions (and purported bugs) and had quite a few discussions over the past few years regarding JSON Schema output, and by far the most common is, "Why does my passing validation contain errors?"

Let's dig in.

_The last time we [talked about output](fixing-json-schema-output), it was to announce changes from the 2019-09/2020-12 version.  I'm going to use the new formats because it's easier to read and more compact._

## No Problem

Before we get into where the output may be confusing, let's have a review of a happy path, where either

- all of the child nodes are valid, so the overall validation is valid, or
- one or more of the child nodes is invalid, so the overall validation is invalid.

These cases are pretty easy to understand, so it serves as a good place to start.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.org/blog/interpreting-output/example1",
  "type": "object",
  "properties": {
    "foo": { "type": "boolean" },
    "bar": { "type": "integer" }
  },
  "required": [ "foo" ]
}
```

This is a pretty basic schema, where this is a passing instance:

```json
{ "foo": true, "bar": 1 }
```

with the output:

```json
{
  "valid": true,
  "evaluationPath": "",
  "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#",
  "instanceLocation": "",
  "annotations": {
    "properties": [
      "foo",
      "bar"
    ]
  },
  "details": [
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#/properties/foo",
      "instanceLocation": "/foo"
    },
    {
      "valid": true,
      "evaluationPath": "/properties/bar",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#/properties/bar",
      "instanceLocation": "/bar"
    }
  ]
}
```

All of the subschema output nodes in `/details` are valid, and the root is valid, and everyone's happy.

Similarly, this is a failing instance (because `bar` is a string):

```json
{ "foo": true, "bar": "value" }
```

with the output:

```json
{
  "valid": false,
  "evaluationPath": "",
  "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#",
  "instanceLocation": "",
  "details": [
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#/properties/foo",
      "instanceLocation": "/foo"
    },
    {
      "valid": false,
      "evaluationPath": "/properties/bar",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#/properties/bar",
      "instanceLocation": "/bar",
      "errors": {
        "type": "Value is \"string\" but should be \"integer\""
      }
    }
  ]
}
```

The subschema output at `/details/1` is invalid, and the root is invalid, and while we may be a bit less happy because it failed, we at least understand why.

So is that always the case?  Can a subschema that passes validation have failed subschemas?  Absolutely!

## More Complexity

There are limitless ways that we can create a schema and an instance that pass it while outputting a failed node.  Pretty much all of them have to do with keywords that present multiple options (`anyOf` or `oneOf`) or conditionals (`if`, `then`, and `else`).  These cases, specifically, have subschemas that are _designed_ to fail while still producing a successful validation outcome.

For this post, I'm going to focus on the conditional schema below, but the same ideas pertain to schemas that contain "multiple option" keywords.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.org/blog/interpreting-output/example2",
  "type": "object",
  "properties": {
    "foo": { "type": "boolean" }
  },
  "required": ["foo"],
  "if": {
    "properties": {
      "foo": { "const": true }
    }
  },
  "then": { "required": ["bar"] },
  "else": { "required": ["baz"] }
}
```

This schema says that if `foo` is true, we also need a `bar` property, otherwise we need a `baz` property.  Thus, both of the following are valid:

```json
{ "foo": true, "bar": 1 }
```

```json
{ "foo": false, "baz": 1 }
```

When we look at the validation output for the first instance, we get output that resembles the happy path from the previous section: all of the output nodes have `valid: true`, and everything makes sense.

However, looking at the validation output for the second instance (below), we notice that the output node for the `/if` subschema has `valid: false`.  But the overall validation passed.

```json
{
  "valid": true,
  "evaluationPath": "",
  "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#",
  "instanceLocation": "",
  "annotations": {
    "properties": [
      "foo"
    ]
  },
  "details": [
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/properties/foo",
      "instanceLocation": "/foo"
    },
    {
      "valid": false,
      "evaluationPath": "/if",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/if",
      "instanceLocation": "",
      "details": [
        {
          "valid": false,
          "evaluationPath": "/if/properties/foo",
          "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/if/properties/foo",
          "instanceLocation": "/foo",
          "errors": {
            "const": "Expected \"true\""
          }
        }
      ]
    },
    {
      "valid": true,
      "evaluationPath": "/else",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/else",
      "instanceLocation": ""
    }
  ]
}
```

How can this be?

## Output Includes Why

Often more important than the simple result that an instance passed validation is _why_ it passed validation, especially if it's not the expected outcome.  In order to support this, it's necessary to include all relevant output nodes.

If we exclude the failed output nodes from the result,

```json
{
  "valid": true,
  "evaluationPath": "",
  "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#",
  "instanceLocation": "",
  "annotations": {
    "properties": [
      "foo"
    ]
  },
  "details": [
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/properties/foo",
      "instanceLocation": "/foo"
    },
    {
      "valid": true,
      "evaluationPath": "/else",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/else",
      "instanceLocation": ""
    }
  ]
}
```

we see that the `/else` subschema was evaluated, from which we can infer that the `/if` subschema MUST have failed.  However, we have no information as to _why_ it failed because that subschema's output was omitted.  But looking back at the full output, it's clear that the `/if` subschema failed because it expected `foo` to be true.

For this reason, the output must retain the nodes for all evaluated subschemas.

It's also important to note that the [specification](https://json-schema.org/draft/2020-12/json-schema-core#name-if) states that the `if` keyword doesn't directly affect the overall validation result.

## A Note About Format

Before we finish up, there is one other aspect of reading output that can be important: format.  All of the above examples use the _Hierarchical_ format (formerly _Verbose_).  However, depending on your needs and preferences, you may want to use the _List_ format (formerly _Basic_).

Here's the output from the simple schema in _List_ format:

```json
{
  "valid": false,
  "details": [
    {
      "valid": false,
      "evaluationPath": "",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#",
      "instanceLocation": ""
    },
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#/properties/foo",
      "instanceLocation": "/foo"
    },
    {
      "valid": false,
      "evaluationPath": "/properties/bar",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example1#/properties/bar",
      "instanceLocation": "/bar",
      "errors": {
        "type": "Value is \"string\" but should be \"integer\""
      }
    }
  ]
}
```

This is easy to read and process because all of the output nodes are on a single level.  To find errors, you just need to scan the nodes in `/details` for any that contain errors.

Here's the output from the conditional schema in _List_ format:

```json
{
  "valid": true,
  "details": [
    {
      "valid": true,
      "evaluationPath": "",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#",
      "instanceLocation": "",
      "annotations": {
        "properties": [
          "foo"
        ]
      }
    },
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/properties/foo",
      "instanceLocation": "/foo"
    },
    {
      "valid": false,
      "evaluationPath": "/if",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/if",
      "instanceLocation": ""
    },
    {
      "valid": true,
      "evaluationPath": "/else",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/else",
      "instanceLocation": ""
    },
    {
      "valid": false,
      "evaluationPath": "/if/properties/foo",
      "schemaLocation": "https://json-schema.org/blog/interpreting-output/example2#/if/properties/foo",
      "instanceLocation": "/foo",
      "errors": {
        "const": "Expected \"true\""
      }
    }
  ]
}
```

Here, it becomes obvious that we can't just scan for errors because we have to consider where those errors are coming from.  The error in the last output node only pertains to the `/if` subschema, which (as mentioned before) doesn't affect the validation result.

## Wrap-up

JSON Schema output gives you all of the information that you need in order to know what the validation result is and how an evaluator came to that result.  Knowing how to read it, though, takes understanding of why all the pieces are there.

If you have any questions, feel free to ask on our Slack workspace (link in the footer) or [open a discussion](https://github.com/orgs/json-schema-org/discussions).

_All output was generated using my online evaluator <https://json-everything.net/json-schema>._

_Cover image by [Tim Gouw](https://unsplash.com/@punttim) on [Unsplash](https://unsplash.com/photos/man-wearing-white-top-using-macbook-1K9T5YiZ2WU)_
