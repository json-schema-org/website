---
title: Creating your first schema
section: docs
---

JSON Schema is a vocabulary that you can use to annotate and validate JSON documents. This tutorial guides you through the process of creating a JSON Schema document, including:

* [Creating a schema definition](#create)
* [Defining properties](#define)
* [Nesting data structures](#nest-data)
* [Adding outside references](#external)
* [Validating JSON data against the schema](#validate)

After you create the JSON Schema document, you can validate the example data against your schema using a validator in a language of your choice. See [Implementations](https://json-schema.org/implementations) for a current list of supported validators.

For more information about the value JSON Schema can provide, see the full [JSON Schema Specification](https://json-schema.org/specification.html).

<span id="overview"></span>

## Overview

The example we use in this guide is a product catalog that stores its data using JSON objects, like the following:

```json
{
  "productId": 1,
  "productName": "A green door",
  "price": 12.50,
  "tags": [ "home", "green" ]
}
```

Each product in the catalog has:

* `productId`: an identifier for the product
* `productName`: the product name
* `price`: the cost to the consumer
* `tags`: an optional array of identifying tags

The JSON object is human-readable, but it doesn’t include any context or metadata. There’s no way to tell from looking at the object what the keys mean or what the possible inputs are. JSON Schema is a standard for providing answers to these questions. In this guide, you will create a JSON Schema document that describes the structure, constraints, and data types for a set of JSON data.

<span id="intro"></span>

## Introduction to JSON Schema[#intro]

The _instance_ is the JSON document that is being validated or described, and the _schema_ is the document that contains the description.

The most basic schema is a blank JSON object, which constrains nothing, allows anything, and describes nothing:

```json
{}
```

By adding validation keywords to the schema, you can apply constraints to an instance. For example, you can use the `type` keyword to constrain an instance to an object, array, string, number, boolean, or null:

```json
{ "type": "string" }
```

JSON Schema is hypermedia-ready and ideal for annotating your existing JSON-based HTTP API. JSON Schema documents are identified by URIs, which can be used in HTTP link headers and within JSON Schema documents to allow for recursive definitions.

<span id="create"></span>

## Create a schema definition[#create]

To create a basic schema definition, define the following keywords:

* `$schema`: specifies which draft of the JSON Schema standard the schema adheres to.
* `$id`: sets a URI for the schema. You can use this unique URI to refer to elements of the schema from inside the same document or from external JSON documents.
* `title` and `description`: state the intent of the schema. These keywords don’t add any constraints to the data being validated.
* `type`: defines the first constraint on the JSON data. In the product catalog example below, this keyword specifies that the data must be a JSON object.

For example:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product in the catalog",
  "type": "object"
}
```

The keywords are defined using JSON keys. Typically, the data being validated is contained in a JSON data document, but JSON Schema can also validate JSON data contained in other content types, such as text or XML files.

In JSON Schema terminology, `$schema` and `$id` are [schema keywords](https://json-schema.org/draft/2020-12/json-schema-core.html#section-8.1.1), `title` and `description` are [schema annotations](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-9.1), and `type` is a [validation keyword](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-6.1.1).

<span id="define"></span>

## Define properties[#define]

This section adds the `properties` keyword. In JSON Schema terms, `properties` is a [validation keyword](https://json-schema.org/draft/2020-12/json-schema-core.html#section-10.3.2.1). When you define `properties`, you create an object where each property represents a key in the JSON data that’s being validated. You can also specify which properties defined in the object are required.

### Add the properties object[#properties]

Using the product catalog example, `productId` is a numeric value that uniquely identifies a product. Since this is the canonical identifier for the product, it’s required.

To add the `properties` object to the schema:

1. Add the `properties` validation keyword to the end of the schema:
    
```json
...
"title": "Product",
"description": "A product from Acme's catalog",
"type": "object",
"properties": {
  "productId": {
  }
}
```

2. Add the `productId` keyword, along with the following schema annotations:
    * `description`: describes what `productId` is. In this case, it’s the product’s unique identifier.
    * `type`: defines what kind of data is expected. For this example, since the product identifier is a numeric value, use `integer`.
    
```json
...
"properties": {
  "productId": {
    "description": "The unique identifier for a product",
    "type": "integer"
  }
}
```

With the new `properties` validation keyword, the overall schema looks like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    }
  }
}
```

The following example adds another required key, `productName`. This value is a string:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    }
  }
}
```

The `properties` object now includes two keys, `productId` and `productName`. When JSON data is validated against this schema, validation fails for any documents that contain invalid data in either of these fields.

### Define required properties[#required]

This section describes how to specify that certain properties are required. This example makes the two existing keys required and adds another required key named `price`. The `price` key has a `description` and `type` just like the other keys, but it also specifies a minimum value. Because nothing in the store is free, each product requires a price value that’s above zero. Define this using the `exclusiveMinimum` validation keyword.

To define a required property:

1. Inside the `properties` object, add the `price` key. Include the usual schema annotations `description` and `type`, where `type` is a number:
    
```json
"properties": {
...
  "price": {
    "description": "The price of the product",
    "type": "number"
  }
```

2. Add the `exclusiveMinimum` validation keyword and set the value to zero:
    
```json
"price": {
  "description": "The price of the product",
  "type": "number",
  "exclusiveMinimum": 0
}
```

3. Add the `required` validation keyword to the end of the schema, after the `properties` object. Add `productID`, `productName`, and the new `price` key to the array:
    
```json
"price": {
  "description": "The price of the product",
    "type": "number",
    "exclusiveMinimum": 0
  }
},
"required": [ "productId", "productName", "price" ]
```

With the new `required` keyword and `price` key, the overall schema looks like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

The `exclusiveMinimum` validation keyword is set to zero, which means that only values above zero are considered valid. To include zero as a valid option, you could use the `minimum` validation keyword instead.

### Define optional properties[#optional]

This section describes how to define an optional property. For this example, define a keyword named `tags` using the following criteria:

* The `tags` keyword is optional.
* If `tags` is included, it must contain at least one item.
* All tags must be unique.
* All tags must be text.

To define an optional property:

1. Inside the `properties` object, add the `tags` keyword. Include the usual schema annotations `description` and `type`, and define `type` as an array:
    
```json
"properties": {
...
  "tags": {
    "description": "Tags for the product",
    "type": "array"
  }
}
```

2. Add a new validation keyword for `items` to define what appears in the array. For example, `string`:
    
```json
"tags": {
  "description": "Tags for the product",
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

3. To make sure there is at least one item in the array, use the `minItems` validation keyword:
    
```json
"tags": {
  "description": "Tags for the product",
  "type": "array",
  "items": {
    "type": "string"
  },
  "minItems": 1
}
```

4. To make sure that every item in the array is unique, use the `uniqueItems` validation keyword and set it to `true`:
    
```json
"tags": {
  "description": "Tags for the product",
  "type": "array",
  "items": {
    "type": "string"
  },
  "minItems": 1,
  "uniqueItems": true
}
```

With the new `tags` keyword, the overall schema looks like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

Because the new keyword is not required, there are no changes to the `required` section.

<span id="nest-data"></span>

## Create a nested data structure[#nest-data]

The earlier examples describe a flat schema with only one level. This section describes how to use nested data structures in JSON Schema.

To create a nested data structure:

1. Inside the `properties` object, create a new key called `dimensions`:
    
```json
"properties": {
...
  "dimensions": {
  }
}
```

2. Define the `type` validation keyword as `object`:
    
```json
"dimensions": {
  "type": "object",
}
```

3. Add the `properties` validation keyword to contain the nested data structure. Inside the new `properties` keyword, add keywords for `length`, `width`, and `height` that all use the `number` type:
    
```json
"dimensions": {
  "type": "object",
  "properties": {
    "length": {
      "type": "number"
    },
    "width": {
      "type": "number"
    },
    "height": {
      "type": "number"
    }
  }
}
```

4. To make each of these properties required, add a `required` validation keyword inside the `dimensions` object:
    
```json
"dimensions": {
  "type": "object",
  "properties": {
    "length": {
      "type": "number"
    },
    "width": {
      "type": "number"
    },
    "height": {
      "type": "number"
    }
  },
  "required": [ "length", "width", "height" ]
}
```

Using the new nested data structures, the overall schema looks like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [ "length", "width", "height" ]
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

The new `required` validation keyword only applies within the scope of the `dimensions` key.

<span id="external"></span>

## Add an external reference[#external]

This section describes how to reference resources outside of the schema. Sharing schemas across many data structures is a common way to make them easier to use, read, and keep up-to-date. So far, the product catalog schema is self-contained. This section creates a new schema and then references it in the product catalog schema.

The following schema validates a geographical location:

```json
{
  "$id": "https://example.com/geographical-location.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Longitude and Latitude",
  "description": "A geographical coordinate on a planet (most commonly Earth).",
  "required": [ "latitude", "longitude" ],
  "type": "object",
  "properties": {
    "latitude": {
      "type": "number",
      "minimum": -90,
      "maximum": 90
    },
    "longitude": {
      "type": "number",
      "minimum": -180,
      "maximum": 180
    }
  }
}
```

To reference this schema in the product catalog schema:

1. Inside the `properties` object, add a key named `warehouseLocation`:
    
```json
"properties": {
...
  "warehouseLocation": {
  }
}
```

2. To link to the external geographical location schema, add the `$ref` schema keyword and the schema URL:
    
```json
"warehouseLocation": {
  "description": "Coordinates of the warehouse where the product is located.",
  "$ref": "https://example.com/geographical-location.schema.json"
}
```

With the external schema reference, the overall schema looks like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [ "length", "width", "height" ]
    },
    "warehouseLocation": {
      "description": "Coordinates of the warehouse where the product is located.",
      "$ref": "https://example.com/geographical-location.schema.json"
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

<span id="valiate"></span>

## Validate JSON data against the schema[#validate]

This section describes how to validate JSON data against the product catalog schema.

This example JSON data matches the product catalog schema:

```json
{
  "productId": 1,
  "productName": "An ice sculpture",
  "price": 12.50,
  "tags": [ "cold", "ice" ],
  "dimensions": {
    "length": 7.0,
    "width": 12.0,
    "height": 9.5
  },
  "warehouseLocation": {
    "latitude": -78.75,
    "longitude": 20.4
  }
}
```

To validate this JSON data against the product catalog JSON Schema, you can use any validator of your choice. In addition to command-line and browser tools, validation tools are available in a wide range of languages, including Java, Python, .NET, and many others. To find a validator that’s right for your project, see [Implementations](https://json-schema.org/implementations).

Use the example JSON data as the input data and the product catalog JSON Schema as the schema. Your validation tool compares the data against the schema, and if the data meets all the requirements defined in the schema, validation is successful.
