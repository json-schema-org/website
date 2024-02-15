---
title: "Understanding JSON Schema Lexical and Dynamic Scopes"
date: "2024-02-15"
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
keyword is independent of any other keywords, while the `additionalProperties`
keyword depends on the `properties` and `patternProperties` keywords defined in
the same schema object.

> If you want to learn more about keyword dependencies, check out the [Static
> Analysis of JSON Schema](schema-static-analysis) article by [Greg
> Dennis](https://www.linkedin.com/in/gregdennis/).

However, there is a small set of keywords whose evaluation depend on the
*scope* they are in. These keywords are `$ref`, `$dynamicRef`,
`unevaluatedItems`, and `unevaluatedProperties`. Additionally, there is also a
set of keywords that *affect* the scope they are declared in. These keywords
are `$id`, `$schema`, `$anchor`, and `$dynamicAnchor`.

JSON Schema defines two types of scopes for the purpose of URI resolution: the
*lexical scope* and the *dynamic scope*. Understanding how these scopes work is
essential for mastering some of the most advanced (and often confusing!)
features of JSON Schema, such as dynamic referencing.

Schema Resources
----------------

Before we jump into lexical and dynamic scopes, lets review some JSON Schema
fundamentals.

The `$id` keyword defines the URI of a
[schema](https://json-schema.org/learn/glossary#schema). While this keyword is
typically set at the top level, any
[subschema](https://json-schema.org/learn/glossary#subschema) may declare it to
distinguish itself with a different URI. For example, the following schema
defines 4 identifiers, some relative and some absolute:

![A JSON Schema with multiple identifiers](/img/posts/2024/understanding-lexical-dynamic-scopes/scopes-multiple-ids.webp)

[In JSON Schema
parlance](https://json-schema.org/draft/2020-12/json-schema-core#name-root-schema-and-subschemas-),
we say that the `$id` keyword introduces a new *schema resource*, and that the
top level schema resource is referred to as the *root schema resource*.

Consider the following example. This schema consists of 3 schema resources,
each highlighted using a different color: the root schema resource (red), the
schema resource at `/properties/foo` (blue), and the schema resource at
`/properties/bar` (green). Note that the subschema at `/properties/baz` is part
of the root schema resource, as it does not introduce a new identifier:

![A JSON Schema that consists of 3 schema resources](/img/posts/2024/understanding-lexical-dynamic-scopes/scopes-schema-resources.webp)

Note that children schema resources are not considered part of the parent
schema resource. For example, in the previous figure, `https://example.com/foo`
or `https://example.com/bar` are *separate* schema resources and not part of
the root schema resource, despite their structural relationship.

Schemas as Directed Graphs
--------------------------

JSON Schema is a recursive data structure. In the context of schema resources,
this means that a schema resource may introduce nested schema resources (like
we saw on the previous section) and use referencing keywords (like `$ref`) to
point to external schema resources, creating a directed graph of schema
resources. 

Consider the following example. In the top left, a root schema resource named
`https://example.com/origin` that declares a nested schema resource named
`https://example.com/nested` (at `/properties/bar`) and references an external
schema resource named `https://example.com/destination` (from
`/properties/foo/$ref`). In the bottom left, a root schema resource named
`https://example.com/destination` that references a nested schema resource
called `https://example.com/nested-string` (from `/items/$ref`). On the right,
a directed graph representation of the relationship between these schema
resources:

![Thinking of a JSON Schema as a directed graph](/img/posts/2024/understanding-lexical-dynamic-scopes/directed-graph.webp)

As you will see, thinking of a schema as a directed graph of schema resources
greatly helps in understanding both lexical and dynamic scopes.

Lexical Scope
-------------

Under the graph analogy from the previous section, the lexical scope of a
schema consists of the node being evaluated. In other words, the lexical scope
of a schema consists of the entire schema resource to which it belongs. 

Consider the following sequence of examples. On the left, a JSON Schema with a
single nested schema resource. On the right, the corresponding directed graph
representations for the root schema resource called
`https://example.com/person` and the nested schema resource called
`https://example.com/surname`. At each step of the evaluation process, we gray
out the parts of the schema and of the directed graph that are not part of the
lexical scope.

The evaluation process starts with the top level schema. The lexical scope at
that point is the root schema resource, and the nested schema resource is out
of scope. 

![The lexical scope of a JSON Schema (1)](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-1.webp)

Then, we enter the `properties` applicator, and if the instance defines a
`firstName` property, we get into the subschema at `/properties/firstName`.
This subschema is part of the root schema resource (as it does not declare its
own identifier), so the lexical scope remains the same as the previous step. 

![The lexical scope of a JSON Schema (2)](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-2.webp)

Finally, if the instance defines a `lastName` property, we follow the
`properties` applicator into the subschema at `/properties/lastName`. This
subschema defines a new schema resource, so the lexical scope at this point is
the nested schema resource, and the root schema resource is out of scope.

![The lexical scope of a JSON Schema (3)](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-3.webp)

Note that by definition, the lexical scope of any subschema can be statically
determined without taking
[instances](https://json-schema.org/learn/glossary#instance) into account, just
as we did here.

### Lexical Scope and Anchors

As another practical example, consider the `$anchor` keyword that defines a
[location-independent
identifier](https://json-schema.org/understanding-json-schema/structuring#dollaranchor)
for a schema. This keyword not only affects the schema object it is defined in,
but also its lexical scope. This is why declaring the same anchor identifier
more than once in the same schema resource is an error (a clash in the lexical
scope), while it is possible to declare the same anchor identifier on different
schema resources (as the lexical scopes are different):

![Example of anchors within and across lexical scopes](/img/posts/2024/understanding-lexical-dynamic-scopes/scopes-static-anchors.webp)

### Following References

When the evaluation process encounters a reference keyword, it *abandons* the
lexical scope of the reference schema and enters the lexical scope of the
*destination* schema.

If the reference points to a subschema *within* the same schema resource, the
lexical scope remains the same. Coming back to the graph analogy, each node
represents a schema resource, so the evaluation process remains at the same
node. However, if the reference points to a subschema on a *different* schema
resource, the schema resource of the destination becomes the new lexical scope.
In the graph analogy, the evaluation process *follows an arrow* to another
node.

#### Within Schema Resources

In the following example, the reference at `/items/$ref` points to
`/$defs/person-name`. The destination schema is part of the same schema
resource (the root schema resource), so the lexical scope remains the same:

![Lexical scope after following a reference within the same resource](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-ref-local.webp)

#### Across Schema Resources

Now consider the following sequence of examples. On the left, a JSON Schema
called `https://example.com/point-in-time` with a nested schema resource (at
`/$defs/timestamp`) and a reference to an external schema called
`https://example.com/epoch` (from `/anyOf/1/$ref`). On the right, the
corresponding directed graph representations of the root schema resource, the
nested schema resource, and the external schema resource. Like before, at each
step of the evaluation process, we gray out the parts of the schema and of the
directed graph that are not part of the lexical scope.

The evaluation process starts with the top level schema. The lexical scope at
that point is the root schema resource, and both the nested schema resource and
the external schema resource are out of scope: 

![Lexical scope after following a reference accross resources (1)](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-ref-remote-1.webp)

Then, we enter the first branch of the `anyOf` logic applicator and follow the
reference at `/anyOf/0/$ref` (highlighted in red) into `/$defs/timestamp`. This
subschema has its own identifier, so the lexical scope becomes the nested
schema resource and both the root schema resource and the external schema
resource go out of scope:

![Lexical scope after following a reference accross resources (2)](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-ref-remote-2.webp)

Finally, we go back to the root schema resource, enter the second branch of the
`anyOf` logic applicator, and follow the remote reference at `/anyOf/1/$ref`
(highlighted in red) into `https://example.com/epoch`. This external schema is
by definition a separate schema resource. Therefore, it becomes the new lexical
scope. This time, both the root schema resource and its nested schema resource
are out of scope:

![Lexical scope after following a reference accross resources (3)](/img/posts/2024/understanding-lexical-dynamic-scopes/lexical-scope-ref-remote-3.webp)

Dynamic Scope
-------------

To recap, the lexical scope of a schema consists of its enclosing schema
resource. In comparison, the dynamic scope of a schema consists of the stack of
schema resources evaluated so far. Coming back to our analogy of a schema as a
graph, the dynamic scope corresponds to the ordered sequence of nodes that were
visited by the evaluation process.

Consider the following sequence of examples. In the top left, a root schema
resource named `https://example.com/person` that declares two nested schema
resources: `https://example.com/name` (at `/properties/name`) and
`https://example.com/age` (at `/properties/age`). In the bottom left, an
example instance that successfully validates against the schema. Note that the
instance does not declare the `age` optional property. On the right, a directed
graph representation of the relationship between these schema resources.
Similar to how we did before, we gray out the parts of the schema and of the
directed graph that are not part of the dynamic scope.

The evaluation process starts with the top level schema. The dynamic scope at
that point is the root schema resource, and the nested schema resources are out
of scope. So far the lexical and dynamic scope align:

![The dynamic scope of a JSON Schema (1)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-1.webp)

Because the instance defines a `name` property, we enter the `properties`
applicator into the subschema at `/properties/name`. This subschema introduces
a new schema resource. Therefore, the dynamic scope now consists of *both* the
root schema resource and the nested schema resource called
`https://example.com/name`, in order:

![The dynamic scope of a JSON Schema (2)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-2.webp)

In comparison to the lexical scope, the dynamic scope of a schema cannot always
be statically determined, as the evaluation path often depends on the instance.
For example, for schemas that make use of logic applicator keywords such as
`if` or `oneOf`, the ordered sequence of schema resources in scope may vary
depending on the characteristics of the instance.

### Following References

So far, we've learned that for the lexical scope, following a reference consists of
abandoning the lexical scope of the origin schema and entering the lexical
scope of the destination schema. In comparison, for the dynamic scope,
following a reference to another schema resource involves *retaining* the
current dynamic scope and *pushing* the destination schema resource to the top
of the stack.

#### Within Schema Resources

Just like with the lexical scope, if a reference points to a subschema within
the same schema resource, the dynamic scope remains the same. In other words,
if the destination schema resource is the same as the schema resource at the
top of the stack, the dynamic scope is not modified. Therefore, until the
evaluation process encounters a reference to another schema resource (either
local or remote), *the lexical scope and the dynamic scope align*:

![Dynamic scope and lexical scopes sometimes align](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-internal-align.webp)

#### Across Schema Resources

Leaving the simple case behind, lets consider an example consisting of local
and remote references across schema resources. In the top left, an example
instance and a root schema resource named `https://example.com` that declares
two nested schema resources: `https://example.com/name` (at `/properties/name`)
and `https://example.com/person` (at `/$defs/person`) where the former
references the latter (from `/properties/name/$ref`). Furthermore,
`https://example.com/person` references an anchored schema called `item` (from
`/$defs/person/$ref`) that is part of an external schema resource called
`https://example.com/people` shown in the bottom left. On the right, a directed
graph representation of the relationship between these schema resources and the
dynamic scope.

Like the other examples so far, the evaluation process starts with the top
level schema. The dynamic scope at that point is the root schema resource, and
all other schema resources are out of scope:

![The dynamic scope and remote references (1)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-ref-remote-1.webp)

Because the instance defines a `name` property, we enter the `properties`
applicator into the subschema at `/properties/name`. This subschema introduces
a new schema resource. Therefore, the dynamic scope now consists of
`https://example.com` (the root schema resource) followed by
`https://example.com/name` (the nested schema resource at `/properties/name`):

![The dynamic scope and remote references (2)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-ref-remote-2.webp)

The `https://example.com/name` schema resource references the other nested
schema resource: `https://example.com/person`. After following this reference,
the dynamic scope now consists of `https://example.com` (the root schema
resource), followed by `https://example.com/name` (the nested schema resource
at `/properties/name`), followed by `https://example.com/person` (the nested
schema resource at `/$defs/person`):

![The dynamic scope and remote references (3)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-ref-remote-3.webp)

Now comes an interesting case. We are currently evaluating the nested schema
resource called `https://example.com/person`. This schema resource points to
the remote schema called `https://example.com/people` (the `people` part of the
`people#item` URI reference), but does not land at its root.  Instead, it lands
at the subschema in `/items` (where the `item` anchor from the `people#item`
URI reference is located). This subschema is part of the root schema resource,
so the dynamic scope now consists of `https://example.com` (the root schema
resource), followed by `https://example.com/name` (the nested schema resource
at `/properties/name`), followed by `https://example.com/person` (the nested
schema resource at `/$defs/person`), followed by `https://example.com/people`:

![The dynamic scope and remote references (4)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-ref-remote-4.webp)

### The Dynamic Scope as a Stack

At the beginning of this section, we said that the dynamic scope of a schema
consists of the stack of schema resources evaluated so far. However, our
examples so far only considered *pushing* schema resources to the top the of
stack. 

In traditional programming languages, program execution typically involves
procedures calling other procedures, creating what is referred to in Computer
Science as a [call stack](https://en.wikipedia.org/wiki/Call_stack).
Eventually, a procedure will not call any other procedures. When such leaf
procedures finish executing, the call stack will
[unwind](https://en.wikipedia.org/wiki/Call_stack#Unwinding) (a pop operation)
and control will return to the caller frame.

> If you are having trouble understanding the previous paragraph, you might
> enjoy watching [Call Stacks - CS50
> Shorts](https://www.youtube.com/watch?v=aCPkszeKRa4) by Harvard University.

The JSON Schema dynamic scope works in the same way. At some point, a schema
resource will not reference any other schema resource. Then, the dynamic scope
will unwind, popping the last schema resource from the stack.

Consider the following sequence of examples. In the top left, a root schema
resource named `https://example.com/integer` that makes use of the `if`,
`then`, and `else` logic applicators to check whether a positive integer is
even or odd and produce a corresponding `title` annotation. Note that each
subschema is a separate schema resource: `https://example.com/check` (at
`/if`), `https://example.com/even` (at `/then`), and `https://example.com/odd`
(at `/else`). In the bottom left, the even integer instance
[42](https://www.scientificamerican.com/article/for-math-fans-a-hitchhikers-guide-to-the-number-42/).
On the right, a directed graph representation of the relationship between these
schema resources and the dynamic scope.

As usual, the evaluation process starts with the top level schema. The dynamic
scope at that point is the root schema resource, and all other schema resources
are out of scope:

![The dynamic scope as a stack (1)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-pop-1.webp)

Next, we enter the `if` applicator that checks whether the integer instance is
even or odd. This subschema declares a new schema resource called
`https://example.com/check`, which is pushed onto the stack. Therefore the
dynamic scope consists of `https://example.com/integer` followed by
`https://example.com/check`:

![The dynamic scope as a stack (2)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-pop-2.webp)

The `https://example.com/check` nested schema resource does not reference any
other schema resource. When the evaluation process completes and determines
that the instance is an even integer, the stack unwinds, the
`https://example.com/check` schema resource is popped, and the evaluation
process *returns* to the root schema resource. Therefore the dynamic scope is
back to just `https://example.com/integer`:

![The dynamic scope as a stack (3)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-pop-3.webp)

Because the `if` subschema successfully validated the instance, we enter the
`then` applicator. This subschema declares a new schema resource called
`https://example.com/even`, which is pushed onto the stack. Therefore the
dynamic scope consists of `https://example.com/integer` followed by
`https://example.com/even`:

![The dynamic scope as a stack (4)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-pop-4.webp)

Like before, the `https://example.com/even` nested schema resource does not
reference any other schema resource. Therefore, the evaluation process returns
once more to the root schema resource, the dynamic scope is back to just
`https://example.com/integer`, and the evaluation process completes:

![The dynamic scope as a stack (5)](/img/posts/2024/understanding-lexical-dynamic-scopes/dynamic-scope-pop-5.webp)

Summary
-------

Understanding how static and dynamic scopes work is essential for gaining a
deeper understanding of JSON Schema. The most important points to remember are
summarized in the following table:

| Comparison Point                     | Lexical Scope | Dynamic Scope |
|--------------------------------------|---------------|---------------|
| **Definition**                       | Consists of the schema resource being evaluated | Consists of the stack of schema resources evaluated so far |
| **Determining the scope**            | Can be statically determined without taking instances into account | Cannot always be statically determined. It may vary depending on the instance |
| **Following references**             | Consists of abandoning the lexical scope of the origin schema and entering the lexical scope of the destination schema | Consists of pushing the destination schema resource to the top of the dynamic scope stack |

In a future post, we will build on top of the concepts introduced in this
article to demystify how dynamic referencing (`$dynamicRef` and
`$dynamicAnchor`) works.

If you enjoyed this content and want to put your JSON Schema skills into
practice in the data industry, check out my O'Reilly book: [Unifying Business,
Data, and Code: Designing Data Products using JSON
Schema](https://www.oreilly.com/library/view/unifying-business-data/9781098144999/).
You can also connect with me on
[LinkedIn](https://www.linkedin.com/in/jviotti/).

***

*Image by [Christina Morillo](https://www.pexels.com/@divinetechygirl/) from [Pexels](https://www.pexels.com/photo/man-standing-infront-of-white-board-1181345/).*
