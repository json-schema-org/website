---
section: docs
title: JSON Schema examples
---

## Address

A schema representing an address, with optional properties for different address components like `post-office-box`, `street-address`, `locality`, `region`, `postal-code`, and `country-name`.

```json
{
  "$id": "https://example.com/address.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "An address similar to http://microformats.org/wiki/h-card",
  "type": "object",
  "properties": {
    "post-office-box": {
      "type": "string"
    },
    "extended-address": {
      "type": "string"
    },
    "street-address": {
      "type": "string"
    },
    "locality": {
      "type": "string"
    },
    "region": {
      "type": "string"
    },
    "postal-code": {
      "type": "string"
    },
    "country-name": {
      "type": "string"
    }
  },
  "required": [ "locality", "region", "country-name" ],
  "dependentRequired": {
    "post-office-box": [ "street-address" ],
    "extended-address": [ "street-address" ]
  }
}
```

**Data**

```json
{
  "post-office-box": "123",
  "street-address": "456 Main St",
  "locality": "Cityville",
  "region": "State",
  "postal-code": "12345",
  "country-name": "Country"
}
```


## Blog post

A schema representing a blog post, including properties like `title`, `content`, `published-date`, `author-details`, and `tags`.

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


## Book

A schema representing a book, including various properties like `title`, `author`, `publication-date`, `genre`, `ISBN`, and `rating`.

```json
{
  "$id": "https://example.com/book.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a book",
  "type": "object",
  "required": ["title", "author"],
  "properties": {
    "title": {
      "type": "string"
    },
    "author": {
      "type": "string"
    },
    "publicationDate": {
      "type": "string",
      "format": "date"
    },
    "genre": {
      "type": "string"
    },
    "isbn": {
      "type": "string"
    },
    "rating": {
      "type": "number",
      "minimum": 0,
      "maximum": 5
    }
  }
}
```

**Data**

```json
{
  "title": "Sample Book",
  "author": "Jane Smith",
  "publicationDate": "2023-07-15",
  "genre": "Fiction",
  "isbn": "978-1234567890",
  "rating": 4.5
}
```


## Calendar

A schema representing an event in a calendar, including properties like `start-date`, `end-date`, `summary`, `location`, and `recurrence` details.

```json
{
  "$id": "https://example.com/calendar.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an event",
  "type": "object",
  "required": [ "dtstart", "summary" ],
  "properties": {
    "dtstart": {
      "type": "string",
      "description": "Event starting time"
    },
    "dtend": {
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
    "rdate": {
      "type": "string",
      "description": "Recurrence date"
    },
    "rrule": {
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
  "dtstart": "2023-08-25T10:00:00Z",
  "dtend": "2023-08-25T12:00:00Z",
  "summary": "Conference Presentation",
  "location": "Conference Center",
  "rrule": "FREQ=DAILY;COUNT=5"
}
```


## Card

A schema representing a person, company, organization, or place, with properties such as `name`, `contact-information`, and `organizational-details`.

```json
{
  "$id": "https://example.com/card.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a person, company, organization, or place",
  "type": "object",
  "required": [ "familyName", "givenName" ],
  "properties": {
    "fn": {
      "description": "Formatted Name",
      "type": "string"
    },
    "familyName": {
      "type": "string"
    },
    "givenName": {
      "type": "string"
    },
    "additionalName": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "honorificPrefix": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "honorificSuffix": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "nickname": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "email": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
    },
    "tel": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
    },
    "adr": { "$ref": "https://example.com/address.schema.json" },
    "geo": { "$ref": "https://example.com/geographical-location.schema.json" },
    "tz": {
      "type": "string"
    },
    "photo": {
      "type": "string"
    },
    "logo": {
      "type": "string"
    },
    "sound": {
      "type": "string"
    },
    "bday": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "role": {
      "type": "string"
    },
    "org": {
      "type": "object",
      "properties": {
        "organizationName": {
          "type": "string"
        },
        "organizationUnit": {
          "type": "string"
        }
      }
    }
  }
}
```

**Data**

```json
{
  "fn": "John Doe",
  "givenName": "John",
  "familyName": "Doe",
  "email": {
    "type": "work",
    "value": "john.doe@example.com"
  },
  "tel": {
    "type": "home",
    "value": "123-456-7890"
  },
  "adr": {
    "locality": "Cityville",
    "region": "State",
    "country-name": "Country"
  }
}
```


## Event registration

A schema representing an event registration, including properties like `event-name`, `participant-details`, `registration-date`, `ticket-type`, and `ticket-price`.

```json
{
  "$id": "https://example.com/event-registration.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an event registration",
  "type": "object",
  "required": ["eventName", "participant", "registrationDate"],
  "properties": {
    "eventName": {
      "type": "string"
    },
    "participant": {
      "$ref": "https://example.com/user-profile.schema.json"
    },
    "registrationDate": {
      "type": "string",
      "format": "date-time"
    },
    "ticketType": {
      "type": "string"
    },
    "ticketPrice": {
      "type": "number",
      "minimum": 0
    }
  }
}
```

