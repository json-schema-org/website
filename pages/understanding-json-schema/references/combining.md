::: {.index}
single: schema composition
:::

Schema Composition {#combining}
==================

::: {.contents}

local

:   
:::

JSON Schema includes a few keywords for combining schemas together. Note
that this doesn\'t necessarily mean combining schemas from multiple
files or JSON trees, though these facilities help to enable that and are
described in [structuring]{.title-ref}. Combining schemas may be as
simple as allowing a value to be validated against multiple criteria at
the same time.

These keywords correspond to well known boolean algebra concepts like
AND, OR, XOR, and NOT. You can often use these keywords to express
complex constraints that can\'t otherwise be expressed with standard
JSON Schema keywords.

The keywords used to combine schemas are:

-   \`allOf\`: (AND) Must be valid against *all* of the subschemas
-   \`anyOf\`: (OR) Must be valid against *any* of the subschemas
-   \`oneOf\`: (XOR) Must be valid against *exactly one* of the
    subschemas

All of these keywords must be set to an array, where each item is a
schema.

In addition, there is:

-   \`not\`: (NOT) Must *not* be valid against the given schema

::: {.index}
single: allOf single: schema composition; allOf
:::

allOf {#allOf}
-----

To validate against `allOf`, the given data must be valid against all of
the given subschemas.

::: {.note}
::: {.title}
Note
:::

[allOf]{.title-ref} can not be used to \"extend\" a schema to add more
details to it in the sense of object-oriented inheritance. Instances
must independently be valid against \"all of\" the schemas in the
`allOf`. See the section on [extending]{.title-ref} for more
information.
:::

::: {.index}
single: anyOf single: schema composition; anyOf
:::

anyOf {#anyOf}
-----

To validate against `anyOf`, the given data must be valid against any
(one or more) of the given subschemas.

::: {.index}
single: oneOf single: schema composition; oneOf
:::

oneOf {#oneOf}
-----

To validate against `oneOf`, the given data must be valid against
exactly one of the given subschemas.

::: {.index}
single: not single: schema composition; not
:::

not
---

The `not` keyword declares that an instance validates if it doesn\'t
validate against the given subschema.

For example, the following schema validates against anything that is not
a string:

::: {.index}
single: not single: schema composition; subschema independence
:::

Properties of Schema Composition {#composition}
--------------------------------

### Illogical Schemas {#illogicalschemas}

Note that it\'s quite easy to create schemas that are logical
impossibilities with these keywords. The following example creates a
schema that won\'t validate against anything (since something may not be
both a string and a number at the same time):

### Factoring Schemas {#factoringschemas}

Note that it\'s possible to \"factor\" out the common parts of the
subschemas. The following two schemas are equivalent.
