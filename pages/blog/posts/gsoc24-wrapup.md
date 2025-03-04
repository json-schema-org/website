---
title: "Celebrating JSON Schema’s Google Summer of Code 2024 Journey"
date: "2025-01-17"
tags:
  - News
type: Community
cover: /img/posts/2025/gsoc24/gsoc24-banner-main.png
authors:
  - name: Onyedikachi Hope Amaechi-Okorie
    photo: /img/avatars/onyedikachi.jpg
    link: https://www.linkedin.com/in/amaechihope/
    byline: Community and Developer Relations Manager 
excerpt: "Discover the projects, mentors, and contributors that shaped Google Summer of Code (GSoC) 2024!"
---

Last year, JSON Schema proudly participated in Google Summer of Code (GSoC) 2024, a global program designed to bring fresh talent into open-source communities. Through this initiative, we tackled some of our most exciting projects yet, creating opportunities for contributors to make meaningful impacts while gaining valuable experience.

We’re thrilled to share the highlights of this journey and the incredible work our contributors and mentors achieved together.

## A Unique Start: Setting the Stage for Success
For JSON Schema, GSoC 2024 wasn’t just about welcoming contributors but about setting a high standard. Before selection, applicants underwent a qualification test, allowing us to assess technical skills and alignment with project goals. This ensured each participant had the tools and mindset to thrive.

Here’s what stood out in our journey:

* 8 projects completed across diverse aspects of JSON Schema.
* A record number of applicants, with a community brimming with enthusiasm.
* Returning mentors and contributors, bringing experience and new perspectives.

## Transformative Projects and Talent Contributors

### 1. Bowtie-Trend: Long-Term Reporting With Bowtie

