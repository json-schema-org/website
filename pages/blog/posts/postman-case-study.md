---
title: "How Postman uses JSON Schema"
date: "2023-07-17"
type: Case Study
cover: /img/posts/2023/postman-case-study/cover.webp
authors:
  - name: Juan Cruz Viotti
    photo: /img/avatars/jviotti.webp
    link: https://www.jviotti.com/
excerpt: "Learn how JSON Schema continues to be a crucial component of the Postman API Platform and the API ecosystem."
canonicalLink: https://blog.postman.com/how-postman-uses-json-schema/
---

> Originally published at [blog.postman.com](https://blog.postman.com/how-postman-uses-json-schema).

<div className="border-2 py-3 px-3 border-blue-400 bg-blue-100 text-blue-700">
Disclaimer: A number of members of the JSON Schema organization are employed by Postman, but this post is not sponsored content.
</div>

The [Postman API Platform](https://blog.postman.com/announcing-postman-v10/) offers a rich set of solutions for every step of the [API lifecycle](https://www.postman.com/api-platform/api-lifecycle/). Through the years, we have witnessed from the front row how JSON Schema entered the scene to become the industry standard for describing and annotating JSON documents. While many alternatives came and went, JSON Schema unquestionably proved to be the robust and extensible foundation behind the API specification movement. According to Postman's [2022 State of the API Report](https://www.postman.com/state-of-api/api-technologies/#api-technologies), an impressive 72% of respondents chose JSON Schema as their preferred API specification.

With JSON Schema being so ingrained in how APIs are developed today, it is hard to find a place in the Postman organization or the Postman API Platform where JSON Schema is not involved in some way or another. And with the modern (and increasing) importance of [API-first](https://www.postman.com/use-cases/api-first-development/) development, the use of API specifications plays a critical role in designing and sharing APIs. JSON Schema is currently the backbone of the most popular API specification technologies in the world, including [OpenAPI](https://www.openapis.org/), [AsyncAPI](https://www.asyncapi.com/), and [RAML](https://raml.org/).

## JSON Schema in the Postman organization

### How Postman uses JSON Schema to build its own APIs

Postman operates a complex distributed system consisting of many dozens of microservices powering the cloud tools that make the Postman API Platform. These microservices make use of JSON Schema to model their interfaces through standalone JSON Schema definitions or OpenAPI and AsyncAPI specifications. Many of these microservices also use JSON Schema under the hood to validate internal data structures and configuration files, and to perform end-to-end testing by either asserting on expected responses or auto-generating input data from JSON Schema definitions. Being a Node.js company, Postman have started efforts to analyze how they can rely on TypeScript annotations to automatically generate OpenAPI and AsyncAPI definitions from our codebases.

Given the importance of API specifications for managing Postman's distributed systems, in 2021 a comprehensive internal research project was conducted to understand the diverse set of JSON Schema definitions introduced by microservices run within the internal Postman platform. The corresponding JSON Schema definitions were analyzed based on characteristics such as reusability, degree of similarity, uniqueness ratio, and type of content. To promote reusability and discoverability, Postman is exploring the idea of a new microservice that acts as a central JSON Schema catalog API.

For analysis purposes, Postman periodically extracts data from every SQL-based database powering the Postman API Platform. To accommodate for schema changes in our services, Postman automatically converts SQL table definitions into JSON Schema definitions, and rows into JSON documents, before aggregating them into Postman's internal data warehouse. Some initial experiments have been conducted to explore generating SQL table definitions out of JSON Schema documents, making the latter the source of truth.

### Use cases of JSON Schema beyond APIs

The use of JSON Schema within the Postman organization is not restricted to its backend services. For example, the popular [Postman Collection](https://www.postman.com/collection/) JSON-based data format is formally defined using JSON Schema. Postman's [Newman](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/) command-line Collection Runner makes use of JSON Schema to validate the expected output of custom reporters. Postman's in-house cross-platform desktop framework makes use of JSON Schema to validate and annotate profile definitions that declare the various variants of the desktop application (Stable, Canary, etc). Postman also maintains internal [C4](https://c4model.com/) diagrams of the Postman architecture defined using JSON and validated using JSON Schema.

In early 2022, Postman released support for [gRPC and Protocol Buffers](https://blog.postman.com/postman-now-supports-grpc/). Internally, Postman is able to transform Protocol Buffers schema definitions into JSON Schema definitions and back again. The JSON Schema definitions corresponding to the Protocol Buffers schemas are used to provide type-hinting and auto-completion in the gRPC payload composer editor, to validate user input and to generate random data that matches a Protocol Buffers schema for testing purposes. This approach allows Postman to implement the aforementioned features on top of a single unified schema language: JSON Schema.

## JSON Schema in the Postman API Platform

JSON Schema is not only used internally to develop the various components of the Postman API Platform - many of the features offered by Postman directly involve the use of JSON Schema.

### JSON Schema in the context of Postman Collections

The Postman app can be used to [convert a growing number of API specification formats into Postman Collections](https://learning.postman.com/docs/developer/collection-conversion/). As noted earlier in this post, the most popular API specification formats such as OpenAPI, Swagger, and RAML rely on JSON Schema. In many cases, the API specification conversion logic requires generating random JSON documents that match a JSON Schema definition.

When defining a Postman Collection, users may define JavaScript-based test and pre-request scripts that are executed automatically when running the corresponding collection. The JavaScript engine embedded within Postman to run these scripts integrates with the popular [AJV](https://ajv.js.org/) JSON Schema validator. With it, Postman users write scripts that employ JSON Schema validation using a wide range of JSON Schema specification versions.

### JSON Schema in the context of OpenAPI

The Postman app provides a rich [OpenAPI editor](https://learning.postman.com/docs/designing-and-developing-your-api/defining-an-api/) with advanced JSON Schema capabilities. The editor is able to show autocompletion and syntax warnings, and it also highlights [potential areas of improvements](https://learning.postman.com/docs/api-governance/api-definition/api-definition-warnings/) with regards to readability and security for JSON Schema and OpenAPI endpoint definitions. An OpenAPI definition is then used to generate [rich documentation](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/) of the available endpoints and their respective JSON Schema definitions, and to optionally generate matching [server code](https://learning.postman.com/docs/designing-and-developing-your-api/generating-server-code/) written in Go, Java, Python, and Node.js.

An API defined using Postman is more than its API definition. It has surrounding elements such as documentation, tests, mock servers, and monitors. When writing an OpenAPI specification, Postman will [cross-check the integrity of each of these elements](https://learning.postman.com/docs/designing-and-developing-your-api/validating-elements-against-schema/) against the JSON Schema definitions included in the API specification.

### The Postman API Network

A key component of the Postman API Platform is the [Postman API Network](https://www.postman.com/api-network/), the [world's largest registry of public APIs](https://blog.postman.com/postman-public-api-network-is-now-the-worlds-largest-public-api-hub/). This global public registry includes a vast amount of APIs and their corresponding JSON Schema definitions typically maintained by their respective original authors. Some notable examples are the [Slack Web API](https://www.postman.com/slackhq/workspace/slack-api/collection/13509546-993e3b18-d277-4189-8ce5-af45df38e336), the [Docker HUB API](https://www.postman.com/dockerdev/workspace/docker-hub/collection/17990590-9574e087-2a50-4ecf-88b3-55f12a29d99e), and the [Twilio API](https://www.postman.com/twilio/workspace/twilio-api/overview). The Postman API Network is therefore one of the largest datasets of production-grade JSON Schema definitions.

## Postman and JSON Schema

With JSON Schema being a crucial component of the Postman API Platform and the API ecosystem, Postman is honored to be supporting the JSON Schema organization as part of the [OpenJS foundation](https://json-schema.org/blog/posts/json-schema-joins-the-openjsf) by bringing aboard some of its passionate core contributors - [Ben Hutton](https://blog.postman.com/ben-hutton-joins-postman-to-lead-json-schema-strategy/), [Greg Dennis](https://json-schema.org/blog/posts/and-then-there-were-three), [Jason Desrosiers](https://json-schema.org/blog/posts/joining-postman), and [Julian Berman](https://json-schema.org/blog/posts/hello-world-hello-postman) - as Postmanauts. We can't know everything about what the future might hold, but Postman is certain that the future of APIs involves JSON Schema.