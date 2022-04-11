::: {.index}
single: type single: types; basic
:::

Type-specific keywords {#type}
======================

The `type` keyword is fundamental to JSON Schema. It specifies the data
type for a schema.

At its core, JSON Schema defines the following basic types:

> -   [string]{.title-ref}
> -   [number \<number\>]{.title-ref}
> -   [integer \<integer\>]{.title-ref}
> -   [object]{.title-ref}
> -   [array]{.title-ref}
> -   [boolean]{.title-ref}
> -   [null]{.title-ref}

These types have analogs in most programming languages, though they may
go by different names.

The `type` keyword may either be a string or an array:

-   If it\'s a string, it is the name of one of the basic types above.
-   If it is an array, it must be an array of strings, where each string
    is the name of one of the basic types, and each element is unique.
    In this case, the JSON snippet is valid if it matches *any* of the
    given types.

Here is a simple example of using the `type` keyword:

In the following example, we accept strings and numbers, but not
structured data types:

For each of these types, there are keywords that only apply to those
types. For example, numeric types have a way of specifying a numeric
range, that would not be applicable to other types. In this reference,
these validation keywords are described along with each of their
corresponding types in the following chapters.
