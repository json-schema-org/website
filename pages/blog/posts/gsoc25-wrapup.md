---
title: "Google Summer of Code 2025 at JSON Schema: Building for Use, Learning, and Longevity"
date: "2026-01-15"
tags:
  - News
type: Community
cover: /img/posts/2026/gsoc25/gsoc25-banner.jpg
authors:
  - name: Onyedikachi Hope Amaechi-Okorie
    photo: /img/avatars/onyedikachi.jpg
    link: https://www.linkedin.com/in/amaechihope/
    byline: Technical Community Advocate 
excerpt: "GSoC 2025 empowered JSON Schema contributors to improve developer experience, tooling, and learning through projects like schema visualization, clearer errors, and a Java wrapper for Blaze."
---

Every year, Google Summer of Code creates a moment of pause for open-source communities, a chance to step back from day-to-day maintenance and ask deeper questions about direction, priorities, and people. It invites us to reflect not only on what we are building, but why it matters and who we are building it for.

For JSON Schema, GSoC 2025 represents a shift toward intentional growth. Rather than expanding the ecosystem simply by adding more tools or features, this year’s focus is on strengthening how JSON Schema is understood, adopted, and experienced in practice. The selected projects pay close attention to the developer journey, how errors are interpreted, how concepts are learned, how schemas are explored, and how tooling fits into existing workflows.

These efforts sit at the intersection of usability, clarity, and long-term sustainability. By improving the everyday experience of working with JSON Schema, we invest not just in new capabilities, but in trust, accessibility, and continued adoption across diverse communities and use cases.

## From Ideas to Impact
The GSoC 2025 project slate is the outcome of ongoing conversations within the JSON Schema community, conversations about friction points, recurring questions, and the gaps contributors and users encounter in real-world use. Over time, patterns emerged, the need for clearer feedback, better guidance, more visual and interactive learning tools, and stronger integration across languages and platforms.

Each project was shaped by these insights, translating community discussion into concrete, actionable work. Mentors helped frame problems with long-term impact in mind, contributors brought fresh perspectives and curiosity, and community feedback grounded proposals in lived experience. The result is a set of projects that move beyond abstract ideas and toward practical improvements that people can feel in their daily work.

Together, these projects represent not just what the community wants to build, but what it needs to build next.

## GSoC 2025 Project Overview

### Build a Java Wrapper Library for sourcemeta/blaze

