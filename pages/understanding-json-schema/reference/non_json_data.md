---
title: "Media: string-encoding non-JSON data"
section: docs
---

<Keywords label="single: non-JSON data single: media" />

<Star label="New in draft 7" />

JSON schema has a set of keywords to describe and optionally validate
non-JSON data stored inside JSON strings. Since it would be difficult to
write validators for many media types, JSON schema validators are not
required to validate the contents of JSON strings based on these
keywords. However, these keywords are still useful for an application
that consumes validated JSON.

<Keywords label="single: contentMediaType single: media; contentMediaType" />

## contentMediaType

The `contentMediaType` keyword specifies the MIME type of the contents
of a string, as described in [RFC 2046](https://tools.ietf.org/html/rfc2046).
There is a list of [MIME types officially registered by the IANA](http://www.iana.org/assignments/media-types/media-types.xhtml),
but the set of types supported will be application and operating system dependent.
Mozilla Developer Network also maintains a [shorter list of MIME types that are important for the web](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)

<Keywords label="single: contentEncoding single: media; contentEncoding" />

## contentEncoding

The `contentEncoding` keyword specifies the encoding used to store the
contents, as specified in [RFC 2054, part
6.1](https://tools.ietf.org/html/rfc2045) and [RFC
4648](https://datatracker.ietf.org/doc/html/rfc4648).

The acceptable values are  `quoted-printable`,
`base16`, `base32`, and `base64`. If not specified, the encoding is the
same as the containing JSON document.

Without getting into the low-level details of each of these encodings,
there are really only two options useful for modern usage:

- If the content is encoded in the same encoding as the enclosing JSON
    document (which for practical purposes, is almost always UTF-8),
    leave `contentEncoding` unspecified, and include the content in a
    string as-is. This includes text-based content types, such as
    `text/html` or `application/xml`.
- If the content is binary data, set `contentEncoding` to `base64` and
    encode the contents using
    [Base64](https://tools.ietf.org/html/rfc4648). This would include
    many image types, such as `image/png` or audio types, such as
    `audio/mpeg`.

<Keywords label="single: contentSchema single: media; contentSchema" />

## contentSchema
<Star label="New in draft 2019-09" />

Documentation Coming soon

## Examples

The following schema indicates the string contains an HTML document,
encoded using the same encoding as the surrounding document:

```json
// props { "isSchema": true }
{
  "type": "string",
  "contentMediaType": "text/html"
}
```
```json
// props { "indent": true, "valid": true }
"<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head></html>"
```
The following schema indicates that a string contains a PNG image, encoded using Base64:

```json
// props { "isSchema": true }
{
  "type": "string",
  "contentEncoding": "base64",
  "contentMediaType": "image/png"
}
```
```json
// props { "indent": true, "valid": true }
"iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA..."
```