---
title: "How 6 River Systems saves time and boosts collaboration with JSON Schema"
date: "2023-05-08"
type: Case Study
cover: /img/posts/2023/6-river-systems-case-study/cover.webp
authors:
  - name: Melinda Gutermuth
    photo: /img/avatars/melinda.webp
    link: https://www.twitter.com/shelikeswords
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    link: https://www.twitter.com/relequestual
excerpt: "Explore the powerful impact of JSON Schema on 6 River Systems' fulfillment operations. Discover how they enabled enhanced collaboration, time savings, and data quality assurance, propelling their successful scaling journey."
---

With the help of AI and collaborative robots, 6 River Systems has become an industry leader in fulfillment operations. Companies in the United States, Canada, and Europe use their comprehensive solutions to optimize their shipping workflows and fulfill millions of units every week. Since they were founded in 2015, 6 River Systems has grown rapidly and experienced a handful of common hurdles that come with scaling a business. During this journey, they found that JSON Schema was able to help them through some of these challenges.


## Challenges

Like many organizations that experience rapid growth, 6 River Systems has faced a series of organizational, technical, and evolutionary challenges as they've scaled. When 6 River Systems' number of warehouse clients increased by a factor of 10, the company itself had to grow as well. The operations, engineering, and analytics teams at 6 River Systems expanded significantly, and as a result, they realized they needed a better way to stay aligned and communicate expectations, contracts, and understandings—not only with one another, but also with the fulfillment system.

6 River Systems uses a large amount of robotics and hardware, and many of those technologies don't always work well together. They struggled to integrate best-in-class data processing, storage, and analytics tools into their existing systems. For example, the robots in their facility use the Robot Operating System (ROS) framework, which stores messages, commands, and system status information. While tools like ROSbag make it easier to collect and analyze robot data, they aren't compatible with modern data stack tools like Elasticsearch and BigQuery. Additionally, the most widely used version of ROS depends on Python 2.7, which is deprecated.

One inevitable byproduct of rapid growth is technical debt. 6 River Systems found early success, enough for Shopify to acquire them in 2019. Some of the solutions they implemented were short-sighted, and they knew that their next phase of growth would require them to focus on projects and practices that were sustainable in the long term.

<figure class="mt-10">
  <img src="/img/posts/2023/6-river-systems-case-study/chuck.webp"/>
  <figcaption class="mt-2 mb-10 text-sm text-center text-gray-500">Automation robot "Chuck"</figcaption>
</figure>


## Solution

By expanding their use of JSON Schema, 6 River Systems was able to solve a number of organizational and technical problems. In fact, JSON Schema has become the nucleus for automation across the organization, which has helped them achieve more consistency and higher-quality results.

To address their communication challenges, 6 River Systems' analysts started to directly collaborate with product engineers to draft new schemas. Using JSON Schema, the analysts can write a production-ready specification that the engineers understand immediately.

6 River Systems has found JSON Schema to be extremely helpful for generating typed SDKs. When an analyst and an engineer finish iterating on a schema, they use the schema to generate TypeScript interfaces for use by robots and throughout the application. The strongly typed nature at the data generation point makes development much smoother and eliminates bugs before they reach production, which makes all the difference.

6 River Systems also uses their schemas to automatically update destination databases, identify and isolate non-conforming data, and provide insight into the data that flows through the pipelines.

Here's a look at some of the technical solutions they've implemented:

- Every time a new schema is released, a series of database reconciliation steps run to make sure everything is in sync. Database tables are created or migrated automatically, and schemas are pushed to registries.
- Data processing systems use JSON Schemas to continuously validate data. Any data that doesn't adhere to the schema specification is redirected to an "invalid events" table (also known as "dead-lettering"), and an alert is triggered. They track the volume of invalid events and notify stakeholders as needed.
- They use JSON Schemas to build event-level namespaces that are incorporated into all of their metrics and monitoring systems. They can identify the exact instrumentation and version of what's running through the pipes, and any issues are immediately visible on a graph.
- Tools for data discovery, such as data catalogs, are seeded with JSON Schemas, so the tools no longer have to manually scrape metadata.
- They're starting to use JSON Schemas to help automate the generation of sources in [dbt](https://www.getdbt.com/), a popular warehouse analytics platform. As a result, an analytics engineer or data analyst no longer has to help write a new JSON Schema and then write the same thing all over again in YAML.


## Impact

As a result of using JSON Schema, 6 River Systems has seen benefits across the organization. They've found that JSON Schema saves time across all layers of their tech stack. Some would say that structuring data at the point of generation slows things down, and there's some truth to that sentiment. But 6 River Systems has found that isn't the case when the team has TypeScript interfaces to point out incorrect data types and missing attributes in an IDE.

