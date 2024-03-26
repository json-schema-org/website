---
title: "Introducing: Bowtie"
date: "2022-11-16"
tags:
  - Update
  - News
  - validation
type: Engineering
cover: /img/posts/2022/bowtie-intro/cover.webp
authors:
  - name: Julian Berman
    photo: /img/avatars/julian.webp
    twitter: JulianWasTaken
    byline: JSON Schema Test Suite Maintainer & Technical Lead, API Specifications @Postman
excerpt: "A new tool for executing JSON Schema implementations & a call to help improve it"
---

*This is the first in what will hopefully be an intermittent series on Bowtie.
I speak here without speaking on behalf of the JSON Schema organization in any official capacity -- Bowtie isn't a tool we The JSON Schema Team are "blessing" in some way today, though I have personal hopes it becomes a sort of official tool, and have developed it intending it to be owned by "the community" in whatever sense that means.
For the moment, I speak only on behalf of myself as its author :)*

The JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "string",
  "maxLength": 3
}
```

validates strings of length at most 3.
This behavior is what the specification says *should* happen.
Does every *implementation* of the specification, across the wide spectrum of programming languages, properly *follow* the specification?
What about for other more complicated schema / instance pairs?
This is the key question Bowtie tries to address -- how can we compare behavioral differences between JSON Schema implementations and between the specification, in the hopes that we make it easier to fix implementation issues and clarify any unclear portions of the specification?

## What It Is

[Bowtie](https://github.com/bowtie-json-schema/bowtie/) is what I'm calling a "meta-validator", by which I mean a program which can execute *other* JSON Schema validation implementations and collect results from them.

There's prior art in doing this sort of thing.
The [JSONPath Comparison project](https://cburgmer.github.io/json-path-comparison/) does this extremely well for [JSONPath](https://github.com/ietf-wg-jsonpath/draft-ietf-jsonpath-base), and [Nicolas Seriot's "Parsing JSON is a Minefield"](https://seriot.ch/projects/parsing_json.html) is a fantastic example for JSON itself.
Bowtie attempts to bring these ideas to JSON Schema.

From the existing [list of JSON Schema implementations](https://json-schema.org/implementations.html#validators), Bowtie already [supports](https://github.com/orgs/bowtie-json-schema/packages) *12* implementations across *9* programming languages, allowing anyone to run any of these implementations and see what they have to say about schemas and instances.

It ships with a [command line program](https://docs.bowtie.report/en/stable/cli/) but perhaps more excitingly, ongoing automated runs of this CLI have been set up, such that Bowtie emits a [report across all of its supported implementations](https://bowtie.report).

To produce this report, Bowtie runs the [official JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite), which is our existing set of tests meant to exercise compliance with the JSON Schema specifications.
Many implementations already [use the suite within their own continuous integration](https://github.com/json-schema-org/JSON-Schema-Test-Suite#who-uses-the-test-suite), but this is the first time both users of JSON Schema as well as implementers can see results of running the suite in a single place, across many implementations.
The test suite already has great coverage of our specifications (specifically the validation portions of them).
The suite certainly isn't perfect, but Bowtie's results therefore cover the validation specification really well.

## Why It Might Be Interesting

The most noticeable thing Bowtie enables is an easy way to compare how close an implementation follows the specification.
This gives transparency to users of implementations, and also to the community about areas which might be hard to implement, or are commonly misimplemented.
Our hope is that this leads to improvement and energy to help fix issues, and overall to a stronger community!

Even beyond the test suite, Bowtie is capable of providing a uniform interface to the implementations it supports, meaning you can quickly access results from each one without needing to learn the language-specific API each implementation offers.
If you have a schema and instance and want to run it across many implementations, or a single implementation which you're not already familiar with or don't have set up, Bowtie can help.

## How Do I Run It?

If you're just interested in its output (i.e. reports on runs of the test suite), you can currently find them at the following links, corresponding to each version of the specification:

* [draft2020-12](https://bowtie.report/#/dialects/draft2020-12)
* [draft2019-09](https://bowtie.report/#/dialects/draft2019-09)
* [draft7](https://bowtie.report/#/dialects/draft7)
* [draft6](https://bowtie.report/#/dialects/draft6)
* [draft4](https://bowtie.report/#/dialects/draft4)
* [draft3](https://bowtie.report/#/dialects/draft3)

The medium-term goal is to combine these onto one unified report (at which point the links may change, though hopefully we'll put a redirect in place).

If you want to go beyond the test suite reports, you can run Bowtie locally as well, on whatever input you'd like.
Bowtie is written in Python and published [on PyPI](https://pypi.org/project/bowtie-json-schema/).
If you have no existing preferred setup for installing Python applications, [install `pipx` using the platform-specific instructions for your OS](https://pipx.pypa.io/stable/), then run:

```sh
$ pipx install bowtie-json-schema
```

which should give you a working Bowtie, which you can check via:

```sh
$ bowtie --help
```

The usage instructions are in [Bowtie's documentation](https://bowtie-json-schema.readthedocs.io/), but more documentation is definitely needed, so do ping myself (Julian) if there are things you can't figure out, it will motivate documenting them.

## How Does It Work?

I won't go into full details of Bowtie's implementation in this post, but at a high level, Bowtie is a command-line program written in Python which orchestrates spinning up and down OCI containers ("Docker containers" in a loose sense).
The containers it runs are "test harnesses" -- little bridge programs which take an implementation of JSON Schema, written in any programming language, and then allow incoming requests from Bowtie to call into the library under test.
Adding support for an implementation essentially means implementing a test harness in this fashion (which is generally simple to do), and once the harness is present, the implementation will light up in Bowtie's reports, and any user of Bowtie will be able to execute the implementation via Bowtie's uniform CLI.

## How to Help

There are two areas you (a user of JSON Schema, author of an implementation, or community member) can help with:

### Improving Implementations

The first and most obvious is by helping to take any issues uncovered by Bowtie back to implementations (after confirming them), and then helping implementations fix them.

Find your favorite JSON Schema implementations and the tests it fails.
Are there existing open issues on the implementation's bug tracker about the failures?
If they aren't previously known, an issue ticket (with minimal reproducer) is likely going to be welcome by the implementer, so you may want to file one.
If they *are* known, you can file a pull request in Bowtie which contains information about the downstream issue, which Bowtie can make use of in reports (by showing that the test is explicitly skipped).
Here's an [example pull request](https://github.com/bowtie-json-schema/bowtie/pull/73) showing how to do so.

Look out for [Bowtie-generated badges](https://github.com/bowtie-json-schema/bowtie/issues/55) in the near future which you can use to show off your spec-compliance (nothing could be cooler, eh?).

### Improving Bowtie

The second is by helping to improve Bowtie itself, which I already have a long list of ideas for, which can only grow as more people start to use it.

To repeat part of the above, I myself have implemented support for [many implementations](https://github.com/bowtie-json-schema/bowtie/tree/main/implementations).
If you maintain or use one, look at the harness I wrote -- it's possible I misused your implementation (though so far thankfully hasn't happened).

I'll also mention that I've been experimenting with doing work on Bowtie on [livestreams here](https://www.twitch.tv/julianberman) -- without too much self-promotion, feel free to stop by and say hello, or even to flip through previous streams where I fight with various Bowtie-adjacent things, it may give you some pointers on how to work on it.

Below is some specific guidance around areas in need of help:

*This is current as of the publication of this post, but my hopes are that it swiftly becomes out of date. If it seems to be, feel free to reach out!*

#### Give Me Something Easy to Get My Feet Wet

There's a list of [good first issues](https://github.com/bowtie-json-schema/bowtie/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) on Bowtie's issue tracker which I've attempted to curate.
They cover various portions of Bowtie's codebase (the Python bits, the frontend bits, and its surrounding infrastructure).
The label doesn't indicate that the issue is necessarily "small" to fix, though many are.
But it does indicate the relevant functionality or fix is "straightforward" or likely well-scoped.
If you don't see activity on one, feel free to leave a comment if you begin to work on it.

#### I Want to Learn About a New Implementation or Programming Language

This is possibly the most "fun" thing to work on, or at least I quite enjoyed doing it.
Pick an implementation Bowtie doesn't already support from the [list of implementations](https://json-schema.org/implementations.html#validators) and follow the [tutorial for writing a harness](https://bowtie-json-schema.readthedocs.io/en/latest/implementers/) which will guide you through what Bowtie expects from a harness.
If there are gaps in the tutorial, do raise them or ping me!
But this can be a nice way to play with a simple program in a language you haven't used before, as well as a way to learn a JSON Schema implementation which may have made different choices than one you're already familiar with.

#### The Report is Ugly, I'm a Frontend Developer or UI Designer Who Can Help

This is probably the most beneficial area you can help in.
I myself am not a frontend developer, in case that wasn't obvious.
What I put together (with Bootstrap) is essentially the bare minimum of what's needed to show off results Bowtie emits.
If you have more experience or headspace to think about how to effectively report test results, or compare implementations, please help!
All of Bowtie's "frontend code" today lives in one place, [a Jinja2 template which gets formatted into a static single page site](https://github.com/bowtie-json-schema/bowtie/blob/b23644eb86cf9bcbdf1d98149cf3d976339f7cdf/bowtie/templates/report.html.j2).
Beyond generally "make it prettier, more responsive, or more usable", here are a few specific issues to look at:

* [Add client-side filtering and sorting](https://github.com/bowtie-json-schema/bowtie/issues/37)
* [Show combined errors+failures counts](https://github.com/bowtie-json-schema/bowtie/issues/53), or more generally improve the summary from a "table of counts" into a more graphically pleasing representation of what happened in a run
* [Display schemas & instances more prettily](https://github.com/bowtie-json-schema/bowtie/issues/28), or more generally, design a good widget or component for representing test cases, their schemas, instances, and (sub)tests
* [Show average compliance numbers](https://github.com/bowtie-json-schema/bowtie/issues/54), or more generally, what summary statistics *across* implementations should we show, and how should we show them?

#### I Develop Other Tooling in the JSON Schema Ecosystem

Great!
I have hopes Bowtie may hook in well with other upstream or downstream tooling.
As a concrete example, given that Bowtie provides uniform interfaces to downstream implementations, an "obvious" complimentary tool might be to fuzz-test across *all* implementations, looking for cases they disagree, or blow up, or more generally produce behavior non-compliant with the specification which isn't already covered by an explicit test in the suite.
Doing this likely simply means hooking such a tool up to Bowtie and letting it rip.
See [this issue](https://github.com/bowtie-json-schema/bowtie/issues/23) though it doesn't contain much beyond the above in the way of detail.

Other tools may also have nice interactive properties when combined with Bowtie, so if you have other ideas, reach out, or try it!

#### I Want to Contribute Tests

This is definitely also helpful.
If they're tests of the specification itself, check whether they're already present in the official suite, and if not, do submit them there.
If they're *not* tests that the official suite covers today, e.g. because they cover pathological cases like causing implementations to "blow up" rather than produce a result, they are now "fair game" to add (somewhere, TBD where), because Bowtie can "gently" run implementations and catch these sorts of errors.
Bowtie also allows for a wider range of `$ref`-related testing, because its protocol specifically instruments harnesses with a sort of "registry" of schemas that the implementation is expected to be able to reference.
[This issue](https://github.com/bowtie-json-schema/bowtie/issues/61) is the relevant one, but ideas are welcome here on kinds of tests we can now add.

#### I Found a Bug, or Have an Idea for Bowtie Itself

If it's with an implementation, you likely should take it to the implementation's issue tracker.
Please be polite, as there's still a small but non-zero chance that issues are caused by Bowtie itself.
And even if there isn't, please do be kind to maintainers, many (including myself!) are already aware of issues Bowtie is flagging and may really want to fix them but have things which make doing so difficult.
Help out implementations if you can!

If it's with Bowtie itself, or is a new idea related to Bowtie, definitely [file an issue](https://github.com/bowtie-json-schema/bowtie/issues), [start a discussion](https://github.com/bowtie-json-schema/bowtie/discussions), or start a thread on the JSON Schema Slack.

#### I Want to Do Something Random and Cool

There are some funky ideas in this bin, even already.
I would love to figure out whether we can make use of Bowtie to *benchmark* implementations uniformly, rather than just test them.
Being able to [jump into a language-specific REPL](https://github.com/bowtie-json-schema/bowtie/issues/38) is also a kind of out-there idea but one which might be fun to play with.
There likely are many others!

#### Setting Up Bowtie Was Hard But I Figured It Out / I Want to Help With CI, "Infrastructure" or Triaging

These are all under-appreciated areas you can help with, so please do reach out if you're interested in anything here.
Even something like making Bowtie easier to install for those who don't use Python is a nice help!
(Right now, builds produce a `shiv`, but not a cross-platform one.)

## Conclusion

Thanks for taking the time to hear a bit about Bowtie.
Special thanks also must be given to [Postman](https://www.postman.com/) who employs me full-time to be able to do work like this on behalf of the community.
Without Postman, this work would never have happened!
I hope there's a lot more to come.
Please do share feedback, it's very welcome, and if you do want to get involved, that'd be very much appreciated!

Cover photo generated via Stable Diffusion.
