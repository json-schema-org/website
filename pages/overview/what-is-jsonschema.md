---
section: docs
title: What is JSON Schema?
---

JSON Schema is a declarative language that you can use to annotate and validate the structure, constraints, and data types of your JSON documents. It provides a way to standardize and define expectations for your JSON data.


## Overview

This documentation describes JSON Schema and the many ways you can use it to ensure the consistency of your JSON data. Here’s what you’ll find in the documentation:

* **Getting Started**: If you’re new to JSON Schema, [start here](/learn/getting-started-step-by-step). You’ll find a step-by-step guide that walks you through creating your first JSON Schema, along with some real-world examples.
* **Reference**: This section provides a [glossary]((/learn/glossary), [specification release notes](/specification), and [in-depth reference](/understanding-json-schema) to JSON Schema that you can use to write and understand more complex schemas.


## Why JSON Schema?

JSON Schema can:

* **Describe existing data formats**: JSON Schema allows you to describe the structure, constraints, and data types of your existing JSON data formats. 
* **Define rules and constraints**: When your JSON documents adhere to these constraints, it becomes easier to exchange structured data between applications because the data follows a consistent pattern.
* **Clear and readable documentation**: JSON Schema supports the creation of documentation that is easily understandable by both humans and machines.
* **Highly extensible** and can be tailored to fit your needs.
    * You can create *custom keywords*, *formats*, and *validation rules* to suit your own requirements.
* **Simplify testing and validation**: JSON Schema helps to reduce the code's complexity and the development time by simplifying your validation logic.
* **Validate your data**, which helps you:
    * **Automate testing**: JSON Schema validation enables automated testing, ensuring that data consistently adheres to the specified rules and constraints.
    * **Enhance data quality**: By enforcing validation rules, JSON Schema helps ensure the quality of client-submitted data, preventing inconsistencies, errors, and malicious inputs.
* **Easy and reliable data exchange**: JSON Schema enables reliable, eventually consistent data exchange at scale.
* **Interoperability and Extensibility**: JSON Schema provides an extensible interoperability layer to your solution in multiple languages and platforms.
* **Huge tooling ecosystem**: JSON Schema is a vibrant and growing ecosystem of production ready Open Source tools implemented by the Community
* **Wide range of tools availability**: The JSON Schema community has a wealth of tools and resources available across many programming languages to help you create, validate, and integrate your schemas.


## How it works

Using JSON Schema, you can define rules and constraints that JSON data should adhere to. When your JSON documents adhere to these constraints, it becomes easier to exchange structured data between applications because the data follows a consistent pattern.

You begin by defining the rules in a JSON Schema document using various [keywords](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-validation-keywords-for-any). For example, you can use `type` to specify what types of data are valid for a given key. You can specify either a single type, like `string`, or an array of possible types, like `string`, `number`, or `integer`. You can also enforce formats using regular expressions with the `pattern` keyword. There are countless ways to describe specific data types and formats that your data must follow.

After you define your schema, you validate your JSON documents against the schema. To do this, you can use any supported [validator](https://json-schema.org/implementations.html#validators) in whatever language or context fits your project. There are JSON Schema validation tools for nearly every modern programming language, as well as language-agnostic command-line and browser tools.

When you have a defined schema and valid JSON data, the possibilities are endless. You can do additional data processing, set up error handling, and integrate your validated data with APIs, other applications, and business logic.


## Next steps

To start using JSON Schema, see [Creating your first schema](/learn/getting-started-step-by-step).


### Learn more

Learn more about the specification:

* [Understanding JSON Schema](/understanding-json-schema)
* [JSON Schema Specification 2020-12](https://json-schema.org/specification.html)


### Join the community

To get involved with our community, please make sure you are familiar with the project's [Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md).

* **Join [JSON Schema Slack](https://json-schema.org/slack)**. This is the best place to ask questions, learn, get help, or discuss all things JSON Schema.
* **Attend our public JSON Schema meetings**. We hold [Office Hours](https://github.com/json-schema-org/community/discussions/34) every first Tuesday at 15:00 BST (and by appointment) and [Open Community Working Meetings](https://github.com/json-schema-org/community/discussions/35) every Monday at 14:00 PT.
* **Follow our [YouTube](https://www.youtube.com/watch?v=48S8-GwRh-g&list=PLHVhS4Tj1YZPYt6sMkvf4nW8zKvZExVA4) channel**. Find recordings of our public community meetings and JSON Schema learning resources.
* **Read our [blog](https://json-schema.org/blog)**. Find the latest and greatest stories from our community.