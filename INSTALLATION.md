# JSON Schema Website: Installation and Development Guide

This guide provides step-by-step instructions for installing the JSON Schema Website on your local machine. Follow each section in order without skipping any steps.

## Table of Contents

1. [Setting Up the Project](#setting-up-project)
   - [Requirements](#requirements)
   - [Cloning the Repository](#cloning-the-repository)
   - [Setting Up Environment Variables](#setting-up-environment-variables)
2. [Corepack Configuration](#corepack-configuration)
   - [What is Corepack?](#what-is-corepack)
   - [Installing Corepack](#installing-corepack)
   - [Using Corepack with This Project](#using-corepack-with-this-project)
   - [Updating Yarn Version](#updating-yarn-version)
   - [Troubleshooting](#troubleshooting)
3. [Post-Configuration Steps](#post-configuration-steps)
   - [Installing Dependencies](#installing-dependencies)
   - [Running the Development Server](#running-the-development-server)
   - [Building Static Files](#building-static-files)
4. [Testing](#testing)
   - [Running Tests](#running-tests)
   - [Test Coverage](#test-coverage)
   - [Writing Tests](#writing-tests)
5. [Code Quality](#code-quality)
   - [Formatting](#formatting)
   - [Linting](#linting)
   - [Husky for Git Hooks](#husky-for-git-hooks)
6. [Run locally using Docker](#docker-deployment)
   - [Prerequisites](#prerequisites)
   - [Steps](#steps)


## Setting up Project

## Configuration

### Requirements
Use the following tools to set up the project:

Node.js v20.9.0+

### Cloning the repository
This project uses git submodules, so you will need to run the following commands to fully clone the repo.
```
git submodule init
git submodule update
```

### Setting Up Environment Variables

This step is optional. Environment variables are not required to run the website on your local development server.

1. Create a new `.env` file by copying the contents of the `.env.example` into `.env` file. Use this command:
```
cp .env.example .env
```
2. Open .env and fill in your actual values for each variable.

3. Save the file.

4. Ensure .env is in your .gitignore.

### Corepack Configuration

This project uses modern Yarn (yarn@4.4.0), which requires Corepack for proper setup and management of package managers. Corepack is a tool that comes with Node.js 14.19.0 and later, allowing for consistent package manager versions across your project.

#### What is Corepack?

Corepack is an experimental tool to help with managing versions of your package managers. It exposes binary proxies for each supported package manager that, when called, will identify whatever package manager is configured for the current project, download it if needed, and finally run it.


#### Installing Corepack

If you're using Node.js version 14.19.0 or later, Corepack is included but might need to be enabled. For Node.js 16.10 or later, Corepack is available by default but might still need to be enabled.

To enable Corepack, run:

```bash
corepack enable
```

If you're using an older version of Node.js or if the above command doesn't work, you can install Corepack globally using npm:

```bash
npm install -g corepack
```

#### Using Corepack with This Project

Once Corepack is enabled or installed, it will automatically use the correct version of Yarn specified in the project's `package.json` file. You don't need to manually install Yarn.

To use Yarn commands, simply run them as usual:

```bash
yarn install
yarn run build
yarn run dev
```

Corepack will ensure that the correct version of Yarn is used for these commands.

#### Updating Yarn Version

If you need to update the Yarn version used in the project:

1. Update the `packageManager` field in `package.json`:
   ```json
   {
     "packageManager": "yarn@x.y.z"
   }
   ```
2. Run `yarn set version x.y.z` to update the local Yarn version.

#### Troubleshooting

If you encounter any issues with Yarn commands, try running:

```bash
corepack prepare
```

This will ensure that the correct version of Yarn is downloaded and prepared for use.

For more information about Corepack, refer to the [official Node.js documentation](https://nodejs.org/api/corepack.html).

## Post-Configuration Steps

### Installing Dependencies

Install dependencies
```
yarn
```

### Running the Development Server

Run the development server on http://localhost:3000
```
yarn dev
```

### Building Static Files

Build static files on `/out` folder
```
yarn build
```
## Testing

We use Cypress for both end-to-end (E2E) testing and component testing. This document will guide you through the process of running tests and generating coverage reports.

### Running Tests


#### Opening Cypress Test Runner

To open the Cypress Test Runner, which allows you to run tests interactively, use:

```
yarn cypress:open
```

This command will open a GUI where you can select and run specific tests.

#### Running All Tests Headlessly

To run all tests in headless mode (useful for CI/CD pipelines), use:

```
yarn cypress:run:all
```

### Test Coverage

We use NYC (Istanbul) for code coverage reporting. Here's how to generate coverage reports:

#### E2E Test Coverage

To run E2E tests with coverage:

```
yarn test:coverage:e2e
```

#### Component Test Coverage

To run component tests with coverage:

```
yarn test:coverage:component
```

#### Full Test Coverage

To run all tests and generate a combined coverage report:

```
yarn test:coverage:all
```

This command will:
1. Run E2E tests with coverage
2. Run component tests with coverage
3. Merge the coverage results
4. Generate an HTML and text report

You can find the HTML report in the `coverage` directory after running this command.

### Writing Tests

When contributing new features or fixing bugs, please consider adding or updating tests:

- For new components, add component tests in the relevant `cypress/components` directory.
- For new features or bug fixes affecting user interactions, add E2E tests in the `cypress/e2e` directory.

## Code Quality

We use ESLint for linting and Prettier for code formatting. This section will guide you through the process of checking and fixing code quality issues.

### Formatting

you can check code formatting using the following command:

```
yarn run format:check
```

you can format the code using the following command:

```
yarn run format:fix
```

### Linting

you can check linting issues using the following command:

```
yarn run lint
```

you can fix linting issues using the following command:

```
yarn run lint:fix
```

### Husky for git hooks

This project uses Husky to run checks for the formatting, linting, typecheck and build commands before committing the code.

#### pre-commit hook
pre-commit hook will run the following commands:

```
yarn run lint
yarn run typecheck
yarn run build
```

If you don't want these pre-commit checks running on each commit, you can manually opt out of it using the `--no-verify` flag with your commit message as shown:-
```
git commit -m "commit message" --no-verify
```

### Run locally using Docker

If you are a Docker lover, you have the option to use it following these instructions.

#### Prerequisites:

- [Install Docker](https://docs.docker.com/get-docker/)

After cloning repository to your local, perform the following steps from the root of the repository.

#### Steps:
1. Build the Docker image:
    ```bash
      make install
    ```

2. Start the container:
    ```bash
      make run
    ```

Now you're running JSON Schema website in a development mode. Container is mapped with your local copy of the website. Whenever you make changes to the code, the website will refresh and changes visible in `http://localhost:3000`.
