---
title: JSON Schema documentation style guide
---

# JSON Schema style guide

Welcome to the JSON Schema! This guide is intended for use by project contributors. It provides guidelines for the text-formatting conventions of our documentation. The purpose of this style guide is to create consistency throughout our documentation, so make sure to read and follow it carefully.

## Our preferred style guide 

We use the [Google developer documentation style guide](https://developers.google.com/style) as our default guide. For a quick summary, see the [Google style guide highlights](https://developers.google.com/style/highlights). This document describes customizations to the Google developers style guide sepcific to the JSON Schema documentation. 

The JSON Schema documentation uses American spelling and our preferred dictionary is the
[American Heritage Dictionary](https://ahdictionary.com/). 

## Write for your audience

The content of our documentation is written mainly for develepers, therefore, information should be clear, concise, and accurate. If you're unsure about a certain detail, please contact the appropriate people to verify it. For more information about our users personas, see [Personas](https://github.com/json-schema-org/community/issues/336#personas). 

## Types of documents and information architecture

To better attend the needs of our readers, we create technical documentation according to the [diataxis framework](https://diataxis.fr/). Therefore, most of our documents can be classified as one of the following:

- Reference
- Tutorial
- How-to guides
- Explanation

Other types of documents we write are:

- Use cases
- Case studies
- Release notes

We organize our documentation into the following content buckets:

- **Introduction**: Several types of documents live in this bucket that introduce the JSON Schema initiative's purpose, how the JSON Schema is used in various industries and applications, and its key features and benefits.
   
- **Basics**: The documents of this content bucket help beginners get started with JSON Schema. 
  
- **Guides**: The guides contained in this bucket help users develop practical skills for validating schemas, building complex ones, and troubleshooting issues. 
  
- **Reference**: These documents explain the type of data, formats, and constraints that keywords expect. It also contains examples of how to use JSON Schema keywords.
  
- **Specification**: This section contains detailed changelogs of keyword modifications, highlights behavioral changes, and provides migration best practices.  
 

## Code blocks

All code should be written and not included in the documentation as images. 

## Titles and headings 

Titles should be short and communicate the main idea of the document. For explanation or reference documents, the title should start with a noun, for example _Conditional subschemas_. When the document is a guide that includes steps to complete a task, such as a tutorial, the title should start with a verb, for example, _Structuring complex schemas_. 

Headings help readers scan the document and identify the parts of a document that are relevant to them. Use headings, and subheadings when needed, that clearly describe what information they contain. 

## Notices and Markdown tags

Use the following tags to give readers relevant information that is not part of the flow of the text. To learn when to use notices, please read the [Notes, cautions, warning, and other notices](https://developers.google.com/style/notices) chapter of the Google developer documentation style guide. 

### Table of contents

To help readers find the information they are looking for within the document, add a table of contents at the beginning. 

`<tableofcontent content= {content} depth= {depth}/>`

### Blockquote

Use the blockquote tag for text that is quoted from another source. 

`<blockquote> message to show </blockquote>`

Example: 

According to the Google developers style guide, notices should be used sparingly:

<blockquote> 
 Don't use too many notices. When you use multiple notices on a page, they begin to lose their visual distinctiveness. See if you can convey the information in a different way. This is especially true if you have two (or more) notices in a row.
 </blockquote>

### Tabs group

Use the tabs groups to make comparisons. 

`[ tabs-start "label"]
[ tab "name"]
message to show
[ tabs-end ]`

Example:

[tabs-start "Language-specific info"]

[tab "Python"]
In Python, "objects" are analogous to the `dict` type.  An
important difference, however, is that while Python dictionaries
may use anything hashable as a key, in JSON all the keys
must be strings.

Try not to be confused by the two uses of the word "object" here:
Python uses the word `object` to mean the generic base class for
everything, whereas in JSON it is used only to mean a mapping from
string keys to values.

[tab "Ruby"]
In Ruby, "objects" are analogous to the `Hash` type. An important
difference, however, is that all keys in JSON must be strings, and therefore
any non-string keys are converted over to their string representation.

Try not to be confused by the two uses of the word "object" here:
Ruby uses the word `Object` to mean the generic base class for
everything, whereas in JSON it is used only to mean a mapping from
string keys to values.

[tab "Objective-C"]
In Objective-C, "objects" are analogous to the `NSDictionary` type.

[tab "Swift"]
In Swift, "objects" are analogous to the `Dictionary` type.
[tabs-end]

### Star tag

Highlight changes introduced by drafts with the start tag.

`<Star label="New in draft"/>`

Example:

<Star label= "New in draft 2019-09"/>

The deprecated keyword is a boolean that indicates that the instance value the keyword applies to should not be used and may be removed in the future.

### Infobox tag

Use the infobox tag for [Notes](https://developers.google.com/style/notices). Notes provide the reader with relevant information that is not necessary, for example, an aside or a tip. 

`<Infobox label="Note"> Message to be shown </Infobox>`

Example:

<Infobox label="Note"> Draft-07 core and validation are backwards-compatible with draft-06. </Infobox>

### Warning tag

Use the warning tag for cautions. A [Caution](https://developers.google.com/style/notices) notice lets the reader know they should proceed carefully. 

`<Warning label="Caution"> Message to be shown </Warning>`

Example:

<Infobox label="Caution"> Using `oneOf` increases processing times because every sub-schema requires verification. Prefer `anyOf` whenever possible.<Infobox>

### Danger tag

Use the danger tag for [Warning](https://developers.google.com/style/notices) notices, which are stronger than Cautions.  

`<Danger label="Warning"> Message to be shown </Danger>`

Example:

<Danger label="Warning"> Modifying a JSON Schema without validating the existing data against it, can cause system or application errors or compromise data integrity. <Infobox>

We created this guide based on templates from [The Good Docs Project](https://www.thegooddocsproject.dev/).