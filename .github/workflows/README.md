## JSON Schema Website CI/CD Workflow Guidelines

### Overview

This document outlines the guidelines for contributing to and maintaining GitHub Actions workflows in the JSON Schema Website project. Adherence to these guidelines ensures consistency, efficiency, and ease of maintenance across our CI/CD processes.

### General Principles

- **Change Management**: Modifications to files in this directory are closely monitored. Changes will trigger unauthorized file changes workflow during pull request checks. Only make changes when explicitly advised by a project contributor or maintainer.
- **Documentation and Naming**: Use descriptive, self-explanatory names for workflows, jobs, and steps. Include clear comments within workflow files to explain complex configurations.

### YAML Workflow File Structure

Our YAML files are organized based on specific roles and event triggers. When creating or modifying workflows, ensure that:
- The file roles described below are strictly maintained.
- Job sequences within workflows are preserved using [GitHub Action job dependencies](https://docs.github.com/en/actions/using-workflows/using-jobs-in-a-workflow#defining-prerequisite-jobs).

### File Categorization

Organize workflow files based on their primary event trigger:

- **Issue Workflows**: 
  - [Issue Workflow](./issue.yml): Handles issue-related events such as opening, closing, or labeling issues.

- **Pull Request Workflows**:
  - [CI Workflow](./ci.yml): Runs for all contributors on pull requests, performing code-quality checks, unauthorized file changes detection, and build processes.
  - [PR Interaction Workflow](./pull-request-target.yml): Contains workflows specifically for first-time contributors, such as welcome messages.

### Exceptions to File Categorization

Separate files may be created for workflows that:

- Require unique `cron` schedules for periodic execution.
  Examples:
  - [Link Checker](./link-checker.yml): Periodically checks for broken links in the repository.
  - [Mark stale issues and pull requests](./stale-issues-prs.yml): Automatically labels and closes stale issues and PRs.
  - [Dependabot](../dependabot.yml): Keeps dependencies up-to-date.

- Need specific `paths` triggers, activating only when files in particular directories are modified.
  Example:
  - [New Implementation Commenter](./new-implementation.yml): Adds comments when new implementation files are added.

- Only work correctly if they have a dedicated file.
  Examples:
  - [Preview Deployment](./preview-deployment.yml): Deploys preview environments for pull requests.
  - [Production Deployment](./production-deployment.yml): Handles production deployments.
  - [CodeQL Code Scanning](./codeql.yml): Performs code security analysis.
  - [Check PR Dependencies](./pr-dependencies.yml): Enforces dependencies between PRs based on opening comments.

### Workflow Maintenance

To ensure the efficiency and reliability of our workflows, follow these maintenance guidelines:

- **Regular Review**: Review and update workflows at least quarterly to incorporate new features or best practices.
- **Dependency Updates**: Keep workflow dependencies up-to-date by reviewing and applying Dependabot suggestions promptly.
- **Documentation**: Update workflow documentation immediately after any changes or modifications to keep it current.
- **Performance Monitoring**: Regularly check workflow run times and optimize where possible to reduce GitHub Actions usage.
- **Security Checks**: Ensure that workflows using secrets or accessing sensitive data are properly secured and follow least privilege principles.

These guidelines aim to maintain the integrity and efficiency of our CI/CD processes. Always consult with the team before making significant changes to any workflow.