::: {.index}
single: array
:::

array
=====

::: {.contents}

local

:   
:::

Arrays are used for ordered elements. In JSON, each element in an array
may be of a different type.

There are two ways in which arrays are generally used in JSON:

-   **List validation:** a sequence of arbitrary length where each item
    matches the same schema.
-   **Tuple validation:** a sequence of fixed length where each item may
    have a different schema. In this usage, the index (or location) of
    each item is meaningful as to how the value is interpreted. (This
    usage is often given a whole separate type in some programming
    languages, such as Python\'s `tuple`).

::: {.index}
single: array; items single: items
:::

Items
-----

List validation is useful for arrays of arbitrary length where each item
matches the same schema. For this kind of array, set the `items` keyword
to a single schema that will be used to validate all of the items in the
array.

In the following example, we define that each item in an array is a
number:

::: {.index}
single: array; tuple validation
:::

Tuple validation
----------------

Tuple validation is useful when the array is a collection of items where
each has a different schema and the ordinal index of each item is
meaningful.

For example, you may represent a street address such as:

    1600 Pennsylvania Avenue NW

as a 4-tuple of the form:

> \[number, street\_name, street\_type, direction\]

Each of these fields will have a different schema:

-   `number`: The address number. Must be a number.
-   `street_name`: The name of the street. Must be a string.
-   `street_type`: The type of street. Should be a string from a fixed
    set of values.
-   `direction`: The city quadrant of the address. Should be a string
    from a different set of values.

To do this, we use the `prefixItems` keyword. `prefixItems` is an array,
where each item is a schema that corresponds to each index of the
document\'s array. That is, an array where the first element validates
the first element of the input array, the second element validates the
second element of the input array, etc.

Here\'s the example schema:

::: {.index}
single: array; tuple validation; items single: items
:::

### Additional Items {#additionalitems}

The `items` keyword can be used to control whether it\'s valid to have
additional items in a tuple beyond what is defined in `prefixItems`. The
value of the `items` keyword is a schema that all additional items must
pass in order for the keyword to validate.

Here, we\'ll reuse the example schema above, but set `items` to `false`,
which has the effect of disallowing extra items in the tuple.

You can express more complex constraints by using a non-boolean schema
to constrain what value additional items can have. In that case, we
could say that additional items are allowed, as long as they are all
strings:

::: {.index}
single: array; tuple validation; unevaluatedItems single:
unevaluatedItems
:::

Unevaluated Items {#unevaluateditems}
-----------------

Documentation Coming Soon

::: {.index}
single: array; contains single: contains
:::

Contains
--------

While the `items` schema must be valid for every item in the array, the
`contains` schema only needs to validate against one or more items in
the array.

### minContains / maxContains

`minContains` and `maxContains` can be used with `contains` to further
specify how many times a schema matches a `contains` constraint. These
keywords can be any non-negative number including zero.

::: {.index}
single: array; length single: minItems single: maxItems
:::

Length
------

The length of the array can be specified using the `minItems` and
`maxItems` keywords. The value of each keyword must be a non-negative
number. These keywords work whether doing [list validation
\<items\>]{.title-ref} or [tuple-validation]{.title-ref}.

::: {.index}
single: array; uniqueness single: uniqueItems
:::

Uniqueness {#uniqueItems}
----------

A schema can ensure that each of the items in an array is unique. Simply
set the `uniqueItems` keyword to `true`.
