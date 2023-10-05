[![JSON Schema logo - Build more, break less, empower others.](https://raw.githubusercontent.com/json-schema-org/.github/main/assets/json-schema-banner.png)](https://json-schema.org)

<br/>
<p>
    <a href="https://github.com/json-schema-org/website/graphs/contributors" alt="JSON Schema GitHub website contributors">
      <img src="https://img.shields.io/github/contributors/json-schema-org/website?color=orange" />
    </a>
    <a href="https://github.com/json-schema-org/website/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22" alt="Good First JSON Schema issue">
      <img src="https://img.shields.io/github/issues/json-schema-org/website/good%20first%20issue.svg?color=%23DDDD00" />
    </a>
    <a href="https://json-schema.slack.com/" alt="JSON Schema Slack">
      <img src="https://img.shields.io/badge/Slack-json--schema-@website.svg?logo=slack&color=yellow" />
    </a>
    <a href="https://github.com/json-schema-org/website" alt="JSON Schema License">
      <img src="https://img.shields.io/github/license/json-schema-org/website.svg" />
    </a>
</p>


# 👋 Welcome to the JSON Schema website
This repository contains the sources of JSON Schema website:

* It's powered by Next.js,
* It uses Tailwind CSS framework,
* It's build and deployed with Netlify.

## Run locally

#### Requirements
Use the following tools to set up the project:

Node.js v16.0.0+
npm v7.10.0+

#### Cloning the repository
This project uses git submodules, so you will need to run the following commands to fully clone the repo.
```
git submodule init
git submodule update
```

#### Install dependencies

Install dependencies
```
yarn
```

#### Run the development server

Run the development server on http://localhost:3000
```
yarn dev
```

#### Build static files 

Build static files on /out folder
```
yarn build
```

## Project structure

This repository has the following structure:

<!-- If you make any changes in the project structure, remember to update it. -->

```text
  ├── .github                     # Definitions of GitHub workflows, pull request and issue templates
  ├── components                  # Various generic components such as "Button", "Figure", etc.
  ├── data                        # JSON Schema Implementations.
  ├── styles                      # Various CSS files
  ├── lib                         # Various JS code for preparing static data to render in pages
  ├── pages                       # Website's pages source. It includes raw markdown files and React page templates.
  │    ├── overview               # JSON Schema initiative docs
  │    ├── blog                   # Blog posts
  │    ├── learn                  # JSON Schema docs
  │    └── implementations        # Various pages to describe tools
  ├── public                      # Data for site metadata and static blog such as images
  ├── next.config.js              # Next.js configuration file

```

## Contribute

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<!-- Copy-paste in your Readme.md file -->

<a href = "https://github.com/json-schema-org/website/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=json-schema-org/website"/>
</a>

<sub>Made with [contributors-img](https://contrib.rocks).</sub>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/json-schema/contribute)]

## Connect with JSON Schema Community

<p align="left">
    <a href="https://json-schema.slack.com/" target="blank">
      <img align="center" src="https://img.icons8.com/color/48/null/slack-new.png" alt="JSON Schema Slack" height="30" width="40" />
    </a>
    <a href="https://twitter.com/jsonschema" target="blank">
      <img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="JSON Schema Twitter" height="30" width="40" />
    </a>
    <a href="https://www.linkedin.com/company/jsonschema" target="blank">
      <img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="JSON Schema LinkedIn" height="30" width="40" />
    </a>
    <a href="https://www.youtube.com/@JSONSchemaOrgOfficial" target="blank">
      <img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg" alt="JSON Schema YouTube" height="30" width="40" />
    </a>
</p>

## License
The contents of this repository are [licensed under](./LICENSE) either the BSD 3-clause license *or* the Academic Free License v3.0.

