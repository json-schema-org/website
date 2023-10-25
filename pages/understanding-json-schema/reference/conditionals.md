---
title: "Applying Subschemas Conditionally"
section: docs
---

<Keywords label="single: conditionals; dependentRequired single: property dependentRequired" />

## dependentRequired[#dependentRequired]

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

```json
// props { "isSchema": true }
{
  "type": "object",

  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" },
    "billing_address": { "type": "string" }
  },

  "required": ["name"],

  "dependentRequired": {
    "credit_card": ["billing_address"]
  }
}
```  
```json
// props { "indent": true, "valid": true }
{
  "name": "John Doe",
  "credit_card": 5555555555555555,
  "billing_address": "555 Debtor's Lane"
}
```
This instance has a `credit_card`, but it's missing a `billing_address`.

```json
// props { "indent": true, "valid": false }
{
  "name": "John Doe",
  "credit_card": 5555555555555555
}
```
This is okay, since we have neither a ``credit_card``, or a ``billing_address``.

```json
// props { "indent": true, "valid": true }
{
  "name": "John Doe"
}
```
Note that dependencies are not bidirectional.  It's okay to have a billing address without a credit card number.

```json
// props { "indent": true, "valid": true }
{
  "name": "John Doe",
  "billing_address": "555 Debtor's Lane"
}
```

To fix the last issue above (that dependencies are not bidirectional),
you can, of course, define the bidirectional dependencies explicitly:

```json
// props { "isSchema": true }
{
  "type": "object",

  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" },
    "billing_address": { "type": "string" }
  },

  "required": ["name"],

  "dependentRequired": {
    "credit_card": ["billing_address"],
    "billing_address": ["credit_card"]
  }
}
```  
This instance has a ``credit_card``, but it's missing a ``billing_address``.

```json
// props { "indent": true, "valid": false }
{
  "name": "John Doe",
  "credit_card": 5555555555555555
}
```
This has a ``billing_address``, but is missing a ``credit_card``.

```json
// props { "indent": true, "valid": false }
{
  "name": "John Doe",
  "billing_address": "555 Debtor's Lane"
}
```

<Infobox label="Draft-specific info">
Previously to Draft 2019-09, ``dependentRequired`` and
   ``dependentSchemas`` were one keyword called ``dependencies``. If
   the dependency value was an array, it would behave like
   ``dependentRequired`` and if the dependency value was a schema, it
   would behave like ``dependentSchema``.
</Infobox>

<Keywords label="single: conditionals; dependentSchemas single: dependentSchemas" />

## dependentSchemas [#dependentSchemas]