* Contributor: [Adwait Godbole](https://github.com/adwait-godbole)
* Mentors: [Julian Berman](https://github.com/Julian), [Agnivesh Chaubey](https://github.com/AgniveshChaubey)
* [Idea on GitHub](https://github.com/json-schema-org/community/issues/607)

The project aims to enhance [Bowtie](https://github.com/bowtie-json-schema/bowtie), a meta-validator for the JSON Schema specification that coordinates the execution of validator implementations and reports their results. While Bowtie already generates compliance reports accessible [here](https://bowtie.report), this project introduces a mechanism to track compliance metrics over time. The goal is to enable graphing and querying of how test results evolve as implementations fix bugs or new tests are added. Key outcomes include a new bowtie trend command to aggregate results into trend reports and a dedicated webpage displaying graphs of failed tests over time, providing deeper insights into long-term compliance trends.

### 2. Bowtie-Perf: A Performance Tester for JSON Schema Implementations

* Contributor: [Dhruv Singh](https://github.com/sudo-jarvis)
* Mentors: [Julian Berman](https://github.com/Julian), [Agnivesh Chaubey](https://github.com/AgniveshChaubey)
* [Idea on Github](https://github.com/json-schema-org/community/issues/605)

The project enhances [Bowtie](https://github.com/bowtie-json-schema/bowtie), a meta-validator of the JSON Schema specification. Bowtie provides universal access to JSON Schema implementations, enabling users to validate instances and identify bugs or gaps in functionality. Currently, Bowtie supports validating instances against schemas and comparing implementations based on correctness. This project expands its capabilities by developing a performance tester integrated within Bowtie. This addition provides a critical dimension for performance optimization and enables more comprehensive comparisons across JSON Schema implementations.

### 3. Setting up the CI/CD Pipeline for the JSON Schema Website

* Contributor: [Alok Gupta](https://github.com/aialok)
* Mentor: [Benjamin Granados](https://github.com/benjagm)
* [Idea on Github](https://github.com/json-schema-org/community/issues/603)

The Improved CI/CD Workflow for the [website](https://github.com/json-schema-org/website) project with GitHub Actions project focuses on enhancing the existing CI/CD pipelines by adding essential features like linting, formatting, unit testing, UI testing, broken link checks, and build processes. The project involves streamlining workflows for pull requests, pushes, and issues, with special emphasis on first-time contributors. Key deliverables include creating and optimizing workflows such as PR workflows, push workflows, issue workflows, stale issue and PR reminders, unauthorized file detection, and CodeQL for security analysis. Additionally, the project aims to provide clear documentation on workflow roles and guidelines for updates, ensuring smoother community operation integration and more efficient code management.

### 4. Building a New Version of the JSON Schema Tooling Page

* Contributor: [DV](http://github.com/darhkvoyd)
* Mentor: [Benjamin Granados](https://github.com/benjagm)
* [Idea on Github](https://github.com/json-schema-org/community/issues/602)

The JSON Schema [Tooling Page](https://json-schema.org/tools) plays a vital role in helping developers explore the ecosystem of JSON Schema tools and implementations. However, its current design presents usability challenges that hinder adoption. This project aims to rebuild the tooling page using a data-driven approach while adhering to the updated UI/UX standards of the JSON Schema website. By improving accessibility, simplifying navigation, and enhancing clarity, the revamped tooling page will make JSON Schema implementations more discoverable and user-friendly, ultimately reducing friction and encouraging broader adoption within the developer community.

### 5. JSON Schema Language Server Contributions

* Contributor: [Diya Solanki](https://github.com/diyaayay)
* Mentor: [Jason Desrosiers](https://github.com/jdesrosiers)
* [Idea on Github](https://github.com/json-schema-org/community/issues/601)

The project focuses on enhancing the [Language Server Protocol (LSP)](https://github.com/hyperjump-io/json-schema-language-tools) for JSON Schema, enabling improved support for various editors and IDEs. Unlike the existing VSCode integration, which lacks support for recent JSON Schema versions and struggles with performance for large schemas, this project aims to expand functionality. Key improvements include inline diagnostics for invalid schemas, semantic highlighting for JSON Schema and deprecated keywords, support for multiple drafts (04/06/07/2019-09/2020-12), and enhanced configuration management. The project also focuses on adding code completion for $schema, making JSON Schema development more efficient and accessible across platforms.

### 6. Define Upgrade/Downgrade Language-Agnostic Declarative Transformation Rules for all JSON Schema Dialects

* Contributor: [Suprith KG](https://github.com/suprith-hub)
* Mentor: [Juan Cruz Viotti](https://github.com/jviotti)
* [Idea on Github](https://github.com/json-schema-org/community/issues/599)

The project addresses the challenges of maintaining software compatibility across different schema versions. It focuses on creating declarative, language-agnostic rules to streamline the process of [upgrading or downgrading JSON Schemas](https://github.com/json-schema-org/upgrade-downgrade-rules). This is crucial for users working with high-level languages like Python, managing large documents, or navigating diverse network communication setups such as HTTP, WebSocket, microservices, or IoT. By simplifying schema transformations and introducing standardized procedures, this project aims to save time, ensure reliability, and improve JSON Schema’s versatility across various implementations and use cases.

### 7. Source Generation Analyzer Powered by Corvus.JsonSchema (.NET)

* Contributor: [Pranay Joshi](https://github.com/pranayjoshi)
* Mentors: [Matthew Adams (Endjin)](https://github.com/mwadams), [Greg Dennis](https://github.com/gregsdennis)
* [Idea on Github](https://github.com/json-schema-org/community/issues/614)

The project focuses on creating a source generator that integrates seamlessly with [Corvus.JsonSchema](https://github.com/corvus-dotnet/corvus.jsonschema). This tool will automatically generate code from JSON Schema files within a .NET project at compile time, streamlining the development process. The ultimate goal is to foster collaboration and consistency across software development teams using diverse technology stacks by establishing JSON Schema as a unified source of truth for data modeling. This ensures that generated code adheres to a standardized data structure, improving efficiency and alignment within organizations.

### 8. A Tour of JSON Schema

* Contributor: [Zeel Rajodiya](https://github.com/JeelRajodiya)
* Mentors: [Bence Eros](https://github.com/erosb), [Benjamin Granados](https://github.com/benjagm)
* [Idea on Github](https://github.com/json-schema-org/community/issues/645)

The [Tour of JSON Schema](https://github.com/json-schema-org/tour) project is an interactive learning platform designed to help beginners quickly grasp JSON Schema concepts and best practices. Through step-by-step lessons and hands-on exercises, users can learn by doing, using a simple interface and built-in code editor. The platform provides practical examples, real-time validation of JSON Schema, and immediate feedback, making the learning process engaging and effective. By following structured lessons, users will gain the confidence to create and work with JSON Schemas independently.

## Mentorship: A Two-Way Learning Process

The success of GSoC 2024 for JSON Schema wouldn’t have been possible without our dedicated mentors. They not only guided contributors but also gained fresh perspectives from working closely with emerging talent.

## Watch the Journey

Want to hear more about the contributors’ stories? Watch our [YouTube presentation](https://www.youtube.com/watch?v=2V9k1Hqhgnw) where contributors reflect on their challenges, successes, and learning moments.

## Looking Forward

GSoC 2024 has left an indelible mark on JSON Schema. From automation to tooling, each project has strengthened our ecosystem and laid a foundation for continued innovation.
We are excited about the future and invite developers from around the world to join us in shaping it.

## Ready to contribute?
Explore our [GitHub repository](https://github.com/json-schema-org), get involved in discussions, and be a part of the JSON Schema community!

Background photo by <a href="https://unsplash.com/@jessbaileydesigns?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jess Bailey</a> 
on <a href="https://unsplash.com/photos/colored-pencil-lined-up-on-top-of-white-surface-l3N9Q27zULw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
