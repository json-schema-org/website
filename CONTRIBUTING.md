# Contributing to JSON Schema Website

First off, thanks for taking the time to contribute! 🫶

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it much easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

If you don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation:
- Star the project on Github
- Post on X or Linkedin about JSON Schema `#jsonschema

## Table of Contents

- 🌱 [Code of Conduct](#-code-of-conduct)
- 💬 [I Have a Question](#-i-have-a-question)
- 🍻 [I Want To Contribute](#-i-want-to-contribute)
  - 🐞 [Reporting Bugs](#-reporting-bugs)
  - 💡 [Issues and feature requests](#-issues-and-feature-requests)
  - 🛠️ [Add a new implementation](#%EF%B8%8F-add-a-new-implementation)
  - ✍️ [Publish a blog post](#%EF%B8%8F-publish-a-blog-post)
  - 📈 [Publish a case study](#-publish-a-case-study)
  - 📋 [Improving the Documentation](#-improving-the-documentation)
  - 🌐 [Improving the website](#-improving-the-website)
  - 🎨 [Improving the Design](#-improving-the-design)
  - 🚀 [Contributing to CI/CD Pipeline](#-contributing-to-cicd-pipeline)
  - 🧪 [Contributing to Testing](#-contributing-to-testing)
- ⌨️ [Pull requests](#%EF%B8%8F-pull-requests)
- 🏛 [License](#-license)


## 🌱 Code of Conduct

Before making your first contribution, please ensure you are familiar with our [Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md).

## 💬 I have a question

If you need clarification after reading this document, we encourage you to join the `#contribute` channel in our [Slack workspace](https://json-schema.org/slack).

## 🍻 I want to contribute

### 🐞 Reporting bugs

Please use our issues templates that provide hints on what information we need to help you.

### 💡 Issues and feature requests

[Open an issue](https://github.com/json-schema-org/website/issues/new) **only** to report a bug or a feature. Don't open issues for questions or support, instead join our [Slack workspace](https://www.json-schema.org/slack) and ask there. Remember to follow our [Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md) while interacting with community members! It's more likely you'll get help, and much faster!

### 🛠️ Add a new Implementation

To add a new implementation, please open a PR, adding the details of your implementation to `\pages\implementations\main.md` file. We also invite you to join the discussion in `#implementers` channel in our  [Slack workspace](https://json-schema.org/slack).

### ✍️ Publish a blog post

Before publishing your first blog post, please ensure you are familiar with our [blog guidelines](https://github.com/json-schema-org/community/blob/main/docs/blog-guidelines.md).

To publish a blog post, please open a PR, adding your post in Markdown format into the `\pages\blog\posts` folder using any existing posts as reference e.g.: [json-schema-in-5-minutes.md](https://github.com/json-schema-org/website/blob/main/pages/blog/posts/json-schema-in-5-minutes.md?plain=1). Remember to add all the images into the `\public\img` folder.

### 📈 Publish a Case Study

To publish a case study, we encourage you to join `#adopters` channel in our [Slack workspace](https://json-schema.org/slack) and introduce your use case.

### 📋 Improving the Documentation

Want to help us improve the JSON Schema documentation? Check out our [docs Contributing guide](https://github.com/json-schema-org/website/blob/main/CONTRIBUTING-docs.md) for docs and Style guide. These documents will give you the basics of our processes to get you started and text-formatting guidelines to create consistent documentation for JSON Schema. 

### 🌐 Improving the Website

If you would like to join the efforts to improve the JSON Schema Website, we encourage you to check our [website contribution board](https://github.com/orgs/json-schema-org/projects/11) to get a sense of the pending issues and bugs and who is doing what. We also invite you to join the discussion in `#website` channel in our  [Slack workspace](https://json-schema.org/slack).

### 🎨 Improving the Design

If you would like to contribute with designs, we encourage you to join `#design` channel in our [Slack workspace](https://json-schema.org/slack) and read the [contributing guidelines](https://github.com/json-schema-org/brand/blob/master/CONTRIBUTING.md) in the [Brand](https://github.com/json-schema-org/brand) repository.

### 🚀 Contributing to CI/CD Pipeline

If you would like to contribute to our CI/CD pipeline, we encourage you to review our current setup in the [workflows README](https://github.com/json-schema-org/website/blob/main/.github/workflows/README.md).

### 🧪 Contributing to Testing

We value contributions to our testing efforts. Here are ways you can help improve our test coverage and quality:

1. **Writing Tests**: If you're adding new features or fixing bugs, please include relevant tests. We use Cypress for both end-to-end (E2E) and component testing.

   - For new components, add component tests in the `cypress/components` directory.
   - For new features or bug fixes affecting user interactions, add E2E tests in the `cypress/e2e` directory.

2. **Improving Existing Tests**: Review and enhance our existing test suite. Look for areas where test coverage could be improved or where tests could be made more robust.

3. **Test Documentation**: Help improve our testing documentation, making it easier for new contributors to understand and write tests.

4. **Running Tests**: Before submitting a pull request, ensure all tests pass by running:
   ```
   yarn cypress:run:all
   ```

5. **Reporting Test Issues**: If you find inconsistencies or problems with our tests, please open an issue describing the problem and how to reproduce it.

For more details on our testing setup and how to run tests, please refer to the Testing section in our [INSTALLATION.md](./INSTALLATION.md#testing) file.


### ⌨️ Pull requests

We welcome pull requests for editorial suggestions and resolving open issues.

If your pull request addresses a specific issue, please reference this issue in your pull request description using a [supported descriptor](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword). This helps automatically link and close the issue when the pull request is merged.

We strongly encourage linking every pull request to an existing issue. If no corresponding issue exists, please create one first. This allows the community to discuss the required changes. If you are addressing an existing issue, ensure the scope is clear and consider the following:

- If the issue is several years old, verify its relevance by asking in the comments.
- Ensure the discussion within the issue has led to a clear, actionable decision.

Generally, pull requests should be made to the `main` branch.

Most PRs, will be left open for a minimum of 14 days.  Minor fixes may be merged more quickly once approved by a project member.

### Markdown Style Guide

Contributors to our Docs or our Blog can have a look at the [custom markdown style guide](https://json-schema.org/md-style-guide) with a list of useful markdown tags providing tools to easily create cool content that provides a better user experience.

## Triage

Please check the [triage process](https://github.com/json-schema-org/.github/blob/main/TRIAGE.md) to learn how we review and label incoming issues . 

## Feedback

Feedback on this process can be made informally through our [Slack server](https://json-schema.org/slack) and formally using our [Community Discussions](https://github.com/json-schema-org/community/discussions).

## References 

This document was adapted from [https://contributing.md](https://contributing.md/)!






