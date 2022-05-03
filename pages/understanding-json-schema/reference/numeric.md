::: {.index}
single: integer single: number single: types; numeric
:::

Numeric types {#numeric}
=============

::: {.contents}

local

:   
:::

There are two numeric types in JSON Schema: [integer]{.title-ref} and
[number]{.title-ref}. They share the same validation keywords.

::: {.note}
::: {.title}
Note
:::

JSON has no standard way to represent complex numbers, so there is no
way to test for them in JSON Schema.
:::

integer
-------

The `integer` type is used for integral numbers. JSON does not have
distinct types for integers and floating-point values. Therefore, the
presence or absence of a decimal point is not enough to distinguish
between integers and non-integers. For example, `1` and `1.0` are two
ways to represent the same value in JSON. JSON Schema considers that
value an integer no matter which representation was used.

number
------

The `number` type is used for any numeric type, either integers or
floating point numbers.

::: {.index}
single: multipleOf single: number; multiple of
:::

Multiples
---------

Numbers can be restricted to a multiple of a given number, using the
`multipleOf` keyword. It may be set to any positive number.

::: {.index}
single: number; range single: maximum single: exclusiveMaximum single:
minimum single: exclusiveMinimum
:::

Range
-----

Ranges of numbers are specified using a combination of the `minimum` and
`maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for
expressing exclusive range).

If *x* is the value being validated, the following must hold true:

> -   *x* ≥ `minimum`
> -   *x* \> `exclusiveMinimum`
> -   *x* ≤ `maximum`
> -   *x* \< `exclusiveMaximum`

While you can specify both of `minimum` and `exclusiveMinimum` or both
of `maximum` and `exclusiveMaximum`, it doesn\'t really make sense to do
so.
