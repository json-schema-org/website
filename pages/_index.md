## Project Status

2021-02-01: Draft 2020-12 has been published!

The document IDs are of the form `draft-bhutton-*-00`.

We are using dates for meta-schemas, which are what implementations should use to determine behavior,
so we will usually refer to `2020-12` (without the word "draft") on this web site.

See the [Specification Links](/specification-links) page for details about naming and numbering.

### The Path to Standardization

The JSON Schema project intends to self-publish the two JSON Schema specifications with the OpenJS Foundation. For the Relative JSON Pointer specification, we will likely pursue an RFC with IETF.

<details markdown="1">
<summary>Read more</summary>

We are currently working toward moving away from self-published Internet-Drafts.

In the meantime, you can find the latest release of specification as Internet-Drafts on the [Specification](/specification) page.

Note that normal Internet-Drafts expire after six months and are replaced by
subsequent drafts. Neither of those properties apply to JSON Schema. JSON Schema
uses Internet-Drafts as production release documents, not as drafts, and each
release is a distinct version of JSON Schema. That means that our releases
remain relevant as long as they continue to be used in production despite what
the document declares as its expiration.

</details>

### Use of the _draft_ designation
Releases of the JSON schema specification and meta schemas use the _draft_ designation primarily for historical reasons stemming from the relationship of this specification to IETF ([explained here](https://json-schema.org/specification-links#understanding-draft-names-and-numbers)).
The use of this designation is under review and will not continue in future releases.

<details markdown="1">
<summary>Read more</summary>

The JSON schema project recognizes, condones, and advocates for the use of the JSON schema standard in production.

Each release of the JSON schema specification is treated as a production release by the JSON schema project. All changes in each new release are made judiciously, with great care, thorough review and careful consideration of how the changes will impact existing users and implementations of the JSON schema specification.

Similarly to most specifications, the JSON schema specification will continue to evolve, and not all releases will be backwards compatible. The intention, particularly for vocabularies such as validation which have been widely implemented, is to remain as compatible as possible from release to release. However, major changes can still occur given a clear enough need validated with the user community.
</details>

## Quickstart

The JSON document being validated or described we call the *instance*, and the document containing the description is called the *schema*.

The most basic schema is a blank JSON object, which constrains nothing, allows anything, and describes nothing:

```json
// props { "isSchema": true }
{}
```

You can apply constraints on an instance by adding validation keywords to the schema. For example, the "type" keyword can be used to restrict an instance to an object, array, string, number, boolean, or null:

```json
// props { "isSchema": true }
{
  "type": "string"
}
```
 
JSON Schema is hypermedia ready, and ideal for annotating your existing JSON-based HTTP API. JSON Schema documents are identified by URIs, which can be used in HTTP Link headers, and inside JSON Schema documents to allow recursive definitions.

## JSON Hyper-Schema

JSON Hyper-Schema is on hiatus / not currently maintained as of 2021.

This allows the team to focus the little time they do donate on JSON Schema core and validation.

We may revisit JSON Hyper-Schema at a later date.

## More Links

Interested? Check out:

* The [specification](/specification)
* the growing list of [JSON Schema software](/implementations)


## Latest version of JSON Schema
<Infobox>
We encourage updating to the latest specification where possible, which is `2020-12`.
</Infobox>
