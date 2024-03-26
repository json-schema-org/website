---
title: "Get started with JSON Schema in Node.js"
date: "2022-05-16"
tags:
  - Node.js
  - Ajv
  - validation
type: Engineering
cover: /img/posts/2022/get-started-with-json-schema-in-node-js/cover.webp
authors:
  - name: Simon Plenderleith
    photo: /img/avatars/simonplenderleith.webp
    twitter: simonplend
    byline: Independent Node.js consultant and educator
excerpt: "Learn how to use JSON Schema for validation in your Node.js applications."
canonicalLink: https://simonplend.com/get-started-with-validation-in-node-js/
---

> Originally published at [simonplend.com](https://simonplend.com/get-started-with-validation-in-node-js/).

The first step in putting together request validation for your Node.js application is finding a way to create flexible validation rules. When you try to pick a validation library to use, it's often more difficult than you expect. They're all different from each other, and it's not clear what benefits one has over another.

Perhaps you've tried to build your own custom validation before, but it starts to feel messy and difficult to maintain. You want to put some reliable validation in place and move on to building exciting new features in your application. Why is adding in validation *such* a headache?!

In this article, we're going to learn how the JSON Schema specification can help us create flexible validation rules. We'll write a schema which describes the format we expect data to be in, then we'll write some JavaScript that uses the Ajv validator library to validate our data against it.

Let's get started!

## A powerful validation duo

The [JSON Schema specification](/specification) defines a JSON-based format for describing the structure of JSON data. This includes validation keywords, such as `type`, `required` and `properties`. These keywords allow us to create a definition of the format we expect data to be in. This is a "schema". It can be as simple as:

```json
// props { "isSchema": true }
{ "type": "string" }
```

To validate data against a schema, we need to use a validator library which implements the JSON Schema specification. The [Ajv (Another JSON Schema Validator)](https://ajv.js.org/) library is the most popular JSON Schema validator for client and server side JavaScript, downloaded over [50 million times every week](https://www.npmtrends.com/ajv) from npm.

Let's get hands-on and see what validating data with JSON Schema and Ajv looks like.

> For a more detailed introduction to JSON Schema, check out the blog post [JSON Schema in 5 minutes](/blog/posts/json-schema-in-5-minutes).

## Creating a schema and validating data

First, we need to run the command `npm install ajv` to install the Ajv library.

Then we can jump straight into defining a JSON schema. It describes the structure and types we expect:

```javascript
const iceCreamSchema = {
  type: "object",
  properties: {
    flavour: { type: "string" },
    price: { type: "number" },
    stock: { type: "number" },
  },
  required: ["flavour", "price", "stock"],
};
```

Now we'll define the data which we want to validate:

```javascript
const iceCreamData = {
  flavour: "Pistachio",
  price: 1.99,
  stock: null,
};
```

Then we'll import the Ajv library and create a new Ajv instance:

```javascript
import Ajv from "ajv";

const ajv = new Ajv();
```

And use it to validate the data against our schema:

```javascript
const isDataValid = ajv.validate(iceCreamSchema, iceCreamData);
```

Lastly, we'll add some code to handle the validation results:

```javascript
if (isDataValid) {
  console.log("The ice cream data is valid! 🍨");
} else {
  console.error("The ice cream data is invalid:", ajv.errors);
}
```

When we put this code together and run it, we get the following output:

```
The ice cream data is invalid: [
  {
    instancePath: '/stock',
    schemaPath: '#/properties/stock/type',
    keyword: 'type',
    params: { type: 'number' },
    message: 'must be number'
  }
]
```

Pretty slick, huh?

Alright, we've created a schema which describes the structure and types we expect, validated data against it, and handled any validation errors. So far so good!

> A note from the editor: In the latest major release of AJV, a "strict mode" was introduced, enabled by default, which sometimes throws an exception when a valid JSON Schema is used. If you run into problems with strict mode related errors, check out [the documentation](https://ajv.js.org/strict-mode.html) for details on how to disable it, or even specific rules. We feel this may be better as linter functionality, however it does help prevent accidental errors in schema authorship. - Ben Hutton

As one final step, we'll look at how we can potentially improve the way we create our JSON schema.

## Schema generation

JSON schemas are an expressive way of defining validation rules, but writing schemas "by hand" can sometimes get a bit much. There's a handy library called [fluent-json-schema](https://npm.im/fluent-json-schema) which can help us generate our JSON schemas. Let's give it a try.

Note that while using a tool to define validaiton rules to be converted into a JSON Schema gives you control, other methods of generating JSON Schema, for example from your instance data, often leaves you with a partially complete or sometimes incorrect JSON Schema. Other approaches might be better called "scaffolding" rather than "generating", as you'll have the basics, but still have work to do before it's complete and useable.

First we need to install the library by running the command `npm install fluent-json-schema`. Then we can import it and use it to generate our schema:

```
import S from "fluent-json-schema";

const iceCreamSchema = S.object()
  .prop("flavour", S.string().required())
  .prop("price", S.number().required())
  .prop("stock", S.number().required())
  // This method call returns the generated schema as an object.
  .valueOf();
```

If we `console.log` the `iceCreamSchema` object, we can see the JSON schema we've generated:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "flavour": { "type": "string" },
    "price": { "type": "number" },
    "stock": { "type": "number" }
  },
  "required": ["flavour", "price", "stock"]
}
```

You'll notice this generated schema is almost identical to the `iceCreamSchema` we previously wrote "by hand". We can replace our handcrafted schema with this generated schema and the validation will behave in the same way as it did before.

If we're writing our applications in TypeScript, the [TypeBox](https://www.npmjs.com/package/@sinclair/typebox) library is a great alternative to `fluent-json-schema`.

Schema generation is down to your personal preference: some folks like to write raw JSON schemas "by hand", whereas others prefer to use a library which helps generate them. Try out both and pick whichever approach works best for you.

## Try it yourself

- **[Browse the code on GitHub](https://github.com/simonplend/creating-flexible-validation-rules)**
- **[Run the code in your browser with StackBlitz](https://stackblitz.com/github/simonplend/creating-flexible-validation-rules)** (works in Chrome, Edge or Brave browsers)
- **[Take on the validation coding challenge](https://github.com/simonplend/creating-flexible-validation-rules#ready-for-a-challenge)**! 🏆

## Wrapping up

We can use Ajv as a standalone library or we can integrate it with the framework we're using to build our Node.js application. Some Node.js frameworks even provide JSON Schema based validation with Ajv [built in](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).

When we combine JSON Schema and Ajv, we have a flexible solution for implementing validation in our Node.js applications:

- **Learn once, use everywhere.** The JSON Schema specification is cross-platform, and there are [validation libraries](/implementations) available for every popular programming language. We're not locked into a library, framework or language. Once we've learnt the fundamentals of JSON Schema, we can use it everywhere.
- **Portability.** Because JSON Schema is cross-platform, even if we decide to rewrite our applications in another framework or language, we can take our schemas with us.
- **Speed**. Under the hood, Ajv compiles our JSON schemas into JavaScript code. This improves the performance of repeated validation of data against a schema. For example, schemas can be compiled by Ajv when our Node.js application starts. HTTP request data which the application receives can then be validated against the pre-compiled schemas.
- **Active and supportive community**. There's an active community of folks on Slack who are happy to help out (the [JSON Schema website](https://json-schema.org/) has a link you can use to join).

### Further reading

If you'd like to learn more about JSON Schema, you might find these links helpful:

- **[How to handle request validation in your Express API](https://simonplend.com/how-to-handle-request-validation-in-your-express-api/)**. If you're using the Express Node.js framework, I wrote this guide to help you integrate the Ajv library into your applications.
- **[Fastify framework validation documentation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)**. The Fastify Node.js framework integrates the Ajv library, making it straightforward to add validation with JSON Schema.
- **[Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)**. A free online book which will teach you the fundamentals of JSON Schema. Also available in PDF format for offline reading.
- **[JSON Schema Cheat Sheet](https://simonplend.com/wp-content/uploads/2020/12/JSON-Schema-Cheat-Sheet-v1.1.pdf)**. I created this cheat sheet PDF as a handy reference for JSON Schema validation keywords. Use it to give you a helping hand any time you're writing schemas.

> Photo by [Manik Rathee](https://unsplash.com/@manikrathee) on [Unsplash](https://unsplash.com/photos/a8YV2C3yBMk).
