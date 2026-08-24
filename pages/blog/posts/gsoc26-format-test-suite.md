---
title: "Nine Months, One Format at a Time: My Google Summer of Code with JSON Schema"
date: "2026-08-24"
tags:
  - News
type: Community
cover: /img/posts/2026/gsoc26-tushar/contributor-spotlight.png
authors:
  - name: Tushar Verma
    photo: /img/avatars/vtushar06.jpg
    link: https://github.com/vtushar06
    byline: GSoC 2026 Contributor @ JSON Schema
excerpt: "How a LinkedIn post in July 2025 turned into 121 merged pull requests across the JSON Schema Test Suite and sourcemeta/core, and everything that happened in between."
---

Before anything else, I want to start where this actually started, which is with gratitude. All glory to God, who never left me in any phase of my life. I worked hard this year. I have never once thought that hard work by itself is what opens a door.

Now the rest of it.

## A LinkedIn post in July

I found out what Google Summer of Code was from a LinkedIn post in July 2025. That is the whole origin story. I was in my first year at [NST ADYPU](https://nst.adypu.edu.in/), mostly heads-down on academics, poking at competitive programming and web development on the side without much direction.

A friend told me I should stop spreading myself thin and point everything at GSoC. So I did.

The thing nobody tells you is that July is the right time to start, and almost nobody does. Applications do not open until March. Most people begin thinking about it in February, which means they are trying to build a relationship with an organization in four weeks. I had eight months.

## Ten organizations, and one that did not work out

I did not pick an org by vibes. I shortlisted around ten, opened their repositories, and read them.

What I was actually looking for was not the tech stack. It was whether the community was alive. Were people talking? Did maintainers reply to issues, or did threads die? Could someone new walk in and find something to do? A repository with 20k stars and a dead Discord is a worse bet than a smaller project where a maintainer answers you the same day.

My first attempt was [Learning Equality](https://learningequality.org/). The org selected me. Google did not give final approval, so the slot did not happen. That was a bad week.

I moved to [JSON Schema](https://json-schema.org/). Part of that was strategy - activity was lower in July, which meant fewer people competing for maintainer attention. But the honest reason I stayed was the community channel. People were solving real problems in it, in public, and when I showed up and said I wanted to help, someone gave me an issue instead of a link to CONTRIBUTING.md.

I fixed it. Then I asked for another one.

## The Paris conference website

The first real work I did for JSON Schema had nothing to do with schemas. It was UI and UX issues on the website for the [JSON Schema Conference in Paris](https://conference.json-schema.org/). I worked on it from September to December 2025 - mostly frontend, some backend.

The reviewer on most of that work had done GSoC with the same organization the year before, and he did not treat me like a stranger passing through. He explained why a change was wrong instead of just closing it.

Four months of website tickets is not a glamorous way to spend the run-up to GSoC. It is, as far as I can tell, the entire reason the rest of this worked. Somewhere in there the organization put me in a contributor spotlight, which was the first sign that anyone had noticed.

![JSON Schema contributor spotlight](/img/posts/2026/gsoc26-tushar/contributor-spotlight.png)

## 6 January

On 6 January - which happens to be my birthday - the organization reached out and made me a triage member.

That changed the job. I was not asking for issues anymore, I was labelling them. I was reading other people's pull requests and deciding whether they were ready. I started seeing the project from the side that has to live with the decisions, which is a completely different view from the one you get as a contributor pushing a patch.

It also meant my GitHub profile stopped growing the way it had been. Reviewing someone else's PR does not show up as a green square.

## The doubt, and the person who cleared it

By the time applications opened I had somewhere around fifteen pull requests to my name. Fifteen. I had seen people talk about hundreds.

I took it to [Onyedikachi Hope Amaechi-Okorie](https://github.com/Honyii), the organization's Technical Community Advocate, and asked her directly whether a low PR count would hurt me.

Her answer was that maintainers are contributors too, and that selection has never been a counting exercise. Organizations are looking at whether you understand the project and whether they want to work with you for three months. A person who has reviewed forty PRs knows the codebase better than a person who has merged forty typo fixes.

She was right, and I would not have believed it from anyone who was not inside the org. That conversation is the reason I applied with what I actually had instead of padding it.

Honyii checked in on me repeatedly over those months without ever being asked to. If you are reading this and you are new somewhere, find the person in the community whose job is people. They are usually the most useful person in the room and the least likely to be thanked.

## The proposal

My proposal was not a research document. It was a description of work I had already started.

I knew the codebase. I knew which parts of the test suite were thin and why. I could name the specific gap - `format` validation had almost no systematic test coverage against the RFCs the specification points at - because I had gone looking and found the hole myself.

That is the whole trick. A proposal written from outside a project reads like a plan. A proposal written from inside it reads like a continuation. Reviewers can tell the difference immediately.

## The call

I did not check the results. I was asleep.

A friend called and woke me up to tell me I had gotten in. My father's reaction was completely neutral - he told me not to talk about it until it was properly confirmed, which is very much my father. My mother was thrilled.

![GSoC 2026 acceptance email](/img/posts/2026/gsoc26-tushar/acceptance-email.png)

The letter put the dates in writing: 25 May to 24 August 2026, roughly 350 hours, JSON Schema.

## What the project actually was

Here is the problem in plain terms.

JSON Schema has a keyword called `format`. It says a string should look like an email address, or an IPv6 address, or a date, or a URI. The specification does not define what those look like - it points at an RFC for each one. `ipv4` points at RFC 2673. `hostname` points at RFC 1123. `duration` points at the ABNF in RFC 3339 Appendix A.

So `format` is really eighteen separate specifications wearing one keyword.

The [JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) is the shared conformance baseline. Every implementation in every language runs against it to prove it behaves correctly. For most keywords that suite is thorough. For `format` it was thin - a handful of obvious cases per format, and almost nothing testing the actual edges of the grammars the RFCs define.

That gap has a real cost. [Blaze](https://github.com/sourcemeta/blaze) defers `format` assertion by design, and one reason is that there was no trustworthy test corpus to implement against. Validators could not agree because nothing was checking whether they agreed.

My job was to close that.

## How I actually found things

The method was the same for every format, and it was not clever:

1. Read the governing RFC. Not a summary of it, the actual text. List every production in the grammar and every boundary in it.
2. Build an input set that hits every one of those boundaries, plus the places where two rules meet.
3. Run all of it through real validators in several languages at once - Python, JavaScript, C++, Ruby, PHP, Go, Rust - and record every input where they disagree with each other or with the RFC.
4. For anything that survives, go read the implementation's source and work out *why* it diverges. A test case is only worth adding if you can explain the mechanism behind it.

Step four is what separates a useful test from noise. Anyone can find two libraries that disagree. The test only earns its place in the suite if you can say which one is wrong and point at the sentence in the RFC that settles it.

I learned that the hard way. Early on I filed a bug against a library claiming it should reject an uppercase letter in an IPvFuture address. I had quoted the RFC from memory. RFC 3986 section 3.2.2 says the host component is case-insensitive, and RFC 5234 section 2.3 says ABNF string literals are case-insensitive to begin with. The bug was wrong, publicly, on someone else's repository.

After that I made a rule: fetch the RFC and read the sentence before making any claim. It cost me time on every single finding. It also meant that for the rest of the summer, when I said something was a bug, it was a bug.

## One example: the Kelvin sign

My favourite finding is a hostname.

```
Kelvin.example.com
```

That looks like an ordinary hostname. The first character is not a capital K. It is U+212A, the KELVIN SIGN - the unit symbol for temperature, which Unicode encodes separately from the letter K.

RFC 1123 hostnames are ASCII. So this string is invalid, and [ajv](https://ajv.js.org/) and [sourcemeta/core](https://github.com/sourcemeta/core) both reject it correctly.

[python-jsonschema](https://github.com/python-jsonschema/jsonschema) accepts it.

The reason is a single line of ordering. The checker calls `.lower()` on the string before running it through the hostname regex - and Python's `.lower()` maps U+212A to a plain ASCII `k`. By the time the regex sees the string, the non-ASCII character is gone. The regex is correct. It is just being handed already-laundered input.

Once I understood that mechanism I went looking for the rest of it, and found 643 non-ASCII codepoints that get through the same checker by three separate routes. Setting the regex to ASCII mode fixes 642 of them and leaves Kelvin standing, which is exactly why Kelvin is the one that became the test case.

It is now in the suite as [#1024](https://github.com/json-schema-org/JSON-Schema-Test-Suite/pull/1024).

![GSoC 2026 midterm evaluation passed](/img/posts/2026/gsoc26-tushar/midterm-evaluation.png)

## The numbers

By the end of the coding period:

- **98 pull requests merged** into the [JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite), with 12 still in review
- **23 pull requests merged** into [sourcemeta/core](https://github.com/sourcemeta/core), the C++ library behind Blaze
- **121 merged pull requests** in total
- **18 formats** worked through against their governing RFCs
- bug reports filed upstream against [python-jsonschema](https://github.com/python-jsonschema/jsonschema), [ajv-formats](https://github.com/ajv-validator/ajv-formats), sourcemeta/core and several others

The per-format evidence - every input, the RFC verdict, which implementations diverge and why, with reproduction commands - is published at [JSON-Schema-format-test-Evidence](https://github.com/vtushar06/JSON-Schema-format-test-Evidence).

None of that is the number I care about most, though.

## The last pull request

Two weeks ago [Karen Etheridge](https://github.com/karenetheridge) opened [an issue](https://github.com/json-schema-org/JSON-Schema-Test-Suite/issues/1130) about whitespace inconsistencies across the test files. My mentor [Juan Cruz Viotti](https://github.com/jviotti) tagged me on it and asked if I would take a pass over the repository.

That is a small thing. It is also the entire point. In July 2025 I was a person asking for an issue to work on. In August 2026 a maintainer looked at a problem and routed it to me without being asked to.

I surveyed all 130 format files, found the actual violation was narrow - two files using two-space indentation where the repository standard is four - fixed those and left the rest alone, because the pattern that looked wrong everywhere else turned out to be deliberate house style. That PR, [#1146](https://github.com/json-schema-org/JSON-Schema-Test-Suite/pull/1146), merged this morning.

I would rather have that than another fifty test cases.

## What I would tell you

Two things, and neither is about code.

**Start before it makes sense to start.** Everything good that happened here traces back to four months of website tickets in late 2025 that had nothing to do with my eventual project. I was not building a portfolio. I was becoming a person the maintainers recognised.

**Read the actual specification.** Not the blog post about it, not the Stack Overflow answer, not your memory of it. The RFC. Almost every interesting bug I found this summer was hiding in a sentence that everybody skims.

And then just keep going. Nine months, mostly unglamorous, mostly small. No week of this was heroic. Consistency turned out to be the whole strategy - not because I was disciplined, but because I stayed somewhere long enough for the work to compound.

The program officially ends today, on the exact date the acceptance letter said it would. The work does not. There are twelve pull requests still in review, a format question still waiting on a maintainer ruling, and a repository I now have write access to.

I opened this by saying God never left me in any phase. I meant the specific ones. The org that selected me and then fell through. The bug I filed that was wrong, in public, on someone else's repository. The stretch of weeks where nothing merged and I could not tell whether I was making progress or quietly wasting a summer. Those were the phases, and I was not carrying any of them by myself.

All glory to God. See you in the next pull request.

---

## References

**Repositories**
- [json-schema-org/JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite)
- [sourcemeta/core](https://github.com/sourcemeta/core)
- [sourcemeta/blaze](https://github.com/sourcemeta/blaze)
- [Format evidence repository](https://github.com/vtushar06/JSON-Schema-format-test-Evidence)

**Project**
- [Issue #965 - Comprehensive Test Suite for Format Validation](https://github.com/json-schema-org/community/issues/965)

**Specifications**
- [RFC 1123 - Requirements for Internet Hosts](https://www.rfc-editor.org/rfc/rfc1123) (`hostname`)
- [RFC 3339 - Date and Time on the Internet](https://www.rfc-editor.org/rfc/rfc3339) (`date`, `time`, `date-time`, `duration`)
- [RFC 3986 - Uniform Resource Identifier](https://www.rfc-editor.org/rfc/rfc3986) (`uri`, `uri-reference`)
- [RFC 3987 - Internationalized Resource Identifiers](https://www.rfc-editor.org/rfc/rfc3987) (`iri`, `iri-reference`)
- [RFC 4291 - IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291) (`ipv6`)
- [RFC 5234 - ABNF](https://www.rfc-editor.org/rfc/rfc5234)
- [RFC 5321 - Simple Mail Transfer Protocol](https://www.rfc-editor.org/rfc/rfc5321) (`email`)
- [RFC 6531 - SMTP Extension for Internationalized Email](https://www.rfc-editor.org/rfc/rfc6531) (`idn-email`)
- [RFC 6570 - URI Template](https://www.rfc-editor.org/rfc/rfc6570) (`uri-template`)
- [RFC 6901 - JavaScript Object Notation Pointer](https://www.rfc-editor.org/rfc/rfc6901) (`json-pointer`)
- [RFC 9562 - Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562) (`uuid`)

**People**
- [Juan Cruz Viotti](https://github.com/jviotti) - mentor
- [Jason Desrosiers](https://github.com/jdesrosiers) - co-mentor
- [Onyedikachi Hope Amaechi-Okorie](https://github.com/Honyii) - Technical Community Advocate
- [Jagpreet Singh Rahi](https://github.com/jagpreetrahi) - GSoC 2025, JSON Schema
