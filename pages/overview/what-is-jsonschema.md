---
section: docs
title: What is JSON Schema?
next: 
  label: Roadmap
  url: '/overview/roadmap'
---

> JSON Schema is a declarative language for defining the structure and constraints of JSON data.

## How does JSON Schema work?

When it comes to data exchange, JSON Schema is a powerful standard for defining the structure and rules of JSON data. It uses a set of [keywords](https://json-schema.org/learn/glossary#keyword) to describe the properties of your data.

While JSON Schema provides the language, validating a JSON [instance](https://json-schema.org/learn/glossary#instance) against a [schema](https://json-schema.org/learn/glossary#schema) requires a validator. A JSON Schema validator checks whether JSON documents conform to a schema.

JSON Schema validators are tools that implement the specification. These tools enable easy integration of JSON Schema into projects of any size.

![How JSON Schema works](/img/json_schema.svg)

## Benefits of JSON Schema for Developers

JSON Schema empowers developers in the following ways:

* **Structured Data Description**: JSON Schema allows developers to describe the structure, constraints, and data types of JSON data.
* **Rule Definition and Enforcement**: By adhering to JSON Schema constraints, it becomes easier to exchange structured data between applications while maintaining consistency.
* **Clear Documentation**: JSON Schema supports the creation of machine- and human-readable documentation.
* **Extensibility**: JSON Schema is highly adaptable to developers' needs. Custom keywords, formats, and validation rules can be created to meet specific requirements.
* **Data Validation**: JSON Schema ensures data validity through:
  * **Automated Testing**: Validation enables automated testing, ensuring data consistently complies with defined rules and constraints.
  * **Improved Data Quality**: By enforcing validation rules, JSON Schema helps maintain the quality of client-submitted data, reducing inconsistencies, errors, and potential security vulnerabilities.
* **Rich Tooling Ecosystem**: The JSON Schema community offers a wide range of [tools](https://json-schema.org/tools) and resources across various programming languages to help developers create, validate, and integrate schemas.

## Benefits of JSON Schema for Organizations

JSON Schema empowers organizations by:

* **Simplifying Testing and Validation**: JSON Schema reduces code complexity and development time by simplifying validation logic. It defines constraints for data structures, enabling the detection and prevention of errors, inconsistencies, and invalid data.
* **Facilitating Seamless Data Exchange**: JSON Schema establishes a common language for data exchange, regardless of project complexity. It defines precise validation rules for data structures, creating a shared understanding and improving interoperability across systems and platforms.
* **Enhancing Data Documentation**: JSON Schema enables the creation of clear and standardized representations of data. This improves understanding and collaboration among developers and stakeholders, enhancing organizational efficiency.
* **Access to a Vibrant Tooling Ecosystem**: JSON Schema is supported by a wide range of languages, libraries, and frameworks, along with community-driven [tools](https://json-schema.org/tools). This ecosystem enhances development productivity and provides resources for effective schema implementation and usage.

## History of JSON Schema

JSON Schema dates back to the [first JSON Schema proposal](https://web.archive.org/web/20071026185150/http://json.com/json-schema-proposal/) submitted by Kris Zyp to [json.com](http://json.com) on October 2, 2007.

The latest version of JSON Schema is [2020-12](https://json-schema.org/latest/release-notes), which includes significant advancements and expanded capabilities compared to earlier versions such as `draft-04`, `draft-06`, and `draft-07`.

We recommend using the latest version of JSON Schema to take advantage of its improvements.

For more information about JSON Schema history, refer to [this article](https://modern-json-schema.com/what-is-modern-json-schema) by Henry Andrews.

## What Next?

Interested in JSON Schema? The best way to learn is by doing. Creating your first schema is a great place to start. Check out the guide on [Creating your first schema](https://json-schema.org/learn/getting-started-step-by-step) to begin building your own data validation tool.

### Learn more

Learn more about the specification:

* [Understanding JSON Schema](../understanding-json-schema)
* [JSON Schema Specification 2020-12](https://json-schema.org/specification.html)

### Join the community

To get involved with the community, please review the project's [Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md).

* **Join [JSON Schema Slack](https://json-schema.org/slack)** to ask questions, learn, and discuss all things JSON Schema.
* **Attend public meetings**:
  * [Office Hours](https://github.com/json-schema-org/community/discussions/34) — First Tuesday of every month at 15:00 BST (or by appointment)
  * [Open Community Working Meetings](https://github.com/json-schema-org/community/discussions/35) — Every Monday at 14:00 PT
* **Follow the [YouTube channel](https://www.youtube.com/watch?v=48S8-GwRh-g&list=PLHVhS4Tj1YZPYt6sMkvf4nW8zKvZExVA4)** for recordings and learning resources.
* **Read the [blog](https://json-schema.org/blog)** for updates and stories from the community.