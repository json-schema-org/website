---
title: "Constant values"
section: docs
---

<Star label="New in draft 6" />

The `const` keyword is used to restrict a value to a single value.

For example, if you only support shipping to the United States for
export reasons:

```json
// props { "isSchema": true }
{
  "properties": {
    "country": {
      "const": "United States of America"
    }
  }
}
```
```json
// props { "indent": true, "valid": true }
{ "country": "United States of America" }
```
```json
// props { "indent": true, "valid": false }
{ "country": "Canada" }
```
