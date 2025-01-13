---
title: "Moving Toward a Stable Spec"
date: "2025-01-13"
tags:
  - specification
  - stable
type: Update
cover: /img/posts/2025/stable-json-schema/mt-taranaki.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: Specification Author & JSON Tooling Implementer
excerpt: "Amidst all of the change at JSON Schema, what's happening with the spec?"
---

Many of you may have noticed a lot of changes happening around the JSON Schema community.  This website has had a facelift, we've started appearing at developer conferences, and we even participated in Google's Summer of Code & Summer of Docs programs.  But many of you may be asking, "What's happening with the spec?"

In this post I'll be providing an update on specification development and our new publication process.

## Publication Process

In a [previous post](./json-schema-joins-the-openjsf), we announced that we were no longer publishing our specifications through the IETF.  At the time, the intent was to join the OpenJS Foundation, however for multiple reasons, the onboarding process was not able to be completed.  As such, currently we are independent.  In the future, we may again seek to join a foundation (we may even try OpenJS again), but for now, independence seems to be the best place for us.

When we last published a specification, we used the IETF's [Internet-Draft Publication Process](https://authors.ietf.org/en/rfc-publication-process).  This meant that our documents were required to retain the "draft" moniker, even though we considered them fully fledged and ready for use in production systems.  Publishing independently, we're no longer bound by this requirement, however it does mean that we can no longer rely on the IETF document publishing infrastructure.  We have to build our own.

The foundation of our publication process is built on several ideals, and I'll cover the major ones in the next few sections.  By focusing on these pillars, we can ensure a safe and easy upgrade path for our users as the specification continues to evolve.

### Minimize Backward-Incompatible Changes Between Releases

One of the primary complaints we received about releasing a new specification over the last few iterations, particularly between Drafts 2019-09 and 2020-12, is the lack of consideration for backward compatibility.

Just to highlight a few of the breaking changes introduced with the latest version:

- `$recursiveRef` / `$recursiveAnchor` became `$dynamicRef` / `$dynamicAnchor`
- Array-form `items` became `prefixItems`
- `additionalItems` was removed; use schema-form `items` now

These changes meant that a schema written for Draft 2019-09 could validate completely differently when processed under Draft 2020-12 rules.  This creates a very poor upgrade experience.

In defending our decision to include these breaking changes, we hid behind our own advice to schema authors to include the `$schema` keyword, which identifies the dialect (specification version), instead of designing a [pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/) that allowed them to continue their current behavior in a system that "just works".

**_Moving forward, upgrade compatibility is our #1 concern when developing a new release._**

That doesn't mean that a breaking change will _never_ happen, but we will make every effort to ensure that it doesn't.

### Maximize Forward Compatibility

**_We need to protect ourselves from potential future changes that would harm or prevent backward compatibility._**

