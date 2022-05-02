::: {.index}
single: \$schema
:::

Declaring a Dialect
===================

::: {.contents}

local

:   
:::

A version of JSON Schema is called a dialect. A dialect represents the
set of keywords and semantics that can be used to evaluate a schema.
Each JSON Schema release is a new dialect of JSON Schema. JSON Schema
provides a way for you to declare which dialect a schema conforms to and
provides ways to describe your own custom dialects.

::: {.index}
single: \$schema single: schema; keyword
:::

\$schema
--------

The `$schema` keyword is used to declare which dialect of JSON Schema
the schema was written for. The value of the `$schema` keyword is also
the identifier for a schema that can be used to verify that the schema
is valid according to the dialect `$schema` identifies. A schema that
describes another schema is called a \"meta-schema\".

`$schema` applies to the entire document and must be at the root level.
It does not apply to externally referenced (`$ref`, `$dynamicRef`)
documents. Those schemas need to declare their own `$schema`.

If `$schema` is not used, an implementation might allow you to specify a
value externally or it might make assumptions about which specification
version should be used to evaluate the schema. It\'s recommended that
all JSON Schemas have a `$schema` keyword to communicate to readers and
tooling which specification version is intended. Therefore most of the
time, you\'ll want this at the root of your schema:

    "$schema": "https://json-schema.org/draft/2020-12/schema"

::: {.index}
single: \$vocabularies single: schema; \$vocabularies
:::

Vocabularies
------------

Documentation Coming Soon

::: {.index}
single: \$vocabularies single: schema; \$vocabularies; guidelines
:::

### Guidelines

One of the strengths of JSON Schema is that it can be written in JSON
and used in a variety of environments. For example, it can be used for
both front-end and back-end HTML Form validation. The problem with using
custom vocabularies is that every environment where you want to use your
schemas needs to understand how to evaluate your vocabulary\'s keywords.
Meta-schemas can be used to ensure that schemas are written correctly,
but each implementation will need custom code to understand how to
evaluate the vocabulary\'s keywords.

Meta-data keywords are the most interoperable because they don\'t affect
validation. For example, you could add a `units` keyword. This will
always work as expecting with an compliant validator.

The next best candidates for custom keywords are keywords that don\'t
apply other schemas and don\'t modify the behavior of existing keywords.
An `isEven` keyword is an example. In contexts where some validation is
better than no validation such as validating an HTML Form in the
browser, this schema will perform as well as can be expected. Full
validation would still be required and should use a validator that
understands the custom keyword.

The least interoperable type of custom keyword is one that applies other
schemas or modifies the behavior of existing keywords. An example would
be something like `requiredProperties` that declares properties and
makes them required. This example shows how the schema becomes almost
completely useless when evaluated with a validator that doesn\'t
understand the custom keyword. That doesn\'t necessarily mean that
`requiredProperties` is a bad idea for a keyword, it\'s just not the
right choice if the schema might need to be used in a context that
doesn\'t understand custom keywords.
