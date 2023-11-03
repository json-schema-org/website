---
section: docs
title: "Conventions used in this documentation"
---

## Language-specific notes

The names of the basic types in JavaScript and JSON can be confusing
when coming from another dynamic language. I\'m a Python programmer by
day, so I\'ve notated here when the names for things are different from
what they are in Python, and any other Python-specific advice for using
JSON and JSON Schema. I\'m by no means trying to create a Python bias to
this book, but it is what I know, so I\'ve started there. In the long
run, I hope this book will be useful to programmers of all stripes, so
if you\'re interested in translating the Python references into Algol-68
or any other language you may know, pull requests are welcome!

The language-specific sections are shown with tabs for each language.
Once you choose a language, that choice will be remembered as you read
on from page to page.

For example, here\'s a language-specific section with advice on using
JSON in a few different languages:

[tabs-start "Language-specific info"]

[tab "Python"]
In Python, JSON can be read using the json module in the standard library.
[tab "Ruby"]
In Ruby, JSON can be read using the json gem.
[tab "C"]
For C, you may want to consider using [Jansson](http://www.digip.org/jansson/) to read and write JSON.
[tab "Objective-C"]
In Objective-C, JSON can be read using the `NSJSONSerialization` class.
[tab "Swift"]
In Swift, JSON can be read using the `JSONDecoder` class.

[tabs-end]

## Draft-specific notes

The JSON Schema standard has been through a number of revisions or
\"drafts\". The current version is Draft 2020-12, but some older drafts
are still widely used as well.

The text is written to encourage the use of Draft 2020-12 and gives
priority to the latest conventions and features, but where it differs
from earlier drafts, those differences are highlighted in special
call-outs. If you only wish to target Draft 2020-12, you can safely
ignore those sections.

<Star label="New in draft 2020-12" />

[tabs-start "Language-specific info"]

[tab "Draft 2019-09"]
This is where anything pertaining to an old draft would be mentioned.
[tabs-end]

## Examples

There are many examples throughout this book, and they all follow the
same format. At the beginning of each example is a short JSON schema,
illustrating a particular principle, followed by short JSON snippets
that are either valid or invalid against that schema. Valid examples are
in green, with a checkmark. Invalid examples are in red, with a cross.
Often there are comments in between to explain why something is or
isn\'t valid.

> These examples are tested automatically whenever the book is
built, so hopefully they are not just helpful, but also correct!

These examples are tested automatically whenever the book is built, so
hopefully they are not just helpful, but also correct!

For example, here\'s a snippet illustrating how to use the `number` type:

```json
// props { "isSchema": true }
{ "type": "number" }
```
```json
// props { "indent": true, "valid": true }
42
```
```json
// props { "indent": true, "valid": true }
-1
```
Simple floating point number:

```json
// props { "indent": true, "valid": true }
5.0
```
Exponential notation also works:

```json
// props { "indent": true, "valid": true }
2.99792458e8
```
Numbers as strings are rejected:

```json
// props { "indent": true, "valid": false }
"42"
```
