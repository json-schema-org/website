---
title: string
section: docs
prev: 
  label: Regular expressions
  url: /understanding-json-schema/reference/regular_expressions
next: 
  label: Dialect and vocabulary declaration
  url: /understanding-json-schema/reference/schema
---

The `string` type is used for strings of text. It may contain Unicode characters.

[tabs-start "Language-specific info"]

[tab "Python"]
In Python, "string" is analogous to the `unicode` type on Python

[tab "Ruby"]
In Ruby, "string" is analogous to the String type.

[tab "Objective-C"]
In Objective-C, "string" is analogous to the ``NSString`` type.

[tab "Swift"]
In Swift, "string" is analogous to the ``String`` type.

[tabs-end]

```json
// props { "isSchema": true }
{ "type": "string" }
```
```json
// props { "indent": true, "valid": true }
"Déjà vu"
```
```json
// props { "indent": true, "valid": true }
""
```
```json
// props { "indent": true, "valid": true }
"42"
```
```json
// props { "indent": true, "valid": false }
42
```

## Length[#length]

The length of a string can be constrained using the `minLength` and
`maxLength` [keywords](../../learn/glossary#keyword). For both keywords, the value must be a
non-negative number.

```json
// props { "isSchema": true }
{
  "type": "string",
  "minLength": 2,
  "maxLength": 3
}
```
```json
// props { "indent": true, "valid": false }
"A"
```
```json
// props { "indent": true, "valid": true }
"AB"
```
```json
// props { "indent": true, "valid": true }
"ABC"
```
```json
// props { "indent": true, "valid": false }
"ABCD"
```

## Regular Expressions[#regexp]

The `pattern` keyword is used to restrict a string to a particular
regular expression. The regular expression syntax is the one defined in
JavaScript ([ECMA 262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)
specifically) with Unicode support. See
[Regular Expressions](../../understanding-json-schema/reference/regular_expressions) for more information.

> When defining the regular expressions, it\'s important to note that the
> string is considered valid if the expression matches anywhere within the
> string. For example, the regular expression `"p"` will match any string
> with a `p` in it, such as `"apple"` not just a string that is simply
> `"p"`. Therefore, it is usually less confusing, as a matter of course,
> to surround the regular expression in `^...$`, for example, `"^p$"`,
> unless there is a good reason not to do so.

The following example matches a simple North American telephone number
with an optional area code:

```json
// props { "isSchema": true }
{
  "type": "string",
  "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
}
```
```json
// props { "indent": true, "valid": true }
"555-1212"
```
```json
// props { "indent": true, "valid": true }
"(888)555-1212"
```
```json
// props { "indent": true, "valid": false }
"(888)555-1212 ext. 532"
```
```json
// props { "indent": true, "valid": false }
"(800)FLOWERS"
```
