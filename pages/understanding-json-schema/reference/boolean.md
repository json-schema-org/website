---
title: "boolean"
section: docs
---

<Keywords label="single: boolean" />

The boolean type matches only two special values: `true` and `false`.
Note that values that *evaluate* to `true` or `false`, such as 1 and 0,
are not accepted by the schema.

[tabs-start "Language-specific info"]

[tab "Python"]
In Python, "boolean" is analogous to `bool`.  Note that in JSON,
`true` and `false` are lower case, whereas in Python they are
capitalized (`True` and `False`).

[tab "Ruby"]
In Ruby, "boolean" is analogous to `TrueClass` and `FalseClass`.  Note
that in Ruby there is no `Boolean` class.

[tab "Objective-C"]
In Objective-C, "boolean" is analogous to `BOOL`.

[tab "Swift"]
In Swift, "boolean" is analogous to `Bool`.

[tabs-end]

```json
// props { "isSchema": true }
{ "type": "boolean" }
```
```json
// props { "indent": true, "valid": true }
true
```
```json
// props { "indent": true, "valid": true }
false
```
```json
// props { "indent": true, "valid": false }
"true"
```
Values that evaluate to `true` or `false` are still not accepted by the schema:

```json
// props { "indent": true, "valid": false }
0
```