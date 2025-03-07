---
title: "Enumerated values"
section: docs
prev: 
  label: Enumerated and Constant Values
  url: /understanding-json-schema/reference/generic
next: 
  label: Constant values
  url: /understanding-json-schema/reference/const
---


The `enum` [keyword](../../learn/glossary#keyword) is used to restrict a value to a fixed set of values.
It must be an array with at least one element, where each element is unique.

Below are several examples demonstrating its usage.

### Basic Example: Street Light Colors

This example demonstrates how to validate that the `color` property of a street light is either "red", "amber", or "green".

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

### Extended Example: Accepting Multiple Data Types

Enums can be used without explicitly setting a data type, allowing different types of values.
In the following example, the schema is extended to include `null` (to represent an "off" state).

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
{ "color": 0 }
```


### Additional Example: Mixed Types for Shape

```json
// props { "isSchema": true }
{
  "properties": {
    "shape": {
      "enum": ["circle", "square", 1, null]
    }
  }
}
```

```json
// props { "indent": true, "valid": true }
{ "shape": "circle" }
```

```json
// props { "indent": true, "valid": true }
{ "shape": 1 }
```

```json
// props { "indent": true, "valid": true }
{ "shape": null }
```

```json
// props { "indent": true, "valid": false }
{ "shape": "triangle" }
```
