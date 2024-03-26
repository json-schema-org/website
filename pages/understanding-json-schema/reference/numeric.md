---
title: "Numeric types"
section: docs
---

<Keywords label="single: integer single: number single: types; numeric" />

There are two numeric types in JSON Schema: [integer](#integer) and [number](#number).
They share the same validation keywords.

> JSON has no standard way to represent complex numbers, so there is no
way to test for them in JSON Schema.

## integer[#integer]

The `integer` type is used for integral numbers. JSON does not have
distinct types for integers and floating-point values. Therefore, the
presence or absence of a decimal point is not enough to distinguish
between integers and non-integers. For example, `1` and `1.0` are two
ways to represent the same value in JSON. JSON Schema considers that
value an integer no matter which representation was used.

[tabs-start "Language-specific info"]
[tab "Python"]
In Python, "integer" is analogous to the `int` type.
[tab "Ruby"]
In Ruby, "integer" is analogous to the `Integer` type.
[tab "Objective-C"]
In Objective-C, "integer" is analogous to the `NSInteger` type.
[tab "Swift"]
In Swift, "integer" is analogous to the `Int` type.

[tabs-end]

```json
// props { "isSchema": true }
{ "type": "integer" }
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": true }
-1
```
Numbers with a zero fractional part are considered integers:

```json
// props { "indent": true, "valid": true }
1.0
```
Floating point numbers are rejected:

```json
// props { "indent": true, "valid": false }
3.1415926
```
Numbers as strings are rejected:

```json
// props { "indent": true, "valid": false }
"42"
```

## number[#number]

The `number` type is used for any numeric type, either integers or
floating point numbers.

<Keywords label="single: multipleOf single: number; multiple of" />

[tabs-start "Language-specific info"]
[tab "Python"]
In Python, "number" is analogous to the `float` type.
[tab "Ruby"]
In Ruby, "number" is analogous to the `Float` type.
[tab "Objective-C"]
In Objective-C, "number" is analogous to the `double` or `NSNumber` type.
[tab "Swift"]
In Swift, "number" is analogous to the `Double` type.

[tabs-end]

```json
// props { "isSchema": true }
{ "type": "number" }
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": true }
-1
```
Simple floating point number:

```json
// props { "indent": true, "valid": true }
5.0
```
Exponential notation also works:

```json
// props { "indent": true, "valid": true }
2.99792458e8
```
Numbers as strings are rejected:

```json
// props { "indent": true, "valid": false }
"42"
```

<Keywords label="single: multipleOf single: number; multiple of" />

## Multiples

Numbers can be restricted to a multiple of a given number, using the
`multipleOf` keyword. It may be set to any positive number.

```json
// props { "isSchema": true }
{
  "type": "number",
  "multipleOf" : 10
}
```
```json
// props { "indent": true, "valid": true }
0
```
```json
// props { "indent": true, "valid": true }
10
```
```json
// props { "indent": true, "valid": true }
20
```
```json
// props { "indent": true, "valid": false }
23
```

The multiple can be a floating point number:

```json
// props { "isSchema": true }
{
  "type": "number",
  "multipleOf" : 0.01
}
```
```json
// props { "indent": true, "valid": true }
4.02
```
```json
// props { "indent": true, "valid": false }
4.021
```


<Keywords label="single: number; range single: maximum single: exclusiveMaximum single: minimum single: exclusiveMinimum" />

## Range[#range]

Ranges of numbers are specified using a combination of the `minimum` and
`maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for
expressing exclusive range).

If *x* is the value being validated, the following must hold true:

> *x* ≥ `minimum`  
> *x* \> `exclusiveMinimum`  
> *x* ≤ `maximum`  
> *x* \< `exclusiveMaximum`

While you can specify both of `minimum` and `exclusiveMinimum` or both
of `maximum` and `exclusiveMaximum`, it doesn\'t really make sense to do
so.

```json
// props { "isSchema": true }
{
  "type": "number",
  "minimum": 0,
  "exclusiveMaximum": 100
}
```
Less than `minimum`:

```json
// props { "indent": true, "valid": false }
-1
```
`minimum` is inclusive, so 0 is valid:

```json
// props { "indent": true, "valid": true }
0
```
```json
// props { "indent": true, "valid": true }
10
```
```json
// props { "indent": true, "valid": true }
99
```
`exclusiveMaximum` is exclusive, so 100 is not valid:

```json
// props { "indent": true, "valid": false }
100
```
Greater than `maximum`:

```json
// props { "indent": true, "valid": false }
101
```

[tabs-start "Draft-specific info"]
[tab "Draft 4"]
In JSON Schema Draft 4, `exclusiveMinimum` and `exclusiveMaximum` work
differently. There they are boolean values, that indicate whether
`minimum` and `maximum` are exclusive of the value. For example:

> if `exclusiveMinimum` is `false`, *x* ≥ `minimum`  
> if `exclusiveMinimum` is `true`, *x* > `minimum`.

This was changed to have better keyword independence.  
  
Here is an example using the older Draft 4 convention:

```json
// props { "isSchema": true }
{
  "type": "number",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMaximum": true
}
```
Less than `minimum`:
```json
// props { "indent": true, "valid": false }
-1
```
`exclusiveMinimum` was not specified, so 0 is included:

```json
// props { "indent": true, "valid": true }
0
```
```json
// props { "indent": true, "valid": true }
10
```
```json
// props { "indent": true, "valid": true }
99
```
`exclusiveMaximum` is `true`, so 100 is not included:

```json
// props { "indent": true, "valid": false }
100
```
Greater than `maximum`:

```json
// props { "indent": true, "valid": false }
101
```

[tabs-end]
