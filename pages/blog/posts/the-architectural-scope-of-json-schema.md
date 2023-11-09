---
title: "The Architectural Scope of JSON Schema"
date: "2022-07-15"
tags:
  - Opinion
  - Fundamentals
type: Opinion
cover: /img/posts/2022/the-architectural-scope-of-json-schema/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @ Postman
excerpt: "What actually is JSON Schema?!"
---

Recently, I've had a few conversations that got me thinking about JSON Schema's place architecturally.  Today I'd like to share some of those thoughts.

## What _is_ JSON Schema?

JSON Schema is a specification that defines a mechanism to describe a JSON value and can be used to validate and annotate the value.  This mechanism is organized into a number of keywords, each of which provides a defined behavior.

A single set of keywords comprises a "schema."

This system takes an input of a schema, which itself is representable as a JSON value, and a JSON value (which we call the "instance") to which the rules in the schema will be applied.  For the purposes of this post, we'll call the application of these rules "evaluation."  (i.e. A schema "evaluates" an instance.)

The output of an evaluation is an aggregation of the individual errors and/or annotations of each of the rules.

However, in general, a system of behaviors is somewhat abstract, and so it's not practically useful.  What we need is a realization of this system in code.  What we need is an implementation.

## Making JSON Schema useful

Before we can make JSON Schema useful, we need to ask who it should be useful for.  To answer _that_ we need to know why JSON Schema exists in the first place.

Well, we visited that in the previous section: a schema evaluates an instance to ensure that the instance complies with all of the rules represented by the schema.  If the instance does comply with the rules in the schema, then we say it is "valid" against that schema.

The reasons to ensure we have valid JSON data could be numerous: checking data before deserializing into programmatic models, checking form inputs before submission, etc.  **These are the needs of applications.**

So _applications_ are the consumers of JSON Schema.

But what about annotations?  Well, annotations are specifically _intended_ for applications so that they can provide additional behavior.  So, yeah, applications are still the consumers here.

But an application can't consume a specification without that specification being realized into code.  That's where implementations come in.

An implementation of JSON Schema is an embodiment of the specification that is directly consumable by an application.

## A nuance

Something I've seen a lot of lately, and I think the source of some of the confusion that has arisen in my discussions, is that an application may be merely an executable wrapper around an implementation.  This tends to give the appearance that the application itself is the implementation, in which case the application would be subject to the requirements of the specification.  But I don't see it that way.  Even in these cases, there exists a distinction between the application and the implementation, even if that distinction is, in practice, really blurry.

_**NOTE** It's important to recognize that this distinction is **actually** blurry.  This is currently an open point of discussion, and nothing has been officially defined in this area._

Applications tend to have three basic components:  an interface (UX or API), some business logic, and data persistence.  **All** applications have an interface.  However, the business logic and data persistence components are optional to the degree that you can have one or the other or both.  (An application with only a UX is generally not very useful.)

An application may only provide an interface over data persistence (e.g. a Postgres web service), meaning that there's no need for any business logic.  Conversely, another application may provide a computational service (e.g. image processing) where there's no need to persist data.

For the recent conversations I've had, this second scenario seems to be the case: an application is created that just evaluates instances against schemas.  But this doesn't mean that the application and implementation *are* the same thing.

Within these applications the implementation, which for these applications _is_ the business logic, is still a separate component from the interface.  And it's important to recognize that JSON Schema as a specification can only cover the implementation part.

## Why any of this matters

It all comes back to what I touched on this in the opening section: JSON Schema needs to define inputs and outputs.  This comprises a minimal API that implementations and applications can use to communicate with each other.

When the line between implementation and application is blurred, it's natural to think that the specification is imposing requirements on how the application communicates with its users.  But that's not the case.

It is impossible for JSON Schema to know the needs of an application's users, and so it's impractical for the specification to attempt to define input and output requirements to which applications must adhere.

Users of different applications have different needs.  Even when you consider two applications that essentially just provide a UX for implementations, say a web app and a CLI, the UX needs of their users are vastly different, despite the two applications doing basically the same thing.

## The scope of the specification

As a result of everything discussed above, it follows that the specification's input and output requirements are only applicable when there is a clear communication seam between an application and a JSON Schema implementation.

The specification recognizes that programming languages and frameworks likely will not be dealing with textual JSON, but rather they will use data models defined within the limitations of that language.  As such, it defines input and output in terms of abstract JSON data and JSON Schema models so that implementations are free to use what they have at their disposal.

Specifically, these requirements only pertain to standalone implementations that are provided as general-use representations of the JSON Schema specification to be consumed by unknown parties.

Applications which have integrated implementations or application/implementation pairs which have specialized contracts need not adhere to these requirements because these arrangements are out of scope of the specification.

_Cover photo by me_ 😁