JSON Schema is a tool that both a data analyst and a product engineer can understand. This enables two people who work with very different languages, such as TypeScript and SQL, to communicate directly with one another—a benefit that "cannot be understated," says Jacob Thomas, Data Platform team lead at 6 River Systems.

JSON Schema has enabled 6 River Systems to implement automation across the stack. They've implemented TypeScript interfaces for instrumentation SDKs, used it to generate tables for data warehouses, and put it to use in streaming environments to generate Kafka topics and dbt sources. In a large fulfillment center, it's very difficult to track down data problems after code has been released, so using JSON Schema to validate code before it goes out saves time and brings peace of mind.

As a company scales, having individuals chase things down through complicated infrastructure is not sustainable. Using JSON Schema as the shared language across the organization has improved the quality and visibility of data at all levels, which enables sustainable practices.

<figure class="mt-10">
  <img src="/img/posts/2023/6-river-systems-case-study/manage.webp"/>
  <figcaption class="mt-2 mb-10 text-sm text-center text-gray-500">Operator Command Center - "The Bridge"</figcaption>
</figure>

### Key Impact Results

The biggest advantage 6 River Systems has seen from using JSON Schema is the time they have saved. For such a small team managing such a large amount of work, every minute counts! They want to automate everything that can be automated.

<p className="text-2xl my-10">"We have processed hundreds of millions of events—each and every one of them is 'known good'. It's a model that works, and it works very well."</p>

6 River Systems discovered that by using JSON Schema, they could:

- Deploy known-good instrumentation to thousands of robots in the field.
- Enable effective collaboration between product engineers who think in TypeScript and JavaScript, data engineers who think in Python, and analysts who think in SQL.
- Validate every payload that reaches their data collection infrastructure.
- Proactively seed data discovery mechanisms and catalogs, as opposed to having the tools manually scrape metadata.

As a result of using JSON Schema, they've been able to implement tools like [Quicktype](https://quicktype.io/) and [TypeBox](https://github.com/sinclairzx81/typebox) on the producer side and JSON Schema-based validators on the client side. With some logic to connect the two, their data warehouses stay up-to-date.


## 6 River Systems' Journey

6 River Systems was founded in Waltham, Massachusetts, in 2015 and became a subsidiary of Shopify in 2019. Like many companies that grow quickly, 6 River Systems discovered that they needed to make some changes in order to sustain their early success. Let's take a look at how 6 River Systems went through the process of identifying the challenges they were facing and the different solutions they considered.


### Identifying Pain Points

When 6 River Systems was starting out, they dealt with a lot of semi-structured data sent without context. There was no way of knowing what the data meant, how to structure it, or what was acceptable and what wasn't. They formed a team to analyze this data, but as the volume of data increased, scaling the team became unsustainable. On top of that, instrumentation would often change and sometimes be removed entirely, making it even harder to contextualize the data and causing customer-facing dashboards to break.

All this was happening as new customers continued to come on board. Costs were increasing across the organization, and 6 River Systems knew that they needed to expand as fast as possible using sustainable, long-term solutions—all without blocking current development.

<p className="text-2xl my-10">"We identified very quickly that we needed a solution for expressing expectations, contracts, and understanding—an IDL for both systems and humans within various teams."</p>


### Finding a Solution

In their search for solutions to maintain explicit contracts with their data, here are some of the options they considered:

- **Protobuf**: While Protobuf works very well, it's less common than JSON. Analysts tend not to know it, while JSON is something they work with every day. Because 6 River Systems' engineering and analytics teams work so closely together, they needed a solution that was equally understandable to both.
- **Apache Avro**: There's a lot to like about Avro, but it's heavily tied to the Kafka ecosystem, which 6 River Systems doesn't use.
- **JSON Schema**: Rather than completely rewriting the stack with new technology, using JSON Schema was an incremental solution that was easy to understand. JSON was already widely used by front-end engineers, it integrates well with the Node.js and TypeScript ecosystem, and it can be "bolted onto" existing code with little to no changes.


### Validating the Solution

Using JSON and JSON Schema turned out to be the best solution at all levels of the stack. Instead of starting from scratch, they could use JSON Schema to enhance upstream processes while automating downstream ones. They were able to make each schema more strict than before and enforce more constraints around the data.

<p className="text-2xl my-10">"The 'aha!' moment was when teams no longer needed to talk to us to push new instrumentation. The product team and analysts could talk to each other, and good data would show up in BigQuery."</p>

While 6 River Systems had previously used JSON Schema in a number of areas across the company, they now use it to power UI components, workflow and configuration management systems, and incoming and outgoing integrations to warehouse management systems. By implementing JSON Schema consistently across the organization, they are confident in their ability to keep growing and scaling while always maintaining the high-quality solutions they are known for.

Thank you to [Jacob Thomas](https://www.linkedin.com/in/jake-thomas/) and 6 River Systems for enabling us to share this case study with you.

Images used with permission.
