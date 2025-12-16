---
title: "How .txt makes LLM outputs reliable with JSON Schema"
date: "2025-12-16"
type: Case Study
cover: /img/posts/2025/dottxt-case-study/banner.webp
authors:
  - name: Remi Louf 
    photo: /img/avatars/remilouf.webp
    link: https://www.dottxt.ai 
    byline: CEO and cofounder at .txt 
excerpt: "Learn how JSON Schema is used to make large language models reliable"
---

Organizations are racing to integrate Large Language Models into everything from customer service chatbots to complex data processing pipelines. But behind every successful implementation lies a frustrating truth: **getting reliable, structured output from LLMs is still remarkably hard.** What is even harder is generating JSON objects that are valid against a given JSON Schema.

From our interviews with engineering teams, we have learned that up to 50% of the time spent integrating LLMs into legacy infrastructure is spent on a single problem: wrangling unpredictable outputs into the format, typically JSON, that downstream systems expect.

While LLMs excel at understanding nuanced requests, they are fundamentally probabilistic text generators. Ask them for JSON, and you might get valid JSON 95% of the time. But that remaining 5%—where the model hallucinates a field or misses a closing brace—can bring an entire data pipeline to a halt.

[**.txt**](https://dottxt.co) was built to solve this universal pain point, ensuring that LLM outputs conform to your specifications 100% of the time. Here is how we leverage JSON Schema to turn probabilistic models into deterministic engines.

## When Flexibility Becomes a Liability

Real-world applications don't need creative prose; they need structured data that adheres to specific schemas. A healthcare system needs FHIR-compliant resources. An e-commerce platform needs product catalogs in a precise JSON format. Application layers, database schemas, and API contracts demand a rigid structure. 

Teams have tried various approaches to bridge this gap, each with significant drawbacks:

**Prompt Engineering:** Developers craft elaborate instructions, provide examples, and use XML tags or formatting tricks to coax LLMs into generating valid output. This approach is fragile—it works differently across models, breaks when prompts change, and offers no guarantees. A prompt that works perfectly with GPT-4 might fail catastrophically with Claude or Llama.

**Post-Processing and Parsing:** The standard fallback is to parse LLM output after generation, extracting JSON from markdown code blocks, fixing malformed structures, or validating against schemas. This fails when the model hallucinates fields, misinterprets data types, or makes subtle formatting errors.

**Retry Loops:** When validation fails, many systems simply retry—regenerating output and hoping for better results. This approach is expensive (multiplying API costs), slow (adding seconds or minutes to response times), and unreliable (no guarantee of eventual success).

## The Solution: Constrained Generation with JSON Schema

Instead of generating text and *then* validating it, we constrain the generation process to produce only **valid outputs**.

At the heart of this approach is a simple but powerful idea: **JSON Schema should be the single source of truth for output structure.** You define your schema once, and .txt uses it to ensure compliant output.

It makes invalid outputs impossible.

### Token-Level Control: How It Works

The mechanism operates at the most granular level of LLM generation: individual tokens (strings of characters. At each step, the model chooses one token to generate). Here's how .txt achieves guaranteed schema compliance:

**1\. Schema Analysis:** When you provide a JSON Schema, .txt parses it to understand the structure you need—the required properties, their types, acceptable values, and constraints. It builds an internal representation of all valid paths through your schema.

**2\. Real-Time Token Filtering:** At each step of generation, the LLM produces a probability distribution over possible next tokens. .txt analyzes this distribution in the context of what's been generated so far and what the schema requires next. Tokens that would violate the schema are filtered out before sampling occurs.

For example, if your schema requires a `user` object with a `name` string field, and the LLM has just generated `{"user": {"name":` , [.txt](https://dottxt.ai) knows the next token must begin a string value. Tokens that would start an object, array, number, or boolean are simply not considered. The LLM is forced to choose from valid continuations only.

### Why JSON Schema Constraint Is Technically Hard

Constraining LLM generation to match a JSON Schema is far more complex than it might initially appear. It isn't a single computational problem; it is a collection of features that span the [**Chomsky Hierarchy**](https://en.wikipedia.org/wiki/Chomsky_hierarchy) of computational complexity.

To support the full spec, we have to solve challenges at three distinct levels:

**Regular Features:** Some JSON Schema constraints can be enforced using relatively simple finite-state machines. Basic type checking (is this a string, number, or boolean?), `enum` constraints (is this value in an allowed set?), and simple string patterns are *regular* in the formal language theory sense. These can be validated by looking at individual tokens or short sequences without tracking complex state.

**Context-Free Features:** The core structure of JSON itself—nested objects and arrays with balanced braces and brackets—is context-free. This requires maintaining a stack to track nesting depth and ensure proper structure closure. 

**Context-Sensitive Features:** Here's where it gets genuinely difficult. Many JSON Schema features are context-sensitive or even more complex:

* **`dependencies` and `dependentSchemas`:** The validity of one property can depend on the presence or value of another property in the same object, requiring tracking of sibling properties.  
* **`if`/`then`/`else` conditionals:** The schema rules that apply can change based on data already generated, requiring dynamic schema selection.  
* **`uniqueItems` in arrays:** Ensuring array elements are unique requires remembering all previously generated elements—context that can grow arbitrarily large.

**Why This Matters:** At each token in the generation process, .txt must determine which tokens are valid by solving this multi-level computational problem in *microseconds*. The naive approach—generating tokens and checking validity after each one—would be prohibitively slow. .txt's implementation uses carefully designed data structures and algorithms to make these checks efficient enough for real-time generation. Still, the underlying computational complexity is what makes JSON Schema constraints a genuinely hard problem.

This is why most "structured output" solutions fall back to simpler approaches like post-generation validation or support only a subset of JSON Schema features. Full JSON Schema support at generation time requires solving problems across the entire complexity hierarchy—from regular expressions to context-sensitive parsing—simultaneously and efficiently.

## The Impact

### Benefits


- **Latency Reduction:** Eliminating retry loops dramatically reduces response times. For user-facing applications, this transforms the experience.  
- **Cost Savings:** Every retry is a wasted API call.

**Developer Experience Transformation**

Beyond metrics, [.tx](https://dottxt.ai)t changes how developers work with LLMs:

**Schema-First Development:** Define your data structure once in JSON Schema—the same schema you're probably already using for API validation or database models.

**Elimination of Parsing Code:** No more regex-based JSON extraction from markdown blocks. No brittle string manipulation to fix malformed output. No complex error recovery logic. The output is always valid, so your code becomes dramatically simpler.

**Better Testing and Validation:** When outputs are guaranteed to match your schema, testing focuses on semantic correctness (did the LLM extract the right information?) rather than format validation (is this valid JSON with the right fields?). Your test suite becomes smaller, faster, and more meaningful.

## Looking Forward

### Roadmap: Complete JSON Schema Compliance

While .txt already supports the most commonly used JSON Schema features of the 2020-12 draft, we're committed to achieving full compliance with the JSON Schema specification by working closely with the JSON Schema community. In particular, we are currently working on supporting context-sensitive features (`uniqueItems`, `dependentRequired`, `if/else`) that are not supported anywhere else.

### Strengthening the JSON Schema Ecosystem

Structured generation with large language models represents a novel use case for JSON Schema—not just for validating existing data, but also for guiding the creation of new data.

We are committed to ensuring that schemas designed for generation work consistently with schemas designed for validation. We look forward to sharing patterns and best practices with the JSON Schema ecosystem to help formalize requirements for generation-time schema usage.

We're grateful to the JSON Schema community for their support and collaboration in bringing reliable structured outputs to the LLM ecosystem. Together, we're building a future where:

* **Schemas serve as universal contracts** across validation and generation
* **Integration is measured in hours**, not weeks
* **100% reliability is the norm**, not the exception

Whether you are building AI agents, data pipelines, or healthcare interoperability solutions, JSON Schema provides the contract, and [.txt](https://dottxt.ai) ensures the LLM respects it.
