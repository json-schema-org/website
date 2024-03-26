---
title: "Fixing JSON Schema Output"
date: "2022-07-23"
tags:
  - Specification
  - Output
type: Engineering
cover: /img/posts/2022/fixing-json-schema-output/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @Postman
excerpt: "I have a problem: when I read GitHub issues, they occasionally resonate with me, and I obsess about them until they're resolved.  That may not sound like a problem to some, but when that resolution causes JSON Schema implementation developers to ask fundamental design questions for three years... yeah, that's a problem."
---

I have a problem: when I read GitHub issues, they occasionally resonate with me, and I obsess about them until they're resolved.  That may not sound like a problem to some, but when that resolution causes JSON Schema implementation developers to ask fundamental design questions for three years... yeah, that's a problem.

And that's precisely what happened coming out of draft 2019-09.  For this version of the specification we released the very first official output format.  It was actually multiple formats that were supposed to cater to multiple needs.

- While most people wanted to know what the errors were, some just wanted a pass/fail result, so we created the `flag` format.
- Among those who wanted some more detail about what actually failed, some preferred a flat list, while others figured a hierarchy that matched the schema would work better.  So we created `basic` for the list people.
- Finally of those that wanted a hierarchy, some wanted a condensed version (which became `detailed`), and others wanted the fully-realized hierarchy (`verbose`).

_**ASIDE** Some people wanted a hierarchy that mimicked the instance data, but we couldn't figure out how to make that work in a realistic way, so we just kinda swept it under the rug and moved on._

## Adding requirements to the spec

At the time, I hadn't contributed anything major to the spec, but I'd been pretty involved in making direction-type decisions, so I thought I'd take a crack at authorship.  That's not to say that I hadn't contributed _any_ text to the spec; just not anything as significant as an entire section.

So I spent a couple weeks writing up the new requirements for output based on the lengthy github issues that results from weeks (months?) of discussion.

Man, I thought I had everything!  I defined the properties, the overall structure, validation examples, and I wrote it all in that wonderful spec-ese that we all love.

I even implemented it in my library, Manatee.Json, before the spec was released just to make sure that it worked.

But I missed something: annotations.  I mean, I considered them, and provided requirements for them.  But I didn't provide an example of the results from a passing instance that generated annotations.  I guess _technically_ I did, but it was buried, nested way down inside the `verbose` example, which happened to be so big that I decided it needed to be in its own file, separate from the specification document.  (Yeah, like anyone was gonna read _that_.)

The highlight of the following years would be the numerous questions I would receive from fellow implementors regarding confusion about the output, mainly around how annotations should be represented.  And my general response to these questions wasn't great either:  "They're just like errors."  I thought it was a trivial exercise.

Fortunately, we listed the output as a whole as a "SHOULD" requirement, so implementations weren't _required_ to do it.  The idea behind this was that we were in the early stages of defining it and we didn't want to put too much of a burden on implementations knowing that we were likely going to tweak it in future releases.

## Tasting my own medicine

It wasn't until I decided to deprecate Manatee.Json to build JsonSchema.Net that I realized why everyone was asking questions.  Having to reimplement the output opened my eyes.

Wow.  I left out a lot!

Knowing what I originally intended helped me quite a bit, but I can't imagine what it must have been like trying to implement what I wrote while not also having written it.

So, I started taking notes.

## Time for an update

