---
title: "Advanced use of JSON Schema in Data-Centric Web APIs with SlashDB"
date: "2025-11-03"
tags:
  - Database
  - API
type: Case Study
cover: /img/posts/2025/advanced-json-schema/banner.png
authors:
  - name: Victor Olex
    photo: /img/avatars/volex.jpeg
    link: https://www.linkedin.com/in/victorolex/
    byline: Founder and CEO, SlashDB
excerpt: "As modern multi-model databases increasingly support JSON, it's time to explore what role JSON schema will play."
---

JSON Schema has become the backbone of modern API design—not just for describing data types, but for enforcing consistency, validating input, and communicating intent between systems. Beyond simple type declarations, schemas can capture constraints like string lengths, date formats, nullability, and even complex conditional logic.  

In this article, we’ll explore how these advanced features come to life in a real-world setting: [SlashDB](https://docs.slashdb.com/), a REST API gateway for relational databases. By examining its schema endpoints and validation mechanisms, you’ll see how JSON Schema can:  

- Ensure data integrity across CRUD operations  
- Provide machine-readable contracts for client applications  
- Catch errors early with precise validation rules  

Along the way, we’ll highlight practical examples of schema features such as `required`, `oneOf`, `maxLength`, `maxItems`,  `format`, and `pattern`, showing how they transform raw database structures into robust, self-validating APIs.  

We will be examining how an application can leverage these features to thoroughly examine data for consistency.  We will demonstrate what a schema incorporating them looks like, and how an application validating user input can manage data inconsistency errors.

## Case Study: SlashDB

**[SlashDB](https://docs.slashdb.com/)** is an application that creates a REST API gateway for relational databases for reading and writing.  Endpoints are created for all resources in a database, and any CRUD operation may be performed by sending the appropriate HTTP request to an endpoint.  

In addition to creating endpoints for data, **SlashDB** has JSON schema endpoints so that you may examine the structure of any resource.

It has two modes of operation - *Data Discovery* and *SQL Pass-Thru*.

*Data Discovery* exposes unique REST endpoints for every resource within a database, from full tables, to subsets of tables, to individual columns or values.

*SQL Pass-Thru* creates a unique endpoint for a SQL query that a user defines and configures.  The query may contain any valid SQL syntax, including complex joins or calls to stored procedures.  Queries are configured to execute on a single database that is connected to **SlashDB**.


#### Example Data Discovery Endpoints

* a database endpoint - https://demo.slashdb.com/db/Chinook

* a table endpoint - https://demo.slashdb.com/db/Chinook/Employee

* a single record, identified by primary key - https://demo.slashdb.com/db/Chinook/Employee/EmployeeId/1


*Data Discovery* also uses JSON schemas to validate data when records are being created or changed.

#### Example SQL Pass-Thru Endpoints

* a simple query - https://demo.slashdb.com/query/sales-by-year.json?limit=29

* a *parameterized* query, with a parameter-value pair of `year/2010` - https://demo.slashdb.com/query/invoices-by-year/year/2010?limit=29

### Examining Data & Schemas

#### Data Discovery

Let's examine a single record for an `Employee` in the `Chinook` database.  We'll use **SlashDB**'s filtering features to select the record where the primary key of the table (EmployeeId) is 1.

https://demo.slashdb.com/db/Chinook/Employee/EmployeeId/1.json

```
{
    "__href": "/db/Chinook/Employee/EmployeeId/1.json",
    "Employee_1": {
        "__href": "/db/Chinook/Employee/EmployeeId/1/Employee_1.json"
    },
    "EmployeeId": 1,
    "LastName": "Adams",
    "FirstName": "Andrew",
    "Title": "General Manager",
    "ReportsTo": null,
    "BirthDate": "1962-02-18T00:00:00",
    "HireDate": "2002-08-14T00:00:00",
    "Address": "11120 Jasper Ave NW",
    "City": "Edmonton",
    "State": "AB",
    "Country": "Canada",
    "PostalCode": "T5K 2N1",
    "Phone": "+1 (780) 428-9482",
    "Fax": "+1 (780) 428-3457",
    "Email": "andrew@chinookcorp.com",
    "Employee_N": {
        "__href": "/db/Chinook/Employee/EmployeeId/1/Employee_N.json"
    },
    "Customer": {
        "__href": "/db/Chinook/Employee/EmployeeId/1/Customer.json"
    }
}
```

We see that this record has data fields of various kinds - numbers, strings, dates, null values, as well as some additional metadata.

Now let's retrieve the schema for this record:
https://demo.slashdb.com/db/Chinook/Employee/EmployeeId/1.json?schema

```
{
    "title": "Employee",
    "type": "object",
    "required": [
        "EmployeeId",
        "LastName",
        "FirstName"
    ],
    "properties": {
        "EmployeeId": {
            "type": "integer"
        },
        "LastName": {
            "type": "string", "maxLength": 20
        },
        "FirstName": {
            "type": "string", "maxLength": 20
        },
        "Title": {
            "type": ["string", "null"],
            "maxLength": 30
        },
        "ReportsTo": {
            "type": ["integer", "null"]
        },
        "BirthDate": {
            "type": ["string", "null"],
            "format": "date-time"
        },
        "HireDate": {
            "type": ["string", "null"],
            "format": "date-time"
        },
        "Address": {
            "type": ["string", "null"],
            "maxLength": 70
        },
        "City": {
            "type": ["string", "null"],
            "maxLength": 40
        },
        "State": {
            "type": ["string", "null"],
            "maxLength": 40
        },
        "Country": {
            "type": ["string", "null"],
            "maxLength": 40
        },
        "PostalCode": {
            "type": ["string", "null"],
            "maxLength": 10
        },
        "Phone": {
            "type": ["string", "null"],
            "maxLength": 24
        },
        "Fax": {
            "type": ["string", "null"],
            "maxLength": 24
        },
        "Email": {
            "type": ["string", "null"],
            "maxLength": 60
        },
        "Employee_1": {
            "type": ["object", "null"],
            "properties": {
                "__href": {
                    "type": ["string", "null"]
                }
            }
        },
        "Employee_N": {
            "type": ["object", "null"],
            "properties": {
                "__href": {
                    "type": ["string", "null"]
                }
            }
        },
        "Customer": {
            "type": ["object", "null"],
            "properties": {
                "__href": {
                    "type": ["string", "null"]
                }
            }
        },
        "__href": {
            "type": ["string", "null"]
        }
    }
}
```

Examining this schema and comparing to the data, we can see that various JSON schema properties are present:

* there are `required` fields, specifying which fields in the record cannot not be null - this attribute also contains the table's primary key, in this case `EmployeeId`

* some `string` fields have the `maxLength` property, reflecting that a maximum length is defined for the database column

* some `string` fields have the `format` property, that identifies them as `date-time` fields - validation/parsing tools can use this to ensure data validity

* a `type` with an array of values means the field can be any one of those types - e.g. `["string", "null"]` is a string field that is nullable

#### Endpoints With Multiple Records

To pull multiple records:

https://demo.slashdb.com/db/Chinook/Employee.json?limit=3

And the schema:

https://demo.slashdb.com/db/Chinook/Employee.json?schema

```
{
  "title": "Employee",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "EmployeeId": {
        "type": "integer"
      },
      "LastName": {
        "type": "string",
        "maxLength": 20
      },
      "FirstName": {
        "type": "string",
        "maxLength": 20
      },
      "Title": {
        "type": ["string", "null"],
        "maxLength": 30
      },
      "ReportsTo": {
        "type": [
          "integer",
          "null"
        ]
      },
      "BirthDate": {
        "type": ["string", "null"],
        "format": "date-time"
      },
      "HireDate": {
        "type": ["string", "null"],
        "format": "date-time"
      },
      "Address": {
        "type": ["string", "null"],
        "maxLength": 70
      },
      "City": {
        "type": ["string", "null"],
        "maxLength": 40
      },
      "State": {
        "type": ["string", "null"],
        "maxLength": 40
      },
      "Country": {
        "type": ["string", "null"],
        "maxLength": 40
      },
      "PostalCode": {
        "type": ["string", "null"],
        "maxLength": 10
      },
      "Phone": {
        "type": ["string", "null"],
        "maxLength": 24
      },
      "Fax": {
        "type": ["string", "null"],
        "maxLength": 24
      },
      "Email": {
        "type": ["string", "null"],
        "maxLength": 60
      },
      "Employee_1": {
        "type": ["object", "null"],
        "properties": {
          "__href": {
            "type": ["string", "null"]
          }
        }
      },
      "Employee_N": {
        "type": ["object", "null"],
        "properties": {
          "__href": {
            "type": ["string", "null"]
          }
        }
      },
      "Customer": {
        "type": ["object", "null"],
        "properties": {
          "__href": {
            "type": ["string", "null"]
          }
        }
      },
      "__href": {
        "type": ["string", "null"]
      }
    },
    "required": [
      "EmployeeId",
      "LastName",
      "FirstName"
    ]
  },
  "minItems": 1
}
```
In this last endpoint, the schema is the same but is nested in an `array` of `items` since there are multiple records. Additionally, the JSON schema `minItems` property is present to denote that data being validated against this schema should contain at least one record.

One other parameter we can use with **SlashDB**'s schemas is the `cardinality` query string parameter:

https://demo.slashdb.com/db/Chinook/Employee.json?schema&cardinality=3

This will add a `maxItems` property to the schema, specifying that the data being validated against this schema should contain at most 3 records.

### Validating Input

Let's see how **SlashDB** uses JSON schemas to validate user input.

Now that we've examined the `Employee` data and its schema, we know what the structure of a record in the table is, and we can create a new one.

To create a new record in **SlashDB**, we send an HTTP payload to the endpoint of the table we want to add a record to:

https://demo.slashdb.com/db/Chinook/Employee.json

First, let's send a request to add a record with a field that isn't part of the table schema:

```
curl -X POST "https://demo.slashdb.com/db/Chinook/Employee.json" -d '{"EmployeeId": 999, "FirstName": "James", "LastName": "Wood", "UnitPrice": 1}'

{"http_code": 400, "description": "Could not parse JSON: Additional properties are not allowed ('UnitPrice' was unexpected)"}
```

Whoops! `UnitPrice` isn't a column in the table, and **SlashDB**'s JSON schema validator has caught that.


Now let's try to send a payload with a `PostalCode` that has more than 10 characters:

```
curl -X POST "https://demo.slashdb.com/db/Chinook/Employee.json" -d '{"EmployeeId":999, "FirstName": "James", "LastName":"Wood", "PostalCode": "aaaaaaaaaaaaaa"}'

{"http_code": 400, "description": "Could not parse JSON: The \"PostalCode\": error at node '/0/PostalCode': 'aaaaaaaaaaaaaa' is too long"}
```

The validator used the `maxLength` property on the `PostalCode` value to check the length of the string, and found a problem.

Lastly, let's try to send a payload with a `BirthDate` that is not in the proper `date-time` format:

```
curl -X POST "https://demo.slashdb.com/db/Chinook/Employee.json" -d '{"EmployeeId":999, "FirstName": "James", "LastName":"Wood", "BirthDate": "01-01-2000"}'

{"http_code": 400, "description": "Could not parse JSON: The \"BirthDate\": error at node '/0/BirthDate': '01-01-2000' is not a 'date-time'"}
```

The validator used the `format` property of the `BirthDate` to check that the value was formatted as an RFC 3339 datetime string (a subset of ISO 8601), and detected an error. 


#### SQL Pass-Thru

Schemas are available for queries executed through *SQL Pass-Thru*.  They are useful for examining the structure of records and validating data integrity on the client side; they are not used internally by **SlashDB** to validate data for queries that modify, add, or delete records.

Let's examine the `sales-by-year` query and its schema:

https://demo.slashdb.com/query/sales-by-year.json?limit=10

Query record set:

```
[
    {
        "Year": 2009,
        "Total": 448.4801
    },
    {
        "Year": 2010,
        "Total": 481.45
    },
    {
        "Year": 2011,
        "Total": 469.58
    },
    {
        "Year": 2012,
        "Total": 477.53
    },
    {
        "Year": 2013,
        "Total": 450.58
    }
]
```

And the schema:

```
{
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "Year": {
                "type": ["integer", "null"]
            },
            "Total": {
                "type": ["number", "null"]
            }
        }
    },
    "minItems": 1
}
```

In the schema, all records are grouped inside of an `array` of `items`, with an object property for each column in the results.  Note that in *SQL Pass-Thru*, the `type` will always be an array of values - the first value being the actual type, the second being `null`; this allows the schema to account for NULL values in the result.

You can now use this schema to examine the structure of the query's output, and also to validate data with any client-side tools that support JSON schemas.

### SlashDB Internal API & Schemas


**SlashDB** provides endpoints to its own internal API for managing connections to databases, users, and query configurations. All endpoint transactions are conducted using JSON.

JSON schemas are also available for determining what fields and data types are needed to interact with the API programmatically.

A couple more JSON schema properties are used in internal schemas: `pattern` and `oneOf`.


### Example Endpoints

* a query definition -  https://demo.slashdb.com/querydef/active-users

### API & Schemas

Let's look at the endpoint for the `active-users` query definition.  First, the query definition itself:

https://demo.slashdb.com/querydef/active-users.json

```
{
    "query_id": "active-users",
    "database": "reshareu",
    "desc": "List of active ReshareU users",
    "sqlstr": "select a.id, c.*\nfrom account a\njoin oauth o on a.id = o.account_id\njoin contact_detail c on o.user_id = c.user_id\nwhere active=True\norder by first_name, last_name",
    "http_methods": {
        "GET": true,
        "POST": true,
        "PUT": true
    },
    "creator": "admin",
    "read": [],
    "write": [
        "public"
    ],
    "execute": [],
    "url_template": "/query/active-users.json"
}
```

Now, the schema:

https://demo.slashdb.com/querydef/active-users.json?schema

```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "creator": {
            "type": ["string", "null"],
            "pattern": "^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]*$",
            "maxLength": 128
        },
        "database": {
            "type": "string",
            "pattern": "^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]*$",
            "maxLength": 128
        },
        "desc": {
            "type": ["string", "null"],
            "maxLength": 4096
        },
        "execute": {
            "oneOf": [
                {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "pattern": "^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]*$",
                        "maxLength": 128
                    }
                },
                {
                    "type": "null"
                }
            ]
        },
        "http_methods": {
            "type": "object",
            "additionalProperties": false,
            "minProperties": 1,
            "properties": {
                "DELETE": {
                    "type": "boolean"
                },
                "GET": {
                    "type": "boolean"
                },
                "POST": {
                    "type": "boolean"
                },
                "PUT": {
                    "type": "boolean"
                }
            }
        },
        "query_id": {
            "type": "string",
            "pattern": "^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]*$",
            "maxLength": 128
        },
        "read": {
            "oneOf": [
                {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "pattern": "^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]*$",
                        "maxLength": 128
                    }
                },
                {
                    "type": "null"
                }
            ]
        },
        "sqlstr": {
            "type": "string",
            "minLength": 1
        },
        "write": {
            "oneOf": [
                {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "pattern": "^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]*$",
                        "maxLength": 128
                    }
                },
                {
                    "type": "null"
                }
            ]
        },
        "url_template": {
            "type": ["string", "null"]
        }
    },
    "required": [
        "query_id",
        "database",
        "http_methods",
        "sqlstr"
    ],
    "optional": [
        "creator",
        "desc",
        "execute",
        "read",
        "write",
        "url_template"
    ]
}
```

We see that the `pattern` attribute is present in several portions of the schema here.  Used in conjunction with `string`, `pattern` allows you to specify a regular expression that a value must match against.

E.g - the `query_id` attribute, which is a unique string that identifies the query, must be no more than 128 characters long (`maxLength` property), and the string must match [this regular expression](https://regex101.com/r/2crKdN/2) - `^(?![xX][mM][lL])[a-zA-Z_][a-zA-Z0-9@_~-]`.

We also see the `oneOf` attribute - used here to define that an attribute is either null/not present, or an array of `items` (e.g. the `read` or `write` properties).

### Conclusion: JSON Schema as a Bridge Between Data and APIs

What we’ve seen through SlashDB is more than just schema decoration—it’s JSON Schema acting as a **bridge** between relational data models and modern web APIs. By embedding constraints like `maxLength`, `format`, and `pattern` directly into schemas, SlashDB ensures that data integrity is preserved not only in the database but also at the API boundary.  

For developers, this means:  
- **Confidence in data quality** before it ever reaches the database  
- **Clear contracts** for client applications consuming APIs  
- **Reduced friction** when integrating across systems  

As JSON Schema continues to evolve, its role in API ecosystems will only grow. Whether you’re designing a new service or modernizing legacy systems, adopting schema-driven validation is one of the most effective ways to build APIs that are both resilient and self-documenting.  

If you’re already using JSON Schema, consider how tools like SlashDB can extend its power into your data layer. And if you’re just getting started, let this case study be a reminder: schemas aren’t just documentation—they’re executable rules that make your APIs smarter, safer, and more reliable.  

> ## 📌 Key Takeaways: JSON Schema in Data-Centric APIs
> 
> - **Type & Nullability** → Use `type` with arrays (e.g. `["string", "null"]`) to explicitly allow nullable fields.  
> - **Required vs. Optional** → `required` enforces critical fields (like primary keys), while optional fields can be left null or omitted.  
> - **String Constraints** → `maxLength` ensures values (e.g. `PostalCode`) don’t exceed database column limits.  
> - **Date & Time Validation** → `format: "date-time"` enforces RFC 3339 compliance for temporal fields.  
> - **Array Controls** → `minItems` and `maxItems` define expected record counts in query results.  
> - **Pattern Matching** → `pattern` applies regex rules to enforce naming conventions or input formats.  
> - **Conditional Structures** → `oneOf` allows flexible definitions (e.g. property may be `null` or an array of strings).  
> - **Error Transparency** → Schema-driven validation provides clear, actionable error messages when input fails.  
> - **API Contracts** → Schemas double as machine-readable documentation, ensuring consistency across clients and services.  