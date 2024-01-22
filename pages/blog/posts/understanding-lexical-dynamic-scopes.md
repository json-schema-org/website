---
title: "Understanding JSON Schema Lexical and Dynamic Scopes"
date: "2024-01-19"
tags:
  - Fundamentals
  - Scopes
type: Engineering
cover: /img/posts/2024/understanding-lexical-dynamic-scopes/cover.webp
authors:
  - name: Juan Cruz Viotti
    photo: /img/avatars/jviotti.webp
    link: https://www.jviotti.com
    byline: O'Reilly author, founder of Intelligence.AI and Sourcemeta
excerpt: "A deep dive on lexical and dynamic scopes, essential for understanding more advanced topics like dynamic referencing"
---

Most of the [keywords](https://json-schema.org/learn/glossary#keyword) defined
by the JSON Schema organization can be either evaluated on their own, or by
only considering the values of their adjacent keywords. For example, the `type`
keyword is independent of any other keywords, while the `minContains` and
`maxContains` keywords depend on the `contains` keyword defined in the same
schema object.

> If you want to learn more about keyword dependencies, check out the [Static
> Analysis of JSON Schema](schema-static-analysis) article by [Greg
> Dennis](https://www.linkedin.com/in/gregdennis/).

However, there is a small set of keywords whose evaluation depend on the
*scope* they are in. These keywords are `$ref`, `$dynamicRef`,
`unevaluatedItems`, and `unevaluatedProperties`. Additionally, there is also a
set of keywords that *affect* the scope they are declared in. These keywords
are `$id`, `$schema`, `$anchor`, and `$dynamicAnchor`.

JSON Schema defines two types of scopes: the *lexical scope* and the *dynamic
scope*. Understanding how these scopes work is essential for mastering some of
the most advanced (and often confusing!) features of JSON Schema, such as
dynamic referencing.

Lexical Scope
-------------

JSON Schema is a circular data structure. What we mean by this is that as a
schema author, you may use *applicator* keywords that take other
[schemas](https://json-schema.org/learn/glossary#schema) as arguments,
effectively creating a tree of schemas. 

Consider the following example. On the left, a JSON Schema consisting of 7
[subschemas](https://json-schema.org/learn/glossary#subschema) (declared using
the `properties` and `prefixItems` applicators). On the right, a tree
representation of the schema, where each subschema corresponds to a node in the
tree:

![Thinking of a JSON Schema as a tree structure](/img/posts/2024/understanding-lexical-dynamic-scopes/tree.webp)

Thinking of a schema as a tree structure greatly helps in understanding lexical
scopes. Under this analogy, the lexical scope of a schema consists of the
*ancestors* of such node, including the node itself. In other words, the
lexical scope of a schema consists of its parent schemas including the schema
itself, but not its subschemas.

Referring back to our previous example, the lexical scope of the subschema at
`/properties/bar/prefixItems/0` (highlighted in red) consists of the set of its
parent schemas. The subschemas that are not part of its lexical scope have been
grayed out:

![The lexical scope of a JSON Schema represented as a tree structure](/img/posts/2024/understanding-lexical-dynamic-scopes/ancestor.webp)

In comparison to the dynamic scope, the lexical scope of any subschema can be
statically determined without taking
[instances](https://json-schema.org/learn/glossary#instance) into account, just
as we did here.

### The Schema Resource Boundary

The `$id` keyword defines the URI of a schema. While this keyword is typically
set at the top level, any subschema may declare it to distinguish itself with a
different URI. For example, the following schema defines 4 identifiers, some
relative and some absolute:

![A JSON Schema with multiple identifiers](/img/posts/2024/understanding-lexical-dynamic-scopes/multiple-ids.webp)

[In JSON Schema
parlance](https://json-schema.org/draft/2020-12/json-schema-core#name-root-schema-and-subschemas-),
we say that the `$id` keyword introduces a new *schema resource*, and that the
top level schema resource is referred to as the *root schema resource*.

Consider the following example of schema resources. This schema consists of 3
schema resources, each highlighted using a different color: the root schema
resource (red), the schema resource at `/properties/foo` (blue), and the schema
resource at `/properties/bar` (green). Note that the subschema at
`/properties/baz` is part of the root schema resource:

![A JSON Schema that consists of 3 schema resources](/img/posts/2024/understanding-lexical-dynamic-scopes/schema-resources.webp)

Going back to scopes, <i>an important rule to remember is that the lexical
scope of a schema does not extend past its schema resource</i>.

As an example of the relationship between schema resources and lexical scopes,
consider the `$anchor` keyword that defines a [location-independent
identifier](https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.2)
for a schema. While declaring the same anchor identifier more than once in the
same schema resource is an error, it is possible to declare the same anchor
identifier on different schema resources within the same schema. This is
possible because *schema resources do not share their lexical scopes*:

![Defining multiple anchors with the same name on different schema resources](/img/posts/2024/understanding-lexical-dynamic-scopes/static-anchors.webp)

### Changing Scopes With References

Now that we understand lexical scopes and their boundaries within schema
resources, lets consider the effect that following references has on them.
<i>When evaluation encounters a reference keyword, it abandons the lexical
scope of the reference schema and enters the lexical scope of the destination
schema</i>. In other words, the evaluation process needs to re-calculate the
lexical scope of the schema it ends up at after following the reference.

Consider the following example. On the left, the lexical scope of a subschema
that defines a static reference. On the right, the lexical scope of the
destination subschema after following such reference. Note that the destination
is part of a different schema resource, under a different
[meta-schema](https://json-schema.org/learn/glossary#meta-schema). The change
of lexical scope lets the destination schema be governed, as expected, by its
own meta-schema instead of by the meta-schema of the root schema resource:

![Lexical scope before and after following a static reference](/img/posts/2024/understanding-lexical-dynamic-scopes/ref.webp)

As an interesting scenario, note that the root schema resource is not
necessarily in the lexical scope of the first subschema that the evaluation
process will visit. Consider a remote reference that points to a nested schema
resource. In this case, the evaluation process jumps to the lexical scope of
the destination schema resource, which may not include the root schema
resource. For example:

![Following a remote reference to a nested schema resource](/img/posts/2024/understanding-lexical-dynamic-scopes/ref-anchor.webp)

Dynamic Scope
-------------

To recap, the lexical scope of a schema consists of the schema itself and its
corresponding parent schemas within the same schema resource. In comparison,
the *dynamic* scope of a schema consists of the subschemas that were *evaluated so far*, 
including the schema itself, regardless of the schema resource they
belong to.

Coming back to our analogy of a JSON Schema as a tree structure, the dynamic
scope corresponds to the sequence of nodes that were visited by the evaluation
process. In JSON Schema parlance, this is referred to as the *evaluation path*.

Consider the following example. On the left, a JSON Schema and a matching JSON
instance with a single object property `bar`. On the right, the evaluation path
on the JSON Schema tree representation for validating the JSON instance,
following schema references accordingly:

![A tree representation of the JSON Schema evaluation
path](/img/posts/2024/understanding-lexical-dynamic-scopes/evaluation-path.webp)

In comparison to the lexical scope, the dynamic scope of a schema cannot always
be statically determined. For example, for schemas that make use of logic
applicator keywords such as `if` or `oneOf`, the evaluation path may vary
depending on the instance. In the previous example, the evaluation path would
also vary if the instance document declared a `foo` property.

### Lexical and Dynamic Scopes Sometimes Align

When leaving references aside, schema evaluation is always top down. For
example, consider a schema that defines subschemas through the use of
applicator keywords. First, the schema is evaluated, and only then its
subschemas are considered:

![A visual representation of top down schema evaluation](/img/posts/2024/understanding-lexical-dynamic-scopes/evaluation-top-down.webp)

In the simple case where a schema is (1) evaluated from the top level, (2)
consists of a single schema resource, and (3) does not make use of reference
keywords (like `$ref` or `$dynamicRef`), the lexical and dynamic scopes of its
subschemas are the same. 

In the following example, the lexical and dynamic scopes for the subschema
highlighted in red align:

![A simple example where lexical and dynamic scopes align](/img/posts/2024/understanding-lexical-dynamic-scopes/aligned.webp)

### References and the Evaluation Path

References are the only exception to top down evaluation. By definition,
references (both static and dynamic) make the evaluation process break from
this mode by *jumping* to another location (as we saw in the evaluation path
figure at the beginning of the Dynamic Scope section). As a consequence, when
the evaluation process encounters a reference, lexical scopes and dynamic
scopes will typically diverge.

To recap, for the lexical scope, following a reference involves abandoning the
lexical scope of the reference schema and entering the lexical scope of the
destination schema. In comparison, for the dynamic scope, <i>following a
reference involves retaining the current dynamic scope, and adding the
destination schema to it</i>.

Consider the following example of a schema that follows a reference to an
anchor. On the left, the lexical scope of the destination schema (highlighted
in red), consists of it parent schema (highlighted in green), and its
grandparent schema (highlighted in blue). However, on the right, the dynamic
scope of the destination schema (highlighted in red) consists of the schema
that referenced the anchor (highlighted in green) and the schema that led to
the evaluation of such reference (highlighted in blue):

![Comparison of lexical scope and dynamic scope with a reference](/img/posts/2024/understanding-lexical-dynamic-scopes/references-dynamic.webp)

### Beyond Schema Resource Boundaries

In comparison to the lexical scope, the dynamic scope of a schema is not
limited by its schema resource. Moreover, the dynamic scope is a singleton
entity that remains for the entirety of the evaluation process. In other words,
the dynamic scope *is* the complete evaluation path.

Consider a variation of the previous example, where this time the anchor is
within a subschema of a different schema resource. The lexical scope of the
destination schema drastically changes as it hits its schema resource barrier,
whereas the dynamic scope of the destination schema remains the same:

![Comparison of lexical scope and dynamic scope through schema resources](/img/posts/2024/understanding-lexical-dynamic-scopes/references-dynamic-resource.webp)

Finally, note that the dynamic scope not only persists through local references
to other schema resources, but across remote references as well.

Summary
-------

Understanding how static and dynamic scopes work is essential for gaining a
deeper understanding of JSON Schema. The most important points to remember are
summarized in the following table:

| Comparison Point                     | Lexical Scope | Dynamic Scope |
|--------------------------------------|---------------|---------------|
| **Definition**                       | Consists of the parent schemas including the schema itself, but not its subschemas | Consists of the subschemas that were evaluated so far, including the schema itself, but not its subschemas |
| **Determining the scope**            | Can be statically determined without taking instances into account | Cannot be always statically determined. It may vary depending on the instance |
| **Following references**             | Consists in abandoning the lexical scope of the reference schema and entering the lexical scope of the destination schema | Consists in retaining the current dynamic scope and adding the destination schema to it |
| **Relationship to schema resources** | Does not extend past the schema resource | Remains across schema resources, both through locally and remote references |

In a future post, we will build on top of the concepts introduced in this
article to demystify how dynamic referencing (`$dynamicRef` and
`$dynamicAnchor`) works.

If you enjoyed this content and want to put your JSON Schema skills into
practice in the data industry, check out my upcoming O'Reilly book: [Unifying
Business, Data, and Code: Designing Data Products using JSON
Schema](https://www.oreilly.com/library/view/unifying-business-data/9781098144999/).
You can also connect with me on
[LinkedIn](https://www.linkedin.com/in/jviotti/).

***

*Image by [Christina Morillo](https://www.pexels.com/@divinetechygirl/) from [Pexels](https://www.pexels.com/photo/man-standing-infront-of-white-board-1181345/).*
