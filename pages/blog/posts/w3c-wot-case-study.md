---
title: "How the W3C Web of Things brings JSON Schema to the Internet of Things"
date: "2022-11-01"
type: Case Study
cover: /img/posts/2022/w3c-wot-case-study/cover.webp
authors:
  - name: Juan Cruz Viotti
    photo: /img/avatars/jviotti.webp
    twitter: jviottidc
excerpt: "Using JSON Schema at the W3C Web of Things to create an interoperability layer so that different IoT platforms, protocols and standards can operate together"
language: en
---

## Challenge

The Internet of Things (IoT) is the network of physical "smart" objects that
exchange data with other devices over the Internet. While communication and
interoperability are by definition the crux of the Internet of Things, the
emergence of custom or proprietary solutions results in devices that cannot
talk to each other due to differences in data interchange mechanisms.

To integrate these disparate devices, developers must work with a growing set
of protocols, serialization formats and API specifications. This results in
repetitive, non-scalable and error-prone work that is difficult to automate.

While technologies like OpenAPI and AsyncAPI largely solve this problem in the
context of Web APIs, they fall short for describing networks of non-HTTP and
multi-protocol devices, and do not consider different modes of interaction
based on their meaning in the physical world.

## Solution

To solve these problems, the W3C Web of Things works on providing standardized
building blocks that make use of JSON Schema.

JSON Schema is used for validating descriptions of network-facing capabilities
of physical entities called [Thing Descriptions][thing-description], and to
model and describe data sent by Internet of Things consumers and producers in a
multi-protocol manner.

The W3C Web of Things specifications are on board with JSON Schema since Draft
4, and even the first draft versions already catered to data models of Internet
of Things devices.  "Currently, we are on JSON Schema Draft 7 and expect to
move to JSON Schema
[2020-12](https://json-schema.org/specification-links.html#understanding-draft-names-and-numbers)
or a newer one when starting our new charter in February 2023," said Ege
Korkan, Research Scientist at Siemens and W3C Specifications editor.

"We observe JSON Schema becoming more and more stable over the years and
Postman's support to the community gives us even more confidence on it,"
continued Ege Korkan.

JSON Schema is delivering exciting features, and more importantly these
features are becoming more and more consistent across implementations.  For
example, Ege Korkan added, "JSON Schema vocabularies are very promising and we
plan to explore them further in conjunction with Semantic Web technologies."

## Impact

The W3C Web of Things relies on JSON-LD for linking vocabularies and ontologies
that already exist on the web, such as [SAREF][#saref], [Units of
Measure][#units-of-measure] and [Schema.org][#schema-org]. Being based on the
JSON data model, JSON Schema fits well with JSON-LD when integrating both
technologies as part of a single specification.

Adopting JSON Schema means that the W3C Web of Things does not need to invest
effort on inventing another schema language. As a consequence of the popularity
of JSON Schema, existing tooling can be often reused instead of implementing
custom parsers, validators, code generators and UI generators for all the
programming languages that the community might be interested in.

JSON Schema has proven to be a foundational block for creating higher-level
tooling that is specific to the W3C Web of Things. As a notable example, the
community has developed a tool called
[testbench](https://github.com/tum-esi/testbench) that makes use of JSON Schema
definitions inside Thing Descriptions to generate matching payloads for the
purpose of stress and penetration testing.

Given the growing popularity of using JSON Schema to generate web-based forms,
W3C Web of Things specifications can be used to automatically generate
dashboards and user interfaces to interact with the objects modeled by Thing
Descriptions.

## Key Impact Results

The ultimate metric of success for a standard like the W3C Web of Things is
adoption, and community adoption is not something you can just "engineer".  Ege
Korkan commented, "since we adopt JSON Schema, developers who are familiar
with it have a smaller learning curve when learning the W3C Web of Things
standard."

"During my PhD times, my MSc engineering students had to become familiar with
the W3C Web of Things. These students typically took 1 week to go through my
[tutorial](https://github.com/tum-esi/wot-tutorial). If they knew JSON Schema,
that 1 week would become 2 days", said Ege Korkan.

## W3C Web of Things

The World Wide Web Consortium (W3C) is the standardization organization behind
most of the standards used in the Web. The W3C Web of Things Working and
Interest Groups work on the standardization of Web of Things at W3C.

The Web of Things groups aim to create an interoperability layer so that
different Internet of Things platforms, protocols and standards can operate
together.

The work started as a discussion in the Web of Things Community Group in
2013-2014.  It proceeded to become an Interest Group in 2015 that
collected the use cases and defined the standards to be worked on. Since 2016,
the working group is working on different standards on the Web of Things with
the first publications of the Thing Description and Architecture
recommendations in 2019 and more that will be published by the end of this
year.

At the time of this writing, the Working Group consists of 96 participants
representing 36 organizations and the Interest Group consists of 131
participants representing 48 organizations. 

![W3C Web of Things Examples](/img/posts/2022/w3c-wot-case-study/wot-examples.webp)

## Getting Started

The W3C Web of Things Working Group invites you to leverage your existing JSON
Schema knowledge to play with the Internet of Things through the use of the W3C
Web of Things specifications and tools. You might already have a smart device
next to you, just that it does not come with a Thing Description!

If you write your own Thing Description, you can programatically interact with
your device by using the [Node.js Web of Things
implementation](https://github.com/eclipse/thingweb.node-wot), or play with it
through the
[Node-RED](https://www.npmjs.com/package/node-red-contrib-web-of-things)
integration.

To learn more, head over to the
[documentation](https://www.w3.org/WoT/documentation/), watch the [introductory
videos](https://www.w3.org/WoT/videos/), have a look at the many examples
provided as part of the [Thing Description specification](#thing-description)
and try them out on the [Thing Description
Playground](http://plugfest.thingweb.io/playground/) app.

Thank you to Ege Korkan, Web of Things Researcher at Siemens AG, Munich, the
W3C Web of Things Working and Interest Groups and Coralie Mercier from the W3C
Marketing and Communications Team for allowing and enabling us to share this
case study with you.

Cover image: [Hello WoT](https://bind.systems/tags/web-of-things/) © 2022 by desertmonitor OÜ is licensed under CC BY-ND 4.0

[thing-description]: https://www.w3.org/TR/2020/REC-wot-thing-description-20200409/
[saref]: https://saref.etsi.org
[units-of-measure]: https://bioportal.bioontology.org/ontologies/UO
[schema-org]: https://schema.org
