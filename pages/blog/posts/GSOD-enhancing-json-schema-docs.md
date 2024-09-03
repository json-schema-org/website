---
title: 'Enhancing JSON Schema documentation: insights and progress from the Google Season of Docs 2024 project'
date: '2024-09-03'
tags:
  - Google Season of Docs
  - Documentation
  - Community
type: Documentation
cover: img\posts\2024\GSOD-enhancing-json-schema-docs\JSON-website-cover.jpg
authors:
  - name: Blessing Ene Anyebe
    link: https://www.linkedin.com/in/anyebe-blessing-ene-kwennb/
    byline: Technical writer
excerpt: 'An in-depth announcement blog post to share the JSON Schema documentation efforts from the GSOD team.'
---

The [JSON Schema documentation project](https://github.com/json-schema-org/website/issues/245) is a collaborative effort that aims at providing new users and implementers with resources to learn and implement JSON Schema. To achieve this vision, JSON Schema contributors have identified different areas to be worked on:

- Improving the information architecture of the documentation to make it easy for all JSON Schema users to understand.
- Improving the navigation and findability of the documentation website.
- Improving the existing guides and examples to provide a clear and comprehensive learning experience.
- Creating tutorials to help new implementers define new implementations.
- Creating overview docs such as Roadmap, vision, release and versioning, support, and FAQ.
- Revamping the glossary.
- Enabling ways to capture feedback from the community.
- Providing internal guides to streamline maintaining and extending the docs.
- Restructuring _Understanding JSON Schema_ to render scalability to the reference documentation.

### JSON Schema Google Season of Docs 2024 project

As part of the broader vision to enhance the JSON Schema documentation, we proposed a [Google Season of Docs (GSoD) project](https://github.com/orgs/json-schema-org/discussions/687) to focus on the following aspects:

- Reformatting the specification documents to improve discoverability, consistency, and usability.
- Rebuilding the reference documentation book structure to optimize scalability and findability.

### The GSoD 2024 team

We are a diverse team of professionals with different skills and levels of experience:

- [Valeria Hernandez](https://www.linkedin.com/in/valeriahhdez/) – Technical Writer (Mexico)
- [Blessing Ene Anyebe](https://www.linkedin.com/in/anyebe-blessing-ene-kwennb/) – Technical Writer (Nigeria)
- [Dhairya Amrish Majmudar](https://www.linkedin.com/in/dhairya-majmudar/) – Web Developer (India)
- [Benjamin Granados](https://www.linkedin.com/in/benjagranados/) – Project Manager (Spain)

By working on the documentation areas described above, we aim to improve the overall developer experience and make JSON Schema documentation easy to maintain and scale.

## Research stage

We conducted three types of content audits to assess the state of the JSON Schema documentation, which helped us propose structural changes. In this section, we describe the most important findings and suggestions from the audits.

### Qualitative audit

We concluded from the qualitative audit that documentation is easy to read, clear, accurate, and has few typos. However, implementing documentation best practices could improve the quality of JSON Schema documentation, particularly:

- Including a table of contents to help readers easily identify sections of interest within documents.
- Including a _Next - Previous_ component at the end of each document to give readers more resources to continue learning.
- Including more images as a visual aid for explaining complex concepts. Only one image was found on the documentation website.

### Quantitative audit

Based on the quantitative audit, we found 29 technical documents. We categorized these technical documents according to the [diataxis framework](https://diataxis.fr/), which attends to readers' needs. Most of the documentation was categorized as reference documents, followed by explanations, tutorials, and a how-to guide.

![Quantitative analysis of the doc](img\posts\2024\GSOD-enhancing-json-schema-docs\quantitative-analysis-gsod24.png)

JSON Schema documentation by content type

Regarding the depth of the documents, defined as the number of headings per document, we found that the minimum number of headings was one and the maximum number was 28. Based on this finding, we suggest breaking down large documents to improve the overall structure of the website.

### Structural audit

The structural audit showed that URLs match expected paths. However, findability and navigation could be improved by integrating breadcrumbs.

## Findings and recommendations

### Developer journey

During this part of the research stage, we identified seven stages of the developer journey with the JSON Schema documentation:

1. Discovery. At this stage, the developer becomes aware of the product or technology and explores the documentation to understand its basic functionalities.
2. Evaluation. Having piqued their interest, the developer dives deeper into the documentation to assess if the product suits their needs. They might look for specific features, code examples, or tutorials.
3. Adoption and learning. Once developers are interested in the technology, they will dive into the learning resources provided by the documentation. This stage typically includes tutorials, getting-started guides, and conceptual explanations. The documentation should aim to provide a gentle learning curve, catering to beginners and experienced developers, with clear examples and step-by-step instructions.
4. Implementation and validation. At this stage, developers will want to integrate the technology into their projects or workflows. The documentation should provide clear instructions on implementation, validation, and integration with other tools or frameworks commonly used in the developer's ecosystem.
5. Troubleshooting. Developers will inevitably encounter issues or bugs during their journey. The documentation should provide comprehensive troubleshooting guides, FAQs, and support resources, such as forums, mailing lists, or issue trackers, to help developers resolve problems efficiently.
6. Scaling. The scaling stage in a developer's journey refers to the phase when developers want to expand their use of JSON Schema beyond initial implementations.
7. Contributing an advocacy. Developers may want to contribute to the JSON Schema or share their experiences with others. The documentation should foster community by highlighting contribution guidelines, showcasing community-driven resources (e.g., blogs, tutorials, plugins), and encouraging knowledge sharing.

We listed questions that developers might have and categorized them according to the stage of the developer journey they belong to. We also identified documents that provide answers to these questions. The most important finding of this work is that the current JSON Schema website lacks documentation for stages five and six, _Troubleshooting_ and _Scaling_, respectively. Click on the following Fugma file to [check out the full list of questions categorized by developer journey stage](https://www.figma.com/board/TRjQUw33K93y8RlJMSRkJs/JSON-dev-journey?node-id=0-1&t=gYkdGtHk2sKrCQM0-0).

### Reference documentation

We conducted a comprehensive review of the JSON Schema draft 2020-12 keywords in the documentation. Our findings in the Draft 20212-12 keywords table reveal that 54 of 57 keywords are currently documented.

To enhance user navigation and provide quick access to relevant documents, we integrated the findings summarized in the Draft 2020-12 keywords table as a stand-alone [page in the reference documentation](https://json-schema.org/understanding-json-schema/keywords).

Based on our analysis of the reference documents, we concluded that the book _Understanding JSON Schema_ serves as a complete reference for new users to learn and implement JSON Schema.

### Specification documents

The specification documents mix information about each JSON Schema dialect and release notes, which hinders findability. Therefore, the goal of this part of the project is to separate the release notes from the information of each draft and to present the latter in a consistent format.

To achieve this goal, we have successfully worked on the following changes:

- Implementing a box component that houses drafts’ details like the specification URL, published date, authors, and metaschema URL.
- Creating a standalone page to keep all draft release notes in a content bucket, enhancing findability.

And we are currently working on creating a new JSON hyper-schema page.

Our assessment of the Specification documents revealed that it can be hard for JSON Schema implementers to migrate between dialects because the documentation lacks clarity about the following aspects:

- Keyword changes. It is difficult to identify which keywords have changed between dialects.
- Insufficient historical context. Some keywords have retained their names but evolved across Schema versions. However, no documentation explains when these keywords were introduced or why they changed over time.
- Behavioral changes without syntax changes. Some keywords have changed their behavior while maintaining their syntax across schemas, which can be confusing to users.
- Limited migration guidance. Users would benefit from more guidance on how to upgrade implementations with changing keywords.

To facilitate smoother migration between drafts, we recommend the following changes:

- Creating a detailed changelog of keyword modifications between versions
- Providing historical timelines for keyword introductions and changes
- Highlighting behavioral changes, especially when syntax remains unchanged
- Developing a robust set of migration examples and best practices

On the strengths of the Specification documents, we particularly acknowledge the comprehensive Specification links page, which has received positive user feedback for its detailed information on all available JSON Schema drafts. Users especially appreciate the page's overview table, listings of published drafts, and clear presentation of relevant URLs. These elements provide a centralized resource for navigating JSON Schema specifications. As we implement improvements, we'll maintain and build upon these strengths to create an even more user-friendly documentation experience.

### Improving community feedback collection

We proposed a new form for community feedback collection to collect unambiguous and actionable feedback. The current open-ended question “Was this helpful?” is sometimes filled by readers with information that we can’t use to improve our documents. As outlined in [issue #805](https://github.com/json-schema-org/website/issues/805), the readers expect the documentation to be:

- Easy to find
- Accurate
- Relevant
- Easy to understand

Therefore, we proposed to change the current feedback form to ask readers four _Yes/No_ questions that will tell us whether our documentation is easy to find, accurate, relevant, and easy to understand. [This proposal is currently under work](https://github.com/json-schema-org/website/pull/841) by other JSON Schema contributors.

## Recap and how you can contribute to JSON Schema GSoD 2024

At the moment of writing this article, the JSON Schema GSoD 2024 team has completed its assessment of the current state of the JSON Schema documentation and provided feedback. The most important conclusions from this work are the following:

1. The JSON Schema documentation is easy to read, clear, accurate, and has a few typos.
2. Adding components like a table of contents, a _Next - Previous_ one, and breadcrumbs can enhance navigation and findability.
3. Documentation depth needs to be rebalanced to avoid very long documents.
4. The current website lacks documents for the *Troubleshootin*g and _Scalability_ stages of the developer journey.
5. The reference documentation provides a comprehensive guide to draft 2020-12 keyword usage.
6. Specification documents need reformatting for consistency and separation from release notes to improve findability.
7. Creating migration documentation will smoothen upgrading between dialects.
8. Implementing a four-question Yes/No feedback system would provide more actionable user insights.
9. Three keywords of draft 2020-12 need to be documented.

The GSoD 2024 team is currently working on the following changes:

1. Draft 2020-12 keywords page (merged).
2. Table of contents component (merged).
3. Next - Previous component (under review).
4. Specification documents reformat (under review).
5. Migration pages (planning stage).

As we continue working on the JSON Schema GSoD 2024 project, we invite you to become a contributor and help us improve the JSON Schema documentation.  If you would like to participate, here is a list of tasks that need attention:

- Break down large documents to improve the overall structure of the documentation website.
- Create missing documentation that answers questions from the _Troubleshooting_ and _Scaling_ stages of the developer journey.
- Document three missing JSON Schema keywords.
- Create a migration page.

Our documentation-focused meetings run every Tuesday at 3:00 PM (UTC). To participate, join the #gsod24 channel in the [JSON Schema Slack workspace](https://json-schema.org/slack) and send us a message with your email address so we can add you to the meeting.

Before contributing, we encourage you to read and agree to our [Code of Conduct](https://json-schema.org/overview/code-of-conduct). Read our [Contribution guidelines](https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md) to know about processes and contribution expectations and check out the [JSON Schema documentation project](https://github.com/orgs/json-schema-org/projects/16/views/1) where you will find documentation issues tagged GSoD.

We also welcome any suggestions to improve documentation. To create an issue, fill out the Docs template and let the team know if you want to work on it yourself.

After working on your changes, you can open a pull request and ask the docs team to review it. The reviewers include Valeria Hernandez, Blessing Ene Anyebe, Dhairya Amrish Majmudar, Benjamin Granados, and the JSON Schema web team.

## Closing thoughts

The JSON Schema Google Season of Docs 2024 project represents a significant step forward in enhancing the accessibility and usability of JSON Schema documentation. Our comprehensive audits and research have laid the foundations for substantial improvements, addressing key areas such as navigation, content structure, and user experience.

As we continue building this project, we're excited about the potential impact of these changes. By refining our documentation, we aim to empower developers at all stages of their journey with JSON Schema. The collaborative nature of this project underscores the strength of our community and our commitment to fostering an environment where knowledge is easily shared and accessed.

We encourage you to join us in this ongoing effort. Whether you're a seasoned JSON Schema user or new to the technology, your insights and contributions can play a crucial role in shaping the future of our documentation. Together, we can create documentation that not only meets the needs of today's developers but also anticipates the challenges of tomorrow.

Thank you for your interest in the JSON Schema documentation project. We look forward to your contributions and seeing how these improvements will benefit the wider developer community.
