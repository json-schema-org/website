---
title: "Using Dynamic References to Support Generic Types"
date: "2022-08-31"
tags:
  - dynamic reference
type: Engineering
cover: /img/posts/2022/dynamicref-and-generics/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @Postman
excerpt: "A step in the right direction for modelling data with JSON Schema"
---

One of the most common questions we get is how to represent a concept from a strongly typed programming language in JSON Schema.  Class hierarchies, polymorphisms, generics, etc.  These ideas define strongly typed languages, and influence our data models.

The topic in this post can apply to any programming paradigm where you have a defined data model and support for something like generic types.  This will likely be the first in a disjoint series on the relation between data modelling in programming languages and JSON Schema.

Today, I want to cover the idea of generics or templates or some other label you may have heard.  To start, let's cover what I mean by "generic types."  This isn't intended as a lesson on them; I just want to ensure that we're all on the same page.

## Generic Types

By "generic types" I mean the feature in many programming languages to create a type that requires the additional information of one or more secondary types to be complete.  In object-oriented programming, generics can also apply to services as well as data models, but since we use JSON Schema to describe data models, we can be fairly certain that the generic types we care about for this use case are wrappers and containers.

In .Net (C#), these are denoted by angle brackets at the end of the type name, so `List<T>` or `Dictionary<TKey, TValue>` where `T`, `TKey`, and `TValue` represent the secondary types.  (These examples are both container types, but you can also do this with envelope types like [Cloud Events](https://cloudevents.io/) (e.g. `CloudEvent<T>`).)

In C++, these types are called "templates" and are denoted by the keyword `template` with the additional type information afterward, also in angle brackets:

```cpp
template <class T>
class List { ... }

template <class TKey, class TValue>
class Dictionary { ... }
```

Typescript also has this concept and mostly follows the C# syntax.

These types are then completed by defining the required secondary type(s).  This is typically done by replacing the type placeholder (e.g. `T`) with the secondary type, so `List<T>` or `Dictionary<string, int>` for the C# examples.  One of the interesting consequences is that a generic type cannot be instantiated on its own: it needs the secondary type so that the compiler or script engine (or whatever runs the code) can know various things about the type, like memory footprint.

So, the question, then, is how to represent a partially defined type in JSON Schema.

## Representing Generics with `$dynamicRef` and `$dynamicAnchor`

The dynamic keywords, collectively `$dynamic*`, enable references that generally can't be resolved until evaluation time, unlike `$ref`, which can be resolved statically with just the schema.  Typically this is most evident when the schema also defines conditionals (`if`/`then`/`else`) which can change the resolution based on the JSON instance being evaluated.

However to support generics, we want to use this dynamic behavior a bit differently.  The strategy we'll use is a two-step process.

1. For the generic type itself, we're going to write a schema with a reference that initially resolves to a subschema that always fails validation.
2. For each derivation, we write a subschema that
    - references the generic type schema from #1
    - defines a new subschema for the same reference that describes the secondary type

To see this in action, let's write schemas for the `List<T>` from above.  Then we'll write two more that will use it to help us define `List<string>` and `List<int>`.

### The Generic Schema: `List<T>`

We start simply with a list of things.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.example/list-of-t",
  "type": "array"
}
```

Now we define the items.  This is where `$dynamic*` does some work for us.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.blog/list-of-t",
  "$defs": {
    "content": {
      "$dynamicAnchor": "T",
      "not": true
    }
  },
  "type": "array",
  "items": { "$dynamicRef": "#T" }
}
```

_**NOTE** I used `T` here to match up with the C# `List<T>` to better illustrate what's happening.  You can name it whatever you want._

If we validate an instance against only this schema, `"$dynamicRef": "#T"` resolves to the subschema with `"$dynamicAnchor": "T"` that we included at `/$defs/content`.  In this case, `$dynamicRef` and `$dynamicAnchor` work just like `$ref` and `$anchor`.

The `"not": true` means that all instances will fail validation.  Typically, to ensure all instances fail validation, we'd use the `false` schema, but in this case, we need to include a dynamic anchor, so a simple `false` doesn't work.  I think `"not": true` is probably the cleanest alternative, but you can also use something like `"allOf": [ false ]` if that makes more sense to you.

_**NOTE** An empty array will still pass validation for this schema, but any array that has items will fail._

You can also use multiple dynamic anchors to support types like `Dictionary<TKey, TValue>` that need multiple secondary types.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.blog/list-of-t",
  "$defs": {
    "key": {
      "$dynamicAnchor": "TKey",
      "not": true
    },
    "value": {
      "$dynamicAnchor": "TValue",
      "not": true
    }
  },
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "key": { "$dynamicRef": "#TKey" },
      "value": { "$dynamicRef": "#TValue" }
    }
  }
}
```

And that's it for the generic type.  The magic comes when we define the content.

### Defining Contents

As mentioned before, we need a schema that references `list-of-t` and also provides a definition for `T`.  Let's write one for `List<string>`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.blog/list-of-string",
  "$defs": {
    "string-items": {
      "$dynamicAnchor": "T",
      "type": "string"
    }
  },
  "$ref": "list-of-t"
}
```

Here's how this works:

1. When evaluation begins, it creates a "dynamic scope" which starts with the root schema (`list-of-string`) and remains throughout evaluation.
2. This root schema defines a `"$dynamicAnchor": "T"`.
3. Evaluation then `$ref`s into the generic schema, `list-of-t`.  This is a new _lexical_ scope, but the _dynamic_ scope remains unchanged.
4. The generic schema also declares `"$dynamicAnchor": "T"`, but that dynamic anchor is already defined, so the new declaration is ignored.
5. When evaluation hits `"$dynamicRef": "#T"`, it uses the first one from the beginning of the dynamic scope.

If we wanted `int` items instead of `string`s, we just create a new schema where the subschema with `$dynamicAnchor` defines an integer.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json-schema.blog/list-of-int",
  "$defs": {
    "int-items": {
      "$dynamicAnchor": "T",
      "type": "integer"
    }
  },
  "$ref": "list-of-t"
}
```

## Conclusion

By using `$dynamicRef` and `$dynamicAnchor`, you don't need to write full schemas for classes which share structure but vary in a content type.  Instead, you can write a partial, reusable schema for the structure, which makes the fully-defined schemas significantly smaller and easier to maintain.

_**ASIDE** With Draft 2020-12, including `$dynamicAnchor` in the generic schema is required for `$dynamicRef` to work.  In future versions, this requirement will be removed as it isn't strictly needed: any resolution attempt will simply fail.  (This requirement is a holdover from its Draft 2019-09 predecessor `$recursive*`.)  However for the particular application of modelling generic types, I'd still keep it in because it serves as an analog for not being able to instantiate a generic type, like `List<T>`.  The net outcome is the same (validation failure), but I think including it more explicitly describes the intent._


_Cover photo by [Nick Fewings](https://unsplash.com/@jannerboy62) on [Unsplash](https://unsplash.com/photos/-sAtFFj28W4) with some edits by me._ 😁