Draft 2020-12 has been published for over a year, and I've decided something needs to be done about the output.  I created this mess, and I feel it's my responsibility to clean it up.  (Now it's actually my job to clean it up! 😁)  I organized all of my notes and dumped out a [massive opening discussion comment](https://github.com/orgs/json-schema-org/discussions/63) on improvements that I think could be made to the formats.

The first thing that everyone agreed on was isolating purpose for and renaming some of the output unit properties.  These properties served a distinct purpose, but [naming things is hard](https://martinfowler.com/bliki/TwoHardThings.html), so of course the names for these could be better.  After some back-n-forth, proposed alternatives, and refinements, this got a quick-n-easy PR that's already been merged, so that's one thing done.

- `keywordLocation` ➡️ `evaluationPath`
- `absoluteSchemaLocation` (mostly optional) ➡️ `schemaLocation` (required)
- `errors`/`annotations` ➡️ `details`

You can read the discussion for the rest of the proposed changes, but I want to focus on one in particular.  At some point in the discussion, I had an epiphany:

> Why is the output designed to capture errors and annotations from individual keywords instead of from subschemas when it's the subschemas that ultimately collect errors and annotations and provide the final result?

## Status quo

To understand what I mean by this, let's take a look at the existing output.  We'll start with a simple example, and for brevity we'll only cover the `basic`, or list, form.

```json
// props { "isSchema": true}
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "example-schema",
  "type": "object",
  "title": "foo object schema",
  "properties": {
    "foo": {
      "title": "foo's title",
      "description": "foo's description",
      "type": "string",
      "pattern": "^foo ",
      "minLength": 10,
    }
  },
  "required": [ "foo" ],
  "additionalProperties": false
}

// instance (passing)
{
  "foo": "foo isn't a real word"
}
```

As you can see, this schema defines that a JSON value must be an object with a single string-valued property, `foo`, and the instance meets these requirements.  Additionally, the schema defines several annotations.

The 2019-09 / 2020-12 specs would require the following output for this evaluation:

```json
{
  "valid": true,
  "keywordLocation": "",
  "instanceLocation": "",
  "annotations": [
    {
      "valid": true,
      "keywordLocation": "/title",
      "instanceLocation": "",
      "annotation": "foo object schema"
    },
    {
      "valid": true,
      "keywordLocation": "/properties",
      "instanceLocation": "",
      "annotation": [
        "foo"
      ]
    },
    {
      "valid": true,
      "keywordLocation": "/properties/foo/title",
      "instanceLocation": "/foo",
      "annotation": "foo's title"
    },
    {
      "valid": true,
      "keywordLocation": "/properties/foo/description",
      "instanceLocation": "/foo",
      "annotation": "foo's description"
    }
  ]
}
```

So what's bad about this?

- Annotations are being rendered as full nodes.  This results in a lot of unnecessary or duplicate information.  This is actually more apparent in the hierarchical formats where everything is grouped by location making the repeated location properties redundant.
- All nodes carry the `valid` property, which makes it difficult to tell what is the result of an annotation vs the result of a validation.
- The top-level node has a plural `annotations` property with an array of nodes, whereas the inner nodes each have a singular `annotation` property with the annotation value.  This is just confusing.

This is just a simple example.  You can see how this can become considerably larger as the size and complexity of the schema grows.

## There's gotta be a better way

There is: reporting output by subschema rather than keyword.

In the above example, this means that we'd get two nodes:  one for the root schema, and one for the `foo` property subschema.  (Also note the aforementioned property name changes.)

```json
{
  "valid": true,
  "evaluationPath": "",
  "instanceLocation": "",
  "details": [
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "instanceLocation": "/foo"
    }
  ]
}
```

That _does_ look a lot simpler.  But what about annotations?  Well, we can group them in a new property.  And, since we know that any keyword is only going to produce a single annotation value, we can utilize an object to report those annotations by using the keyword as the property names.

```json
{
  "valid": true,
  "evaluationPath": "",
  "instanceLocation": "",
  "annotations": {
    "title": "foo object schema",
    "properties": [
      "foo"
    ]
  },
  "details": [
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "instanceLocation": "/foo",
      "annotations": {
        "title": "foo's title",
        "description": "foo's description"
      }
    }
  ]
}
```

Alternatively for the `basic` format, which is supposed to be a list, the result for the root schema could be moved inside the root output node as shown below.  This is the proposed idea, anyway.  Let us know in a comment on the [PR](https://github.com/json-schema-org/json-schema-spec/pull/1249) which way you prefer.  I'll be using this format for the rest of the post because it's what is currently proposed.

```json
{
  "valid": true,
  "details": [
    {
      "valid": true,
      "evaluationPath": "",
      "instanceLocation": "",
      "annotations": {
        "title": "foo object schema",
        "properties": [
          "foo"
        ]
      }
    },
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "instanceLocation": "/foo",
      "annotations": {
        "title": "foo's title",
        "description": "foo's description"
      }
    }
  ]
}
```

The last thing is that the absolute URI of the subschema is now required, so let's add that in.

_**NOTE** All of these examples (both old and new) are generated by my implementation, which uses a default base URI of `https://json-everything/base`.  I've implemented this new output on an experimental branch, and you can view the impact of those changes on my library suite [here](https://github.com/gregsdennis/json-everything/pull/308)._

```json
{
  "valid": true,
  "details": [
    {
      "valid": true,
      "evaluationPath": "",
      "schemaLocation": "https://json-everything/example-schema#",
      "instanceLocation": "",
      "annotations": {
        "title": "foo object schema",
        "properties": [
          "foo"
        ]
      }
    },
    {
      "valid": true,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-everything/example-schema#/properties/foo",
      "instanceLocation": "/foo",
      "annotations": {
        "title": "foo's title",
        "description": "foo's description"
      }
    }
  ]
}
```

And that's it!  All of the information we had before in a much more concise package.  Moreover, all of the related annotations are grouped together, which increases readability.

## How this affects errors

I wanted to start off with annotations because that's what I missed in the previous iteration.  Now, let's take a look at how a couple of failing instances would be reported.  There is an interesting nuance that isn't immediately apparent, and I had to do some double- and triple-checking to ensure that it was right.

Our first failing instance

```json
{
  "baz": 42
}
```

This will fail because

- `foo` is required but missing
- `baz` isn't allowed

The current error output has the same problems as the current annotations output:

```json
{
  "valid": false,
  "keywordLocation": "#",
  "instanceLocation": "#",
  "errors": [
    {
      "valid": false,
      "keywordLocation": "#/required",
      "instanceLocation": "#",
      "error": "Required properties [\"foo\"] were not present"
    },
    {
      "valid": false,
      "keywordLocation": "#/additionalProperties",
      "instanceLocation": "#/baz",
      "error": "All values fail against the false schema"
    }
  ]
}
```

Note how even though all of the errors actually result from the root schema, they are reported from child locations.  This just seems wrong.

Let's look at the new output:

```json
{
  "valid": false,
  "details": [
    {
      "valid": false,
      "evaluationPath": "",
      "schemaLocation": "https://json-everything/example-schema#",
      "instanceLocation": "",
      "errors": {
        "required": "Required properties [\"foo\"] were not present"
      }
    },
    {
      "valid": false,
      "evaluationPath": "/additionalProperties",
      "schemaLocation": "https://json-everything/example-schema#/additionalProperties",
      "instanceLocation": "/baz",
      "errors": {
        "": "All values fail against the false schema"
      }
    }
  ]
}
```

Again, we see the errors exist as a single `errors` property, which is reported at the subschema level.

Also, that nuance I mentioned appears: that `false` under `additionalProperties` is reported as a separate subschema (because it technically _is_ a subschema), and the error is reported as an empty-string keyword.  Looking at the evaluation path, though, it still appears that we're reporting at the keyword level.  That's the nuance:  we're actually reporting at the subschema level; it's just that the subschema happens to be located at a keyword.  Let's take a look at another failing instance to see this better.

```json
{
  "foo": "baz"
}
```

```json
{
  "valid": false,
  "details": [
    {
      "valid": false,
      "evaluationPath": "/properties/foo",
      "schemaLocation": "https://json-everything/example-schema#/properties/foo",
      "instanceLocation": "/foo",
      "errors": {
        "pattern": "The string value was not a match for the indicated regular expression",
        "minLength": "Value is not longer than or equal to 10 characters"
      }
    }
  ]
}
```

Here, you can see that the evaluation path shows that we are at the subschema located at `/properties/foo`.  Compare this to the previous example, where we were evaluating the subschema `false` at the location `/additionalProperties`, and you can see the similarity.

## Wrap-up

So that's one way that I would like to update the output and the reasoning behind it.  If you have any thoughts on this, please do let us know in a comment either in the [discussion](https://github.com/orgs/json-schema-org/discussions/63) or on the [PR](https://github.com/json-schema-org/json-schema-spec/pull/1249).

Again, if you'd like to see what the impact of making this change in my implementation was, please have a look at [this PR](https://github.com/gregsdennis/json-everything/pull/308).  All of these changes were driven by updating the output, but I think most of them are specific to my architecture, and some of them could be made to the library even without implementing the new output.  The short summary, though, is the net -343 lines of code!

_Cover photo by [Daria Nepriakhina](https://unsplash.com/@epicantus) on [Unsplash](https://unsplash.com/photos/zoCDWPuiRuA)_ 😁
