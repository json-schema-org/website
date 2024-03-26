---
title: string
section: docs
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
`maxLength` keywords. For both keywords, the value must be a
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
string is considered valid if the expression matches anywhere within the
string. For example, the regular expression `"p"` will match any string
with a `p` in it, such as `"apple"` not just a string that is simply
`"p"`. Therefore, it is usually less confusing, as a matter of course,
to surround the regular expression in `^...$`, for example, `"^p$"`,
unless there is a good reason not to do so.

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

## Format[#format]

The `format` keyword allows for basic semantic identification of certain
kinds of string values that are commonly used. For example, because JSON
doesn\'t have a \"DateTime\" type, dates need to be encoded as strings.
`format` allows the schema author to indicate that the string value
should be interpreted as a date. By default, `format` is just an
annotation and does not effect validation.

Optionally, validator implementations can provide a configuration option
to enable `format` to function as an assertion rather than just an
annotation. That means that validation will fail if, for example, a
value with a `date` format isn\'t in a form that can be parsed as a
date. This can allow values to be constrained beyond what the other
tools in JSON Schema, including [Regular Expressions](../../understanding-json-schema/reference/regular_expressions) can
do.

> Implementations may provide validation for only a subset of the built-in
formats or do partial validation for a given format. For example, some
implementations may consider a string an email if it contains a `@`,
while others might do additional checks for other aspects of a well
formed email address.

There is a bias toward networking-related formats in the JSON Schema
specification, most likely due to its heritage in web technologies.
However, custom formats may also be used, as long as the parties
exchanging the JSON documents also exchange information about the custom
format types. A JSON Schema validator will ignore any format type that
it does not understand.

### Built-in formats[#built-in-formats]

The following is the list of formats specified in the JSON Schema
specification.

#### Dates and times

Dates and times are represented in [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). This is a subset
of the date format also commonly known as [ISO8601 format](https://www.iso.org/iso-8601-date-and-time-format.html).

- `"date-time"`: Date and time together, for example,
    `2018-11-13T20:20:39+00:00`.
- `"time"`: <StarInline label="New in draft 7" /> Time, for example, `20:20:39+00:00` 
- `"date"`: <StarInline label="New in draft 7" /> Date, for example, `2018-11-13`.
- `"duration"`: <StarInline label="New in draft 2019-09" />  A duration as defined by the [ISO 8601 ABNF for \"duration\"](https://datatracker.ietf.org/doc/html/rfc3339#appendix-A).
    For example, `P3D` expresses a duration of 3 days.

<Keywords label="single: email single: idn-email single: format; email single: format; idn-email" />

#### Email addresses

- `"email"`: Internet email address, see [RFC 5321, section 4.1.2](http://tools.ietf.org/html/rfc5321#section-4.1.2).
- `"idn-email"`: <StarInline label="New in draft 7" />  The internationalized form of an Internet email
    address, see [RFC 6531](https://tools.ietf.org/html/rfc6531).

<Keywords label="single: hostname single: idn-hostname single: format; hostname single: format; idn-hostname" />

#### Hostnames

- `"hostname"`: Internet host name, see [RFC 1123, section 2.1](https://datatracker.ietf.org/doc/html/rfc1123#section-2.1).
- `"idn-hostname"`: <StarInline label="New in draft 7" /> An internationalized Internet host name, see
    [RFC5890, section 2.3.2.3](https://tools.ietf.org/html/rfc5890#section-2.3.2.3).

<Keywords label="single: ipv4 single: ipv6 single: format; ipv4 single: format; ipv6" />

#### IP Addresses

- `"ipv4"`: IPv4 address, according to dotted-quad ABNF syntax as
    defined in [RFC 2673, section 3.2](http://tools.ietf.org/html/rfc2673#section-3.2).
- `"ipv6"`: IPv6 address, as defined in [RFC 2373, section 2.2](http://tools.ietf.org/html/rfc2373#section-2.2).

<Keywords label="single: uuid single: uri single: uri-reference single: iri single: iri-reference single: format; uuid single: format; uri single: format; uri-reference single: format; iri single: format; iri-reference" />

#### Resource identifiers

- `"uuid"`: <StarInline label="New in draft 2019-09" /> A Universally Unique Identifier as defined by [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122). Example:
    `3e4666bf-d5e5-4aa7-b8ce-cefe41c7568a`
- `"uri"`: A universal resource identifier (URI), according to
    [RFC3986](http://tools.ietf.org/html/rfc3986).
- `"uri-reference"`: <StarInline label="New in draft 6" />  A URI Reference (either a URI or a
    relative-reference), according to [RFC3986, section 4.1](http://tools.ietf.org/html/rfc3986#section-4.1).
- `"iri"`: <StarInline label="New in draft 7" /> The internationalized equivalent of a \"uri\", according to
    [RFC3987](https://tools.ietf.org/html/rfc3987).
- `"iri-reference"`: <StarInline label="New in draft 7" />  The internationalized equivalent of a
    \"uri-reference\", according to
    [RFC3987](https://tools.ietf.org/html/rfc3987)

If the values in the schema have the ability to be relative to a
particular source path (such as a link from a webpage), it is generally
better practice to use `"uri-reference"` (or `"iri-reference"`) rather
than `"uri"` (or `"iri"`). `"uri"` should only be used when the path
must be absolute.

<Keywords label="single: uri-template single: format; uri-template" />

#### URI template

- `"uri-template"`: <StarInline label="New in draft 6" /> A URI Template (of any level) according to
    [RFC6570](https://tools.ietf.org/html/rfc6570). If you don\'t
    already know what a URI Template is, you probably don\'t need this
    value.

<Keywords label="single: json-pointer single: relative-json-pointer single: format; json-pointer single: format; relative-json-pointer" />

#### JSON Pointer

- `"json-pointer"`: <StarInline label="New in draft 6" /> A JSON Pointer, according to
    [RFC6901](https://tools.ietf.org/html/rfc6901). There is more
    discussion on the use of JSON Pointer within JSON Schema in
    [Structuring a complex schema](../../understanding-json-schema/structuring). Note that this should be used only when
    the entire string contains only JSON Pointer content, e.g.
    `/foo/bar`. JSON Pointer URI fragments, e.g. `#/foo/bar/` should use
    `"uri-reference"`.
- `"relative-json-pointer"`: <StarInline label="New in draft 7" /> A [relative JSON pointer](https://tools.ietf.org/html/draft-handrews-relative-json-pointer-01).

<Keywords label="single: regex single: format; regex" />

#### Regular Expressions

- `"regex"`: <StarInline label="New in draft 7" /> A regular expression, which should be valid according to
    the [ECMA 262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)
    dialect.

Be careful, in practice, JSON schema validators are only required to
accept the safe subset of [regular expressions](../../understanding-json-schema/reference/regular_expressions) described elsewhere in this document.
