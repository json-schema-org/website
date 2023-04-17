---
title: "Towards a stable JSON Schema"
date: "2022-10-21"
type: Update
tags:
  - Standardization
cover: /img/posts/2022/stability/arches.webp
authors:
  - name: Jason Desrosiers
    photo: /img/avatars/jasondesrosiers.jpeg
    twitter: jasondesrosiers
    byline: JSON Schema Specification Contributor
excerpt: "About this time last year, I hosted a discussion at the API Specification
Conference about the future of JSON Schema. The most popular topic of discussion
was, when JSON Schema is going to be 'done'. Of course we've heard that question
a lot. The question stems from the 'draft' label we put on your releases. The
term 'draft' has led to quite a bit of confusion for our community over the
years, so let's take a moment to understand where it comes from."
---

About this time last year, I hosted a discussion at the API Specification
Conference about the future of JSON Schema. The most popular topic of discussion
was, when JSON Schema is going to be "done". Of course we've heard that question
a lot. The question stems from the "draft" label we put on your releases. The
term "draft" has led to quite a bit of confusion for our community over the
years, so let's take a moment to understand where it comes from.

## Why is it a "draft"?

JSON Schema has been loosely following the IETF standards track RFC process.
That means our releases are in the form of an Internet Draft (I-D). That's why
we refer to them as drafts. However, because of JSON Schema's wide use in
production systems, it's not really possible to treat the spec like a typical
I-D. Therefore, our use of the term "draft" is a bit of legacy artifact from
when the IETF process made more sense for JSON Schema.

This is has been a problem because when people hear "draft", they hear
"unfinished" or "not production ready". That's not the way we treat our
releases. Every release is expected and encouraged to be used in production.
It's no different than OpenAPI releasing a new version. No one asks when OpenAPI
is going to be "done". JSON Schema is just perceived differently because we call
our releases "drafts".

## The real problem

But this isn't just a branding problem. When people ask when JSON Schema is
going to be out of "draft", what they really mean is, when is JSON Schema going
to be "stable". They want to be able to write a schema and be sure that it will
continue to work the same way no matter how JSON Schema evolves in the future.
They want to be able to update their dependencies and not have to update their
schemas that were working just fine.

This effects library maintainers as well. Needing to support multiple versions
of JSON Schema with no backward or forward compatibility guarantees gets
cumbersome and has led many maintainers to
[drop support](https://github.com/gregsdennis/json-everything/issues/310) for
older releases. When this happens, it can leave users with a choice to have to
update all of their existing schemas that weren't broken or pin to a
no-longer-supported version of the JSON Schema library they are using.

## Our solution

Those are the problems we're aiming to solve in the next release. Instead of
continuing to release a new immutable and incompatible version of JSON Schema
with each release, our next release will be a long-lived version that is stable,
but evolving. In this case, "stable" means that there will be strict backward
and forward compatibility requirements that must be followed for any change. It
will be much like JavaScript in that as it evolves you can always be sure that
your existing schemas will continue to work with any JSON Schema library you're
using, but you take a risk using newer features because not all libraries will
have implemented those features yet.

That vision of a stable yet continuously evolving spec doesn't fit well with the
IETF process. There are paths we considered, but nothing was proposed that we
thought would allow us to continue to evolve the standard and get out of "draft"
any time soon. Therefore, the first step to achieving our vision is to [decouple
our main spec development from the IETF process](https://github.com/json-schema-org/json-schema-spec/pull/1277).
This split allows us to pursue a new model for the main spec development that is
more conducive to our vision.

Whether or not you're a fan of the direction the JavaScript language has
evolved, it seems clear that they've come up with an
[effective process](https://2ality.com/2015/11/tc39-process.html) for allowing
for continuous evolution without sacrificing interoperability and longevity.
That's why we've chosen to base our new process on the process that is used to
evolve the JavaScript language. In our next release, most of the keywords and
features you use today will be declared stable and they will never change in a
backward incompatible way again. Features and keywords we aren't comfortable
making stable yet will become part of a new staged release process that we are
working on defining now. The goal of the staged release process is to ensure
that the feature gets sufficient implementation, testing, and real world vetting
for us to be confident in declaring it stable. The process should not only make
us more confident, but also allow us to achieve that confidence much more
quickly.

## Standards considerations

Starting with the next release, the JSON Schema specification will be
self-published on our website.

One of the concerns about self-publishing is about other standards being able to
reference the JSON Schema specification. We have received
[feedback](https://github.com/json-schema-org/json-schema-spec/pull/1277#issuecomment-1228734352)
from people involved in standards development that our approach would be
acceptable for them to reference our specification in their standards based on
our membership with the OpenJS Foundation. We don't know if _all_ standards
bodies will come to the same conclusion, but this feedback gives us confidence
that it isn't going to be a significant problem.

Although the main specification will be self published, we are continuing to
work through the IETF process where it makes sense. For example, we are in the
process of registering our media types such as `application/schema+json` through
the HTTPAPIs WG. We are also looking into standardizing reusable components such
as Relative JSON Pointer through IETF.

## The bottom line

Details about the new process will be shared in a separate post when they are
finalized, but here are some outcomes users can expect.

* If you use only stable features, you are guaranteed interoperability between
  JSON Schema libraries and you will never need to update your schemas just for
  the sake of keeping up with new releases.
* You can safely use new features before they are stable, as long as the
  libraries consuming your schemas support the feature.
* Compatibility/Interoperability guarantees will only apply to the next release
  and beyond. You will need to update your schemas to the stable version, but
  you won't have to continue to update them as JSON Schema evolves.
* Custom dialects and vocabularies will continue to be central concepts for
  customizing and extending JSON Schema.
* Implementers won't need to maintain distinct code to support past stable
  releases. A library that supports the 2025 release will automatically support
  the 2023 and 2024 releases. The past stable releases will no longer need to be
  maintained as distinct versions. However, implementations that continue to
  support the "draft" releases would still need to maintain those as distinct
  versions from the current stable release.
