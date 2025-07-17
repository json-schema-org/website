---
section: docs
title: What is JSON Schema?
next: 
  label: Roadmap
  url: '/overview/roadmap'
---
> JSON Schema is a declarative language for defining structure and constraints for JSON data.
<br/>


## How does JSON Schema work?

When it comes to data exchange, JSON Schema stands out as a powerful standard for defining the structure and rules of JSON data. It uses a set of [keywords](https://json-schema.org/learn/glossary#keyword) to define the properties of your data.

While JSON Schema provides the language, validating a JSON [instance](https://json-schema.org/learn/glossary#instance) against a [schema](https://json-schema.org/learn/glossary#schema) requires a JSON Schema [validator](https://json-schema.org/tools#validators). The JSON validator checks if the JSON documents conform to the schema.

JSON Schema Validators are tools that implement the JSON Schema specification. Such tooling enables easy integration of JSON Schema into projects of any size.

![How JSON Schema works](/img/json_schema.svg)

## Benefits of JSON Schema for Developers

JSON Schema empowers developers in the following ways:

* **Structured Data Description**: JSON Schema allows developers to describe the structure, constraints, and data types of existing JSON data.
* **Rule Definition and Enforcement**: By adhering to JSON schema constraints, it becomes easier to exchange structured data between applications as it maintains a consistent pattern.
* **Produce clear documentation**: JSON Schema supports the creation of machine and human readable documentation.
* **Extensibility:** JSON Schema offers high adaptability to developers' needs. Custom keywords, formats, and validation rules can be created to tailor schemas according to specific requirements.
* **Data Validation:** JSON Schema ensures data validity through:
   * Automated Testing: Validation enables automated testing, ensuring data consistently complies with specified rules and constraints.
   * Improved Data Quality: By enforcing validation rules, JSON Schema aids in maintaining the quality of client-submitted data, reducing inconsistencies, errors, and potential security vulnerabilities.
* **Rich Tooling Ecosystem**: The JSON Schema community offers a wealth of [tools](https://json-schema.org/tools) and resources across various programming languages to help developers create, validate, and integrate schemas.

### Benefits of JSON Schema for Organizations

JSON Schema empowers organizations by:

* **Simplifying Testing and Validation**: JSON Schema reduces code complexity and development time by simplifying validation logic. It defines constraints for data structures, enabling the detection and prevention of errors, inconsistencies, and invalid data.
* **Facilitating Seamless Data Exchange**: JSON Schema establishes a common language for data exchange, no matter the complexity of your project. It defines precise validation rules for your data structures to create a shared understanding and increase interoperability across different systems and platforms.
* **Enhancing Data Documentation**: JSON Schema enables the creation of clear and standardized representations of data. This improves understanding and collaboration among developers, stakeholders, and collaborators, enhancing organizational efficiency.
* **Access to a Vibrant Tooling Ecosystem**: JSON Schema is supported by a diverse array of languages, libraries, and frameworks with community-driven [tools](https://json-schema.org/tools). This vibrant ecosystem enhances development productivity and provides resources for effective schema implementation and utilization.


## History of JSON Schema 


JSON Schema dates back to the [first JSON Schema proposal](https://web.archive.org/web/20071026185150/http://json.com/json-schema-proposal/) submitted by Kris Zyp to [json.com](http://json.com) on October 2nd, 2007.

The latest version of JSON Schema is [2020-12](https://json-schema.org/latest/release-notes), which represents the latest advancements and has expanded capabilities compared with the previous versions, `draft-04`, `draft-06`, and `draft-07`.

We recommend using the newest version of JSON Schema and taking advantage of its benefits.

For more information regarding JSON Schema history, refer to [this article](https://modern-json-schema.com/what-is-modern-json-schema) by Henry Andrews.


## What Next?

Intrigued by JSON Schema's potential? Dive right in! Learning is by doing, and creating your first schema is the perfect starting point. Check out the guide on [Creating your first schema](https://json-schema.org/learn/getting-started-step-by-step) to begin crafting your data validation tool.

### Learn more

Learn more about the specification:

* [Understanding JSON Schema](../understanding-json-schema)
* [JSON Schema Specification 2020-12](https://json-schema.org/specification.html)


### Join the community

To get involved with our community, please make sure you are familiar with the project's [Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md).

* **Join [JSON Schema Slack](https://json-schema.org/slack)**. This is the best place to ask questions, learn, get help, or discuss all things JSON Schema.
* **Attend our public JSON Schema meetings**. We hold [Office Hours](https://github.com/json-schema-org/community/discussions/34) every first Tuesday at 15:00 BST (and by appointment) and [Open Community Working Meetings](https://github.com/json-schema-org/community/discussions/35) every Monday at 14:00 PT.
* **Follow our [YouTube](https://www.youtube.com/watch?v=48S8-GwRh-g&list=PLHVhS4Tj1YZPYt6sMkvf4nW8zKvZExVA4) channel**. Find recordings of our public community meetings and JSON Schema learning resources.
* **Read our [blog](https://json-schema.org/blog)**. Find the latest and greatest stories from our community.