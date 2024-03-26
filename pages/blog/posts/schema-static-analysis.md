---
title: "Static Analysis of JSON Schema"
date: "2023-08-02"
tags:
  - Implementations
  - Theory
type: Engineering
cover: /img/posts/2023/schema-static-analysis/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @Postman
excerpt: What can we know about a schema without having an instance to evaluate?
---

When I first implemented JSON Schema, I took an approach that was probably typical for a C# developer: a blend of object-oriented and procedural programming.  However, over the past year or so, I've had an idea that I just haven't been able to escape.

A schema defines constraints on values in well-known locations inside the instance.  What if I could capture those constraints somehow and model a schema that way?  Then I would only have to do that work once, and when I finally received an instance, I would only have to evaluate each individual constraint.

I tried this several times.  Four, I think.  Each time, I got closer to getting it working, but I would always hit a roadblock that whatever design I had come up with just couldn't overcome.

But over the past couple weeks, I got it!  (And the performance boost was substantial!)

In this post, I'd like to share some of the more abstract JSON Schema analysis things that I've learned during this process.  **This one's for the implementers!**

## What are constraints?

Constraints are the building blocks of JSON Schema.  They're individual requirements that apply to specific locations within JSON data.

In this schema

```json
{
  "type": "object",
  "properties": {
    "foo": { "type": "string" },
    "bar": { "type": "number" }
  }
}
```

we have three constraints:

1. The root instance **must** be an object.
2. If there is a `foo` property, its value **must** be a string.
3. If there is a `bar` property, its value **must** be a number.

Each constraint identifies:

- where in the schema we are, the "schema location"
- how we got there, the "evaluation path"
- the instance location
- a specific requirement by one keyword

Note that none of this actually requires an instance, and we should be able to precalculate a lot of this.

This seems pretty easy to set up.  We can model each of these constraints, and when we get an instance, we test each constraint.  If they all pass, then the validation passes.

Simple, right?  That's what I thought, too.  It gets complicated in multiple ways pretty quickly.

_Please note that I don't present these as problems that need to be overcome when implementing JSON Schema; they're simply mechanics that exist._

## Keywords that have dependencies

The vast majority of keywords operate completely independently.  These are keywords like `type` and `properties`, as we saw above, as well as `maximum`, `minItems`, `title`, `format`, and a bunch of others.

But there are a few keywords that depend on (or interact with) others in order to operate.  These are:

| Keyword | Dependencies |
|:--|:--|
| `additionalProperties` | `properties`<br/>`patternProperties` |
| `contains` | `minContains`<br/>`maxContains` |
| `then`<br/>`else` | `if` |
| `items` | `prefixItems` |
| `unevaluatedItems`\* | `prefixItems`<br/>`items`<br/>`unevaluatedItems` |
| `unevaluatedProperties`\* | `properties`<br/>`patternProperties`<br/>`additionalProperties`<br/>`unevaluatedProperties` |

\* _While most keywords can only find their dependencies among their siblings, the `unevaluated*` keywords also take dependencies on keywords inside subschemas of their siblings (that apply to the same instance location)._

The `if`/`then`/`else` keywords are a good example of keyword interaction.

The procedural approach would use branching logic like

```
if ( ... )
then {
  ...
} else {
  ...
}
```

We evaluate `if`, and the result of that determines whether we evaluate `then` or `else`.

But if we think of these as constraints, then these three present a rather peculiar boolean logic:

```
valid = (if && then) || (!if && else)
```

Note how this differs from the notion that all individual constraints passing implies validation passing.  In this case, if `if` passes, then it doesn't matter whether `else` passes because it's just skipped; conversely, if `if` fails, `then` is skipped.

While the interaction for `if`/`then`/`else` is pretty straightforward to precalculate, doing so for some other keywords, like `additionalProperties`, doesn't work.  For that, you have an additional complication.

## Unknown instance locations

At the top, we defined a constraint as a requirement applied to a specific location.  However some keywords apply their subschemas more generally.  These keywords include:

