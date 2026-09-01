---
title: "Testing JSON Schema's format Keyword Against the RFCs"
date: "2026-08-24"
tags:
  - News
type: Engineering
cover: /img/posts/2026/gsoc26-tushar/gsoc26-banner.png
authors:
  - name: Tushar Verma
    photo: /img/avatars/vtushar06.jpg
    link: https://github.com/vtushar06
    byline: GSoC 2026 Contributor @ JSON Schema
excerpt: "A GSoC 2026 project put every format keyword value against the RFC it's supposed to follow. 126 merged pull requests later, here is what was actually wrong, in how many real validators, and what it means for anyone relying on format."
---

JSON Schema's `format` keyword asserts that a string looks like an email address, an IPv6 address, a date, a URI, and so on. This year, [Google Summer of Code](https://summerofcode.withgoogle.com/) funded a project at JSON Schema to check whether that assertion is actually true - not against what implementations happen to do, but against the RFC each format value points at.

This is a report on what that testing found.

## Why format is hard to get right

The specification does not define what an email address or a URI looks like. It delegates to an RFC per format: `email` to [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321), `ipv6` to [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291), `duration` to the ABNF in [RFC 3339 Appendix A](https://www.rfc-editor.org/rfc/rfc3339), and so on across 18 formats. So `format` is really eighteen separate grammars sitting behind one keyword, each with its own edge cases, and none of them defined by JSON Schema itself.

The [JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) is the shared conformance baseline every implementation runs against. Before this project, its format coverage was thin relative to the other keywords - a handful of representative cases per format rather than a systematic pass over each grammar's boundaries. That gap matters beyond the suite itself: [sourcemeta/blaze](https://github.com/sourcemeta/blaze) defers `format` assertion by design, in part because there was no test corpus solid enough to implement against with confidence.

## Method

For each format:

1. Read the governing RFC and list every grammar production and boundary in it.
2. Build an input set that exercises those boundaries, including the places where two rules meet.
3. Run every input through real validators across languages - Python, JavaScript, C++, Ruby, PHP, Go, Rust, Java, and others depending on the format - and record every case where implementations disagree with each other or with the RFC.
4. For anything that survives, read the implementation's source to identify the actual mechanism causing the divergence, not just the symptom.

Step 4 is the one that matters. Two libraries disagreeing is easy to find. A test case only earns a place in the suite once you can point at the specific line in the RFC that settles the disagreement, and the specific line of code that gets it wrong.

## What the testing found

Across the 13 formats with published evidence, this method produced **270 documented findings against 29 JSON Schema validators** - cases where a real, in-use implementation gives a different verdict than its governing RFC. Most of these validators pass the entire existing published suite.

| validator | findings | formats affected |
|---|---:|---|
| [python-jsonschema](https://github.com/python-jsonschema/jsonschema) | 56 | email 25, relative-json-pointer 8, duration 7, uuid 6, idn-email 5, uri-reference 3, date-time 1, uri 1 |
| ata-validator | 27 | email 23, uri-reference 2, duration 1, uri 1 |
| [ajv-formats](https://github.com/ajv-validator/ajv-formats) | 24 | uri-reference 8, email 5, idn-email 4, date-time 3, uri 2, uuid 2 |
| tdegrunt/jsonschema | 16 | json-pointer 6, duration 4, email 4, uri 1, relative-json-pointer 1 |
| fastjsonschema | 13 | email 8, uri-reference 5 |
| @exodus/schemasafe | 12 | email 4, uri-reference 4, duration 2, uri 2 |
| [json-everything](https://github.com/gregsdennis/json-everything) | 11 | relative-json-pointer 11 |
| @cfworker/json-schema | 10 | email 4, duration 2, uri 2, uri-reference 1, uuid 1 |
| networknt | 10 | date-time 4, email 3, uri-reference 2, duration 1 |
| gojsonschema | 10 | email 5, uri-reference 3, ipv4 1, uuid 1 |
| Newtonsoft.Json.Schema | 9 | json-pointer 5, email 2, uuid 2 |
| justinrainbow/json-schema | 9 | uri-reference 6, email 3 |
| api7/jsonschema | 8 | email 6, ipv4 1, uuid 1 |
| opis/json-schema | 8 | relative-json-pointer 3, duration 2, email 2, uuid 1 |
| js-json-schema | 7 | uri-reference 5, email 2 |
| jsonschemafriend | 7 | email 4, relative-json-pointer 2, duration 1 |
| @swagger-api/apidom | 4 | relative-json-pointer 4 |
| clojure-json-schema | 4 | email 2, ipv4 1, json-pointer 1 |
| com.github.java-json-tools | 4 | ipv4 3, uuid 1 |
| santhosh-tekuri/jsonschema | 4 | uri-reference 3, email 1 |
| vscode-json-language-service | 4 | email 4 |
| Corvus.JsonSchema | 3 | email 2, relative-json-pointer 1 |
| @hyperjump/json-schema | 2 | relative-json-pointer 2 |
| JSON::Schema::Modern | 2 | uri-reference 2 |
| z-schema | 2 | uri-reference 2 |
| json-schema-library | 1 | uri-reference 1 |
| jsonschema-rs | 1 | duration 1 |
| openapiprocessor | 1 | uuid 1 |
| rust-boon | 1 | email 1 |

A note on what those numbers are: they count documented findings in the [evidence repository](https://github.com/vtushar06/JSON-Schema-format-test-Evidence), not failing suite tests. Several findings collapse into a single test case, and inputs where the RFC is ambiguous - leading zeros in `ipv4`, the leap-second month-end - are excluded entirely rather than counted against anyone. `sourcemeta/core` does not appear because across all 13 formats it was the faithful reference, with its only two non-conforming readings both being open specification questions rather than defects.

A separate group sits underneath this table: another 28 libraries that are not JSON Schema validators but that validators delegate to - C's `inet_aton`, Java's Guava, the WHATWG URL parser, ICU4J, GNU libidn2, Python's `email.utils.parseaddr`, Go's `net/mail`, the Rust and Python `idna` crates. Several of the rows above are inherited from these rather than written by the validator authors.

The findings are not spread evenly, and the reason is more interesting than the count. python-jsonschema accounts for the largest single share, because its `format` checkers delegate to third-party libraries - `isoduration`, `rfc3339-validator`, `rfc3987`, `jsonpointer` - each of which implements a grammar slightly different from the RFC the JSON Schema specification actually points at. One delegation choice then produces divergences across several formats at once.

A second recurring mechanism is anchoring. A regex that is correct in shape but ends in `$`, or omits the end anchor entirely, will accept a trailing newline or trailing junk: `jsonschemafriend` (Java `$` matching before a final line terminator), `opis/json-schema` (missing end anchor) and `tdegrunt/jsonschema` (no anchors at all, so any string *containing* a valid value passes) all fail this way, in three different languages, for the same underlying reason.

What the table shows overall is that this is not a story about one bad library. Twenty-nine validators, in ten languages, each got something wrong - and the two mechanisms above account for a large share of it. `email` and `uri-reference` are the worst affected, which makes sense: they have the largest grammars and the most places to go wrong.

Most findings belong in the test suite rather than in a bug tracker: a shared conformance test is the right way to communicate "this input has this verdict" to every implementation at once, and many cases are places where the RFC is ambiguous rather than where a library is broken. Nine were different - reproducible defects with an identifiable cause, worth reporting directly:

- **sourcemeta/core**: [`is_regex_ecma` over-rejections](https://github.com/sourcemeta/core/issues/2757) on valid Unicode property escapes and large quantifier counts, [malformed IPv6 literals accepted](https://github.com/sourcemeta/core/issues/2742) through a fallthrough branch, [uppercase-Punycode A-labels wrongly rejected](https://github.com/sourcemeta/core/issues/2741), a [valid RFC 1123 hostname rejected](https://github.com/sourcemeta/core/issues/2520), and four RFC 3986 URI defects ([#2331](https://github.com/sourcemeta/core/issues/2331), [#2319](https://github.com/sourcemeta/core/issues/2319), [#2318](https://github.com/sourcemeta/core/issues/2318), [#2317](https://github.com/sourcemeta/core/issues/2317))
- **python-jsonschema**: an [uncaught `ValueError` crash](https://github.com/python-jsonschema/jsonschema/issues/1558) on conflicting regex inline flags, and an [uncaught `decimal.Overflow` crash](https://github.com/python-jsonschema/jsonschema/issues/1511) on a duration with a large exponent

All nine were merged or accepted by their respective maintainers.

### One example, worked through

`Kelvin.example.com` is a hostname. Its first character is not the letter K - it's U+212A, the KELVIN SIGN, the unit symbol for temperature, which Unicode encodes separately from the letter it resembles.

RFC 1123 hostnames are ASCII, so this string is invalid. `ajv` and `sourcemeta/core` both reject it correctly. `python-jsonschema` accepts it, because its hostname checker calls `.lower()` on the string before running the hostname regex, and Python's `.lower()` maps U+212A to a plain ASCII `k`. The regex is correct; by the time it runs, the non-ASCII character is already gone.

That single mechanism - case-folding before validation instead of after - turned out to open the door for 643 distinct non-ASCII codepoints through this one checker, via three separate paths. The Kelvin sign is now a published test case: [suite#1024](https://github.com/json-schema-org/JSON-Schema-Test-Suite/pull/1024).

## What it means for the suite, in numbers

The clearest single measure is the published test suite itself. Comparing the `format` test files at the start of the coding period against their state now:

![Published format tests, before and after GSoC 2026 - a bar chart per format showing the test count before the project against the test count after](/img/posts/2026/gsoc26-tushar/format-growth-chart.png)

Published `format` tests across the 19 formats tracked grew from **618 to 838** over the project - a net addition of 220 tests, essentially all of it landing through this project's pull requests. `duration`, `idn-email`, and the `regex` dialect tests had close to no dedicated coverage before this and now have a real baseline. `email` alone more than doubled, from 27 to 71. One format, `json-pointer`, needed no additions at all - its existing coverage held up against the same testing everything else went through.

The work also landed in a second repository. The project was mentored by [Juan Cruz Viotti](https://github.com/jviotti), who maintains [sourcemeta/core](https://github.com/sourcemeta/core) - the C++ library behind [Blaze](https://github.com/sourcemeta/blaze) - so a large part of the effort went into building out its `format` support and test coverage alongside the suite itself. That pairing was useful in both directions: the suite defined what correct behaviour is, and implementing it against a real validator immediately exposed the cases where the definition was underspecified.

Total delivered across both repositories:

| | merged | in review |
|---|---:|---:|
| [JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) | **103** | 7 |
| [sourcemeta/core](https://github.com/sourcemeta/core) | **23** | 0 |
| **total** | **126** | **7** |

`regex` (ECMA-262 dialect validity) was added to the project's scope partway through, alongside the 18 formats already in the specification - which is why it appears in the totals despite starting from close to nothing.

## What is still open

Two format questions remain unresolved and are waiting on maintainer rulings rather than more testing: whether the ECMA-262 regex dialect tests should include the Annex B / Unicode-mode-dependent cases, and how the `idn-hostname` / `idn-email` tests should target IDNA profile differences per dialect ([suite#1132](https://github.com/json-schema-org/JSON-Schema-Test-Suite/issues/1132)). Seven pull requests are still in review, mostly `time` coverage.

The larger point the numbers support: `format` was under-tested primarily because nobody had gone through the exercise of treating each format as its own specification and checking real implementations against it end to end. Once that exercise happened, every format examined turned up at least one real, shipping validator getting something wrong. The [evidence repository](https://github.com/vtushar06/JSON-Schema-format-test-Evidence) has the full input-by-input detail, with reproduction commands, for anyone who wants to check a specific case or extend the method to a format not covered here.
