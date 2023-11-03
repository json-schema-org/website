---
title: "null"
section: docs
---

When a schema specifies a `type` of `null`, it has only one acceptable value: `null`.

> It's important to remember that in JSON, `null` isn't equivalent to something being absent. See [Required Properties](../../understanding-json-schema/reference/object#required) for an example.

[tabs-start "Language-specific info"]

[tab "Python"]
In Python, `null` is analogous to `None`.

[tab "Ruby"]
In Ruby, `null` is analogous to `nil`.

[tab "Objective-C"]
In Objective-C, `null` is analogous to `nil`.

[tab "Swift"]
In Swift, `null` is analogous to `nil`.

[tabs-end]

```json
// props { "isSchema": true }
{ "type": "null" }
```
```json
// props { "indent": true, "valid": true }
null
```
```json
// props { "indent": true, "valid": false }
false
```
```json
// props { "indent": true, "valid": false }
0
```
```json
// props { "indent": true, "valid": false }
""
```
```json
// props { "indent": true, "valid": false }
⠀
```
