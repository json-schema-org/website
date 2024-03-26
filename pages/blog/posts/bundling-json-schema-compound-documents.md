---
title: "JSON Schema bundling finally formalised"
date: "2021-08-04"
type: Engineering
tags:
  - OpenAPI
  - Bundling
cover: /img/posts/2021/bundling-json-schema-compound-documents/cover.webp
authors:
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    twitter: relequestual
    byline: JSON Schema Specification Lead @Postman
  - name: Mike Ralphson
    photo: /img/avatars/mikeralphson.webp
    twitter: PermittedSoc
    byline: OpenAPI Specification Lead @Postman
excerpt: "Existing tooling developers have created their own approaches to bundling JSON Schema and OpenAPI documents, but that can lead to errors. Bundling is now standardised."
---

*I’ve been known to say “If you haven’t rewritten your OpenAPI bundling implementation recently, then you don’t support OpenAPI 3.1”. This observation may be true, but perhaps some more detail would be helpful? When implementing support for OAS 3.1 and JSON Schema draft 2020-12 in `oas-kit`, reading the sections of the JSON Schema spec on bundling compound documents, I still wasn’t totally clear on what was expected of compliant tooling. Thankfully, Ben Hutton is here to set the record straight with a worked example.* - Mike Ralphson, OAI TSC

## Bundling has renewed importance

OpenAPI has long since put the spotlight on JSON Schema, and the release of OpenAPI 3.1 has huge implications for the future of both projects. I'm truly excited.

Developers of platforms and libraries that use OpenAPI haven't had such a shake up before, and my feeling is it may take more than a few releases to correctly implement all the new shiny features full JSON Schema has to offer.

While the number of changes from JSON Schema draft-04 to draft 2020-12 are vast and the subject of more blog posts than are likely interesting, one of the key "features" of draft 2020-12 is a defined bundling process. (draft-04 is the version of JSON Schema that OAS used prior to version 3.1.0; or rather, a subset/superset of it.)

Indeed, bundling, if anything, is going to be more important to get right than ever. OAS 3.1 ushering in full JSON Schema support dramatically increases the likelihood that developers with existing JSON Schema documents will use them __by reference__ in new and updated OpenAPI definitions. Ultimate source of truth matters, and it's often the JSON Schemas.

Many tools don't support referencing external resources.
Bundling is a convenient way to package up schema resources spread across multiple files in a single file for use elsewhere, such as an OpenAPI document.

## Existing solutions? New solutions!

There are several libraries which offer bundling solutions, however they all have caveats, and I haven't seen any to date which are fully JSON Schema aware. The most popular of these libraries is called `json-schema-ref-parser`, however it [reports](https://github.com/APIDevTools/json-schema-ref-parser/issues/97#issuecomment-415963663) that it was not intended to be JSON Schema aware, and is only intended to cover the JSON Reference specification (Which has been bundled back into the JSON Schema specification now).

