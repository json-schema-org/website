---
title: "Custom Annotations Will Continue"
date: "2023-02-22"
tags:
  - Specification
type: Engineering
cover: /img/posts/2023/custom-annotations-will-continue/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @Postman
excerpt: "Custom annotations are one of JSON Schemas most-used features.  Here's how we're still supporting them."
---

[Last time](the-last-breaking-change), I wrote about how we had to remove support for unknown keywords.  I ended that post with a note saying that we were still searching for a way that we can support non-functional custom keywords, that is, simple annotations.

In this post, I'd like to review the solution and how we came to it, as well as a brief overview of some of the other solutions we dreamed up and were offered.  Buckle up, 'cause it's gonna be a mild ride!

## What's the solution?

The `tl;dr` of it is that going forward, JSON Schema will treat any keyword that starts with `x-` as an annotation.

This solution was chosen for several reasons.

1. Ad-hoc keywords necessarily cannot have any functionality tied to them.  That is, they're only ever annotations; their values are just returned to the user or application without any processing by the schema.
2. Having ad-hoc annotations follow a convention makes them very easy to identify.
3. A prefix is a good convention to follow.
4. Reserving this prefix for ad-hoc annotations means that there can be no collision with keywords defined by vocabularies, now or in the future (preserving our compatibility promise).
5. Developers are generally familiar with the `x-` prefix as it's already commonly used in other arenas, such as HTTP headers, to denote custom data intended for recipients that understand it.

The one hesitancy we had for using `x-` was that its origins denoted experimental behavior.  However, it seems that in practice, this prefix used quite liberally for any custom data.  Since we're making custom data our expressed purpose, it seems like a good fit.

## Why a prefix and not some other solution?

After releasing the previous blog post and publicizing it as far across the internet as we could, we received feedback that custom keywords were used quite extensively and not supporting them would break users more severely than we wanted.  While we had already planned on still supporting annotative custom keywords, we didn't know what that would look like.  So, I started a [discussion](https://github.com/json-schema-org/community/discussions/57) with some of the loose ideas that the team already had.

There's a lot in that discussion and quite a few ideas, but I'll just go through some highlights here.  If you're interested in the details, feel free to read the discussion.

### Alternative #1 - Defining the prefix in a new keyword

This option actually builds on the one we selected by defining a new Core keyword (one that starts with `$`) that would contain the prefix used for that schema.  It's a fascinating concept that would allow schema authors to use the prefix they wanted.

It was pointed out, however, that in order for a schema to be validated by the meta-schema, the meta-schema would need to be able to read this new keyword to get the prefix so that it could ignore the keywords that started with it.  This requires a whole lot of new mechanisms that we don't currently have in JSON Schema, so it's not very practical at this time.

We also noted that we couldn't figure out what the scope of this keyword would be.  Would it be only the schema resource (indicated by `$id`) where the keyword was used?  Would it be the whole document?  What if we `$ref` to another schema resource or document that doesn't define a prefix?  There's a balance somewhere between inferring intent and requiring too much repetition.

### Alternative #2 - Listing the custom keywords to ignore in a new keyword

This option defines a new Core keyword such as `$ignored` that would hold an array of the names of keywords to ignore.  This would allow schema authors to explicitly define the keywords they wanted to use.

Like alternative #1, this has the problem that JSON Schema doesn't currently have the mechanisms to perform the kind of meta-schema validation that would be required, as well as the same scoping issues.  It's also possible that a schema author could ignore a keyword that would later be added to the spec or some vocabulary, meaning that it _shouldn't_ be ignored, resulting in surprisingly wrong validations and violates our compatibility requirements.

### Alternative #3 - Inlined vocabularies that define keywords

This option allows for a vocabulary to be defined and described _within_ a meta-schema's `$vocabulary` keyword.  This is like alternative #2, except that the ad-hoc keywords are defined by a vocabulary so the normal JSON Schema process that enforces "no unknown keywords" wouldn't pick them up; they would be known.

We decided against this because it requires a lot of further development of vocabularies, a concept which is still under development anyway.  This solution would also skew that development toward solving this problem, which may not be the right direction for the vocabulary concept.

### Alternative #4 - A new keyword to contain all custom annotations

This option creates a new Core keyword such as `$extra` that simply houses all of the custom keywords that a schema author may want to use.

Undesirably, this creates a layer of separation between the annotations and the data they're trying to annotate.  But more importantly, a keyword can only create a single annotation (as it's defined now), and so a keyword like `$extra` would lump all of the annotations into a single large object rather than being more targeted like individual keywords would be.

### Alternative #5 - Support unknown keywords behind an option

Finally, this option just requires implementations to provide a configuration option to allow unknown keywords, defaulting to "disallow."  While allowing unknown keywords breaks our compatibility promises, a user explicitly setting this option is effectively acknowledging that risk.

This felt like [a step backwards](https://vlipsy.com/vlip/the-emperors-new-groove-this-is-a-step-backwards-0YryOW3W).  It just didn't feel like it aligned with the spirit of supportability we want for this project.

## How did we arrive at `x-` as the prefix of choice?

In the previous post, I linked to the discussion and invited everyone to support their preferred ideas or propose new ones.  We saw a lot more interaction than we have in the past, and that was great!

Additionally, we posted about the discussion on social media and we even found several posts (e.g. on reddit) that others made linking back to the blog post or the discussion (or both) and discussing on that platform.

Once we had determined that the prefix option looked like the favorite, Benjamin Granados, our Community Manager, created a survey that listed options for what that prefix could be.  It included the proposals we had in the discussion so far, `x-` and a handful of easily typeable symbols, as well as a "make your own" option.

We had 53 respondents, which may not seem like much, but it's more than we've ever had.  The results clearly showed that `x-` (with 17 votes) was the preferred prefix.  Tying for second were the "at" symbol `@` and the asterisk `*` with 12 votes each.

## Too long; Read anyway

Moving forward, prefix your custom annotation keywords with `x-`.

Another nice thing about this solution is that you don't have to wait for the next version of JSON Schema to come out.  You can start updating your schemas today.  `x-` keywords are compatible with all versions of JSON Schema that are currently published; they'll still just be collected as annotations.  And when the next version comes out, you'll already have migrated!

_Cover photo by [Mick Haupt](https://unsplash.com/@rocinante_11) on [Unsplash](https://unsplash.com/photos/dtTu8Ec_uAU)_
