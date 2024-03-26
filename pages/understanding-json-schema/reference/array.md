---
title: "array"
section: docs
---

<Keywords label="single: array" />

Arrays are used for ordered elements. In JSON, each element in an array
may be of a different type.

[tabs-start "Language-specific info"]

[tab "Python"]
In Python, "array" is analogous to the `list` or `tuple` type,
depending on usage.  However, the `json` module in the Python
standard library will always use Python lists to represent JSON
arrays.

[tab "Ruby"]
In Ruby, "array" is analogous to the `Array` type.

[tab "Objective-C"]
In Objective-C, "array" is analogous to the `NSArray` type.

[tab "Swift"]
In Swift, "array" is analogous to the `Array` type.

[tabs-end]

<Keywords label="single: array; items single: items" />

```json
// props { "isSchema": true }
{ "type": "array" }
```
```json
// props { "indent": true, "valid": true }
[1, 2, 3, 4, 5]
```
```json
// props { "indent": true, "valid": true }
[3, "different", { "types": "of values" }]
```
```json
// props { "indent": true, "valid": false }
{"Not": "an array"}
```

There are two ways in which arrays are generally used in JSON:

- **List validation:** a sequence of arbitrary length where each item
    matches the same schema.
- **Tuple validation:** a sequence of fixed length where each item may
    have a different schema. In this usage, the index (or location) of
    each item is meaningful as to how the value is interpreted. (This
    usage is often given a whole separate type in some programming
    languages, such as Python\'s `tuple`).

## Items[#items]

List validation is useful for arrays of arbitrary length where each item
matches the same schema. For this kind of array, set the `items` keyword
to a single schema that will be used to validate all of the items in the
array.

In the following example, we define that each item in an array is a
number:

```json
// props { "isSchema": true }
{
  "type": "array",
  "items": {
    "type": "number"
  }
}
```
```json
// props { "indent": true, "valid": true }
[1, 2, 3, 4, 5]
```
A single "non-number" causes the whole array to be invalid:

```json
// props { "indent": true, "valid": false }
[1, 2, "3", 4, 5]
```
The empty array is always valid:

```json
// props { "indent": true, "valid": true }
[]
```

<Keywords label="single: array; tuple validation" />

## Tuple validation[#tupleValidation]

Tuple validation is useful when the array is a collection of items where
each has a different schema and the ordinal index of each item is
meaningful.

For example, you may represent a street address such as `1600 Pennsylvania Avenue NW` as a 4-tuple of the form:

```json
[number, street_name, street_type, direction]
```


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

<Infobox label="Draft-specific info">
In Draft 4 - 2019-09, tuple validation was handled by an alternate
   form of the `items` keyword. When `items` was an array of
   schemas instead of a single schema, it behaved the way
   `prefixItems` behaves.
</Infobox>

Here\'s the example schema:

```json
// props { "isSchema": true }
{
  "type": "array",
  "prefixItems": [
    { "type": "number" },
    { "type": "string" },
    { "enum": ["Street", "Avenue", "Boulevard"] },
    { "enum": ["NW", "NE", "SW", "SE"] }
  ]
}
```
```json
// props { "indent": true, "valid": true }
[1600, "Pennsylvania", "Avenue", "NW"]
```
"Drive" is not one of the acceptable street types:

```json
// props { "indent": true, "valid": false }
[24, "Sussex", "Drive"]
```
This address is missing a street number:

```json
// props { "indent": true, "valid": false }
["Palais de l'Élysée"]
```
It's okay to not provide all of the items:

```json
// props { "indent": true, "valid": true }
[10, "Downing", "Street"]
```
And, by default, it's also okay to add additional items to end:

```json
// props { "indent": true, "valid": true }
[1600, "Pennsylvania", "Avenue", "NW", "Washington"]
```

<Keywords label="single: array; tuple validation; items single: items" />

### Additional Items[#additionalitems]

The `items` keyword can be used to control whether it\'s valid to have
additional items in a tuple beyond what is defined in `prefixItems`. The
value of the `items` keyword is a schema that all additional items must
pass in order for the keyword to validate.

[tabs-start "Draft-specific info"]

[tab "Draft 4 - 2019-09"]
Before to Draft 2020-12, you would use the `additionalItems`
keyword to constrain additional items on a tuple. It works the same
as `items`, only the name has changed.
[tab "Draft 6 - 2019-09"]
In Draft 6 - 2019-09, the `additionalItems` keyword is ignored if
there is not a "tuple validation" `items` keyword present in the
same schema.

[tabs-end]

Here, we\'ll reuse the example schema above, but set `items` to `false`,
which has the effect of disallowing extra items in the tuple.

```json
// props { "isSchema": true }
{
  "type": "array",
  "prefixItems": [
    { "type": "number" },
    { "type": "string" },
    { "enum": ["Street", "Avenue", "Boulevard"] },
    { "enum": ["NW", "NE", "SW", "SE"] }
  ],
  "items": false
}
```
```json
// props { "indent": true, "valid": true }
[1600, "Pennsylvania", "Avenue", "NW"]
```
It's ok to not provide all of the items:

```json
// props { "indent": true, "valid": true }
[1600, "Pennsylvania", "Avenue"]
```
But, since `items` is `false`, we can't provide extra items:

```json
// props { "indent": true, "valid": false }
[1600, "Pennsylvania", "Avenue", "NW", "Washington"]
```

You can express more complex constraints by using a non-boolean schema
to constrain what value additional items can have. In that case, we
could say that additional items are allowed, as long as they are all
strings:

```json
// props { "isSchema": true }
{
  "type": "array",
  "prefixItems": [
    { "type": "number" },
    { "type": "string" },
    { "enum": ["Street", "Avenue", "Boulevard"] },
    { "enum": ["NW", "NE", "SW", "SE"] }
  ],
  "items": { "type": "string" }
}
```
Extra string items are ok ...

```json
// props { "indent": true, "valid": true }
[1600, "Pennsylvania", "Avenue", "NW", "Washington"]
```
... but not anything else

```json
// props { "indent": true, "valid": false }
[1600, "Pennsylvania", "Avenue", "NW", 20500]
```

<Keywords label="single: array; tuple validation; unevaluatedItems single: unevaluatedItems" />

## Unevaluated Items[#unevaluateditems]

<Star label="New in draft 2019-09" />

The `unevaluatedItems` keyword is useful mainly when you want to add
or disallow extra items to an array.

`unevaluatedItems` applies to any values not evaluated by an `items`, 
`prefixItems`, or `contains` keyword. Just as `unevaluatedProperties`
affects only **properties** in an object, `unevaluatedItems` affects
only **items** in an array.

> Watch out! The word "unevaluated" *does not mean* "not evaluated by
`items`, `prefixItems`, or `contains`." "Unevaluated" means
"not successfully evaluated", or "does not evaluate to true".

Like with `items`, if you set `unevaluatedItems` to `false`, you
can disallow extra items in the array.

```json
// props { "isSchema": true }
{
  "prefixItems": [
    { "type": "string" }, { "type": "number" }
  ],
  "unevaluatedItems": false
}
```

Here, all the values are evaluated. The schema passes validation.

```json
// props { "indent": true, "valid": true }
["foo", 42]
```

But here, the schema fails validation because `"unevaluatedItems": false`
specifies that no extra values should exist.

```json
// props { "indent": true, "valid": false }
["foo", 42, null]
```

Note that `items` doesn't "see inside" any instances of `allOf`,
`anyOf`, or `oneOf` in the same subschema. So in this next example,
`items` ignores `allOf` and thus fails to validate.

```json
// props { "isSchema": true }
{
  "allOf": [{ "prefixItems": [{ "type": "boolean" }, { "type": "string" }] }],
  "items": { "const": 2 }
}
```

```json
// props { "indent": true, "valid": false }
[true, "a", 2]
```

But if you replace `items` with `unevaluatedItems`, then the same
array validates.

```json
// props { "isSchema": true }
{
  "allOf": [{ "prefixItems": [{ "type": "boolean" }, { "type": "string" }] }],
  "unevaluatedItems": { "const": 2 }
}
```

```json
// props { "indent": true, "valid": true }
[true, "a", 2]
```

You can also make a "half-closed" schema: something useful when you
want to keep the first two arguments, but also add more in certain
situations. ("Closed" to two arguments in some places, "open" to
more arguments when you need it to be.)

```json
// props { "isSchema": true }
{
  "$id": "https://example.com/my-tuple",
  "type": "array",
  "prefixItems": [
    { "type": "boolean" },
    { "type": "string" }
  ],

  "$defs": {
    "closed": {
      "$anchor": "closed",
      "$ref": "#",
      "unevaluatedItems": false
    }
  }
}
```

Here the schema is "closed" to two array items. You can then later
use `$ref` and add another item like this:

```json
// props { "isSchema": true }
{
  "$id": "https://example.com/my-extended-tuple",
  "$ref": "https://example.com/my-tuple",
  "prefixItems": [
    { "type": "boolean" },
    { "type": "string" },
    { "type": "number" }
  ],

  "$defs": {
    "closed": {
      "$anchor": "closed",
      "$ref": "#",
      "unevaluatedItems": false
    }
  }
}
```

Thus, you would reference `my-tuple#closed` when you need only two
items and reference `my-tuple#extended` when you need three items.

<Keywords label="single: array; contains single: contains" />

## Contains[#contains]

<Star label="New in draft 6" />

While the `items` schema must be valid for every item in the array, the
`contains` schema only needs to validate against one or more items in
the array.

```json
// props { "isSchema": true }
{
  "type": "array",
  "contains": {
    "type": "number"
  }
}
```
A single "number" is enough to make this pass:

```json
// props { "indent": true, "valid": true }
["life", "universe", "everything", 42]
```
But if we have no number, it fails:

```json
// props { "indent": true, "valid": false }
["life", "universe", "everything", "forty-two"]
```
All numbers is, of course, also okay:

```json
// props { "indent": true, "valid": true }
[1, 2, 3, 4, 5]
```

### minContains / maxContains

<Star label="New in draft 2019-09" />

`minContains` and `maxContains` can be used with `contains` to further
specify how many times a schema matches a `contains` constraint. These
keywords can be any non-negative number including zero.

```json
// props { "isSchema": true }
{
  "type": "array",
  "contains": {
    "type": "number"
  },
  "minContains": 2,
  "maxContains": 3
}
```
Fails `minContains`

```json
// props { "indent": true, "valid": false }
["apple", "orange", 2]
```
```json
// props { "indent": true, "valid": true }
["apple", "orange", 2, 4]
```
```json
// props { "indent": true, "valid": true }
["apple", "orange", 2, 4, 8]
```
Fails `maxContains`

```json
// props { "indent": true, "valid": false }
["apple", "orange", 2, 4, 8, 16]
```

<Keywords label="single: array; length single: minItems single: maxItems" />

## Length[#length]

The length of the array can be specified using the `minItems` and
`maxItems` keywords. The value of each keyword must be a non-negative
number. These keywords work whether doing [list validation](#items) or [tuple-validation](#tupleValidation).

```json
// props { "isSchema": true }
{
  "type": "array",
  "minItems": 2,
  "maxItems": 3
}
```
```json
// props { "indent": true, "valid": false }
[]
```
```json
// props { "indent": true, "valid": false }
[1]
```
```json
// props { "indent": true, "valid": true }
[1, 2]
```
```json
// props { "indent": true, "valid": true }
[1, 2, 3]
```
```json
// props { "indent": true, "valid": false }
[1, 2, 3, 4]
```

<Keywords label="single: array; uniqueness single: uniqueItems" />

## Uniqueness[#uniqueItems]

A schema can ensure that each of the items in an array is unique. Simply
set the `uniqueItems` keyword to `true`.

```json
// props { "isSchema": true }
{
  "type": "array",
  "uniqueItems": true
}
```
```json
// props { "indent": true, "valid": true }
[1, 2, 3, 4, 5]
```
```json
// props { "indent": true, "valid": false }
[1, 2, 3, 3, 4]
```
The empty array always passes:

```json
// props { "indent": true, "valid": true }
[]
```
