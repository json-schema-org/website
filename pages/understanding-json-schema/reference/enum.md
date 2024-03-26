---
title: "Enumerated values"
section: docs
---

The `enum` keyword is used to restrict a value to a fixed set of values.
It must be an array with at least one element, where each element is
unique.

The following is an example for validating street light colors:

```json
// props { "isSchema": true }
{
  "enum": ["red", "amber", "green"]
}
```
```json
// props { "indent": true, "valid": true }
"red"
```
```json
// props { "indent": true, "valid": false }
"blue"
```

You can use `enum` even without a type, to accept values of different
types. Let\'s extend the example to use `null` to indicate \"off\", and
also add 42, just for fun.

```json
// props { "isSchema": true }
{
  "enum": ["red", "amber", "green", null, 42]
}
```
```json
// props { "indent": true, "valid": true }
"red"
```
```json
// props { "indent": true, "valid": true }
null
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": false }
0
```
