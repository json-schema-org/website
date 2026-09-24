---
title: "Making JSON Strings Work for Every Language"
date: "2026-06-16"
type: Engineering
cover: /img/posts/2026/making-json-strings-work-for-every-language/cover.svg
authors:
  - name: Fuqiao Xue
    photo: /img/posts/2026/making-json-strings-work-for-every-language/fuqiaoxue.jpg
    twitter: XueFuqiao
excerpt: "How JSON Schema authors preserve language and text direction metadata for the web."
language: en
---

JSON is one of the most successful data formats, but its `string` type is too simple. That simplicity becomes a problem when a string contains natural language text.

Titles, names, error messages, etc. often need more than Unicode characters. Consumers may also need to know the language of the text and its direction, especially when displaying right-to-left scripts such as Arabic or Hebrew. Without that metadata, applications fall back to guessing, and guessing fails.

The W3C Internationalization Working Group is developing [Strings on the Web: Language and Direction Metadata](https://www.w3.org/TR/string-meta/). Its recommendations are directly useful when schemas define fields that contain human-readable text.

The core recommendation is simple: if a field contains natural language text, it must be possible to determine the language and direction of that specific string. Prefer explicit metadata over heuristics.

For example, instead of treating every human-readable value as a plain string:

```json
{
  "bookName": "HTML و CSS: تصميم و إنشاء مواقع الويب"
}
```

a format can define a localizable text object:

```json
{
  "bookName": {
    "value": "HTML و CSS: تصميم و إنشاء مواقع الويب",
    "lang": "ar",
    "dir": "rtl"
  }
}
```

This gives producers and consumers a shared agreement. The producer can preserve the intended language and direction. The consumer can display the string correctly, apply the right `lang` and `dir` attributes in HTML, choose better fonts, select an appropriate text-to-speech voice, improve search and indexing, and avoid bidirectional text spillover.

A schema can make the expected structure explicit. The examples below define the three common patterns as reusable schema resources. The `$id` values use `example.com`; schema authors should replace them with stable identifiers for their own formats.

For the localizable text object pattern, the reusable schema keeps the string and its metadata together:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/localizable-text",

  "type": "object",
  "required": ["value"],
  "properties": {
    "value": { "type": "string" },
    "lang": { "type": "string" },
    "dir": { "enum": ["ltr", "rtl", "auto"] }
  },
  "additionalProperties": false
}
```

A data structure schema can reference it for any field that needs per-string language or direction metadata:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/book",

  "type": "object",
  "properties": {
    "bookName": { "$ref": "https://example.com/schemas/localizable-text" },
    "subtitle": { "$ref": "https://example.com/schemas/localizable-text" }
  }
}
```

The `lang` value should be a [BCP 47 language tag](https://www.rfc-editor.org/info/bcp47/).

The document also explains when not to add language and direction metadata. Not every JSON string is natural language text. Identifiers, protocol keywords, ISBNs, URLs, enum values, and many user-defined tokens are usually syntactic content, not localizable text. Specifications and schemas should distinguish these cases clearly.

For resources that contain many strings in the same language, a format can define resource-wide defaults, while still allowing string-specific overrides:

```json
{
  "language": "en-US",
  "direction": "ltr",
  "name": "Example University",
  "summary": "A short description.",
  "alternateName": {
    "value": "جامعة المثال",
    "lang": "ar",
    "dir": "rtl"
  }
}
```

The resource-wide defaults can be described as their own schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/global-lang-dir",

  "type": "object",
  "properties": {
    "language": { "type": "string" },
    "direction": { "enum": ["ltr", "rtl", "auto"] }
  }
}
```

A data structure schema can then combine those global settings with its own fields:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/university",

  "$ref": "https://example.com/schemas/global-lang-dir",
  "type": "object",
  "required": ["name", "summary"],
  "properties": {
    "name": { "type": "string" },
    "summary": { "type": "string" },
    "alternateName": { "$ref": "https://example.com/schemas/localizable-text" }
  }
}
```

The document recommends `language` for a resource-wide default language field and `direction` for a resource-wide default direction field. For localizable text objects, the examples use `lang` and `dir`, which align naturally with HTML attributes when the value is eventually displayed.

For multilingual values, the document recommends language maps, where language tags help consumers find the best localized value:

```json
{
  "bookName": {
    "en": { "value": "Learning Web Design" },
    "fr": { "value": "Apprendre le design web" },
    "ar": { "value": "تعلم تصميم الويب", "dir": "rtl" }
  }
}
```

A reusable language map schema can describe this pattern by treating the object property names as language tags and the property values as localizable text objects:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/language-map",

  "type": "object",
  "patternProperties": {
    "^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$": {
      "$ref": "https://example.com/schemas/localizable-text"
    }
  },
  "additionalProperties": false
}
```

A data structure schema can use that language map where a multilingual value is expected:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/book-with-translations",

  "type": "object",
  "properties": {
    "bookName": { "$ref": "https://example.com/schemas/language-map" }
  }
}
```

Note that the language tag regular expression above is loose. It applies the value schema to properties whose names look like non-empty, hyphen-separated language tag tokens, but it does not validate the full BCP 47 grammar. Applications that require full BCP 47 validation should use or implement a dedicated validator.

Producers should preserve language and direction metadata when they have it. They should avoid redundant per-string metadata when a resource-wide default already applies, but they should include string-specific metadata when a value uses a different language, a more specific language tag, or a direction opposite to the default.

Consumers should use the metadata they receive. For example, when inserting a string into HTML, that usually means applying `lang` and `dir` to an element that tightly wraps the inserted text, or using `bdi` when no better element is available. When metadata is absent, the language and direction should be treated as unknown. [First-strong direction](https://www.w3.org/TR/i18n-glossary/#dfn-first-strong-detection) detection can be a fallback, but it should not replace explicit metadata.

Language metadata also affects font selection, line breaking, hyphenation, spell checking, search, filtering, accessibility, and text-to-speech.

Unicode lets us exchange the characters, and metadata helps applications process and present those characters correctly.

We invite JSON Schema users, schema authors, and specification developers to read the recommendations of the W3C Internationalization Working Group and apply its patterns when designing JSON-based formats. Feedback on the document is welcome via the [W3C string-meta GitHub repository](https://github.com/w3c/string-meta/issues).
