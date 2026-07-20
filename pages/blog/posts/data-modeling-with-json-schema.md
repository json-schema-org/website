---
title: Data Modeling with JSON Schema
date: "2026-05-09"
tags:
  - Engineering
  - Validation
  - Data Modeling
type: Engineering
cover: /img/posts/2026/data-modeling/cover.jpg
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.jpg
    byline: JSON Schema Specification Editor, JSON Tooling Implementer
excerpt: JSON Schema was designed for constraints.  Let's use it to model data.
---

There has been a lot of chatter lately about a new specification called JSON Structure.  The goal of that specification is to rebuild JSON Schema, but with data modeling and code generation as a first-class use case.

This post is going to cover rethinking JSON Schema in its current state with those goals in mind.

## Why JSON Structure?

Over the years, we have maintained that JSON Schema wasn't initially designed to model data but to validate it.  One of our members, Henry Andrews, published an [article on his own blog](https://modern-json-schema.com/json-schema-is-a-constraint-system) describing the difficulties one might face when attempting to model programming types using JSON Schema.  It's definitely an informative read, and would probably be a good primer for what we're going to discuss today.  The key insight was that JSON Schema's subtractive constraint model is fundamentally an opposing approach to programming languages' additive data definition model.

Solving this fundamental difference and bridging the gap to data modeling is why JSON Structure was created.

But is an entirely new specification needed?  I don't think so.  Furthermore, I expect that as JSON Structure grows in complexity, they're going to run into many of the same or similar speed bumps and road blocks that JSON Schema has.  Primarily, flexibility (which is prioritized by JSON Schema) means that not all paradigms will work in all use cases.  JSON Schema can express constraints that data models can't represent, and that's okay.  We just need to limit ourselves to well-known patterns that fit the paradigm of data modeling.

## The Approach

To rethink JSON Schema, we'll need to first look at how it's currently organized: vocabularies.  The main vocabularies separate keywords into three groups:

- **applicators**, which affect validation and whose values are or contain other schemas
- **validators**, non-applicators which also affect validation
- **annotations**, which do not affect validation but attach additional data and context to the instance

While these groupings help us as specification and tooling maintainers, perhaps they're not so helpful for data modeling.  We need to reframe how we assemble these keywords.  We're going to have build a programming data model step by step, but using JSON Schema.

To do this, we need to think of structure first, which will mostly come from applicator keywords, but we won't use them all.  After that, we can refine the specific values using validator keywords.

## Establish the `type`

The first step to data modeling is determining the JSON type.  In order for JSON Schema to work for us, we have to look at how our type is going to be represented in JSON.  Languages can have various representations that all serialize to similar JSON constructs.  For example, arrays, queues, stacks, and lists would all be best represented by JSON arrays, wheras strings, dates, times, and enumeration values could all be serialized as JSON strings.

So first we need to know what JSON type will best represent our data.  We'll create a sort-of decision tree to help guide us to find the right `type` value.

1. Is your type a number, boolean, or string?  If so, just use the same JSON type.  JSON Schema also defines integers as a type.
2. Is your type a scalar that would be represented in one of those?  If so, use that.
3. Is your type an unkeyed collection of objects with the same type?  Use an array.
4. Is your type a positionally-significant collection of values (i.e. a tuple)?  Arrays are good for this, too.
5. Does your type have individual properties that are separately defined?  Probably an object is right for you.
6. Is your type a keyed collection where the key could be represented as a string?  Maybe you could use an object.
7. Is your type a keyed collection where the key cannot be represented as a string?  We're back to arrays where each item specifies both the key and the value as properties.

This isn't exhaustive, but it'll get you most of the way there to figuring out what JSON type to use.

However, while JSON Schema allows you to set multiple types in the `type` keyword, doing so typically disagrees with code generation, so that's our first data modeling principle:

> **1.** Only specify a single type with the `type` keyword.

## Add Structure

DO MORE HERE

Most keywords only operate on one JSON type.  For example, `properties` only operates on JSON objects, and `items` only works on array.  That's not to say it's invalid to include any keyword in your schema when it doesn't match the type; that keyword will just have no effect if the schema doesn't allow that type.

This brings us to our second data modeling principle:

> **#2** Only include keywords that operate on the type you've specified.

## Refine

For the types that are represented by JSON scalars (generally strings or numbers), we're basically done structurally: `type` brings all of the structure you need.

However, most of the time, it's nice to be able to further define the range of acceptable values for our programmatic type.  For instance, we might want to make sure our string's content accurately represents an email address.  For this, we'll introduce any number of validation keywords.

## Nullability

JSON makes an interesting distinction between a value being absent and a value being null.  In my primary background of .Net, these are often treated as the same thing.  If your background is JavaScript or another language, this concept may be more familiar to you.0

_**NOTE** Nullability is really only relevant for descendents since the root value can't be "absent"_ per se; _it can only be an explicit value_.

This distinction is quite useful to represent the removal of a value.  This is how JSON Merge Patch works.  When a property is absent from the incoming JSON data, that property remains unchanged; when it is `null`, that property is removed or its value is cleared.

To represent this in JSON Schema, we add `"null"` to the `type` keyword to indicate that we accept a `null` as well as the correct data type.

```json
{
  "firstName": "John",
  "lastName": null
}
```

_**NOTE** Another way to do this is to define your type's schema as non-nullable, and then wrap it in an `anyOf` along with a `{"type": "null"}`.  The outcome is the same, but one may communicate better to you what's going on._

The above update to a "person" object could represent that the caller wants to update the first name to John and clear the last name.  If there are any other properties, they remain unchanged.  A schema for this person might look like this:

```json
{
  "type": "object",
  "properties": {
    "firstName": {
      "type": ["string", "null"]
    },
    "lastName": {
      "type": ["string", "null"]
    },
    "age": {
      "type": ["integer", "null"]
    }
  }
}
```

This allows clearing all three properties and requires none.

_**NOTE** For brevity, I'm omitting `$schema` and `$id`, but these should always be included in root schemas_.

It's not necessary to implement JSON Merge Patch or a similar system, but I've personally found it quite useful in APIs that I've designed.
