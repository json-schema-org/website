---
title: "Comments"
section: docs
---

<Star label="New in draft 7" />

The `$comment` keyword is strictly intended for adding comments to a
schema. Its value must always be a string. Unlike the annotations
`title`, `description`, and `examples`, JSON schema implementations
aren\'t allowed to attach any meaning or behavior to it whatsoever, and
may even strip them at any time. Therefore, they are useful for leaving
notes to future editors of a JSON schema, but should not be used to
communicate to users of the schema.

```json
    {
      "$comment": "Created by John Doe",
      "type": "object",
      "properties": {
        "country": {
          "$comment": "TODO: add enum of countries"
        }
      }
    }
```