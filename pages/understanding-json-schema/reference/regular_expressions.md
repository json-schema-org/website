---
title: "Regular Expressions"
section: docs
---

<Keywords label="regular expressions" />

The [pattern](../../understanding-json-schema/reference/string#regexp) and
[patternProperties](../../understanding-json-schema/reference/object#regexp) keywords use regular expressions to
express constraints. The regular expression syntax used is from
JavaScript ([ECMA 262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/),
specifically). However, that complete syntax is not widely supported,
therefore it is recommended that you stick to the subset of that syntax
described below.

-   A single unicode character (other than the special characters below)
    matches itself.
-   `.`: Matches any character except line break characters. (Be aware
    that what constitutes a line break character is somewhat dependent
    on your platform and language environment, but in practice this
    rarely matters). To include newlines use the ``(.|\r?\n)*`` pattern
    which avoids the use of regex flags/modifiers and has good support
    across regex libraries.
-   `^`: Matches only at the beginning of the string.
-   `$`: Matches only at the end of the string.
-   `(...)`: Group a series of regular expressions into a single regular
    expression.
-   `|`: Matches either the regular expression preceding or following
    the `|` symbol.
-   `[abc]`: Matches any of the characters inside the square brackets.
-   `[a-z]`: Matches the range of characters.
-   `[^abc]`: Matches any character *not* listed.
-   `[^a-z]`: Matches any character outside of the range.
-   `+`: Matches one or more repetitions of the preceding regular
    expression.
-   `*`: Matches zero or more repetitions of the preceding regular
    expression.
-   `?`: Matches zero or one repetitions of the preceding regular
    expression.
-   `+?`, `*?`, `??`: The `*`, `+`, and `?` qualifiers are all greedy;
    they match as much text as possible. Sometimes this behavior isn\'t
    desired and you want to match as few characters as possible.
-   `(?!x)`, `(?=x)`: Negative and positive lookahead.
-   `{x}`: Match exactly `x` occurrences of the preceding regular
    expression.
-   `{x,y}`: Match at least `x` and at most `y` occurrences of the
    preceding regular expression.
-   `{x,}`: Match `x` occurrences or more of the preceding regular
    expression.
-   `{x,y}?`, `{x,}?`: Non-greedy versions of the above expressions.
-   Use only standard escapes like ``\n``, ``\r``, ``\t`` and keep 
    in mind that you also need to do JSON escaping.

Example
-------

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

The following example checks that the string starts with `{{` and ends with `}}`
and that it also allows multiline strings.

```json
   {
      "type": "string",
      "pattern": "^\\{\\{(.|[\\r\\n])*\\}\\}$",
   }
```
```json
   "{{ foo\nbar }}"
```
```json
   "{ foo }"
```