**Data**

```json
{
  "eventName": "Tech Conference",
  "participant": {
    "username": "participantuser",
    "email": "participant@example.com"
  },
  "registrationDate": "2023-08-20T10:00:00Z",
  "ticketType": "Standard",
  "ticketPrice": 100
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

A schema representing a health record, including `patient-information`, `allergies`, `medical-conditions`, `medications`, and `emergency-contact`.

```json
{
  "$id": "https://example.com/health-record.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a health record",
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


## Invoice

A schema representing an invoice, including `invoice details`, `billing address`, `line items`, and `total amount`.

```json
{
  "$id": "https://example.com/invoice.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an invoice",
  "type": "object",
  "required": ["invoiceNumber", "billingAddress", "items", "totalAmount"],
  "properties": {
    "invoiceNumber": {
      "type": "string"
    },
    "billingAddress": {
      "$ref": "https://example.com/address.schema.json"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string"
          },
          "quantity": {
            "type": "integer",
            "minimum": 1
          },
          "unitPrice": {
            "type": "number",
            "minimum": 0
          }
        }
      }
    },
    "totalAmount": {
      "type": "number",
      "minimum": 0
    }
  }
}
```

**Data**

```json
{
  "invoiceNumber": "INV123",
  "billingAddress": {
    "street-address": "789 Billing St",
    "locality": "Cityville",
    "region": "State",
    "postal-code": "54321",
    "country-name": "Country"
  },
  "items": [
    { "description": "Product A", "quantity": 2, "unitPrice": 50 },
    { "description": "Product B", "quantity": 1, "unitPrice": 30 }
  ],
  "totalAmount": 130
}
```


## Job posting

A schema representing a job posting, including properties like `job title`, `company name`, `location`, `job description`, `employment type`, `salary`, and `application deadline`.

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
      "type": "string"
    },
    "duration": {
      "type": "string"
    },
    "cast": {
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
  "title": "Sample Movie",
  "director": "John Director",
  "releaseDate": "2023-07-01",
  "genre": "Action",
  "duration": "2h 15m",
  "cast": ["Actor A", "Actress B", "Actor C"]
}
```


## Order

A schema representing an order, including properties like `order ID`, `items`, `total price`, `customer details`, and `shipping address`.

```json
{
  "$id": "https://example.com/order.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an order",
  "type": "object",
  "required": ["orderId", "items", "totalPrice"],
  "properties": {
    "orderId": {
      "type": "string"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "productId": {
            "type": "string"
          },
          "quantity": {
            "type": "integer",
            "minimum": 1
          }
        }
      }
    },
    "totalPrice": {
      "type": "number",
      "minimum": 0
    },
    "customer": {
      "$ref": "https://example.com/user-profile.schema.json"
    },
    "shippingAddress": {
      "$ref": "https://example.com/address.schema.json"
    }
  }
}
```

**Data**

```json
{
  "orderId": "ORD123",
  "items": [
    { "productId": "PROD1", "quantity": 2 },
    { "productId": "PROD2", "quantity": 1 }
  ],
  "totalPrice": 150,
  "customer": {
    "username": "customeruser",
    "email": "customer@example.com"
  },
  "shippingAddress": {
    "street-address": "123 Shipping St",
    "locality": "Cityville",
    "region": "State",
    "postal-code": "54321",
    "country-name": "Country"
  }
}
```


## Product

A schema representing a product, including properties such as `name`, `price`, `description`, `category`, and `inventory count`.

```json
{
  "$id": "https://example.com/product.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a product",
  "type": "object",
  "required": ["name", "price"],
  "properties": {
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number",
      "minimum": 0
    },
    "description": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "inventory": {
      "type": "integer",
      "minimum": 0
    }
  }
}
```

**Data**

```json
{
  "name": "Product A",
  "price": 50,
  "description": "A high-quality product",
  "category": "Electronics",
  "inventory": 100
}
```


## Recipe

A schema representing a recipe, including properties like `name`, `ingredients`, `cooking instructions`, `preparation time`, `cooking time`, and `servings`.

```json
{
  "$id": "https://example.com/recipe.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of a recipe",
  "type": "object",
  "required": ["name", "ingredients", "instructions"],
  "properties": {
    "name": {
      "type": "string"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "instructions": {
      "type": "string"
    },
    "prepTime": {
      "type": "string"
    },
    "cookTime": {
      "type": "string"
    },
    "servings": {
      "type": "integer",
      "minimum": 1
    }
  }
}
```

**Data**

```json
{
  "name": "Chocolate Chip Cookies",
  "ingredients": ["Flour", "Sugar", "Chocolate Chips", "Butter"],
  "instructions": "1. Preheat the oven...",
  "prepTime": "15 minutes",
  "cookTime": "12 minutes",
  "servings": 24
}
```


## User profile

A schema representing a user profile, including properties like `username`, `email`, `full name`, `age`, `location`, and `interests`.

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

