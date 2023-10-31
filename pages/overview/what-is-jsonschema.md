---
section: docs
title: What is JSON Schema?
---
JSON Schema is a declarative language that you can use to annotate and validate the structure, constraints, and data types of your JSON documents. It provides a way to standardize and define expectations for your JSON data.
<br/><br/>
![How JSON Schema works](/img/what-is-json-schema.png)

## How it works

Using JSON Schema, you can define rules and constraints that JSON data should adhere to. When your JSON documents adhere to these constraints, it becomes easier to exchange structured data between applications because the data follows a consistent pattern.

Before we get into JSON Schema and how it can help us, let's first understand what exactly is a JSON document.

* A JSON document represents a piece of data that follows the syntax and structure defined by the JSON format. It is a collection of key-value pairs, arrays, and nested objects. 
* JSON documents are used to store and transfer data between systems and applications.

Taking an example of a JSON document representing a customer order:

```json
{
  "order_id": "123456",
  "customer_name": "John Doe",
  "items": [
    {
      "product_id": "P001",
      "name": "T-shirt",
      "quantity": 2,
      "price": 19.99
    },
    {
      "product_id": "P002",
      "name": "Jeans",
      "quantity": 1,
      "price": 49.99
    }
  ],
  "total_amount": 89.97,
  "status": "pending"
}
```

* The above code snippet includes attributes such as the *order ID*, *customer name*, *items ordered* (an array of objects with product details), *shipping address*, *total amount*, and *status* of the order.

* This JSON document provides a structured representation of an order, making it easy to exchange, store, or process the order information in various applications or systems.


### The challenge

When working with JSON data, it can quickly become complex and difficult to manage, especially when dealing with nested structures. Without a standardized schema, it becomes challenging to validate and enforce constraints on the data. 

For example, if we wanted to validate JSON data using Python: 

```python
# Without JSON Schema
data = {
    "product": {
        "name": "Widget",
        "price": 10.99,
        "quantity": 5
    }
}

# Performing basic validation
if "product" in data and isinstance(data["product"], dict) and "name" in data["product"] and "price" in data["product"]:
    print("Valid JSON object.")
else:
    print("Invalid JSON object.")
```

In the above code snippet, we are performing basic validation to check if the JSON object has the required fields. Since this is a relatively simpler data, this way of checking works for now. 

To show the challenges of performing data validation without using JSON Schema, we can take this exmaple in Python:

```python
# Without JSON Schema
data = {
    "order": {
        "order_id": "123456",
        "customer_name": "John Doe",
        "items": [
            {
                "product_id": "P001",
                "name": "T-shirt",
                "quantity": 2,
                "price": 19.99
            },
            {
                "product_id": "P002",
                "name": "Jeans",
                "quantity": 1,
                "price": 49.99
            }
        ],
        "shipping_address": {
            "street": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001"
        },
        "total_amount": 89.97,
        "status": "pending"
    }
}

# Performing basic validation
if (
    "order" in data
    and isinstance(data["order"], dict)
    and "order_id" in data["order"]
    and "customer_name" in data["order"]
    and "items" in data["order"] and isinstance(data["order"]["items"], list)
    and "shipping_address" in data["order"] and isinstance(data["order"]["shipping_address"], dict)
    and "total_amount" in data["order"]
    and "status" in data["order"]
):
    print("Valid JSON object.")
else:
    print("Invalid JSON object.")
```

Now we are dealing with a complex JSON structure that represents an order. The basic validation logic checks whether the required fields exist in the JSON object. However, as the structure becomes more complex, the validation code becomes more complicated and prone to errors. Moreover, this approach lacks support for checking data types, handling nested structures, and enforcing specific constraints.


### JSON Schema to the rescue

JSON Schema provides a solution to this problem. It is a specification language for JSON that allows you to describe the structure, content, and semantics of a JSON instance. With JSON Schema, you can define metadata about an object's properties, specify whether fields are optional or required, and define expected data formats.

By using JSON Schema, people can better understand the structure and constraints of the JSON data they are using. It enables applications to validate data, ensuring it meets the defined criteria. With JSON Schema, you can make your JSON more readable, enforce data validation, and improve interoperability across different programming languages.

