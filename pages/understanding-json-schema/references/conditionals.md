::: {.index}
single: conditionals
:::

Applying Subschemas Conditionally {#conditionals}
=================================

::: {.contents}

local

:   
:::

::: {.index}
single: conditionals; dependentRequired single: property
dependentRequired
:::

dependentRequired {#dependentRequired}
-----------------

The `dependentRequired` keyword conditionally requires that certain
properties must be present if a given property is present in an object.
For example, suppose we have a schema representing a customer. If you
have their credit card number, you also want to ensure you have a
billing address. If you don\'t have their credit card number, a billing
address would not be required. We represent this dependency of one
property on another using the `dependentRequired` keyword. The value of
the `dependentRequired` keyword is an object. Each entry in the object
maps from the name of a property, *p*, to an array of strings listing
properties that are required if *p* is present.

In the following example, whenever a `credit_card` property is provided,
a `billing_address` property must also be present:

To fix the last issue above (that dependencies are not bidirectional),
you can, of course, define the bidirectional dependencies explicitly:

::: {.index}
single: conditionals; dependentSchemas single: dependentSchemas
:::

dependentSchemas {#dependentSchemas}
----------------

The `dependentSchemas` keyword conditionally applies a subschema when a
given property is present. This schema is applied in the same way
[allOf]{.title-ref} applies schemas. Nothing is merged or extended. Both
schemas apply independently.

For example, here is another way to write the above:

::: {.index}
single: conditionals single: conditionals; if single: conditionals; then
single: conditionals; else single: if single: then single: else
:::

If-Then-Else {#ifthenelse}
------------

The `if`, `then` and `else` keywords allow the application of a
subschema based on the outcome of another schema, much like the
`if`/`then`/`else` constructs you\'ve probably seen in traditional
programming languages.

If `if` is valid, `then` must also be valid (and `else` is ignored.) If
`if` is invalid, `else` must also be valid (and `then` is ignored).

If `then` or `else` is not defined, `if` behaves as if they have a value
of `true`.

If `then` and/or `else` appear in a schema without `if`, `then` and
`else` are ignored.

We can put this in the form of a truth table, showing the combinations
of when `if`, `then`, and `else` are valid and the resulting validity of
the entire schema:

  if    then   else   whole schema
  ----- ------ ------ --------------
  T     T      n/a    T
  T     F      n/a    F
  F     n/a    T      T
  F     n/a    F      F
  n/a   n/a    n/a    T

For example, let\'s say you wanted to write a schema to handle addresses
in the United States and Canada. These countries have different postal
code formats, and we want to select which format to validate against
based on the country. If the address is in the United States, the
`postal_code` field is a \"zipcode\": five numeric digits followed by an
optional four digit suffix. If the address is in Canada, the
`postal_code` field is a six digit alphanumeric string where letters and
numbers alternate.

::: {.note}
::: {.title}
Note
:::

In this example, \"country\" is not a required property. Because the
\"if\" schema also doesn\'t require the \"country\" property, it will
pass and the \"then\" schema will apply. Therefore, if the \"country\"
property is not defined, the default behavior is to validate
\"postal\_code\" as a USA postal code. The \"default\" keyword doesn\'t
have an effect, but is nice to include for readers of the schema to more
easily recognize the default behavior.
:::

Unfortunately, this approach above doesn\'t scale to more than two
countries. You can, however, wrap pairs of `if` and `then` inside an
`allOf` to create something that would scale. In this example, we\'ll
use United States and Canadian postal codes, but also add Netherlands
postal codes, which are 4 digits followed by two letters. It\'s left as
an exercise to the reader to expand this to the remaining postal codes
of the world.

::: {.note}
::: {.title}
Note
:::

The \"required\" keyword is necessary in the \"if\" schemas or they
would all apply if the \"country\" is not defined. Leaving \"required\"
off of the \"United States of America\" \"if\" schema makes it
effectively the default if no \"country\" is defined.
:::

::: {.note}
::: {.title}
Note
:::

Even if \"country\" was a required field, it\'s still recommended to
have the \"required\" keyword in each \"if\" schema. The validation
result will be the same because \"required\" will fail, but not
including it will add noise to error results because it will validate
the \"postal\_code\" against all three of the \"then\" schemas leading
to irrelevant errors.
:::

::: {.index}
single: conditionals; implication single: implication
:::

Implication
-----------

Before Draft 7, you can express an \"if-then\" conditional using the
[combining]{.title-ref} keywords and a boolean algebra concept called
\"implication\". `A -> B` (pronounced, A implies B) means that if A is
true, then B must also be true. It can be expressed as `!A || B` which
can be expressed as a JSON Schema.

Variations of implication can be used to express the same things you can
express with the `if`/`then`/`else` keywords. `if`/`then` can be
expressed as `A -> B`, `if`/`else` can be expressed as `!A -> B`, and
`if`/`then`/`else` can be expressed as `A -> B AND !A -> C`.

::: {.note}
::: {.title}
Note
:::

Since this pattern is not very intuitive, it\'s recommended to put your
conditionals in `$defs` with a descriptive name and `$ref` it into your
schema with
`"allOf": [{ "$ref": "#/$defs/sit-down-restaurant-implies-tip-is-required" }]`.
:::
