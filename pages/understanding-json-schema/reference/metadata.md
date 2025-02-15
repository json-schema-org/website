---
title: "Schema annotations and comments"
section: docs
prev: 
  label: Constant values
  url: /understanding-json-schema/reference/const
next: 
  label: Annotations
  url: http://localhost:3000/understanding-json-schema/reference/annotations
---

Annotations and comments are not directly related to the core structure and constraints of the JSON Schema itself. As such, keywords for annotations and comments are not required, however, using them can improve the maintainability of your schemas.  

Annotations are optional pieces of information that provide additional context or meaning to a JSON Schema. They are not used for data validation but can serve various purposes, such as:

- **Descriptions**. Adding human-readable descriptions to properties or the entire schema.
- **Defaults**. Specifying default values for properties.
- **Examples**. Providing example JSON objects that validate against the schema.
- **ReadOnly/WriteOnly**. Indicating read-only or write-only properties (often used in API contexts).
- **Deprecated**.  Marking properties or features that are discouraged from use and might be removed in the future.
  

While annotations don't enforce data validation, they play a valuable role in enhancing the clarity, usability, and maintainability of JSON Schemas.

Unlike some programming languages, JSON Schema itself doesn't natively support comments. However, it provides the keyword `$comment`, which allows schema authors to add comments within their schema. These comments enhance the clarity and maintainability of your schemas; they're intended for schema maintainers and are invisible to applications using the schema for validation.

By incorporating annotations and comments into your schemas you can improve their clarity, maintainability, and overall quality. This will ensure your schemas are easier to understand and managed over time. 

To get started, explore the following resources:

- [Annotations](../../understanding-json-schema/reference/annotations)
- [Comments](../../understanding-json-schema/reference/comments)
