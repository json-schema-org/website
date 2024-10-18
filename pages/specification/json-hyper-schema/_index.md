---
title: JSON Hyper-Schema
---

### Introduction

JSON Hyper-Schema is an extension of JSON Schema that allows for the definition of hypermedia-driven APIs. The hyper-schema vocabulary shows how to annotate JSON documents with hypermedia controls by enabling the description of links and actions that can be executed on JSON data. Consecutively, it helps provide a more interactive and dynamic representation of JSON data. It also enhances API discoverability using the description features of actions and links within the JSON documents.

JSON Hyper-Schema seamlessly integrates with existing JSON HTTP APIs and offers functionalities to describe complex resource relationships, facilitate client-side validation, and promote better interaction patterns. It makes APIs more intuitive, self-descriptive, and efficient, particularly in RESTful architectures.

In essence:

- JSON Hyper-Schema is helpful in complex APIs where clients need to define and explicitly understand the relationships between resources and actions, especially when navigating resources without prior knowledge of the API structure.
- It helps create more discoverable and self-documenting APIs, making it easier for clients to interact with them.

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
