---
title: "The Last Breaking Change"
date: "2023-02-23"
tags:
  - Specification
type: Engineering
cover: /img/posts/2022/the-last-breaking-change/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @Postman
excerpt: "We need to make a breaking change so that we can promise we won't again."
---

As we continue to [move toward a stable specification](https://json-schema.org/blog/posts/future-of-json-schema), we have been analyzing the various components, behaviors, and features of JSON Schema to determine what can be included, what may need modification, and what (if anything) needs to be removed or replaced.  The primary question that we had was whether there were any planned changes that would cause problems for users with existing schemas, i.e. breaking changes.

To answer that, we needed user input.  So we posted across the internet in order to encourage users to participate in a [particular conversation on GitHub](https://github.com/orgs/json-schema-org/discussions/295) around how we treat any supposed breaking changes for the upcoming release.  The response was very much, "If you can help it, please don't break things."  But many people also said they would be less bothered if there was a defined migration path and tooling to help.

We also performed an internal survey of feature stability, involving all of the JSON Schema core team members.  We're pleased to report that the vast majority of Draft 2020-12 can be kept completely as-is.  There are a few keywords and behaviors that could use some tweaking, but mostly in ways that we feel are generally compatible with the current release.

Another common sentiment among both users and team members was that JSON Schema already has a history (and reputation) of including breaking changes when releasing new versions of the specification, meaning that a schema that validates properly with one version may not validate properly with the next.  This perception is one that we need to address.  To do that, **we need to orient ourselves and the specification so that we can promise schemas written to one version will validate consistently with every subsequent version**.

Unfortunately, in order to make that promise, there is one behavior that we absolutely must change in a breaking way: support for unknown keywords.

## What are unknown keywords?

A keyword is "known" if it is defined by a vocabulary listed in the schema's meta-schema (identified by the value in `$schema`).  By recognizing this vocabulary and continuing to process the schema, an implementation declares that it understands how to process all of the keywords that vocabulary defines.  Any keyword which is not defined by a vocabulary listed in the schema's meta-schema is considered "unknown."

All of the currently published versions of JSON Schema instruct implementations to (at a minimum) ignore keywords that are not recognized.  With the introduction of annotations in Draft 2019-09, implementations were given the option to collect the values of unknown keywords and report them to the user in the output.  This behavior was widely supported by the community because it meant that they could annotate and document their schemas without having to worry that their validations would be impacted.  For a schema like

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "database-field-id": 1234
    }
  }
}
```

a validator would either ignore `database-field-id` or include it and its value as an annotation in the output.  One can see how this feature would be extremely helpful.  However, this feature also blocks our ability to promise future compatibility.

## Why can't we still support this?

Suppose a user wrote the example schema above while using a validator written to conform to the 2023 version of the specification.  A couple years later, they want to upgrade the validator now that supports the 2025 specification.  However in that 2025 specification, we added `database-field-id` as a keyword, and its value is expected to be a string.  Suddenly the user's schema is no longer valid.  **We've broken a user by adding a new keyword.**

In order to prevent this scenario, we are forced to forbid keywords that are not declared by a listed vocabulary.  We recognize that this will break a lot of people up front.  However we feel that a promise of future-compatible specifications should take precedence over the immediate pain of having to change your schemas yet again (and potentially again perpetually into the future).

## What is being done to soften the blow?

We have an [open discussion](https://github.com/orgs/json-schema-org/discussions/329) on this very topic, and we invite you to weigh in.

Current proposals include things from simple prefixes on unknown keywords as a convention to indicate custom annotations to more complex solutions like inlined and ad-hoc vocabularies bundled into the schema that can define annotation-only keywords, like `title` and `readOnly`.  These options are effectively ways for the schema author to say, "I know these keywords aren't declared by any vocabulary, but I'd really like them in my schema.  Please disregard them."

## Will there be any other breaking changes in the next release?

Hopefully not.  We believe that removing support for unknown keywords will be the only change of any real negative impact, but that doesn't preclude the possibility of other changes that break things in less critical ways.

We recognize that making breaking changes like this is hard on developers, both users and implementors, and so we're doing our best to measure the changes that are needed and seek alternatives to breaks where possible.  We don't see this as an opportunity to go wild with changes.

In any case, we will be open and transparent about any changes that we make, breaking and otherwise.

## Sum up

It looks like we have to break some schemas with the next version.  However by doing so, we are able to promise that we won't in the future.

We have to break it in order to fix it.

_Cover photo by [Ken Suarez](https://unsplash.com/@kensuarez) on [Unsplash](https://unsplash.com/photos/4IxPVkFGJGI)_
