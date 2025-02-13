---
title: Introduction to JSON Schema
section: docs
---


## What is JSON Schema?
JSON Schema is a declarative language for defining the structure and constraints of JSON data. It serves as both a blueprint and validation tool, ensuring that JSON data adheres to expected formats and structures.
### Why use JSON Schema?
- **Validation**: It ensures that JSON data is well-structured and adheres to defined rules.
- **Documentation**: It serves as a clear specification for the expected format of data.
- **Interoperability**: It provides a common framework for systems to exchange data reliably.

## Core Concepts
### JSON data types
JSON supports several basic data types that form the foundation for any schema:

### object
```json
{ "key1": "value1", "key2": "value2" }
```

### array
```json
[ "first", "second", "third" ]
```

### number 
```json 
42
3.1415926
``` 

### string
```json
"This is a string"
```

### boolean
```json
  true
  false
```

### null
```json
  null
```

These types have [analogs in most programming languages](../understanding-json-schema/reference/type).

## The role of a schema
A JSON Schema defines the structure and validation criteria for a given JSON document. It specifies which fields are required, the types of those fields, and any other constraints that must be met for the data to be considered valid.

For instance, a schema for a `"Person"` might specify that it must contain a `first_name` and `last_name`, both of which should be strings.

Example Schema for a person:

````
{
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "birthdate": { "type": "string", "format": "date" }
  },
  "required": ["first_name", "last_name"]
}
````
In this example:

- **type**: Defines the expected data type for the object.
- **properties**: Specifies the allowed properties of the object and their types.
- **required**: Lists the properties that must be included in the object.


### Writing a simple JSON Schema
To get started with JSON Schema, let’s begin with the simplest possible schema: one that accepts any valid JSON document.

##### Example: "Hello, World!" Schema

An empty schema (represented by `{}`) will validate any JSON data.

```
// props { "isSchema": true }
{}
```

This accepts anything, as long as it's valid JSON

```
// props { "valid": true, "indent": true }
42
```

```
// props { "valid": true, "indent": true }
"I'm a string"
```

````
// props { "valid": true, "indent": true }
{ "an": [ "arbitrarily", "nested" ], "data": "structure" }
````

## Restricting data with the type keyword
One of the most common tasks in JSON Schema is restricting data to a specific type. The type keyword allows you to enforce that a given field contains a specific kind of value.

Example: Enforcing a string Type

To ensure that the data is always a string, you can use the following schema:

````
{
  "type": "string"
}
````

This schema will validate:

````
"Valid string"
````

It will fail on non-string data:

````
42
````


## Declaring a JSON Schema version

When defining a schema, it is good practice to specify which version of the JSON Schema specification the schema adheres to. This is done using the $schema keyword.

Example: Declaring a Schema Version

````
{
  "$schema": "https://json-schema.org/draft/2020-12/schema"
}
````

Although not mandatory, including $schema ensures that your schema is interpreted according to the correct version of the specification.

## Building a more complex schema
As you create more sophisticated data structures, your schemas will become more complex. JSON Schema allows you to define nested objects and arrays, making it a powerful tool for managing structured data.

Example: Person with address

Consider a more detailed schema for a "Person" that includes an address field, which is itself an object with several properties

````
{
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" },
        "zipcode": { "type": "string" }
      },
      "required": ["street", "city"]
    }
  },
  "required": ["first_name", "last_name", "address"]
}

````
In this schema:

address is defined as an object with its own properties.
The required keyword is used to ensure certain fields are present.

## Validating JSON data against a schema

Once you have a schema, you can validate JSON data to ensure that it conforms to the expected structure. If the data is valid according to the schema, the validation will succeed; otherwise, it will fail.

Example: Valid data

This data conforms to the "Person with Address" schema:

````
{
  "first_name": "John",
  "last_name": "Doe",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipcode": "12345"
  }
}
````
##### Example: Invalid data

This data is invalid because the city field is missing in the address object:

````
{
  "first_name": "John",
  "last_name": "Doe",
  "address": {
    "street": "123 Main St",
    "zipcode": "12345"
  }
}
````

## Best practices

- **Use `$schema`**: Always declare which version of the JSON Schema specification you are using to avoid compatibility issues.
- **Use `required` thoughtfully**: Specify which fields are essential for your data to ensure the validity of your documents.
- **Provide clear documentation**: Use JSON Schema not just for validation, but also as a form of documentation to describe the structure of your data.

## Additional resources

To deepen your understanding of JSON Schema, check out the following resources:

- [JSON Schema Official Documentation](https://json-schema.org/overview/what-is-jsonschema/)
- [JSON Schema Core Specification](https://json-schema.org/overview/what-is-jsonschema)
- [Understanding JSON Schema: A Detailed Guide](https://json-schema.org/overview/what-is-jsonschema)