| Keyword | Instance locations |
|:--|:--|
| `patternProperties` | any property that matches one of its regular expression keys |
| `additionalProperties`<br/>`unevaluatedProperties`<br/>`unevaluatedItems` | any object property not evaluated by one of its dependencies |
| `contains` | any item in an array |
| `items`<br/>`unevaluatedItems` | any array item not evaluated by one of its dependencies |

For all of these, you need the instance to determine what locations are available.  Only then can you complete the constraints.

The strategy here is to build a "constraint template."  The idea is a constraint that has a requirement and some mechanism to determine where that requirement needs to be applied once the available locations are known.  So while we can't build a completed constraint, we can still get a little of the work out of the way.

## Static references

Static references, i.e. `$ref`, can be resolved ahead of time without an instance.  They always point to the same location within the same document, regardless of the instance.  Easy mode.  Sometimes.

What if we have a recursive schema, like a schema that validates a linked list or a binary tree?  In these cases, the recursion stops when the instance no longer has any data that needs validating, i.e. when you read the end of the list or a leaf on the node.  To handle this, we can take the same "constraint template" approach as in the previous section.

_The template solution actually works for a lot of cases.  The real trick is figuring out when you need to use it._

## Dynamic references

Dynamic references, on the other hand, generally boil down to one thing: dynamic scope.  Dynamic scope is the ordered set of resource IDs (generally set by `$id`) that evaluation enters and leaves.  (Think of a stack, pushing when entering a resource, and popping when leaving.)  The dynamic scope is influenced by two things:

- where the evaluation started
- instance data

### Root schema dynamics

Last year I wrote a [post](dynamicref-and-generics) describing how to use `$dynamicRef` to model generic types in languages.  The idea went like this:

1. Start by defining a generic schema, using a `$dynamicRef` to a `$dynamicAnchor` to identify an undefined "type" parameter.
2. Define multiple secondary schemas that reference the generic one and use their own `$dynamicAnchor` to define the "type" parameter: one for each type.

Using this approach, if you start evaluation from the generic schema, evaluation will fail because the "type" isn't defined.  However, starting evaluation from a secondary schema redirects the `$dynamicRef` resolution to the one defined in the secondary schema.  This different resolution can allow an instance to pass validation.

This is a great example of a dynamic reference that _can_ be resolved without an instance present.  You only need the starting point of the evaluation.  Specifically, you need to know where the dynamic scope starts in order to identify the reference target.

### Data-driven dynamics

Another way the dynamic scope can change is through some kind of conditional logic.  [This test](https://github.com/jdesrosiers/JSON-Schema-Test-Suite/blob/06fc43d767e11369be443a60523261a3ce032423/tests/draft2020-12/dynamicRef.json#L390-L475) from the JSON Schema Test Suite is a good example.  It uses the same ideas from from the generics post, but instead of having separate schemas, everything is bundled up into one.

For this case, depending on the value of the `kindOfList` instance property, the items in the array are expected to either be numbers or strings.  Mechanically, this is determined by a set of `if`/`then`/`else` keywords that directs evaluation into either of the `numberList` or `stringList` definitions, both of which define `$dynamicAnchor: itemType` and reference into the `genericList` definition which contains `$dynamicRef: #itemType`.

When `$dynamicRef` is eventually hit, the evaluation had to either go through `numberList` or `stringList`.  This identifies which `$dynamicAnchor` is resolved.

In this case, you can't fully define the constraint until you have the instance because, while you may know the instance location, you don't know the requirements that need to apply.

I wasn't able to find a good strategy to isolate any kind of pre-work for this, and as a result, I still have to calculate all of this at evaluation time.

## Summary

These were the primary gotchas that I found when trying to change my approach to schema evaluation.  JSON Schema static analysis has proven to be a pretty interesting area of study for me, and I hope that I've piqued your interest as well.

If you'd like to find out more about how I ended up implementing all of this, I've got a summary on [blog.json-everything.net](https://blog.json-everything.net/posts/new-json-schema-net/).  It's a bit more functional now than procedural, but still very object-oriented.

There's probably a lot more to explore here, too.  If you think of something, feel free to come find me in [Slack](https://json-schema.org/slack).

_Cover image by [Google DeepMind](https://unsplash.com/@googledeepmind) on [Unsplash](https://unsplash.com/photos/ZJKE4XVlKIA)_