Ironically, this means introducing a breaking change.  (I had [posted](./the-last-breaking-change) about this a couple of years ago, and the reception wasn't awesome, which led to a [follow-up post](./custom-annotations-will-continue).)

In short, to preserve future compatibility, we need to ensure that schemas can't contain extra properties which may one day be proposed as legitimate keywords.  This means that extra data in schemas can no longer be acceptable.  To accommodate our users' need to include meta-data and other values in their schemas, the specification will define a convention or namespace for property names that are to be ignored, and we guarantee that no future proposed keyword may follow this convention in order to keep the namespace protected.

As it stands today, the convention is that your property name should start with `x-`.  If you like, you can read about alternative ideas and how we decided on this approach in [the ADR](https://github.com/json-schema-org/json-schema-spec/blob/main/adr/2023-04-sva-prefix.md).

### Formally Define a Feature Proposal Process

In the past, new features would just be added to the specification and released with the next version.  We held it as acceptable that a feature may not be fully finished when we released the specification.  We expected to receive feedback, and the feature would be updated in the next version.

However, this approach puts a large burden on tooling maintainers who want to support multiple versions of the specification, which is basically all of them.  They'd have to support many different behaviors, sometimes for the same keyword.

The perfect example of this is Draft 2019-09's `$recursiveRef` & `$recursiveAnchor`.  The idea was solid and had a lot going for it.  In 2019 when we were working on it, we developed the concept as best we could, but we needed actual user feedback, so we added it to the specification, knowing that it wasn't quite complete.  Prior to releasing the specification, a few of us who had implementations also added it as an optional feature to let our users try it out.  But after the specification was released, we found that many users were confused as to how it should work, and we identified several ways that we could make it better.  Those improvements became `$dynamicRef` & `$dynamicAnchor` in Draft 2020-12.  Even though the "recursive" keywords weren't part of the latest specification, many implementations wanted to support Draft 2020-12 while continuing to support Draft 2019-09.  Furthermore, schemas which contained the "recursive" keywords couldn't be processed under the Draft 2020-12 rules, which takes us back to the backward compatibiility problem.

**_We need a feature proposal process that encourages tool support while also allowing continued feature development._**

By introducing a feature proposal process, all tooling maintainers can add support as they elect to do so.  And because these proposals aren't considered a hard requirement of the specification, we can continue to iterate on them (including breaking changes).  Finally, by actively encouraging tooling support, we can obtain the real-world feedback that we need to ensure that the feature is the best it can be before we officially integrate it into the specification.

## Compatibility with Draft 2020-12

To close this out, and with all of the above in mind, I want to cover what the upcoming release will entail as it stands now.

First, the incompatibilities:

- As mentioned before, we won't be supporting arbitrary properties anymore.  Any extra data you wish to include will need to use the `x-` property name convention.
- The `$dynamicRef` / `$dynamicAnchor` referencing system will be completely disjoint from the `$ref` / `$id` / `$anchor` system.  In Draft 2020-12, `$dynamicRef` could sometimes fall back to a normal `$ref` behavior.  This has been very confusing, so we've just isolated the two referencing systems.  This is _technically_ a breaking change, but we're pretty certain no one ever used `$dynamicRef` expecting it to work like `$ref`.
- `format` will validate by default.  There was a lot of [discussion](https://github.com/json-schema-org/json-schema-spec/issues/1520) on this topic, but the deciding factor was that users generally expect it to validate, and we wanted to meet that expectation.
- Vocabularies are being demoted to a feature proposal.  This was one of those ideas that wasn't completely finished when it was added to the spec in Draft 2019-09.  It's likely that this feature will change substantially before being merged back into the specification.  As a proposal, the feature can still be supported as development continues, but it's not a hard requirement.

Additionally, but not breaking:

- The recommended output format introduced in Draft 2019-09 has been extracted to its own specification.  The two driving factors for this decision were that different output formats could be more beneficial to different consumers and having the output versioned separately from the specification would more easily allow them to evolve independently.
- Many keyword interaction behaviors were defined by the annotations that were produced at various levels of evaluation.  This led to some confusion and unnecessary requirements, so we've loosened the language around this to allow tooling to figure out how they want to implement the behavior rather than prescribing a particular approach.
- General clean-up and clarifications to more accurately define behavior.

Beyond that, we still have a lot to do, but not nearly as much as we had this time last year, and we still have to figure out the actual publication piece, i.e. how we want it on the website.  We have the IETF-published documents mirrored here, and the new ones will likely go up next to those.  It's just another thing we need to do.  You can track our list of items on the [GitHub project board](https://github.com/orgs/json-schema-org/projects/15/views/1).

It's been four years since we published a new version, but we're getting really close, and I'm very excited.  Stay tuned!

_Cover image is of Mt. Taranaki in New Zealand, by [Sophie Turner](https://unsplash.com/@sophie_turner) on [Unsplash](https://unsplash.com/photos/mountain-near-body-of-water-during-daytime-LZVmvKlchM0)._
