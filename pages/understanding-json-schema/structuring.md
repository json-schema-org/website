::: {.index}
single: structure
:::

Structuring a complex schema {#structuring}
============================

::: {.contents}

local

:   
:::

When writing computer programs of even moderate complexity, it\'s
commonly accepted that \"structuring\" the program into reusable
functions is better than copying-and-pasting duplicate bits of code
everywhere they are used. Likewise in JSON Schema, for anything but the
most trivial schema, it\'s really useful to structure the schema into
parts that can be reused in a number of places. This chapter will
present the tools available for reusing and structuring schemas as well
as some practical examples that use those tools.

::: {.index}
single: schema identification single: structuring; schema identification
:::

Schema Identification
---------------------

Like any other code, schemas are easier to maintain if they can be
broken down into logical units that reference each other as necessary.
In order to reference a schema, we need a way to identify a schema.
Schema documents are identified by non-relative URIs.

Schema documents are not required to have an identifier, but you will
need one if you want to reference one schema from another. In this
documentation, we will refer to schemas with no identifier as
\"anonymous schemas\".

In the following sections we will see how the \"identifier\" for a
schema is determined.

::: {.note}
::: {.title}
Note
:::

URI terminology can sometimes be unintuitive. In this document, the
following definitions are used.

-   **URI**
    [\[1\]](https://datatracker.ietf.org/doc/html/rfc3986#section-3) or
    **non-relative URI**: A full URI containing a scheme (`https`). It
    may contain a URI fragment (`#foo`). Sometimes this document will
    use \"non-relative URI\" to make it extra clear that relative URIs
    are not allowed.
-   **relative reference**
    [\[2\]](https://datatracker.ietf.org/doc/html/rfc3986#section-4.2):
    A partial URI that does not contain a scheme (`https`). It may
    contain a fragment (`#foo`).
-   **URI-reference**
    [\[3\]](https://datatracker.ietf.org/doc/html/rfc3986#section-4.1):
    A relative reference or non-relative URI. It may contain a URI
    fragment (`#foo`).
-   **absolute URI**
    [\[4\]](https://datatracker.ietf.org/doc/html/rfc3986#section-4.3) A
    full URI containing a scheme (`https`) but not a URI fragment
    (`#foo`).
:::

::: {.note}
::: {.title}
Note
:::

Even though schemas are identified by URIs, those identifiers are not
necessarily network-addressable. They are just identifiers. Generally,
implementations don\'t make HTTP requests (`https://`) or read from the
file system (`file://`) to fetch schemas. Instead, they provide a way to
load schemas into an internal schema database. When a schema is
referenced by it\'s URI identifier, the schema is retrieved from the
internal schema database.
:::

::: {.index}
single: base URI single: structuring; base URI
:::

Base URI
--------

Using non-relative URIs can be cumbersome, so any URIs used in JSON
Schema can be URI-references that resolve against the schema\'s base URI
resulting in a non-relative URI. This section describes how a schema\'s
base URI is determined.

::: {.note}
::: {.title}
Note
:::

Base URI determination and relative reference resolution is defined by
[RFC-3986](https://datatracker.ietf.org/doc/html/rfc3986#section-5). If
you are familiar with how this works in HTML, this section should feel
very familiar.
:::

::: {.index}
single: retrieval URI single: structuring; base URI; retrieval URI
:::

### Retrieval URI

The URI used to fetch a schema is known as the \"retrieval URI\". It\'s
often possible to pass an anonymous schema to an implementation in which
case that schema would have no retrieval URI.

Let\'s assume a schema is referenced using the URI
`https://example.com/schemas/address` and the following schema is
retrieved.

The base URI for this schema is the same as the retrieval URI,
`https://example.com/schemas/address`.

::: {.index}
single: \$id single: structuring; base URI; \$id
:::

### \$id

You can set the base URI by using the `$id` keyword at the root of the
schema. The value of `$id` is a URI-reference without a fragment that
resolves against the [retrieval-uri]{.title-ref}. The resulting URI is
the base URI for the schema.

::: {.note}
::: {.title}
Note
:::

This is analogous to the `<base>` [tag in
HTML](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element).
:::

::: {.note}
::: {.title}
Note
:::

When the `$id` keyword appears in a subschema, it means something
slightly different. See the [bundling]{.title-ref} section for more.
:::

Let\'s assume the URIs `https://example.com/schema/address` and
`https://example.com/schema/billing-address` both identify the following
schema.

No matter which of the two URIs is used to retrieve this schema, the
base URI will be `https://example.com/schemas/address`, which is the
result of the `$id` URI-reference resolving against the
[retrieval-uri]{.title-ref}.

However, using a relative reference when setting a base URI can be
problematic. For example, we couldn\'t use this schema as an anonymous
schema because there would be no [retrieval-uri]{.title-ref} and you
can\'t resolve a relative reference against nothing. For this and other
reasons, it\'s recommended that you always use an absolute URI when
declaring a base URI with `$id`.

The base URI of the following schema will always be
`https://example.com/schemas/address` no matter what the
[retrieval-uri]{.title-ref} was or if it\'s used as an anonymous schema.

::: {.index}
single: JSON Pointer single: structuring; subschema identification; JSON
Pointer
:::

### JSON Pointer

In addition to identifying a schema document, you can also identify
subschemas. The most common way to do that is to use a [JSON
Pointer](https://tools.ietf.org/html/rfc6901) in the URI fragment that
points to the subschema.

A JSON Pointer describes a slash-separated path to traverse the keys in
the objects in the document. Therefore, `/properties/street_address`
means:

1)  find the value of the key `properties`
2)  within that object, find the value of the key `street_address`

The URI `https://example.com/schemas/address#/properties/street_address`
identifies the highlighted subschema in the following schema.

::: {.index}
single: \$anchor single: structuring; subschema identification; \$anchor
:::

### \$anchor

A less common way to identify a subschema is to create a named anchor in
the schema using the `$anchor` keyword and using that name in the URI
fragment. Anchors must start with a letter followed by any number of
letters, digits, `-`, `_`, `:`, or `.`.

::: {.note}
::: {.title}
Note
:::

If a named anchor is defined that doesn\'t follow these naming rules,
then behavior is undefined. Your anchors might work in some
implementation, but not others.
:::

The URI `https://example.com/schemas/address#street_address` identifies
the subschema on the highlighted part of the following schema.

::: {.index}
single: \$ref single: structuring; \$ref
:::

\$ref
-----

A schema can reference another schema using the `$ref` keyword. The
value of `$ref` is a URI-reference that is resolved against the
schema\'s [base-uri]{.title-ref}. When evaluating a `$ref`, an
implementation uses the resolved identifier to retrieve the referenced
schema and applies that schema to the instance.

For this example, let\'s say we want to define a customer record, where
each customer may have both a shipping and a billing address. Addresses
are always the same\-\--they have a street address, city and
state\-\--so we don\'t want to duplicate that part of the schema
everywhere we want to store an address. Not only would that make the
schema more verbose, but it makes updating it in the future more
difficult. If our imaginary company were to start doing international
business in the future and we wanted to add a country field to all the
addresses, it would be better to do this in a single place rather than
everywhere that addresses are used.

The URI-references in `$ref` resolve against the schema\'s
[base-uri]{.title-ref} (`https://example.com/schemas/customer`) which
results in `https://example.com/schemas/address`. The implementation
retrieves that schema and uses it to evaluate the \"shipping\_address\"
and \"billing\_address\" properties.

::: {.note}
::: {.title}
Note
:::

When using `$ref` in an anonymous schema, relative references may not be
resolvable. Let\'s assume this example is used as an anonymous schema.

The `$ref` at `/properties/shipping_address` can resolve just fine
without a non-relative base URI to resolve against, but the `$ref` at
`/properties/billing_address` can\'t resolve to a non-relative URI and
therefore can\'t can be used to retrieve the address schema.
:::

::: {.index}
single: \$defs single: structuring; \$defs
:::

\$defs
------

Sometimes we have small subschemas that are only intended for use in the
current schema and it doesn\'t make sense to define them as separate
schemas. Although we can identify any subschema using JSON Pointers or
named anchors, the `$defs` keyword gives us a standardized place to keep
subschemas intended for reuse in the current schema document.

Let\'s extend the previous customer schema example to use a common
schema for the name properties. It doesn\'t make sense to define a new
schema for this and it will only be used in this schema, so it\'s a good
candidate for using `$defs`.

`$ref` isn\'t just good for avoiding duplication. It can also be useful
for writing schemas that are easier to read and maintain. Complex parts
of the schema can be defined in `$defs` with descriptive names and
referenced where it\'s needed. This allows readers of the schema to more
quickly and easily understand the schema at a high level before diving
into the more complex parts.

::: {.note}
::: {.title}
Note
:::

It\'s possible to reference an external subschema, but generally you
want to limit a `$ref` to referencing either an external schema or an
internal subschema defined in `$defs`.
:::

::: {.index}
single: recursion single: \$ref single: structuring; recursion; \$ref
:::

Recursion
---------

The `$ref` keyword may be used to create recursive schemas that refer to
themselves. For example, you might have a `person` schema that has an
array of `children`, each of which are also `person` instances.

Above, we created a schema that refers to itself, effectively creating a
\"loop\" in the validator, which is both allowed and useful. Note,
however, that a `$ref` referring to another `$ref` could cause an
infinite loop in the resolver, and is explicitly disallowed.

::: {.index}
single: Extending Recursive Schemas single: \$recursiveRef single:
\$recursiveAnchor single: structuring; Extending Recursive Schemas
:::

Extending Recursive Schemas
---------------------------

Documentation Coming Soon

::: {.index}
single: bundling single: \$id single: structuring; bundling; \$id
:::

Bundling
--------

Working with multiple schema documents is convenient for development,
but it\'s often more convenient for distribution to bundle all of your
schemas into a single schema document. This can be done using the `$id`
keyword in a subschema. When `$id` is used in a subschema, it indicates
an embedded schema. The identifier for the embedded schema is the value
of `$id` resolved against the [base-uri]{.title-ref} of the schema it
appears in. A schema document that includes embedded schemas is called a
Compound Schema Document. Each schema with an `$id` in a Compound Schema
Document is called a Schema Resource.

::: {.note}
::: {.title}
Note
:::

This is analogous to the `<iframe>` [tag in
HTML](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element).
:::

::: {.note}
::: {.title}
Note
:::

It is unusual to use embedded schemas when developing schemas. It\'s
generally best not to use this feature explicitly and use schema
bundling tools to construct bundled schemas if such a thing is needed.
:::

This example shows the customer schema example and the address schema
example bundled into a Compound Schema Document.

All references in a Compound Schema Document need to be the same whether
the Schema Resources are bundled or not. Notice that the `$ref` keywords
from the customer schema have not changed. The only difference is that
the address schema is now defined at `/$defs/address` instead of a
separate schema document. You couldn\'t use `#/$defs/address` to
reference the address schema because if you unbundled the schema, that
reference would no longer point to the address schema.

You should also see that `"$ref": "#/definitions/state"` resolves to the
`definitions` keyword in the address schema rather than the one at the
top level schema like it would if the embedded schema wasn\'t used.

Each Schema Resource is evaluated independently and may use different
JSON Schema dialects. The example above has the address Schema Resource
using Draft 7 while the customer Schema Resource uses Draft 2020-12. If
no `$schema` is declared in an embedded schema, it defaults to using the
dialect of the parent schema.
