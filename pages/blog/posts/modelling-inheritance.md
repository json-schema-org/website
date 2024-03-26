---
title: "Modelling Inheritance with JSON Schema"
date: "2023-09-13"
tags:
  - Questions
  - Explorations
type: Engineering
cover: /img/posts/2023/modelling-inheritance/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @ Postman
excerpt: Can it be done?  Well, sort of.
---

Probably the most common question that we get is, "How do I model an inheritance hierarchy in JSON Schema?"  And most commonly, our answer to that question is, "You don't."

JSON Schema just isn't [designed](https://modern-json-schema.com/json-schema-is-a-constraint-system) for that.  It's a subtractive system, where more constraints means fewer matches, and data modelling tends to be additive, where more definition means more matches.  The systems are inherently incompatible.

However, if we accept a few concessions, we might just be able to work something out.

## Our Models

To get started, we're going to attempt to model some computer peripherals.  In a strongly typed language, we may model this using a `Peripheral` base class that defines a number of properties (and typically functions) that are common to all peripherals.  Then, each device would be a subclass of this base class.

For our purposes, we're just going to define the `name` property on the base class.  That is, every peripheral needs to have a name.

_I'm going to use TypeScript for the code samples, but the concepts will apply to other languages as well._

```ts
abstract class Peripheral {
  name: string;
  // ...
}
```

Now we can define other peripherals, `Mouse` and `Keyboard`, by inheriting from this base class.

```ts
class Mouse extends Peripheral {
  buttonCount: number;
  wheelCount: number;
  trackingType: "ball" | "optical";
  // ...
}

class Keyboard extends Peripheral {
  keyCount: number;
  mediaButtons: boolean;
  // ...
}
```

This will suffice to get us started.

## Representing Our Models Using Constraints

In JSON Schema, ideally, we'd want to have schemas for each of these.  For peripheral, we might try something like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:peripheral",
  "type": "object",
  "properties": {
    "name": true
  },
  "required": [ "name" ],
  "additionalProperties": false
}
```

_I'm using a `schema:` URI for the schema identifiers since these schemas aren't accessible anywhere.  It's a recommendation that we're [considering](https://github.com/orgs/json-schema-org/discussions/460) for the upcoming version of JSON Schema.  Let us know if you like this approach._

But that `additionalProperties` keyword causes problems.  Specifically, "inherited" schemas (like what we're going to build for `Mouse`) can't define additional properties, which is something it definitely needs to do.  That just won't work at all, and the solution is simply to omit it.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:peripheral",
  "type": "object",
  "properties": {
    "name": true
  },
  "required": [ "name" ]
}
```

But now, _any_ JSON object with a `name` property is validated as a peripheral.  While not quite right, we can live with it.  This gives us our first concession:

> Schemas that model base classes cannot verify that an instance represents a derivation of that class.

Modelling the derivations is pretty straightforward: we model what the derivation defines and add a `$ref` back to the base schema.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:mouse",
  "$ref": "schema:peripheral",
  "type": "object",
  "properties": {
    "buttonCount": { "type": "integer" },
    "wheelCount": { "type": "integer" },
    "trackingType": { "enum": [ "ball", "optical" ] }
  },
  "required": [ "buttons", "wheels", "tracking" ],
  "unevaluatedProperties": false
}

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:keyboard",
  "$ref": "schema:peripheral",
  "properties": {
    "keys": { "type": "integer" },
    "mediaButtons": { "type": "boolean" }
  },
  "required": [ "keys", "mediaButtons" ],
  "unevaluatedProperties": false
}
```

For the derived schemas, we can use `unevaluatedProperties` because these don't have any schemas which derive from them.  If the inheritance hierarchy is bigger and these classes serve as bases for others, we'd have to leave the `unevaluatedProperties` off, just like we did for `schema:peripheral`.  Checking for extra properties can only be done for the leaves of the inheritance tree.

Additionally, we use `unevaluatedProperties` instead of `additionalProperties` because we need it to be able to "see inside" of the `$ref` to identify that `name` was evaluated as part of the base schema.  With `additionalProperties`, `name` would be rejected.

That seems pretty simple, and we only had to make a single (and rather easy) concession.

## Adding a Recursive Reference

What if one of our peripherals could itself have other peripherals attached?  Say, a USB hub.

```ts
class UsbHub extends Peripheral {
  connectedDevices: Peripheral[];
  // ...
}
```

Let's try to model that in a schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:usbhub",
  "$ref": "schema:peripheral",
  "properties": {
    "connectedDevices": {
      "type": "array",
      "items": { "$ref": "schema:peripheral" }
    }
  },
  "required": [ "connectedDevices" ],
  "unevaluatedProperties": false
}
```

