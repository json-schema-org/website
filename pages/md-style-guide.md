---
title: JSON Schema documentation style guide
---

Welcome to JSON Schema! This guide is intended for project contributors and provides guidelines for the text-formatting conventions of our documentation. The purpose of this style guide is to create consistency throughout our documentation, so make sure to read and follow it carefully. To learn about how to contribute to our documentation, see the [Docs contributing guide](https://github.com/json-schema-org/website/blob/main/CONTRIBUTING-docs.md)

## Our preferred style guide 

We use the [Google developer documentation style guide](https://developers.google.com/style) as our default guide. For a quick summary, see the [Google style guide highlights](https://developers.google.com/style/highlights). This document describes customizations to the Google developers style guide specific to the JSON Schema documentation. 

The JSON Schema documentation uses American spelling and our preferred dictionary is the
[American Heritage Dictionary](https://ahdictionary.com/). 

## Write for your audience

The content of our documentation is written mainly for develepers, therefore, information should be clear, concise, and accurate. If you're unsure about a certain detail, please contact the appropriate people to verify it. For more information about our users personas, see [Personas](https://github.com/json-schema-org/community/issues/336#personas). 

## Types of documents and information architecture

To better attend to the needs of our readers, we create technical documentation according to the [diataxis framework](https://diataxis.fr/). Therefore, most of our documents can be classified as one of the following:

- Reference
- Tutorial
- How-to guides
- Explanation

Other types of documents we write are the following:

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

To ensure that code samples are easy to search, copy and paste, and adapt, include all code as text, not as images, in the documentation.  

## Titles and headings 

Titles should be short and communicate the main idea of the document. For explanation or reference documents, the title should start with a noun phrase, for example, _Conditional subschemas_. When the document is a guide that includes steps to complete a task, such as a tutorial, the title should start with a bare infinitive, for example, _Structure complex schemas_. To learn more about headings and titles, see [_Headings and titles_](https://developers.google.com/style/text-formatting) of the Google developer documentation style guide. 

Headings help readers scan the document and identify the parts that are relevant to them. Use headings, and subheadings when needed, that clearly describe the information they contain. 

## Notices and Markdown tags

Use the following tags to give readers relevant information that is not part of the flow of the text. To learn when to use notices, please read the [Notes, cautions, warning, and other notices](https://developers.google.com/style/notices) chapter of the Google developer documentation style guide. 

### Table of contents

To help readers find the information they are looking for within the document, add a table of contents at the beginning. 

```markdown
<tableofcontent content= {content} depth= {depth}/>
```

### Blockquote

Use the `Blockquote` tag for text that is quoted from another source. 

```markdown
<blockquote> Message to show </blockquote>
```

Example: 

According to the Google developers style guide, notices should be used sparingly:

<blockquote> 
 Don't use too many notices. When you use multiple notices on a page, they begin to lose their visual distinctiveness. See if you can convey the information in a different way. This is especially true if you have two (or more) notices in a row.
 </blockquote>

### Tabs group

Use the tabs groups to make comparisons. 

```markdown
[ tabs-start "label"]
[ tab "name"]
message to show
[ tabs-end ]
```

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

Highlight changes introduced by drafts with the `Star` tag.

```markdown
<Star label="New in draft"/>
```

Example:

<Star label= "New in draft 2019-09"/>

The deprecated keyword is a boolean that indicates that the instance value the keyword applies to should not be used and may be removed in the future.

### Infobox tag

Use the `Infobox` tag for [Notes](https://developers.google.com/style/notices). Notes provide the reader with relevant information that is not necessary, for example, an aside or a tip. 

```markdown
<Infobox label="Note"> Message to show </Infobox>
```

Example:

<Infobox label="Note"> Draft-07 core and validation are backwards-compatible with draft-06. </Infobox>

### Warning tag

Use the `Warning` tag for cautions. A [Caution](https://developers.google.com/style/notices) notice lets the reader know they should proceed carefully. 

```markdown
<Warning label="Caution"> Message to show </Warning>
```

Example:

<Warning label="Caution"> Using `oneOf` increases processing times because every sub-schema requires verification. Prefer `anyOf` whenever possible.</Warning>

### Danger tag

Use the `Danger` tag for [Warning](https://developers.google.com/style/notices) notices, which are stronger than Cautions.  

```markdown
<Danger label="Warning"> Message to show </Danger>
```

Example:

<Danger label="Warning"> Modifying a JSON Schema without validating the existing data against it, can cause system or application errors or compromise data integrity. </Danger>

## Markdown tags for blog articles

Use the following tags only when writing blog articles.  

### StarInline

You can use the `StarInLine` tag to highlight important information within your text, for example, when providing a best practice. 

```markdown
<StarInline label="Best Practice"/> Message to show
```

Example:

<StarInline label="Best Practice"/> Always include the `$schema` keyword at the root of your JSON Schema to declare which version you're using.

### Summary and details

To provide readers with additional information without cluttering the main content, use the `summary` and `details` tags. The text within the `summary` tag is displayed initialy. The content within `details` is revealed after readers click on it.

```markdown
<summary> 
Click for more details
</summary>
<details>
Additional information to show
</details>
```

Example:

<summary> 
View the details of the employee information schema here
</summary>
<details> 
<pre><code>
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "minimum": 18 },
    "email": { 
      "type": "string",
      "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    },
    "jobTitle": { "type": "string" },
    "department": { "type": "string" },
    "hireDate": { "type": "string", "format": "date" }
  },
  "required": ["name", "email", "jobTitle", "department", "hireDate"],
  "additionalProperties": false
}
</code></pre>
</details>

### Bigquote

Use `Bigquote` to emphasize key quotations or statements, for example, a user testimonial. 

```markdown
<Bigquote> This is an important quote </Bigquote>
```

Example:

<Bigquote> _Choosing JSON Schema to allow JSON schema validation was a natural and obvious choice that our team made. It has been a fundamental part of our application since we moved from having a static site to a dynamic application about 3 years ago._ 
<br><br> - Rachael Sewell & Robert Sese, Docs Engineers at GitHub </Bigquote>

### Regularquote

Use the `Regularquote` tag for shorter quotes from documentation or other sources and for highlighting key terms or concepts.

```markdown
<Regularquote>This is a short quote</Regularquote>
```

Example: 

When discussing JSON Schema validation, it's important to understand the concept of keywords.

<Regularquote>
Keywords are the basic building blocks of JSON Schema. They are used to impose requirements on parts of the instance, or to provide annotation information.
</Regularquote>


### Tip

Use the `Tip` tag to give readers advice or additional context that enhances understanding. 

```markdown
<Tip label="Tip">This is a tip or additional context.</Tip>
```

Example: 

<Tip label="Tip">To learn more about keyword dependencies, read the _Static Analysis of JSON Schema_ article by Greg Dennis.</Tip>

<br>

We created this guide based on templates from [The Good Docs Project](https://www.thegooddocsproject.dev/).
