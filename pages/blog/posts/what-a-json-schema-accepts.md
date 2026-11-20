---
title: "What a JSON Schema accepts isn't always what it meant"
date: '2026-11-18'
tags:
  - Engineering
  - validation
type: Engineering
cover: /img/posts/2026/what-a-json-schema-accepts/cover.webp
authors:
  - name: Simin Yuan
    photo: /img/avatars/simin-yuan.webp
    link: https://github.com/simin-yuan
    byline: Independent researcher
excerpt: "A validation run that comes back clean says less than it looks like. Mutation testing two corpora, and what a schema's silence costs."
language: en
---

A validation run comes back clean, and I want to know what a clean result meant. Two very different situations produce the same empty error list: the document was written the way its author intended, or the schema never asked about the part that went wrong.

The question matters more than it used to. The same schema that filters a document is now handed to code generators and LLM structured-output features as a description of what to produce, and whatever it leaves open, a generator can fill and still pass.

So I started testing the second situation on purpose. The tool is [greencheck](https://github.com/simin-yuan/greencheck). It takes an input that passes, breaks it in ways an editor might: deletes a line, blanks a value, shifts one character in a string. Then it runs the broken version through the same gate the schema owner ships. If the broken version passes too, the schema had nothing to say about that position.

The edits are deliberately simple. If one of them slips through, someone typing in a hurry will eventually produce the same thing.

## Starting with the schemas people already ship

38 schemas from [SchemaStore](https://www.schemastore.org), each with a real instance file beside it. 1,791 mutants could be judged, and 1,382 of them came back through the gate with no complaint. That is 77%.

My first guess was that the escapes would cluster around validators I could name: one engine missing a keyword, another reading a format differently. They turned out duller than that. Most of them landed on positions the schema never asked about. A string property with no length or pattern takes an empty string, and an object that never mentions extra keys takes any key you add. Nothing was broken in the validator.

To check that this was more than a schema-level effect, I took 85 deletion mutants from the config files of five real tools, [eslint](https://eslint.org) and [jshint](https://jshint.com) among them, and fed them to those tools directly. The schema let 83 of them through, and the tools accepted all 83.

One escaped mutant blanked the version string in a package.json. The schema accepted the empty string; npm would not pack it:

```
npm error Invalid package, must have name and version
```

That one is repaired. SchemaStore's package.json schema now rejects an empty version string ([schemastore#6421](https://github.com/SchemaStore/schemastore/pull/6421)), with a negative test added next to it.

## The second sample, where silence costs more

The first sample is all Draft 7 and mostly hand-written, one instance per schema. It says nothing about descriptions generated from code, so I went looking there.

20 OpenAPI 3.0 descriptions drawn from the [APIs.guru](https://apis.guru) directory, up to five examples each, with the descriptions' own example values as seeds. Keeping the seeds inside the document matters: every mutant is an edit to something the author already put in front of a reader. Every mutant went through [sourcemeta/jsonschema](https://github.com/sourcemeta/jsonschema)'s `validate --entrypoint`. Of the 545 mutants that could be judged, 304 passed. A little over half of the things I broke came back clean.

Two results I did not expect.

Four of the examples do not validate against the schema shipped beside them. They are plain type mismatches: a string where an array was wanted, an object where a string was wanted, and two nulls where a string was wanted. The rule built for this case, `valid_example` ([sourcemeta/jsonschema#926](https://github.com/sourcemeta/jsonschema/pull/926)), shipped in 17.3.3, and it reports all four. In that same settings schema from [VTEX](https://vtex.com), an e-commerce platform, it also reports two property-level examples I had not counted, so the run reports six, and all six are real mismatches.

And two of the 20 documents were never judged at all. The CLI refused to read them: each repeats a templated path in its Paths Object, which OAS 3.0 forbids. A tool that only reads `/components/schemas` never reaches that layer, so both documents would look fine to it.

## Where the silence is

The finding I keep coming back to is small. Across the 20 documents there are 41 `allOf` compositions, and they point at 11 distinct base schemas. All 11 declare `properties`. None of the 11 says anything about unknown keys.

A reader who meets an object validated against one of those bases cannot tell whether extra keys are welcome. Composition exists to share a base between shapes, and the base is exactly where a shared decision about extra keys belongs. The text of an intended opening and the text of an omission are identical here.

## Three things to do this week

If you maintain a schema, three cheap moves.

Say it when you mean it. Where a position is meant to be open, write that down, and write `additionalProperties` explicitly wherever the dialect allows it. Leaving `additionalProperties` out behaves like `true`, and nothing in the text says whether anyone chose that. A base schema that others extend is the hard case: from 2019-09 on, an explicit `additionalProperties: true` on the base gets in the way of `unevaluatedProperties` in the schema that composes it, so the place that should state the intent is the one place that cannot.

Keep a few examples that must fail. A check that has never failed tells you nothing about what it is checking, and two or three negative tests per schema show whether a constraint can fire at all.

Validate your examples against their own schemas. Readers treat examples as documentation, and four of the ones I looked at could not pass. Any validator can run this check, and the sourcemeta/jsonschema linter now has a rule for it, `valid_example`.

## What I am trying

Where an author means a position to be open and leaves it unwritten, as those 11 base schemas do, nothing marks the difference. So I drafted two keywords in my own repository that say it in place: `x-open-object` for an object whose extra keys are welcome, and `x-open-value` for a position where any value will do. They are not part of the JSON Schema specification, no validator needs to know them, and a schema can adopt them one node at a time. The draft, with the questions I have not settled, lives in [docs/intent-annotations.md](https://github.com/simin-yuan/greencheck/blob/main/docs/intent-annotations.md).

Two caveats on the numbers above. Each schema in the first sample contributes a single instance, so its per-schema rates rest on one file. And many mutants die at the parser, so every rate here describes what line-level edits can reach; boundary values, added keys and type substitutions would need different operators.

Everything above reproduces from the repository:

```
git clone https://github.com/simin-yuan/greencheck
cd greencheck && ./studies/reproduce.sh
```

Here is the question I cannot answer alone. In your schemas, which positions are open on purpose, and how do you tell a reader that? I would like to hear how other people handle it, in the JSON Schema Slack or as an issue on the greencheck repository.

*Simin Yuan is an independent researcher. More at [github.com/simin-yuan](https://github.com/simin-yuan).*