Using the same example, we can validate the data by making use of the [jsonschema](https://github.com/python-jsonschema/jsonschema) Python library:

```python
from jsonschema import validate

# Using JSON Schema
data = {
    "product": {
        "name": "Widget",
        "price": 10.99,
        "quantity": 5
    }
}

schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Product",
    "type": "object",
    "properties": {
        "product": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                    },
                "price": {
                    "type": "number", 
                    "minimum": 0
                    },
                "quantity": {
                    "type": "integer", 
                    "minimum": 1
                    }
            },
            "required": ["name", "price", "quantity"]
        }
    },
    "required": ["product"]
}

try:
    validate(data, schema)
    print("Valid JSON object.")
except Exception as e:
    print("Invalid JSON object:", e)

```

In the above code snippet, we defined a JSON Schema that describes the expected structure and constraints of the JSON data. We use the `jsonschema` library to validate the `data` against the `schema`. If the data doesn't conform to the schema, an exception is raised, providing detailed information about the failure.

By using JSON Schema, we can easily define and enforce constraints, making the validation process more robust and manageable. It improves the readability of the code and reduces the chances of data-related issues.


## Why developers use JSON Schema

With JSON Schema you can:

* **Describe existing data formats**: JSON Schema allows you to describe the structure, constraints, and data types of your existing JSON data formats. 
* **Define rules and constraints**: When your JSON documents adhere to these constraints, it becomes easier to exchange structured data between applications because the data follows a consistent pattern.
* **Clear and readable documentation**: JSON Schema supports the creation of documentation that is easily understandable by both humans and machines.
* **Highly extensible** and can be tailored to fit your needs.
    * You can create *custom keywords*, *formats*, and *validation rules* to suit your own requirements.
* **Validate your data**, which helps you:
    * **Automate testing**: JSON Schema validation enables automated testing, ensuring that data consistently adheres to the specified rules and constraints.
    * **Enhance data quality**: By enforcing validation rules, JSON Schema helps ensure the quality of client-submitted data, preventing inconsistencies, errors, and malicious inputs.
* **Wide range of tools availability**: The JSON Schema community has a wealth of tools and resources available across many programming languages to help you create, validate, and integrate your schemas.


## Why organizations adopt JSON Schema

* **Streamline testing and validation**: Simplify your validation logic to reduce your code’s complexity and save time on development. Define constraints for your data structures to catch and prevent errors, inconsistencies, and invalid data.
* **Exchange data seamlessly**: Establish a common language for data exchange, no matter the scale or complexity of your project. Define precise validation rules for your data structures to create shared understanding and increase interoperability across different systems and platforms.
* **Document your data**: Create a clear, standardized representation of your data to improve understanding and collaboration among developers, stakeholders, and collaborators.
* **Vibrant tooling ecosystem**: Adopt JSON Schema with an expansive range of community-driven tools, libraries, and frameworks across many programming languages.

## JSON Schema History

JSON Schema has a rich history that dates back to the [first JSON Schema proposal](https://web.archive.org/web/20071026185150/http://json.com/json-schema-proposal/) submitted by **Kris Zyp** to json.com on October 2nd, 2007. 

The current version of JSON Schema is [2020-12](../draft/2020-12/release-notes), which represents the latest advancements and have expended capabilities as compared with the previous version `draft-04`, `draft-06`, `draft-07`. We encourage everyone to adopt the latest version whenever possible to take advantage of all the advancements and benefits of JSON Schema.

For more information regarding JSON Schema history, you can refer to [this article](https://modern-json-schema.com/what-is-modern-json-schema) by **Henry Andrews**.

## Next steps

To start using JSON Schema, see [Creating your first schema](../learn/getting-started-step-by-step).


### Learn more

Learn more about the specification:

* [Understanding JSON Schema](../understanding-json-schema)
* [JSON Schema Specification 2020-12](https://json-schema.org/specification.html)


### Join the community

To get involved with our community, please make sure you are familiar with the project's [Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md).

* **Join [JSON Schema Slack](https://json-schema.org/slack)**. This is the best place to ask questions, learn, get help, or discuss all things JSON Schema.
* **Attend our public JSON Schema meetings**. We hold [Office Hours](https://github.com/json-schema-org/community/discussions/34) every first Tuesday at 15:00 BST (and by appointment) and [Open Community Working Meetings](https://github.com/json-schema-org/community/discussions/35) every Monday at 14:00 PT.
* **Follow our [YouTube](https://www.youtube.com/watch?v=48S8-GwRh-g&list=PLHVhS4Tj1YZPYt6sMkvf4nW8zKvZExVA4) channel**. Find recordings of our public community meetings and JSON Schema learning resources.
* **Read our [blog](https://json-schema.org/blog)**. Find the latest and greatest stories from our community.