The `dependentSchemas` keyword conditionally applies a subschema when a
given property is present. This schema is applied in the same way
[allOf](../../understanding-json-schema/reference/combining#allof) applies schemas. Nothing is merged or extended. Both
schemas apply independently.

For example, here is another way to write the above:

```json
// props { "isSchema": true }
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" }
  },
  "required": ["name"],
  "dependentSchemas": {
    "credit_card": {
      "properties": {
        "billing_address": { "type": "string" }
      },
      "required": ["billing_address"]
    }
  }
}
```

```json
// props { "indent": true, "valid": true }
{
  "name": "John Doe",
  "credit_card": 5555555555555555,
  "billing_address": "555 Debtor's Lane"
}
```
This instance has a ``credit_card``, but it's missing a ``billing_address``:

```json
// props { "indent": true, "valid": false }
{
  "name": "John Doe",
  "credit_card": 5555555555555555
}
```
This has a ``billing_address``, but is missing a ``credit_card``.  This passes, because here ``billing_address`` just looks like an additional property:

```json
// props { "indent": true, "valid": true }
{
  "name": "John Doe",
  "billing_address": "555 Debtor's Lane"
}
```

<Infobox label="Draft-specific info">
Previously to Draft 2019-09, ``dependentRequired`` and
   ``dependentSchemas`` were one keyword called ``dependencies``. If
   the dependency value was an array, it would behave like
   ``dependentRequired`` and if the dependency value was a schema, it
   would behave like ``dependentSchema``.
</Infobox>

<Keywords label="single: conditionals single: conditionals; if single: conditionals; then single: conditionals; else single: if single: then single: else" />

## If-Then-Else[#ifthenelse]

<StarInline label="New in draft 7" />
The `if`, `then` and `else` keywords allow the application of a subschema based
on the outcome of another schema, much like the `if`/`then`/`else` constructs
you've probably seen in traditional programming languages.

If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is
invalid, `else` must also be valid (and `then` is ignored).

If `then` or `else` is not defined, `if` behaves as if they have a value of
`true`.

If `then` and/or `else` appear in a schema without `if`, `then` and `else` are
ignored.

We can put this in the form of a truth table, showing the combinations of when
`if`, `then`, and `else` are valid and the resulting validity of the entire
schema:

| if   | then | else | whole schema |
|:-----|:-----|:-----|:-------------|
| T    | T    | n/a  | T            |
| T    | F    | n/a  | F            |
| F    | n/a  | T    | T            |
| F    | n/a  | F    | F            |
| n/a  | n/a  | n/a  | T            |

For example, let's say you wanted to write a schema to handle addresses in the
United States and Canada. These countries have different postal code formats,
and we want to select which format to validate against based on the country. If
the address is in the United States, the `postal_code` field is a "zipcode":
five numeric digits followed by an optional four digit suffix. If the address is
in Canada, the `postal_code` field is a six digit alphanumeric string where
letters and numbers alternate.

```json
// props { "isSchema": true }
{
  "type": "object",
  "properties": {
    "street_address": {
      "type": "string"
    },
    "country": {
      "default": "United States of America",
      "enum": ["United States of America", "Canada"]
    }
  },
  "if": {
    "properties": {
      "country": { "const": "United States of America" }
    }
  },
  "then": {
    "properties": {
      "postal_code": { "pattern": "[0-9]{5}(-[0-9]{4})?" }
    }
  },
  "else": {
    "properties": {
      "postal_code": { "pattern": "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" }
    }
  }
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "1600 Pennsylvania Avenue NW",
  "country": "United States of America",
  "postal_code": "20500"
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "1600 Pennsylvania Avenue NW",
  "postal_code": "20500"
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "24 Sussex Drive",
  "country": "Canada",
  "postal_code": "K1M 1M4"
}
```
```json
// props { "indent": true, "valid": false }
{
  "street_address": "24 Sussex Drive",
  "country": "Canada",
  "postal_code": "10000"
}
```
```json
// props { "indent": true, "valid": false }
{
  "street_address": "1600 Pennsylvania Avenue NW",
  "postal_code": "K1M 1M4"
}
```

> In this example, "country" is not a required property. Because the
`if` schema also doesn't require the "country" property, it will pass and the
"then" schema will apply. Therefore, if the "country" property is not defined,
the default behavior is to validate "postal_code" as a USA postal code. The
"default" keyword doesn't have an effect, but is nice to include for readers of
the schema to more easily recognize the default behavior.

Unfortunately, the approach above doesn't scale to more than two countries. You
can, however, wrap pairs of `if` and `then` inside an `allOf` to create
something that would scale. In this example, we'll use United States and
Canadian postal codes, but also add Netherlands postal codes, which are 4 digits
followed by two letters. It's left as an exercise to the reader to expand this
to the remaining postal codes of the world.

```json
// props { "isSchema": true }
{
  "type": "object",
  "properties": {
    "street_address": {
      "type": "string"
    },
    "country": {
      "default": "United States of America",
      "enum": ["United States of America", "Canada", "Netherlands"]
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "country": { "const": "United States of America" }
        }
      },
      "then": {
        "properties": {
          "postal_code": { "pattern": "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    },
    {
      "if": {
        "properties": {
          "country": { "const": "Canada" }
        },
        "required": ["country"]
      },
      "then": {
        "properties": {
          "postal_code": { "pattern": "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" }
        }
      }
    },
    {
      "if": {
        "properties": {
          "country": { "const": "Netherlands" }
        },
        "required": ["country"]
      },
      "then": {
        "properties": {
          "postal_code": { "pattern": "[0-9]{4} [A-Z]{2}" }
        }
      }
    }
  ]
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "1600 Pennsylvania Avenue NW",
  "country": "United States of America",
  "postal_code": "20500"
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "1600 Pennsylvania Avenue NW",
  "postal_code": "20500"
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "24 Sussex Drive",
  "country": "Canada",
  "postal_code": "K1M 1M4"
}
```
```json
// props { "indent": true, "valid": true }
{
  "street_address": "Adriaan Goekooplaan",
  "country": "Netherlands",
  "postal_code": "2517 JX"
}
```
```json
// props { "indent": true, "valid": false }
{
  "street_address": "24 Sussex Drive",
  "country": "Canada",
  "postal_code": "10000"
}
```
```json
// props { "indent": true, "valid": false }
{
  "street_address": "1600 Pennsylvania Avenue NW",
  "postal_code": "K1M 1M4"
}
```

> The `required` keyword is necessary in the `if` schemas or they would all
apply if the "country" is not defined. Leaving `required` off of the "United
States of America" `if` schema makes it effectively the default if no "country"
is defined.

> Even if "country" was a required field, it's still recommended to have the
`required` keyword in each `if` schema. The validation result will be the same
because `required` will fail, but not including it could add noise to error
results because it will validate the "postal_code" against all three of the
`then` schemas leading to irrelevant errors.

<Keywords label="single: conditionals; implication single: implication" />

## Implication

Before Draft 7, you can express an \"if-then\" conditional using the
[Schema composition](../../understanding-json-schema/reference/combining) keywords and a boolean algebra concept called
\"implication\". `A -> B` (pronounced, A implies B) means that if A is
true, then B must also be true. It can be expressed as `!A || B` which
can be expressed as a JSON Schema.

```json
// props { "isSchema": true }
{
  "type": "object",
  "properties": {
    "restaurantType": { "enum": ["fast-food", "sit-down"] },
    "total": { "type": "number" },
    "tip": { "type": "number" }
  },
  "anyOf": [
    {
      "not": {
        "properties": { "restaurantType": { "const": "sit-down" } },
        "required": ["restaurantType"]
      }
    },
    { "required": ["tip"] }
  ]
}
```
```json
// props { "indent": true, "valid": true }
{
  "restaurantType": "sit-down",
  "total": 16.99,
  "tip": 3.4
}
```
```json
// props { "indent": true, "valid": false }
{
  "restaurantType": "sit-down",
  "total": 16.99
}
```
```json
// props { "indent": true, "valid": true }
{
  "restaurantType": "fast-food",
  "total": 6.99
}
```
```json
// props { "indent": true, "valid": true }
{ "total": 5.25 }
```

Variations of implication can be used to express the same things you can
express with the `if`/`then`/`else` keywords. `if`/`then` can be
expressed as `A -> B`, `if`/`else` can be expressed as `!A -> B`, and
`if`/`then`/`else` can be expressed as `A -> B AND !A -> C`.

> Since this pattern is not very intuitive, it\'s recommended to put your
conditionals in `$defs` with a descriptive name and `$ref` it into your
schema with
`"allOf": [{ "$ref": "#/$defs/sit-down-restaurant-implies-tip-is-required" }]`.