* [Idea on Github](https://github.com/json-schema-org/community/issues/874)
* Contributor: [Madhav Dhatrak](https://github.com/MadhavDhatrak)
* Mentor: [Bence Eros](https://github.com/erosb)

This project focused on building a Java wrapper for the sourcemeta/blaze library, a high-performance JSON Schema validator written in C++, making Blaze’s capabilities accessible to Java developers without requiring them to leave the Java ecosystem. By using the Foreign Function & Memory (FFM) API, the work removed the need for traditional JNI, resulting in better performance, improved safety, easier maintainability, and alignment with modern Java standards (Java 21+). The project delivered a production-ready wrapper with Java-friendly APIs designed for minimal overhead and straightforward integration, alongside comprehensive documentation, usage examples, and sample applications. It also introduced CI/CD workflows using GitHub Actions to support cross-platform builds and automated testing, and the library was published to Maven Central to enable wider adoption and long-term usability within the Java community.

### Better JSON Schema Errors

* [Idea on Github](https://github.com/json-schema-org/community/issues/870)
* Contributor: [Arpit Kuriyal](https://github.com/arpitkuriyal)
* Mentor: [Jason Desrosiers](https://github.com/jdesrosiers)

This project focused on improving one of the most common pain points in JSON Schema usage, the difficulty of understanding validation errors. Many existing error messages are hard to interpret, which can make debugging frustrating for both developers and end users. The work resulted in a JavaScript library that transforms raw JSON Schema validation outputs into clear, concise, and human-friendly messages while remaining compatible with standard error formats. The library improves readability, supports multiple languages, and allows customization to fit different application needs. By prioritizing clarity and usability, this project significantly improves the developer experience and makes JSON Schema validation errors easier to understand and act on.

### Comprehensive JSON Schema Linting for Best Practices

* [Idea on Github](https://github.com/json-schema-org/community/issues/856)
* Contributor: [Karan Palan](https://github.com/Karan-Palan)
* Mentors: [Juan Cruz Viotti](https://github.com/jviotti), [Ben Hutton](https://github.com/Relequestual)

This project focused on strengthening JSON Schema linting by defining and standardizing rules based on shared agreement around common anti-patterns and best practices across different dialects. The work established a clear set of linting rules, each published with a stable URL so that linters can reference them directly when reporting issues on the JSON Schema website. These rules were also implemented in practice by extending the Sourcemeta JSON Schema CLI and related tooling. By building a comprehensive and scalable linting framework, the project provides developers with a consistent and reusable foundation for validating schema quality. This work improves the reliability of schemas, helps teams follow best practices more closely, and makes it easier to catch issues early through automated linting that can be applied across projects at scale.

### Automated Badge Issuance for A Tour of JSON Schema

* [Idea on Github](https://github.com/json-schema-org/community/issues/872)
* Contributor: [Prasanth S7](https://github.com/Prasanth-S7)
* Mentor: [Matthew Adams](https://github.com/mwadams)

This project delivered a simple and automated badge issuance system for learners who complete the JSON Schema Tour, removing the need for manual intervention in recognizing progress. The work focused on building a lightweight and reliable workflow that uses Google Sheets to collect completion data and integrates with Badgr to issue digital badges at scale. A script was developed to fetch user data, communicate with the Badgr API, and handle errors and logging in a way that supports long-term maintenance. The automation was designed with scalability in mind, with hosting options such as Cloudflare Workers explored to ensure efficient execution. The result is an open-source solution published on GitHub with clear documentation, making it easy for others to adopt, reuse, and adapt the system for similar learning initiatives.

### Component Library Adaptation for the JSON Schema Website

* [Idea on Github](https://github.com/json-schema-org/community/issues/859)
* Contributor: [Idan levy](https://github.com/idanidan29)
* Mentor: [Benjamin Granados](https://github.com/benjagm)

This project focused on modernizing the JSON Schema website by reducing the reliance on custom UI components that had become difficult to maintain and slow to update. The work introduced a shared component library and refactored existing components into a more modular and consistent system, improving both maintainability and the overall user experience. Updates included theming the new components, refining layout and navigation with support for dark mode, and reworking Markdown rendering into a more flexible and extensible approach. This made it possible to support richer content such as tables, tab groups, and a dynamic table of contents while replacing legacy overrides with modern equivalents. Alongside the technical changes, clear documentation and implementation guidance were added for future contributors, and long-standing issues related to the affected components were addressed to improve stability and usability across the site.

### JSON Schema Visualization Tool: An Interactive Graphical Viewer

* [Idea on Github](https://github.com/json-schema-org/community/issues/868)
* Contributor: [Jagpreet Singh Rahi](https://github.com/jagpreetrahi)
* Mentor: [Agnivesh Chaubey](https://github.com/AgniveshChaubey)

This project focused on making complex JSON Schema structures easier to understand by visualizing the relationships between schema properties, particularly in cases involving nested objects and deeply structured schemas. The work introduced a graphical representation of JSON Schemas using Cytoscape.js, allowing users to explore schema relationships visually rather than relying solely on raw text. Schema validation was handled using AJV to ensure strict compliance across JSON Schema dialects, with the visualization reflecting validated structures accurately. The tool was built with React and designed to run entirely on the client side, requiring no backend. By prioritizing standards compliance and clear visual feedback, the project significantly improves usability and learning for new and experienced users alike, while laying a strong foundation for future enhancements such as real-time editing, interactive tooltips, and improved accessibility features like dark mode.

## Mentorship as Infrastructure

Mentorship in GSoC is often talked about as guidance, but in practice it functions more like infrastructure. Mentors help contributors navigate not just codebases, but decision-making, trade-offs, and community norms. In return, contributors challenge assumptions and bring new energy into long-standing projects.
This exchange is foundational to how JSON Schema sustains itself.

## Looking Beyond the Program

GSoC 2025 is not an endpoint. The outcomes of these projects are designed to live beyond the program, feeding into documentation, tooling, and future community initiatives. As the work progresses, we’ll continue to share updates and invite feedback from across the ecosystem.

## Join the Work

Whether you are a long-time contributor or discovering JSON Schema for the first time, there are many ways to get involved. [Join discussions](https://json-schema.org/slack), [explore the repositories](https://github.com/json-schema-org), or simply ask questions. The community grows stronger with every voice and perspective added.

Background Photo by <a href="https://unsplash.com/@chillytooth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chanhee Lee</a> on <a href="https://unsplash.com/photos/a-laptop-and-a-glass-of-water-on-a-table-MADezathlZo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>