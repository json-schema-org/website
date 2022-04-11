::: {.index}
single: object
:::

object
======

::: {.contents}

local

:   
:::

Objects are the mapping type in JSON. They map \"keys\" to \"values\".
In JSON, the \"keys\" must always be strings. Each of these pairs is
conventionally referred to as a \"property\".

::: {.index}
single: object; properties single: properties
:::

Properties
----------

The properties (key-value pairs) on an object are defined using the
`properties` keyword. The value of `properties` is an object, where each
key is the name of a property and each value is a schema used to
validate that property. Any property that doesn\'t match any of the
property names in the `properties` keyword is ignored by this keyword.

::: {.note}
::: {.title}
Note
:::

See [additionalproperties]{.title-ref} and
[unevaluatedproperties]{.title-ref} for how to disallow properties that
don\'t match any of the property names in `properties`.
:::

For example, let\'s say we want to define a simple schema for an address
made up of a number, street name and street type:

::: {.index}
single: object; properties; regular expression single: patternProperties
:::

Pattern Properties {#patternProperties}
------------------

Sometimes you want to say that, given a particular kind of property
name, the value should match a particular schema. That\'s where
`patternProperties` comes in: it maps regular expressions to schemas. If
a property name matches the given regular expression, the property value
must validate against the corresponding schema.

::: {.note}
::: {.title}
Note
:::

Regular expressions are not anchored. This means that when defining the
regular expressions for `patternProperties`, it\'s important to note
that the expression may match anywhere within the property name. For
example, the regular expression `"p"` will match any property name with
a `p` in it, such as `"apple"`, not just a property whose name is simply
`"p"`. It\'s therefore usually less confusing to surround the regular
expression in `^...$`, for example, `"^p$"`.
:::

In this example, any properties whose names start with the prefix `S_`
must be strings, and any with the prefix `I_` must be integers. Any
properties that do not match either regular expression are ignored.

::: {.index}
single: object; properties single: additionalProperties
:::

Additional Properties {#additionalproperties}
---------------------

The `additionalProperties` keyword is used to control the handling of
extra stuff, that is, properties whose names are not listed in the
`properties` keyword or match any of the regular expressions in the
`patternProperties` keyword. By default any additional properties are
allowed.

The value of the `additionalProperties` keyword is a schema that will be
used to validate any properties in the instance that are not matched by
`properties` or `patternProperties`. Setting the `additionalProperties`
schema to `false` means no additional properties will be allowed.

Reusing the example from [properties]{.title-ref}, but this time setting
`additionalProperties` to `false`.

You can use non-boolean schemas to put more complex constraints on the
additional properties of an instance. For example, one can allow
additional properties, but only if their values are each a string:

You can use `additionalProperties` with a combination of `properties`
and `patternProperties`. In the following example, based on the example
from [patternProperties]{.title-ref}, we add a `"builtin"` property,
which must be a number, and declare that all additional properties (that
are neither defined by `properties` nor matched by `patternProperties`)
must be strings:

::: {.index}
single: object; properties; additionalProperties single: extending
:::

### Extending Closed Schemas {#extending}

It\'s important to note that `additionalProperties` only recognizes
properties declared in the same subschema as itself. So,
`additionalProperties` can restrict you from \"extending\" a schema
using [combining]{.title-ref} keywords such as [allOf]{.title-ref}. In
the following example, we can see how the `additionalProperties` can
cause attempts to extend the address schema example to fail.

Because `additionalProperties` only recognizes properties declared in
the same subschema, it considers anything other than
\"street\_address\", \"city\", and \"state\" to be additional. Combining
the schemas with [allOf]{.title-ref} doesn\'t change that. A workaround
you can use is to move `additionalProperties` to the extending schema
and redeclare the properties from the extended schema.

Now the `additionalProperties` keyword is able to recognize all the
necessary properties and the schema works as expected. Keep reading to
see how the `unevaluatedProperties` keyword solves this problem without
needing to redeclare properties.

::: {.index}
single: object; properties; extending single: unevaluatedProperties
:::

Unevaluated Properties {#unevaluatedproperties}
----------------------

In the previous section we saw the challenges with using
`additionalProperties` when \"extending\" a schema using
[combining]{.title-ref}. The `unevaluatedProperties` keyword is similar
to `additionalProperties` except that it can recognize properties
declared in subschemas. So, the example from the previous section can be
rewritten without the need to redeclare properties.

`unevaluatedProperties` works by collecting any properties that are
successfully validated when processing the schemas and using those as
the allowed list of properties. This allows you to do more complex
things like conditionally adding properties. The following example
allows the \"department\" property only if the \"type\" of address is
\"business\".

In this schema, the properties declared in the `then` schema only count
as \"evaluated\" properties if the \"type\" of the address is
\"business\".

::: {.index}
single: object; required properties single: required
:::

Required Properties {#required}
-------------------

By default, the properties defined by the `properties` keyword are not
required. However, one can provide a list of required properties using
the `required` keyword.

The `required` keyword takes an array of zero or more strings. Each of
these strings must be unique.

In the following example schema defining a user record, we require that
each user has a name and e-mail address, but we don\'t mind if they
don\'t provide their address or telephone number:

::: {.index}
single: object; property names single: propertyNames
:::

Property names {#propertyNames}
--------------

The names of properties can be validated against a schema, irrespective
of their values. This can be useful if you don\'t want to enforce
specific properties, but you want to make sure that the names of those
properties follow a specific convention. You might, for example, want to
enforce that all names are valid ASCII tokens so they can be used as
attributes in a particular programming language.

Since object keys must always be strings anyway, it is implied that the
schema given to `propertyNames` is always at least:

    { "type": "string" }

::: {.index}
single: object; size single: minProperties single: maxProperties
:::

Size
----

The number of properties on an object can be restricted using the
`minProperties` and `maxProperties` keywords. Each of these must be a
non-negative integer.