We are hoping to provide you with a canonical implementation (Right, Mike?!) and enough information to get started building your own in your language of choice. (Although, it's always best to read the full specification when developing implementations.)

## Bundling fundamentals

Firstly, let's visit some key definitions in JSON Schema draft 2020-12.
The `$id` keyword is used to identify a "schema resource". In the example below, the `$id` is `https://jsonschema.dev/schemas/mixins/integer` for the resource.

```json
{
  "$id": "https://jsonschema.dev/schemas/mixins/integer",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Must be an integer",
  "type": "integer"
}
```

A "Compound Schema Document" is a JSON document which has multiple embedded JSON Schema Resources. Below is a simplified example of one we’ll unpack a bit later.

```json
{
  "$id": "https://jsonschema.dev/schemas/examples/non-negative-integer-bundle",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Must be a non-negative integer",
  "$comment": "A JSON Schema Compound Document. Aka a bundled schema.",
  "$defs": {
    "https://jsonschema.dev/schemas/mixins/integer": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://jsonschema.dev/schemas/mixins/integer",
      "description": "Must be an integer",
      "type": "integer"
    },
    "https://jsonschema.dev/schemas/mixins/non-negative": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://jsonschema.dev/schemas/mixins/non-negative",
      "description": "Not allowed to be negative",
      "minimum": 0
    },
    "nonNegativeInteger": {
      "allOf": [
        {
          "$ref": "/schemas/mixins/integer"
        },
        {
          "$ref": "/schemas/mixins/non-negative"
        }
      ]
    }
  },
  "$ref": "#/$defs/nonNegativeInteger"
}
```
> Note that schema bundling and the use of multiple definitions are not necessary to represent non-negative integers.
> This example is purely for illustrative purposes and the schema below is perfectly suitable for representing non-negative integers without the use of bundling.
> ```json
> {"type": "integer", "minimum": 0}
> ```

Last, let's look at the carefully crafted definition of "bundling" according to the JSON Schema specification:

"The bundling process for creating a Compound Schema Document is
   defined as taking references (such as "$ref") to an external Schema
   Resource and embedding the referenced Schema Resources within the
   referring document.  Bundling SHOULD be done in such a way that all
   URIs (used for referencing) in the base document and any referenced/
   embedded documents do not require altering."

With these definitions in mind, now we can look at the defined bundling process for JSON Schema resources! We will only cover the ideal situation in this article. The goal here is to have no external Schema Resources.

Note, this article does NOT cover "total dereferencing", which is removing all uses of `$ref` from a schema. This is not advised, and is not always even possible, such as when there are self references.

## Bundling Simple External Resources

In our first example, we have an ideal situation for bundling. Each schema has an `$id` and `$schema` defined, making the bundling process simple.
We'll cover various other situations and edge cases in further examples, but having each resource define its own identity and dialect is always preferable.
Our primary schema resource references two other schema resources using the in-place applicator `$ref` with the value being a relative URI. The relative URI is resolved against the base URI, which in this instance is found in the primary schema resource's `$id` value. By combining "integer" and "non-negative" schemas, we create a "non-negative integer" schema.

```json
{
  "$id": "https://jsonschema.dev/schemas/mixins/integer",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Must be an integer",
  "type": "integer"
}
```

```json
{
  "$id": "https://jsonschema.dev/schemas/mixins/non-negative",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Not allowed to be negative",
  "minimum": 0
}
```

```json
{
  "$id": "https://jsonschema.dev/schemas/examples/non-negative-integer",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Must be a non-negative integer",
  "$comment": "A JSON Schema that uses multiple external references",
  "$defs": {
    "nonNegativeInteger": {
      "allOf": [
        {
          "$ref": "/schemas/mixins/integer"
        },
        {
          "$ref": "/schemas/mixins/non-negative"
        }
      ]
    }
  },
  "$ref": "#/$defs/nonNegativeInteger"
}
```

Should "non-negative-integer" schema be used as the primary schema in an implementation, the other schemas would need to be available to the implementation. At this point, exactly how that implementation loads in the schemas doesn't matter, as they have fully qualified URIs as their identity defined in `$id`. Any implementation that loads in schemas should build an internal local index of schema URIs defined in `$id` to schema resources.

Remember, any schema which provides a value for `$id` is considered a Schema Resource.

Let's resolve (dereference) one of the references in our primary schema. `"$ref": "/schemas/mixins/integer"` resolves to a fully qualified URI of `https://jsonschema.dev/schemas/mixins/integer` by following the rules for first determining the base URI and then resolving the relative URI against that base URI. The implementation should then check its internal index of schema identifiers and schema resources, finding a match, and using the appropriate previously loaded schema resource.

The bundling process is done. The previously externally referenced schemas are copied into `$defs` in our primary schema, as is. The keys for the `$defs` object are the identifying URIs, but they can be anything, as those values won't be referenced (They could be UUIDs if you like). Looking at our final bundled schema… I mean "Compound Schema Document", we now have multiple Schema Resources embedded in a single Schema document.

```json
{
  "$id": "https://jsonschema.dev/schemas/examples/non-negative-integer-bundle",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Must be a non-negative integer",
  "$comment": "A JSON Schema Compound Document. Aka a bundled schema.",
  "$defs": {
    "https://jsonschema.dev/schemas/mixins/integer": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://jsonschema.dev/schemas/mixins/integer",
      "description": "Must be an integer",
      "type": "integer"
    },
    "https://jsonschema.dev/schemas/mixins/non-negative": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://jsonschema.dev/schemas/mixins/non-negative",
      "description": "Not allowed to be negative",
      "minimum": 0
    },
    "nonNegativeInteger": {
      "allOf": [
        {
          "$ref": "/schemas/mixins/integer"
        },
        {
          "$ref": "/schemas/mixins/non-negative"
        }
      ]
    }
  },
  "$ref": "#/$defs/nonNegativeInteger"
}
```

When the bundled schema is initially loaded and evaluated, the implementation should create its own internal index of schema identifiers and schema resources, just as before. The relative URIs used to reference those schema resources need not change.

The simplest way to see this bundled schema working as expected is to paste it into https://json-schema.hyperjump.io and then try different values for the instance. I'm hopeful to bring several updates to https://jsonschema.dev over the next few months, but times are busy as we continue to elevate JSON Schema as an organisation.

It’s worth remembering that the example in this article shows the ideal situation, when best practices have been followed. The JSON Schema specification does define additional processes for non-ideal situations and edge cases (such as when `$id` or `$schema` are not set), however, some solutions may be indirectly related to Compound JSON Schema Documents. For example, establishing the base URI follows the steps laid out in RFC3986, which JSON Schema does not redefine.

## OpenAPI Specification Example

Let’s look at an example of how this might work with an OpenAPI definition.

```yaml
openapi: 3.1.0
info:
  title: API
  version: 1.0.0
components:
  schemas:
    non-negative-integer:
      $ref: 'https://jsonschema.dev/schemas/examples/non-negative-integer'
```

We start with our input OpenAPI 3.1.0 specification document. For brevity, we’re only showing the components section with a single component, but let’s assume some other part of the document uses the component schema “non-negative-integer”.

“non-negative-integer” has a single reference to a JSON Schema resource. The reference URI is an absolute URI, including domain and path, meaning there’s no need to do any “resolve the relative URI against the base URI” dance.

All the schemas required to resolve and bundle the reference are provided to the bundling tooling. After the schemas are loaded into the implementation, their originating physical location no longer matters.

```yaml
openapi: 3.1.0
info:
  title: API
  version: 1.0.0
components:
  schemas:
    # This name has not changed, or been replaced, as it already existed and is likely to be referenced elsewhere
    non-negative-integer:
      # This Reference URI hasn't changed
      $ref: 'https://jsonschema.dev/schemas/examples/non-negative-integer'
    # The path name already existed. This key doesn't really matter. It could be anything. It's just for human readers. It could be an MD5!
    non-negative-integer-2:
      $schema: 'https://json-schema.org/draft/2020-12/schema'
      $id: 'https://jsonschema.dev/schemas/examples/non-negative-integer'
      description: Must be a non-negative integer
      $comment: A JSON Schema that uses multiple external references
      $defs:
        nonNegativeInteger:
          allOf:
          # These references remain unchanged because they rely on the base URI of this schema resource
          - $ref: /schemas/mixins/integer
          - $ref: /schemas/mixins/non-negative
      $ref: '#/$defs/nonNegativeInteger'
    integer:
      $schema: 'https://json-schema.org/draft/2020-12/schema'
      $id: 'https://jsonschema.dev/schemas/mixins/integer'
      description: Must be an integer
      type: integer
    non-negative:
      $schema: 'https://json-schema.org/draft/2020-12/schema'
      $id: 'https://jsonschema.dev/schemas/mixins/non-negative'
      description: Not allowed to be negative
      minimum: 0
```

The schemas are inserted into the `components/schemas` location of the OAS document. The keys used in the `schemas` object have no importance for reference resolution, although you will want to avoid potential duplications. References need not change, and a processor of the resulting bundled or Compound Document, should look for the use of embedded Schema Resources within the OAS document, keeping track of the `$id` values.


## But what about...

The astute among you might have noticed that Compound Documents may not be correctly validated using a meta-schema for the dialect defined at the document root. One of our principal contributors distilled a great explanation which he has agreed to let us share with you.

“*If an embedded schema has a different `$schema` than the parent schema, then a Compound Schema Document can't be validated against a meta-schema without deconstructing it into separate schema resources and applying the appropriate meta-schema to each. That doesn't mean the Compound Schema Document is not usable without deconstruction, it just means that implementations need to be aware that the `$schema` can change during evaluation and handle such changes appropriately.*” - Jason Desrosiers.

If you’d like a more in-depth look at edge case situations, please do let us know.

You can reach out to us [@jsonschema](https://www.twitter.com/jsonschema) or our [Slack server](/slack).

*I hope you’ll agree, Ben has clarified the process for us all here, and we can use this example to fully meet JSON Schema’s bundling expectations when writing tools which bundle multiple resources into compound OpenAPI documents. Thanks, Ben!* - Mike

<a href="https://www.freepik.com/vanitjan1">Business photo created by vanitjan - www.freepik.com</a>

This article was first published on the JSON Schema Blog and is canonically located at https://json-schema.org/blog/posts/bundling-json-schema-compound-documents
