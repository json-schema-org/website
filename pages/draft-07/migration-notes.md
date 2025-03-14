---
title: Draft 06 to Draft 07
section: docs
---


### Introduction

JSON Schema Draft 7 builds upon Draft 6 by introducing new validation and annotation keywords, refining conditional validation capabilities, and clarifying core behaviors. These changes improve schema expressiveness and usability while maintaining backward compatibility with Draft 6.

This guide will help you understand the new keywords and behaviors introduced in Draft 7 for better transition.

### Keyword changelog

| Keyword(Draft 6)  | Keyword(Draft 7)    | Specification | Keyword type | Behavior Details |
| ---------------- | ---------------- | ----------------| --------------- | --------------- |
|`$schema` |`$schema` | Core | Identifier | Change in the dialect (Uses the latest Draft7 dialect).           |
|not present | `$comment`| Core | Reserved location | The `$comment` keyword was introduced for internal comments, requiring a string that must not be shown to end users and has no impact on validation. Worked as annotation in Draft 6 but now works as a keyword in Draft 7.            |
| not present | `if`| `validation` | Applicator | The `if` keyword was introduced, requiring a valid JSON Schema; instances must validate against then if `if` succeeds, and against else if `if` fails, with `if` validation always succeeding on its own. |
| not present | `then`| `validation`| Applicator |  The `then` keyword was introduced, requiring a valid JSON Schema; it succeeds if the instance validates against both `if` and `then`, and always succeeds if `if` is absent or fails.  |
| not present | `else` | `validation` | Applicator | The `else` keyword was introduced, requiring a valid JSON Schema; it succeeds if the instance fails `if` and validates against `else`, and always succeeds if `if` is absent or succeeds |
| not present  | `contentEncoding` | `validation` | Annotation | The `contentEncoding` keyword was introduced to specify that a string instance should be treated as binary data, requiring a valid string value for encoding. |
| not present  | `contentMediaType`| `validation` | Annotation | The `contentMediaType` keyword specifies the media type of instances defined by the schema and must be a string; it is ignored if the instance is not a string. |
| not present  | `readOnly` | `validation`| Annotation        | The `readOnly` keyword, set to true, indicates that the instance value is managed by the owning authority, and modifications by applications will be ignored. |
| not present  | `writeOnly`| `validation` | Annotation         | The `writeOnly` keyword, set to true, means the value is not retrieved from the authority but can be sent for updates or creation. |

### Tutorial

#### Migration Steps

##### 1. Update the `$schema` Declaration

Replace your Draft 6 schema declaration with the Draft 7 identifier:

 **Before (Draft 6):**

```
{
  "$schema": "http://json-schema.org/draft-06/schema#"
}
```

**After (Draft 7):**

```
{
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

##### 2. Incorporate the `$comment` Keyword (Optional)

If you want to include inline comments for documentation purposes, use the `$comment` keyword:

```
{
  "$comment": "This field is deprecated and will be removed in the next version."
}
```

##### 3. Implement Conditional Validation with `if`, `then`, and `else`

Draft 7 introduces conditional validation, which allows schemas to specify different validation rules depending on whether a condition is met.

 **Example:**

```
{
  "type": "object",
  "properties": {
    "age": { "type": "integer" }
  },
  "if": { "properties": { "age": { "minimum": 18 } } },
  "then": { "properties": { "canVote": { "const": true } } },
  "else": { "properties": { "canVote": { "const": false } } }
}
```

*Explanation:* If `age` is 18 or higher, `canVote` must be `true`; otherwise, it must be `false`.

##### 4. Utilize `contentEncoding` and `contentMediaType` for String Data Interpretation

These keywords help define how string instances should be treated:

 **Example:**

```
{
  "type": "string",
  "contentEncoding": "base64",
  "contentMediaType": "image/png"
}
```

*Explanation:* The string must be base64-encoded and represent a PNG image.

##### 5. Define `readOnly` and `writeOnly` Fields

These annotations help define whether a field should be modifiable or retrievable.

 **Example:**

```
{
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "readOnly": true
    },
    "password": {
      "type": "string",
      "writeOnly": true
    }
  }
}
```

*Explanation:* `username` is read-only (cannot be changed by clients), while `password` is write-only (cannot be retrieved once set).

### Conclusion

Migrating from JSON Schema Draft 6 to Draft 7 is mostly seamless. The key updates include:

- The introduction of `$comment` for internal documentation.
- New conditional validation keywords (`if`, `then`, `else`).
- Enhanced support for string-based data with `contentEncoding` and `contentMediaType`.
- Read/write permissions via `readOnly` and `writeOnly`.

These adjustments helps you take full advantage of the improvements introduced in Draft 7 while ensuring compatibility with existing schemas.