This works, but remember that first concession we made?  This schema would allow items that are _anything_ with a string `name` property.  But that doesn't align with the TypeScript models.  The TypeScript model says that `connectedDevices` can only hold types that are derived from `Peripheral`.

While this may be sufficient for some, in my opinion it doesn't work.  I want to ensure that the items in the `connectedDevices` array are only known peripheral types.  To do this, we need another schema.

## Supporting Only Known Derivations

Problem: we want a schema that identifies that some JSON represents _one of_ our known device types.

Solution: define the schema using a `oneOf` that references all of the known device type schemas.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:known-peripherals",
  "oneOf": [
    { "$ref": "schema:mouse" },
    { "$ref": "schema:keyboard" },
    { "$ref": "schema:usbhub" }
  ]
}
```

This schema is pretty basic.  It just says, "If the JSON matches one of these devices, then it's a known peripheral."

We can now reference this in `schema:usbhub`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "schema:usbhub",
  "$ref": "schema:peripheral",
  "properties": {
    "connectedDevices": {
      "type": "array",
      "items": { "$ref": "schema:known-peripherals" }
    }
  },
  "required": [ "connectedDevices" ],
  "unevaluatedProperties": false
}
```

Now the USB hub _and its connected devices_ can be validated properly.

The catch is that because I can't dynamically add items to the `oneOf`, I can only support devices I know about at dev time.  For most cases, this isn't a problem.  However, if I plan on publishing this in a package to be used by others, it wouldn't support devices that they create.  (I do have a workaround for this, but it's not a good one, so I won't be sharing it here.)  This gives us our second concession:

> If we need references to the base class, we can only support derivations we know about ahead of time.

## An Unexpected Benefit

To determine whether some JSON is a `Mouse` or a `Keyboard` or a `UsbHub`, one might hold all three of those schemas and validate each one of them in turn to determine which one was received.  But our solution to the referencing problem actually gives us a better option.

We know that `schema:known-peripherals` can validate _any_ known peripheral (because we designed it to do that), but if we use a more verbose output format, it can actually tell us which _kind_ of peripheral we got.

First, we identify which `oneOf` subschema passed validation by looking through its child output nodes for a `valid: true`.  We know that's going to be a `$ref` schema (because it's a `oneOf` that contains only `$ref` schemas), which means that the child output node of that `$ref` schema will represent the output of the peripheral schema, which contains the peripheral schema's `$id` URI.

So in a single validation pass, we get whether it's a supported peripheral of any kind, _and_ we can discern what kind it is.  Two birds, one stone.

## So is Inheritance in JSON Schema Possible?

No.

And yes, if we're okay that:

> Schemas that model base classes cannot verify that an instance represents a derivation of that class.

> If we need references to the base class, we can only support derivations we know about ahead of time.

I think these will be acceptable for most people, but I'm also sure that someone will inevitably run into a scenario where this approach won't work.

This is the best I've seen so far at modelling inheritance, and I'm fairly certain that JSON Schema can't get it 100% right without some new functionality.

If you have some other ideas about how to support polymorphism, or if you think polymorphism is overrated and JSON Schema doesn't need to support it, please join the [conversation](https://github.com/json-schema-org/vocab-idl/issues/49) in our IDL Vocabulary repository.

_Cover image by [Gerd Altmann](https://pixabay.com/users/geralt-9301/) on [Pixabay](https://pixabay.com/illustrations/board-drawing-hierarchy-755792/)_
