# Docs Contributing Guide

This guide describes the workflow to contribute to the JSON Schema technical documentation. If you would like to contribute to other aspects of the JSON Schema website, like writing blog articles or publishing a case study, please read the website's [Contributing Guide](https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md) for more details. 

## Welcome
Thank you for helping us improve our documentation.

This guide is intended for use by documentation contributors and will help you get started with the basics of our working processes.

## Before you start
To contribute to the JSON Schema documentation you will need to complete the following steps:

1. [Create a GitHub account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github), if you don't have one already.
2. Read our [Code of Conduct](https://json-schema.org/overview/code-of-conduct).
3. [Install the JSON Schema website](https://github.com/json-schema-org/website/blob/main/INSTALLATION.md) on your computer.
4. Read our [style guide](https://json-schema.org/md-style-guide). 

## Community engagement
To stay updated with news about the JSON Schema project and its documentation, engage with our team, ask questions, and discuss ideas, please join our [Slack workspace](https://json-schema.org/slack). We particularly recommend the following channels:

- `#documentation`: Discussions related to the JSON Schema documentation.

- `#website`: Discussions related to our website.

- `#introductions`: Self-introductions and connecting with other members of the community.

- `#community-announcements`: Events and updates related to the JSON Schema project.

- `#anouncements`: Important announcement from the JSON Schema organization.

- `#stack-overflow`: Stack overflow questions tagged with JSON Schema.
  
## Best practices

This is a list of best practices the JSON Schema project strives for and resources we recommend for additional information:

1. File and branching naming conventions: We use dashes instead of spaces, and lowercase letters to name .md files and branches. For example: `implementers-guide.md`, `web-feat-diataxis`.
2. Commit messages: To learn how to write good commit messages, see [Step-by-step guide on how to write good commit messages on Git](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/).

## Contribution workflow 

Here we describe three ways you can help us improve our documentation:


1. Review pull requests
2. Work on an existing issue 
3. Propose changes 

### Review pull requests

Are you new to the JSON Schema community? Help us review pull requests. Reviewing pull requests helps you familiarize yourself with our workflows, learn how others contribute, and understand the project's needs and goals. It's a great way to start contributing and you'll be better prepared to make your own contributions.  

### Work on an existing issue

To work on an existing issue, go to the [JSON Schema docs board](https://github.com/orgs/json-schema-org/projects/16) and check all the open issues.  

If the issue you select has no assignees, you can claim the issue by assigning it to yourself and tag @json-schema-org/docs-team in the comments to let us know you'll be working on it. 

If the issue you select has already an assignee, write a comment expressing your interest in collaborating with them. The JSON Schema respects the order in which people claim issues, therefore, you will have to check if the assignee is accepting collaborations.

After you have been assigned to an issue, fork the [json-schema-org/website](https://github.com/json-schema-org/website) repository and create a new branch from `main` to work on the changes. 

### Propose changes

To propose modifications to our documentation that do not have an issue in the [documentation board](https://github.com/orgs/json-schema-org/projects/16), you can [create a GitHub issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue#creating-an-issue-from-a-repository) and use the *Documentation* template to describe the changes. After that, you can decide whether you want to work on the changes yourself or let someone else claim the issue. If you decide to work on the issue, assign it to yourself and commit the changes to a new branch. 

## Add metadata to newly created markdown files
Metadata helps organize content and maintain consistency across all pages in the documentation. It also provides key information about the file, such as its title, author, and the last updated date.

When contributing to the documentation, it is essential to include metadata in every new markdown file. Metadata is critical for successfully building and rendering the file locally. Without it, the file may fail to render correctly or cause errors in the documentation system.

### Example of metadata in a new markdown file
Every new `.md` file should start with a YAML front matter block. Here's an example:
---
    title: "Your Page Title"
    section: "docs"  # Can be used to categorize the content
    date: "YYYY-MM-DD"  # Optional: Date when the page was created or last updated
    author: "Your Name"  # Optional: Your name if you're the author
    tags: ["tag1", "tag2"]  # Optional: Tags to categorize the page
---
To add the front matter metadata, copy and paste the example above at the top of your .md file and replace the details with the information of your document.

## Create a Pull Request

To submit your work to review by the community, open a draft pull request to the `main` upstream branch, and add the issue your pull request solves. Add @json-schema-org/docs-team as a reviewer of your pull request, and let us know in the #documentation Slack channel your pull request is ready for review. 

The reviewers might ask for additional changes. When they approve your pull request, you can merge your changes into `main` and your contribution to the project will be complete!

<br>

We created this guide based on templates from [The Good Docs Project](https://www.thegooddocsproject.dev/).
