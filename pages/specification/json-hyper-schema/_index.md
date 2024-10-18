---
title: JSON Hyper-Schema
---

### Introduction

JSON Hyper-Schema is an extension of JSON Schema that allows for the definition of hypermedia-driven APIs. The hyper-schema vocabulary shows how to annotate JSON documents with hypermedia controls by enabling the description of links and actions that can be executed on JSON data. Consecutively, it helps provide a more interactive and dynamic representation of JSON data. It also enhances API discoverability using the description features of actions and links within the JSON documents.

JSON Hyper-Schema seamlessly integrates with existing JSON HTTP APIs and offers functionalities to describe complex resource relationships, facilitate client-side validation, and promote better interaction patterns. It makes APIs more intuitive, self-descriptive, and efficient, particularly in RESTful architectures.

In essence:

- JSON Hyper-Schema is helpful in complex APIs where clients need to define and explicitly understand the relationships between resources and actions, especially when navigating resources without prior knowledge of the API structure.
- It helps create more discoverable and self-documenting APIs, making it easier for clients to interact with them.


## Hyper-schema use cases

### Basic concept

**Get a JSON instance**

```http
GET https://example.com/book/12345
```

_This `GET` request fetches information about a specific book, identified by the `book` ID (`12345`). In response:_

```http
200 OK
Content-Type: application/json
Link: <https://example.com/schemas/book>; rel="describedby"

{
  "title": "Mobby-Dick",
  "authorId": 100,
  ...
}
```

_The server responds with a successful `200 OK` status, JSON-formatted data, and a `Link` header that references the schema describing the structure of the returned data, including details like the `book` `title` and a link to the author via `authorId`._

**Get the schema that describes the instance using the "`describedby`" Link header.**

```http
GET https://example.com/schemas/book
```

_This request fetches the schema describing the structure of the `book` object.
In response:_

```http
200 OK
Content-Type: application/schema+json

{
  "links": [
    {
      "href": "/author/{authorId}",
      "rel": "author",
      "templateRequired": ["authorId"]
    }
  ]
}
```

_The response contains a JSON Schema describing the instance's structure and links to relevant resources, such as the author's resource via `rel="author`." It also specifies that the `authorId` is required to complete the URL template._

**Use the LDO combined with the instance to construct a link to get information about the author.**

```http
GET https://example.com/author/100
```

This request fetches data for the author with `authorId` 100. In response:

```http
200 OK
Content-Type: application/json
Link: <https://example.com/schemas/author>; rel="describedby"

{
  "name": "Herman Melville",
  ...
}
```

_The response includes a JSON object with the author's details, and the `Link` header points to the schema that describes the author, following the same format as the book schema._

Keep following links to discover more content.

### Actions

#### Search

Using a link to construct a URI from user input. (Analogous to `<form method="get">`)

```json
{
  "links": [
    {
      "href": "/books"
      "rel": "search",
      "hrefSchema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "author": { "type": "integer" },
          ...
        }
      }
    }
  ]
}
```

```http
GET https://example.com/books?title=Moby-Dick
```

_This `GET` request searches for books with the title `Moby-Dick`._

```http
200 OK
Content-Type: application/json
Link: <https://example.com/schemas/books>; rel="describedby"

[
  {
    "title": "Mobby-Dick",
    "authorId": 100,
    ...
  }
]
```

_The response returns a successful `200 OK` JSON-formatted data with a `Link` to the schema describing the book collection, and the response body contains an array of books, each with details such as the `title` and `authorId`._

#### Submission

Using a link to submit user input. (Analogous to `<form method="post">`)

```json
{
  "links": [
    {
      "href": "/books"
      "rel": "collection",
      "submissionSchema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "authorId": { "type": "integer" },
          ...
        },
        "required": ["title", "authorId", ...]
      }
    }
  ]
}
```

```http
POST https://example.com/books
Content-Type: application/json

{
  "title": "Moby-Dick",
  "authorId": 100,
  ...
}
```

_This `POST` request submits data to create a new book with the title "Moby-Dick" and `authorId` 100._

```http
204 No Content
```

_The request was successful, and the book was created, but the response contained no content._

##### Submission Media Type

You can also make submission will media types other than JSON.

```json
{
  "links": [
    {
      "href": "/books"
      "rel": "collection",
      "submissionMediaType": "application/xml",
      "submissionSchema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "authorId": { "type": "integer" },
          ...
        },
        "required": ["title", "authorId", ...]
      }
    }
  ]
}
```

```http
POST https://example.com/books
Content-Type: application/xml

<Book>
  <title>Moby-Dick<title>
  <authorId>100</authorId>
  ...
</Book>
```

```http
204 No Content
```

_This code shows using application/xml, to create a new book resource with a `POST` request._

### Relations

#### Registered relation

A registered relation pointing to an author.

```json
{
  "links": [
    {
      "href": "https://example.com/authors/100",
      "rel": "author"
    }
  ]
}
```

#### Custom relation

A custom relation linking to a specific review.

```json
{
  "links": [
    {
      "href": "https://example.com/review/6789",
      "rel": "https://example.com/relations/review"
    }
  ]
}
```

#### Multiple relations

A multiple relations associating a comments collection with two different relationship types.

```json
{
  "links": [
    {
      "href": "https://example.com/reviews",
      "rel": ["collection", "https://example.com/relations/reviews"]
    }
  ]
}
```

### Base URIs

A base URI is used to resolve relative URIs.

#### Default

By default, the base URI for relative URIs in LDOs is the URI used to retrieve the resource

```http
GET https://example.com/books/1
```

```json
{
  "links": [
    {
      "href": "/author/1",
      "rel": "author"
    }
  ]
}
```

