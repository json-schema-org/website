---
title: "Enumerated values"
section: docs
prev: 
  label: Comments
  url: /understanding-json-schema/reference/comments
next: 
  label: Constant values
  url: /understanding-json-schema/reference/const
---

The `enum` [keyword](../../learn/glossary#keyword) is used to restrict a value to a fixed set of values.
It must be an array with at least one element, where each element is
unique.

The following is an example for validating street light colors:

```json
// props { "isSchema": true }
{
  "properties": {
    "color": {
      "enum": ["red", "amber", "green"]
    }
  }
}
```
```json
// props { "indent": true, "valid": true }
{  "color": "red" }
```

```json
// props { "indent": true, "valid": false }
{  "color": "blue" }
```

You can use `enum` even without a type, to accept values of different
types. Let\'s extend the example to use `null` to indicate \"off\", and
also add 42, just for fun.

```json
// props { "isSchema": true }
{
  "properties": {
    "color": {
      "enum": ["red", "amber", "green", null, 42]
    }
  }
}
```

```json
// props { "indent": true, "valid": true }
{ "color": null }
```

```json
// props { "indent": true, "valid": true }
{ "color": 42 }
```

```json
// props { "indent": true, "valid": false }
{ "color": "blue" }
```