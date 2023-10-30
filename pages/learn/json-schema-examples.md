---
section: docs
title: JSON Schema examples
---

In this page, you will find examples illustrating different use cases to help you get the most out of your JSON Schemas. These examples cover a wide range of scenarios, and each example comes with accompanying JSON data and explanation, showcasing how JSON Schemas can be applied to various domains. You can modify these examples to suit your specific needs, as this is just one of the many ways you can utilize JSON Schemas.

- [Address](#address)
- [Blog post](#blog-post)
- [Calendar](#calendar)
- [Device Type](#device-type)
- [Ecommerce System](#ecommerce-system)
- [Geographical location](#geographical-location)
- [Health record](#health-record)
- [Job posting](#job-posting)
- [Movie](#movie)
- [User profile](#user-profile)


## Address

A schema representing an address, with optional properties for different address components which enforces that `locality`, `region`, and `countryName` are required, and if `postOfficeBox` or `extendedAddress` is provided, `streetAddress` must also be provided.

```json
{
  "$id": "https://example.com/address.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "An address similar to http://microformats.org/wiki/h-card",
  "type": "object",
  "properties": {
    "postOfficeBox": {
      "type": "string"
    },
    "extendedAddress": {
      "type": "string"
    },
    "streetAddress": {
      "type": "string"
    },
    "locality": {
      "type": "string"
    },
    "region": {
      "type": "string"
    },
    "postalCode": {
      "type": "string"
    },
    "countryName": {
      "type": "string"
    }
  },
  "required": [ "locality", "region", "countryName" ],
  "dependentRequired": {
    "postOfficeBox": [ "streetAddress" ],
    "extendedAddress": [ "streetAddress" ]
  }
}
```

**Data**

```json
{
  "postOfficeBox": "123",
  "streetAddress": "456 Main St",
  "locality": "Cityville",
  "region": "State",
  "postalCode": "12345",
  "countryName": "Country"
}
```


## Blog post

A schema representing a blog post, including properties like `title`, `content`, `publishedDate`, `author`, and `tags`.

```json
{
  "$id": "https://example.com/blog-post.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a blog post",
  "type": "object",
  "required": ["title", "content", "author"],
  "properties": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "publishedDate": {
      "type": "string",
      "format": "date-time"
    },
    "author": {
      "$ref": "https://example.com/user-profile.schema.json"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

**Data**

```json
{
  "title": "New Blog Post",
  "content": "This is the content of the blog post...",
  "publishedDate": "2023-08-25T15:00:00Z",
  "author": {
    "username": "authoruser",
    "email": "author@example.com"
  },
  "tags": ["Technology", "Programming"]
}
```


## Calendar

A schema representing an event in a calendar, including properties like `startDate`, `endDate`, `summary`, `location`, and `recurrenceDate` details. The `geo` property is a reference (`$ref`) to another schema defined at a different location which represents a geographical location with latitude and longitude values.

```json
{
  "$id": "https://example.com/calendar.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an event",
  "type": "object",
  "required": [ "dtstart", "summary" ],
  "properties": {
    "startDate": {
      "type": "string",
      "description": "Event starting time"
    },
    "endDate": {
      "type": "string",
      "description": "Event ending time"
    },
    "summary": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "duration": {
      "type": "string",
      "description": "Event duration"
    },
    "recurrenceDate": {
      "type": "string",
      "description": "Recurrence date"
    },
    "recurrenceDule": {
      "type": "string",
      "description": "Recurrence rule"
    },
    "category": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "geo": {
      "$ref": "https://example.com/geographical-location.schema.json"
    }
  }
}
```

**Data**

```json
{
  "startDate": "2023-08-25T10:00:00Z",
  "endDate": "2023-08-25T12:00:00Z",
  "summary": "Conference Presentation",
  "location": "Conference Center",
  "recurrenceDule": "FREQ=DAILY;COUNT=5"
}
```


## Device type

This schema represents electronic devices with a `deviceType` property that determines the device's category, such as `smartphone` or `laptop`. It employs the `oneOf` keyword to dynamically reference schemas based on the `deviceType` property. This flexible schema structure allows data to conform to the appropriate device schema based on the deviceType specified, making it easy to describe different electronic devices with their unique characteristics. When `deviceType` is set to `smartphone`, the schema enforces properties specific to smartphones, and when `deviceType` is set to `laptop`, it enforces properties specific to laptops. 

```json
{
  "$id": "https://example.com/device.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "deviceType": {
      "type": "string"
    }
  },
  "required": ["deviceType"],
  "oneOf": [
    {
      "properties": {
        "deviceType": { "const": "smartphone" }
      },
      "$ref": "https://example.com/smartphone.schema.json"
    },
    {
      "properties": {
        "deviceType": { "const": "laptop" }
      },
      "$ref": "https://example.com/laptop.schema.json"
    }
  ]
}

{
  "$id": "https://example.com/smartphone.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "brand": {
      "type": "string"
    },
    "model": {
      "type": "string"
    },
    "screenSize": {
      "type": "number"
    }
  },
  "required": ["brand", "model", "screenSize"]
}

{
  "$id": "https://example.com/laptop.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "brand": {
      "type": "string"
    },
    "model": {
      "type": "string"
    },
    "processor": {
      "type": "string"
    },
    "ramSize": {
      "type": "number"
    }
  },
  "required": ["brand", "model", "processor", "ramSize"]
}
```

**Data**

```json
{
  "deviceType": "smartphone",
  "brand": "Samsung",
  "model": "Galaxy S21",
  "screenSize": 6.2
}
```


## Ecommerce system

A schema representing an ecommerce system, where `$anchor` is used within the definitions of `product` and `order` schemas to define anchor points: `ProductSchema` and `OrderSchema`, respectively.

```json
{
  "$id": "https://example.com/ecommerce.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$defs": {
    "product": {
      "$anchor": "ProductSchema",
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number", "minimum": 0 }
      }
    },
    "order": {
      "$anchor": "OrderSchema",
      "type": "object",
      "properties": {
        "orderId": { "type": "string" },
        "items": {
          "type": "array",
          "items": { "$ref": "#ProductSchema" }
        }
      }
    }
  }
}
```

**Data**

```json
{
  "order": {
    "orderId": "ORD123",
    "items": [
      {
        "name": "Product A",
        "price": 50
      },
      {
        "name": "Product B",
        "price": 30
      }
    ]
  }
}
```


## Geographical location

A schema representing geographical coordinates with `latitude` and `longitude` values within specified ranges.

```json
{
  "$id": "https://example.com/geographical-location.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Longitude and Latitude Values",
  "description": "A geographical coordinate.",
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

**Data**

```json
{
  "latitude": 48.858093,
  "longitude": 2.294694
}
```


## Health record

A schema representing a health record, including `patientName`, `dateOfBirth`, `bloodType`, `allergies`, `conditions`, `medications`, and `emergencyContact`.

```json
{
  "$id": "https://example.com/health-record.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Schema for representing a health record",
  "type": "object",
  "required": ["patientName", "dateOfBirth", "bloodType"],
  "properties": {
    "patientName": {
      "type": "string"
    },
    "dateOfBirth": {
      "type": "string",
      "format": "date"
    },
    "bloodType": {
      "type": "string"
    },
    "allergies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "conditions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "medications": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "emergencyContact": {
      "$ref": "https://example.com/user-profile.schema.json"
    }
  }
}
```

**Data**

```json
{
  "patientName": "Jane Doe",
  "dateOfBirth": "1985-02-15",
  "bloodType": "A+",
  "allergies": ["Pollen", "Penicillin"],
  "conditions": ["Hypertension", "Diabetes"],
  "medications": ["Lisinopril", "Metformin"],
  "emergencyContact": {
    "username": "emergencyuser",
    "email": "emergency@example.com"
  }
}
```


## Job posting

A schema representing a job posting, including properties like `title`, `company`, `location`, `description`, `employmentType`, `salary`, and `applicationDeadline`. It also uses the `$anchor` keyword for defining an anchor.

```json
{
  "$id": "https://example.com/job-posting.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a job posting",
  "type": "object",
  "required": ["title", "company", "location", "description"],
  "properties": {
    "title": {
      "type": "string"
    },
    "company": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "employmentType": {
      "type": "string"
    },
    "salary": {
      "type": "number",
      "minimum": 0
    },
    "applicationDeadline": {
      "type": "string",
      "format": "date"
    }
  }
}
```

**Data**

```json
{
  "title": "Software Engineer",
  "company": "Tech Solutions Inc.",
  "location": "Cityville",
  "description": "Join our team as a software engineer...",
  "employmentType": "Full-time",
  "salary": 80000,
  "applicationDeadline": "2023-09-15"
}
```


## Movie 

A schema representing a movie, including properties such as `title`, `director`, `release date`, `genre`, `duration`, and `cast members`.

```json
{
  "$id": "https://example.com/movie.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a movie",
  "type": "object",
  "required": ["title", "director", "releaseDate"],
  "properties": {
    "title": {
      "type": "string"
    },
    "director": {
      "type": "string"
    },
    "releaseDate": {
      "type": "string",
      "format": "date"
    },
    "genre": {
      "type": "string",
      "enum": ["Action", "Comedy", "Drama", "Science Fiction"]
    },
    "duration": {
      "type": "string"
    },
    "cast": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "additionalItems": false
    }
  }
}
```

**Data**

```json
{
  "title": "Sample Movie",
  "director": "John Director",
  "releaseDate": "2023-07-01",
  "genre": "Action",
  "duration": "2h 15m",
  "cast": ["Actor A", "Actress B", "Actor C"]
}
```


## User profile

A schema representing a user profile, including properties like `username`, `email`, `fullName`, `age`, `location`, and `interests`.

```json
{
  "$id": "https://example.com/user-profile.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a user profile",
  "type": "object",
  "required": ["username", "email"],
  "properties": {
    "username": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "fullName": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "location": {
      "type": "string"
    },
    "interests": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

**Data**

```json
{
  "username": "user123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "age": 30,
  "location": "Cityville",
  "interests": ["Travel", "Technology"]
}
```