Link Target: `https://example.com/author/1`

#### Setting the base URI

`base` can be used to alter the base URI. It is a URI Template and can be relative.

```http
GET https://example.com/myapi/v3/books/1
```

```json
{
  "base": "/myapi/v3/",
  "links": [
    {
      "href": "author/1",
      "rel": "author"
    }
  ]
}
```

Link Target: `https://example.com/myapi/v3/author/1`

#### Setting a link's "anchor"

A link is a connection between two resources. The source of the link is called the "anchor" and the destination is called the "target. The "anchor" usually doesn't need to be specified because it's understood to be the resource the link appears in. `anchor` allows you to change the link's "anchor" to something other than the resource it appears in.

When `anchor` appears in an LDO, it becomes the base URI for resolving `href`.

> NOTE: I don't have an example because I can't think of any reason someone would want to do this. It's an anti-pattern at best. It might be best to just leave `anchor` and `anchorPointer` undocumented.

### URI Templates

`href`, `base`, and `anchor` are URI Templates

#### Template variables

##### Link applicability

```json
{
  "type": "object",
  "properties": {
    "documentation": {
      "links": [
        {
          "href": "/docs",
          "rel": "about"
        }
      ]
    }
  }
}
```

```json
{}
```

**about**: N/A

> Note: Links are annotations, which means they're attached to a location in the JSON instance. If the location of the link doesn't exist in the JSON instance, the link doesn't apply.

```json
{
  "documentation": true
}
```

**about**: `https://example.com/docs`

##### Required/Optional variables

```json
{
  "links": [
    {
      "href": "/books?page={next}{&perPage}",
      "rel": "next",
      "templateRequired": ["next"]
    },
    {
      "href": "/books?page={previous}{&perPage}",
      "rel": "previous",
      "templateRequired": ["previous"]
    }
  ]
}
```

```json
{
  "list": [
    { ... book 1 ... },
    { ... book 2 ... },
    { ... book 3 ... }
  ],
  "page": 0,
  "next": 1
}
```

**next**: `https://example.com/books?page=1`

**previous**: N/A

Note: `previous` doesn't apply because the required property "previous" is not present.
Note: `perPage` is an optional variable. The `next` link still applies even though there is no "perPage" property.

```json
{
  "list": [
    { ... book 1 ... },
    { ... book 2 ... }
  ],
  "metaData": {
    "page": 0,
    "next": 1,
    "perPage": 2
  }
}
```

**next**: `https://example.com/books?page=1&perPage=2`

**previous**: N/A

Note: Optional variable `perPage` is present and included in the link.

##### Variable coersion

```json
{
  "links": [
    {
      "href": "/{a}",
      "rel": "https://example.com/relations/a"
    }
  ]
}
```

```json
{ "a": true }
```

**`https://example.com/relations/a`**: `https://example.com/true`

```json
{ "a": false }
```

**`https://example.com/relations/a`**: `https://example.com/false`

```json
{ "a": null }
```

**`https://example.com/relations/a`**: `https://example.com/null`

```json
{ "a": 42 }
```

**`https://example.com/relations/a`**: `https://example.com/42`

##### Pointers

Expand a variable from a different object.

```json
{
  "type": "object",
  "properties": {
    "cartItems": {
      "type": "array",
      "items": {
        "links": [
          {
            "href": "cart-item/{cartId}/{cartItemId}",
            "rel": "https://example.com/relations/cart-item",
            "templateRequired": ["cartId", "cartItemId"],
            "templatePointer": {
              "cartId": "/cartId"
            }
          }
        ]
      }
    }
  }
}
```

```json
{
  "cartId": 100,
  "cartItems": [
    {
      "cartItemId": 200,
      ...
    }
  ],
  ...
}
```

**`https://example.com/relations/cart-item`**: `https://example.com/cart-item/100/200`

Example using Relative JSON Pointer instead of JSON Pointer.

```json
{
  "type": "object",
  "properties": {
    "cartItems": {
      "type": "array",
      "items": {
        "links": [
          {
            "href": "cart-item/{cartId}/{cartItemId}",
            "rel": "https://example.com/relations/cart-item",
            "templateRequired": ["cartId", "cartItemId"],
            "templatePointer": {
              "cartId": "2/cartId"
            }
          }
        ]
      }
    }
  }
}
```

**`https://example.com/relations/cart-item`**: `https://example.com/cart-item/100/200`

### TODO

- PUT and DELETE
- `title`
- `description`
- `targetMediaType`
- `targetSchema`
- `targetHints`
- `headerSchema`
- Special case relations: `collection`/`item`, `root`, `self`

### Hyper Schema Specification

- Hyper-Schema: [draft-handrews-json-schema-hyperschema-02](../draft/2019-09/json-schema-hypermedia.html)
- Relative JSON Pointer: [draft-bhutton-relative-json-pointer-00](https://datatracker.ietf.org/doc/html/draft-bhutton-relative-json-pointer-00.html)

**Schemas:**

- [JSON Hyper-Schema meta-schema](../draft/2020-12/hyper-schema)
- [JSON Hyper-Schema vocabulary schema](../draft/2020-12/meta/hyper-schema)
- [JSON Hyper-Schema Link Description Object meta-schema](../draft/2020-12/links)
- [JSON Schema Output schemas and examples](../draft/2019-09/output/hyper-schema)

### Release Notes

- [Draft-07 to 2019-09](../draft/2019-09/release-notes#hyper-schema-vocabulary)
- [Draft-04 to Draft-07](../draft-07/json-hyper-schema-release-notes)
- [Draft-04 to Draft-06](../draft-06/json-hyper-schema-release-notes)
