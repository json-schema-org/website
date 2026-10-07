---
title: "How JSON Schema makes LLM output reliable"
date: "2025-12-16"
type: Case Study
cover: /img/posts/2025/dottxt-case-study/json-schema-txt-banner.png
authors:
  - name: Remi Louf
    photo: /img/avatars/remi-louf.jpg
    link: https://www.dottxt.ai
    byline: CEO and cofounder at .txt
excerpt: "How JSON Schema became the contract that turns probabilistic LLMs into deterministic engines"
---

Organizations are racing to integrate Large Language Models into everything from customer service chatbots to complex data processing pipelines. But behind every successful implementation lies a frustrating truth: **getting reliable, structured output from LLMs is still remarkably hard.** What is even harder is generating JSON objects that are valid against a given JSON Schema.

From our interviews with engineering teams, we have learned that up to 50% of the time spent integrating LLMs into legacy infrastructure is spent on a single problem: wrangling unpredictable outputs into the format, typically JSON, that downstream systems expect.

While LLMs excel at understanding nuanced requests, they are fundamentally probabilistic text generators. Ask them for JSON, and you might get valid JSON 95% of the time. But that remaining 5%, where the model hallucinates a field or misses a closing brace, can bring an entire data pipeline to a halt.

The answer turned out to be a standard teams already had on the shelf. JSON Schema is the contract engineers reach for to *validate* data and it is expressive enough to do something it was never originally designed for: **constrain how that data gets generated in the first place.** That single insight is what lets us turn a probabilistic model into a deterministic engine. At [**.txt**](https://dottxt.ai) we built our generation engine around it, and this is the story of how JSON Schema makes that possible.

## A new use case for an old contract

For years, JSON Schema has done one job extremely well: given a document, decide whether it conforms. Structured generation flips the arrow. Instead of checking data *after* it exists, the schema now guides data *into* existence, token by token, so that the only documents a model can produce are the ones the schema would have accepted anyway.

It is the same artifact serving both directions. The schema your team already wrote for API validation or database models becomes the single source of truth for generation too. No second format, no drift between what you validate and what you produce.

## When Flexibility Becomes a Liability

Real-world applications don't need creative prose; they need structured data that adheres to specific schemas. A healthcare system needs FHIR-compliant resources. An e-commerce platform needs product catalogs in a precise JSON format. Application layers, database schemas, and API contracts demand a rigid structure.

Teams have tried various approaches to bridge this gap, each with significant drawbacks:

**Prompt Engineering:** Developers craft elaborate instructions, provide examples, and use XML tags or formatting tricks to coax LLMs into generating valid output. This approach is fragile: it works differently across models, breaks when prompts change, and offers no guarantees. A prompt that works perfectly with GPT-4 might fail catastrophically with Claude or Llama.

**Post-Processing and Parsing:** The standard fallback is to parse LLM output after generation, extracting JSON from markdown code blocks, fixing malformed structures, or validating against schemas. This fails when the model hallucinates fields, misinterprets data types, or makes subtle formatting errors.

**Retry Loops:** When validation fails, many systems simply retry, regenerating output and hoping for better results. This approach is expensive (multiplying API costs), slow (adding seconds or minutes to response times), and unreliable (no guarantee of eventual success).

What every one of these approaches has in common is that the schema only enters the picture *after* the model has spoken. The reframe is to let the schema speak first.

## Constrained Generation: Letting the Schema Lead

Instead of generating text and *then* validating it, the generation process is constrained to produce only **valid outputs**.

At the heart of this approach is a simple but powerful idea: **JSON Schema is the single source of truth for output structure.** You define your schema once, and it drives the generation, making invalid outputs impossible rather than merely detectable.

### Token-Level Control: How It Works

The mechanism operates at the most granular level of LLM generation: individual tokens (strings of characters; at each step, the model chooses one token to generate). Here's how a JSON Schema is turned into a guarantee:

**1\. Schema Analysis:** The JSON Schema is parsed to understand the structure it describes: the required properties, their types, acceptable values, and constraints. From this, .txt builds an internal representation of every valid path the schema allows.

**2\. Real-Time Token Filtering:** At each step of generation, the LLM produces a probability distribution over possible next tokens. .txt checks this distribution against what the schema permits next, given everything generated so far. Tokens that would violate the schema are filtered out before sampling occurs.

For example, if your schema requires a `user` object with a `name` string field, and the LLM has just generated `{"user": {"name":`, the schema dictates that the next token must begin a string value. Tokens that would start an object, array, number, or boolean are simply not considered. The model is left to choose only among continuations the schema would accept.

### How Much JSON Schema Actually Asks Of You

Honoring a JSON Schema at generation time is far more demanding than it might initially appear and that difficulty is a measure of how much expressive power the specification carries. JSON Schema is not a single computational problem; its features span the [**Chomsky Hierarchy**](https://en.wikipedia.org/wiki/Chomsky_hierarchy) of computational complexity.

Supporting the full spec means meeting the language at three distinct levels:

**Regular Features:** Some JSON Schema constraints can be enforced using relatively simple finite-state machines. Basic type checking (is this a string, number, or boolean?), `enum` constraints (is this value in an allowed set?), and simple string patterns are *regular* in the formal language theory sense. These can be validated by looking at individual tokens or short sequences without tracking complex state.

**Context-Free Features:** The core structure of JSON itself, nested objects and arrays with balanced braces and brackets, is context-free. This requires maintaining a stack to track nesting depth and ensure proper structure closure.

**Context-Sensitive Features:** Here's where it gets genuinely difficult. Many JSON Schema features are context-sensitive or even more complex:

* **`dependencies` and `dependentSchemas`:** The validity of one property can depend on the presence or value of another property in the same object, requiring tracking of sibling properties.
* **`if`/`then`/`else` conditionals:** The schema rules that apply can change based on data already generated, requiring dynamic schema selection.
* **`uniqueItems` in arrays:** Ensuring array elements are unique requires remembering all previously generated elements, a context that can grow arbitrarily large.

**What This Reveals:** The fact that JSON Schema reaches from regular patterns all the way to context-sensitive constraints is exactly what makes it a serious contract—rich enough to describe the data real systems depend on. The engineering consequence is that honoring all of it at generation time means solving this multi-level problem at every token, in *microseconds*. The naive approach, generating tokens and checking validity after each one, would be prohibitively slow, so .txt uses carefully designed data structures and algorithms to keep these checks fast enough for real-time generation.

This expressive range is also why most "structured output" solutions support only a subset of the specification or fall back to post-generation validation. Honoring JSON Schema in full, at generation time, means meeting the language across its entire complexity hierarchy efficiently, from regular expressions to context-sensitive parsing.

## The Impact

When the schema leads generation, the benefits land directly on the teams that adopt it:

- **Latency Reduction:** Eliminating retry loops dramatically reduces response times. For user-facing applications, this transforms the experience.
- **Cost Savings:** Every retry is a wasted API call, and constrained generation removes them entirely.

Beyond the metrics, treating the schema as the contract changes how developers work with LLMs:

**Schema-First Development:** Define your data structure once in JSON Schema, the same schema you're probably already using for API validation or database models, and reuse it to drive generation.

**Elimination of Parsing Code:** No more regex-based JSON extraction from markdown blocks. No brittle string manipulation to fix malformed output. No complex error recovery logic. The output is always valid against the schema, so your code becomes dramatically simpler.

**Better Testing and Validation:** When outputs are guaranteed to match your schema, testing focuses on semantic correctness (did the LLM extract the right information?) rather than format validation (is this valid JSON with the right fields?). Your test suite becomes smaller, faster, and more meaningful.

## Looking Forward

### Roadmap: Complete JSON Schema Compliance

.txt already supports the most commonly used JSON Schema features of the 2020-12 draft, and we're committed to achieving full compliance with the specification by working closely with the JSON Schema community. In particular, we are currently working on the context-sensitive features (`uniqueItems`, `dependentRequired`, `if`/`else`) that are not supported at generation time anywhere else.

### Strengthening the JSON Schema Ecosystem

Structured generation represents a novel use case for JSON Schema. Not just validating existing data, but guiding the creation of new data. We think this is a meaningful expansion of what the specification is for, and we want to see it formalized.

We are committed to ensuring that schemas designed for generation behave consistently with schemas designed for validation, and we look forward to sharing patterns and best practices with the JSON Schema ecosystem to help define what generation-time schema usage should mean.

We're grateful to the JSON Schema community for their support and collaboration in bringing reliable structured outputs to the LLM ecosystem. Together, we're building a future where:

* **Schemas serve as universal contracts** across validation and generation
* **Integration is measured in hours**, not weeks
* **100% reliability is the norm**, not the exception

Whether you are building AI agents, data pipelines, or healthcare interoperability solutions, JSON Schema provides the contract. Structured generation is how the LLM is held to it.
