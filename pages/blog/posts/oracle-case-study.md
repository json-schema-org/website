---
title: "How Oracle is Bridging the Gap Between JSON Schema and Relational Databases"
date: "2025-02-07"
tags:
  - database
  - relational
type: Case Study
cover: /img/posts/2025/oracle-case-study/banner.webp
authors:
  - name: Loïc Lefèvre
    photo: /img/avatars/loiclefevre.webp
    link: https://www.linkedin.com/in/loiclefevre/
    byline: Oracle Database Senior Product Manager
excerpt: "As modern multi-model databases increasingly support JSON, it's time to explore what role JSON schema will play."
---

As modern multi-model databases increasingly support JSON, it's time to explore what role [JSON schema](https://json-schema.org/) will play. In this post, we'll dive into the newly developed ["Database Vocabulary"](https://github.com/json-schema-org/vocab-database/blob/main/database.md), a proposed extension to the official JSON schema specification, developed by Oracle (with inputs from the MySQL and PostgreSQL teams). This vocabulary addresses key database tasks, including validation, type coercion/casting, and metadata preservation, making it easier to manage JSON in databases effectively and bridging the gap with existing relational data. Regardless of whether you are a JSON developer or a relational model developer, you'll learn something reading this post!

Oracle Database 23ai fully implements this new vocabulary, and we'll describe not only the concepts but we'll also see real-world examples of JSON schema validation in action and how to describe database objects in JSON schema.

## JSON Data Guide

With Oracle Database 12cR2 (2017), we've introduced the concept of a [JSON data guide](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-data-guide.html); that lets you **discover** information about the structure and content of *existing* JSON documents stored in JSON columns inside the database.

Let's look at the following example which creates a table `blog_posts` with a column `data` of type `JSON` and inserts one JSON document:

```sql
create table blog_posts (
  data json -- BINARY JSON
);

insert into blog_posts( data ) values (
  json {
    'title': 'New Blog Post',
    'content': 'This is the content of the blog post...',
    'publishedDate': '2023-08-25T15:00:00Z',
    'author': {
      'username': 'authoruser',
      'email': 'author@example.com'
    },
    'tags': ['Technology', 'Programming']
  }
);
commit;
```

We can query the table and retrieve JSON values using the SQL dot notation to navigate the JSON document hierarchy. Attributes within the JSON document can simply be referenced by `.<attribute name>`:

```sql
select -- field names are case sensitive
       p.data.title,
       p.data.author.username.string() as username, 
       p.data.tags[1].string() as "array_field[1]"
  from blog_posts p;
```

The [item method](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/sql-json-path-expression-item-methods.html) `string()` allows explicit casting of the JSON field value. Alongside `string()` are other casting methods like `number()`, `date()`, etc.

However, nothing prevents us from inserting unexpected data!

```sql
insert into blog_posts( data ) values( '{ "garbageDocument":true }' );
commit;

select data from blog_posts;
```
Results:

| DATA |
|-|
| {<br/>&nbsp;&nbsp;"title": "New Blog Post",<br/>&nbsp;&nbsp;"content": "This is the content of the blog post...",<br/>&nbsp;&nbsp;"publishedDate":"2023-08-25T15:00:00Z",<br/>&nbsp;&nbsp;"author": {<br/>&nbsp;&nbsp;&nbsp;&nbsp;"username":"authoruser",<br/>&nbsp;&nbsp;&nbsp;&nbsp;"email":"author@example.com"<br/>&nbsp;&nbsp;},<br/>&nbsp;&nbsp;"tags": [ "Technology", "Programming" ]<br/>} |
| {<br/>&nbsp;&nbsp;"garbageDocument":true<br/>} |

This is where, JSON schemas can help, and the [`JSON_DATAGUIDE()`](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/JSON_DATAGUIDE.html) function can generate one from a set of already existing JSON document(s):

```sql
select json_dataguide(
         data, 
         dbms_json.format_schema,
         dbms_json.pretty
       ) as json_schema
  from blog_posts;
```
Results:

```json
{
  "type": "object",
  "o:length": 1,
  "properties": {
    "tags": {
      "type": "array",
      "o:length": 1,
      "items": {
        "type": "string",
        "o:length": 16
      }
    },
    "title": {
      "type": "string",
      "o:length": 16
    },
    "author": {
      "type": "object",
      "o:length": 1,
      "properties": {
        "email": {
          "type": "string",
          "o:length": 32
        },
        "username": {
          "type": "string",
          "o:length": 16
        }
      }
    },
    "content": {
      "type": "string",
      "o:length": 64
    },
    "publishedDate":  {
      "type": "string",
      "o:length": 32
    },
    "garbageDocument": {
      "type": "boolean",
      "o:length": 4
    }
  }
}
```

We can see that the `garbageDocument` field was properly detected and added to the set of accepted JSON fields for the JSON schema.

## Data Validation

The most obvious use case for JSON schema is JSON data validation. The Oracle Database 23ai brings the new PL/SQL package [`DBMS_JSON_SCHEMA`](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/DBMS_JSON_SCHEMA.html#GUID-89B9C48D-D905-482C-A78C-8DB314EDF072) which can be used to validate JSON schemas and JSON data.

The `dbms_json_schema.is_schema_valid()` function can tell us if a given JSON schema itself is valid:

```sql
-- Validate the generated JSON schema
select dbms_json_schema.is_schema_valid( 
    (
      -- Generate JSON Data Guide/Schema from data column
      select json_dataguide(
               data,
               dbms_json.format_schema,
               dbms_json.pretty
             ) as json_schema
        from blog_posts
    ) 
) = 1 as is_schema_valid;
```

Another function `dbms_json_schema.validate_report()` validates a JSON document against a JSON schema and  generates a validation report, including validation errors, if there are any:

```sql
-- Validate current JSON data with a simple JSON schema
select dbms_json_schema.validate_report( 
           data,
           json( '{
                    "type": "object",
                    "properties": { 
                      "tags": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    }
                  }' )
       ) as report
from blog_posts;
```
Results:

| REPORT                                                     |
|------------------------------------------------------------|
| {<br/>&nbsp;&nbsp;"valid": true,<br/>&nbsp;&nbsp;"errors": []<br/>} |
| {<br/>&nbsp;&nbsp;"valid": true,<br/>&nbsp;&nbsp;"errors": []<br/>} |

With the simplistic JSON schema, no validation errors are present. Let's use a more complex JSON schema (based on the [Blog post](https://json-schema.org/learn/json-schema-examples#blog-post) example from the JSON schema website itself):

```sql
select dbms_json_schema.validate_report( 
  data,
  json('{
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
    },
    "$def": {
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
  }')
) as report
from blog_posts;
```
Results:

| REPORT                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| { <br/>&nbsp;&nbsp;"valid": true,<br/>&nbsp;&nbsp;"errors": []<br/>} |
| {<br/>&nbsp;&nbsp;"valid": false,<br/>&nbsp;&nbsp;"errors": [<br/>&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"schemaPath": "\$",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"instancePath": "\$",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": "JZN-00501",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"error": "JSON schema validation failed"<br/>&nbsp;&nbsp;&nbsp;&nbsp;}, {<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"schemaPath": "\$.required",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"instancePath": "\$",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": "JZN-00515",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"error": "required properties not found: 'title', 'content', 'author'"<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;]<br/>} |

Now we can see that the second JSON document shows several validation errors, namely the missing fields `title`, `content` and `author`.

If you don't want or need to know the validation error details, you may simply use the `dbms_json_schema.is_valid()` function.

Finally, you can leverage the `dbms_json_schema.describe()` function to generate JSON schemas from existing relational objects such as tables, views, and JSON Relational Duality Views (more on that later).

```sql
-- Get the JSON schema from a relational table!
select dbms_json_schema.describe( 'BLOG_POSTS' ) as json_schema;
```
Results:

| JSON_SCHEMA                                                                                                                                                                                  |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| {<br/>&nbsp;&nbsp;"title": "BLOG_POSTS",<br/>&nbsp;&nbsp;"dbObject": "APIDAYS.BLOG_POSTS",<br/>&nbsp;&nbsp;"type": "object",<br/>&nbsp;&nbsp;"dbObjectType": "table",<br/>&nbsp;&nbsp;"properties": {<br/>&nbsp;&nbsp;&nbsp;&nbsp;"DATA": {}<br/>&nbsp;&nbsp;}<br/>} |

### Client-side validation using JSON Schema

Now that we are able to create and retrieve JSON schemas from the database, we may consider the database as a central repository for JSON schemas that can be used by clients (backends and frontends) to validate JSON data.

Below, you can see a quick overview of a demo available in this [GitHub repository](https://github.com/loiclefevre/apidays-paris-2024):

![React frontend form created from the json-schema-form library.](/img/posts/2025/oracle-case-study/json-schema-form.webp)

Using [Oracle REST Data Services](https://download.oracle.com/otn_software/java/ords/ords-latest.zip), we can indeed expose a JSON schema to a frontend via REST. Below, we are using the `json-schema-form` [library](https://github.com/remoteoss/json-schema-form) to build an input form from a JSON schema where `title`, `description`, and check constraints are used to define input fields and associated validation rules. Let's drill down into this example:

We'll start by creating a basic relational table that will store products:

```sql
-- drop table if exists products purge;

create table products (
  name     varchar2(100) not null primary key
      constraint minimal_name_length check (length(name) >= 3),
  price    number not null 
      constraint strictly_positive_price check (price > 0),
  quantity number not null 
      constraint non_negative_quantity check (quantity >= 0)
);

insert into products (name, price, quantity)
values ('Cake mould',     9.99, 15),
       ('Wooden spatula', 4.99, 42);
commit;
```

This table has 3 columns. Each column has a named check constraint ensuring inserted values are conform with business rules (strictly positive prices, etc.).

If we retrieve the JSON schema corresponding to this relational table using `dbms_json_schema.describe()`, we'll also get these check constraints *translated* into the JSON schema format:

```sql
-- JSON Schema of PRODUCTS table
-- Contains check constraints!
select dbms_json_schema.describe( 'PRODUCTS' ) as json_schema;
```
Results:

```json
{
  "title": "PRODUCTS",
  "dbObject": "APIDAYS.PRODUCTS",
  "type": "object",
  "dbObjectType": "table",
  "properties": {
    "NAME": {
      "type": "string",
      "extendedType": "string",
      "maxLength": 100,
      "allOf": [
        {
          "minLength": 3
        }
      ]
    }, 
    "PRICE": {
      "type": "number",
      "extendedType": "number",
      "allOf": [
        {
          "exclusiveMinimum": 0
        }
      ]
    },
    "QUANTITY": {
      "type": "number",
      "extendedType": "number",
      "allOf": [
        {
          "minimum": 0
        }
      ]
    }
  },
  "required": [
    "NAME",
    "PRICE",
    "QUANTITY"
	],
  "dbPrimaryKey": [
    "NAME"
  ]
}
```

One thing we remark is the absence of `title` and `description` attributes for our 3 columns but considering JSON schemas are also JSON documents, we may enrich the JSON schema with the missing values.

#### Database Schema Annotations

Starting with the Oracle Database 23ai, you can leverage [Schema Annotations](https://docs.oracle.com/en/database/oracle/oracle-database/23/adfns/registering-application-data-usage-database.html#GUID-2DAF069E-0938-40AF-B05B-75AFE71D666C) to annotate database objects (columns, tables, views, indexes, etc.).

Consider the following schema annotations:

```sql
ALTER TABLE products MODIFY name ANNOTATIONS (
  ADD OR REPLACE "title" 'Name',
  ADD OR REPLACE "description" 'Product name (max length: 100)',
  ADD OR REPLACE "minLength" '3'
);

ALTER TABLE products MODIFY price ANNOTATIONS (
  ADD OR REPLACE "title" 'Price',
  ADD OR REPLACE "description" 'Product price strictly positive',
  ADD OR REPLACE "minimum" '0.01'
);

ALTER TABLE products MODIFY quantity ANNOTATIONS (
  ADD OR REPLACE "title" 'Quantity',
  ADD OR REPLACE "description" 'Quantity of products >= 0',
  ADD OR REPLACE "minimum" '0'
);
```

These schema annotations provide additional information for each relational columns. Note that the `minimum` and `minLength` ones are here to work around a current `json-schema-form` library limitation (hopefully, this [open issue](https://github.com/remoteoss/json-schema-form/issues/102) will be solved soon).

These annotations are stored inside the database dictionary and can be retrieved via the `user_annotations_usage` dictionary view:

```sql
-- View annotations
select column_name, annotation_name, annotation_value
  from user_annotations_usage
 where object_name='PRODUCTS'
   and object_type='TABLE'
order by 1, 2;
```
Results:

|COLUMN_NAME|ANNOTATION_NAME|ANNOTATION_VALUE|
|-|-|-|
|NAME|description|Product name (max length: 100)|
|NAME|minLength|3|
|NAME|title|Name|
|PRICE|description|Product price strictly positive|
|PRICE|minimum|0.01|
|PRICE|title|Price|
|QUANTITY|description|Quantity of products >= 0|
|QUANTITY|minimum|0|
|QUANTITY|title|Quantity|

To mix both, the table JSON schema with these column level annotations, we can use the following PL/SQL function:

```sql
-- Annotate JSON Schema with column level annotations
-- p_table_name: the table name to work on
create or replace function getAnnotatedJSONSchema( p_table_name in varchar2 )
return json
as
  schema       clob;          -- the original JSON schema
  l_schema     JSON_OBJECT_T; -- the JSON schema as DOM to modify
  l_properties JSON_OBJECT_T; -- the "properties" JSON object entry of the JSON schema
  l_keys       JSON_KEY_LIST; -- the list of JSON field names of "properties" JSON object
  l_column     JSON_OBJECT_T; -- the JSON object to modify (for each column of the table)
begin
  -- get JSON schema of table
  select json_serialize( dbms_json_schema.describe( p_table_name )
                         returning clob ) into schema;
  
  -- create a DOM object
  l_schema := JSON_OBJECT_T.parse( schema );
  -- access the "properties" JSON schema field that lists all the table columns
  l_properties := l_schema.get_Object('properties');
  -- get all the field names of this "properties" DOM: the table columns
  l_keys := l_properties.get_Keys();

  -- loop over all the columns...
  for i in 1..l_keys.count loop
    l_column := l_properties.get_Object( l_keys(i) );

    -- now retrieve from the database dictionary, all the annotations
    -- associated with this table column
    for c in (select ANNOTATION_NAME, ANNOTATION_VALUE 
                from user_annotations_usage
               where object_name=p_table_name 
                 and object_type='TABLE' 
                 and column_name=l_keys(i))
    loop
      -- add each annotation found as a new key/value pair to the JSON schema 
      -- for that table column
      l_column.put( c.ANNOTATION_NAME, c.ANNOTATION_VALUE );
    end loop;
  end loop;

  -- returns the annotated JSON schema
  return l_schema.to_json;
end;
/
```

Then one can use the function as below:

```sql
select getAnnotatedJSONSchema( 'PRODUCTS' );
```
Results:

```json
{
  "title": "PRODUCTS",
  "dbObject": "APIDAYS.PRODUCTS",
  "type": "object",
  "dbObjectType": "table",
  "properties": {
    "NAME": {
      "type": "string",
      "extendedType": "string",
      "maxLength": 100,
      "allOf": [
        {
          "minLength": 3
        }
      ],
      "title": "Name",
      "description": "Product name (max length: 100)",
      "minLength": "3"
    },
    "PRICE": {
      "type": "number",
      "extendedType": "number",
      "allOf": [
        {
          "exclusiveMinimum": 0
        }
      ],
      "description": "Product price strictly positive",
      "minimum": "0.01",
      "title": "Price"
    },
    "QUANTITY": {
      "type": "number",
      "extendedType": "number",
      "allOf": [
        {
          "minimum": 0
        }
      ],
      "title": "Quantity",
      "description": "Quantity of products >= 0",
      "minimum": "0"
    }
  }, 
  "required": [
    "NAME", 
    "PRICE",
    "QUANTITY"
  ],
  "dbPrimaryKey": [
    "NAME"
  ]
}
```

#### GET method

The previous SQL query can then be used as the parameterized template for our REST end point for the GET method:

```sql
-- Run only once:
BEGIN
  ORDS.ENABLE_SCHEMA(
    p_enabled             => TRUE,
    -- database user/schema
    p_schema              => 'APIDAYS',
    p_url_mapping_type    => 'BASE_PATH',
    p_url_mapping_pattern => 'apidays',
    p_auto_rest_auth      => FALSE);
    
  ORDS.DEFINE_MODULE(
    p_module_name    => 'apidays',
    p_base_path      => '/schema_repository/',
    p_items_per_page => 25,
    p_status         => 'PUBLISHED',
    p_comments       => NULL);

  ORDS.DEFINE_TEMPLATE(
    p_module_name    => 'apidays',
    p_pattern        => 'products',
    p_priority       => 0,
    p_etag_type      => 'HASH',
    p_etag_query     => NULL,
    p_comments       => NULL);

  ORDS.DEFINE_HANDLER(
    p_module_name    => 'apidays',
    p_pattern        => 'products',
    p_method         => 'GET',
    p_source_type    => 'json/item',
    p_mimes_allowed  => NULL,
    p_comments       => NULL,
    p_source         => 
'select getAnnotatedJSONSchema( ''PRODUCTS'' ) as schema');
       
COMMIT;

END;
/
```

In the [GitHub repositoy](https://github.com/loiclefevre/apidays-paris-2024/blob/main/src/ORDS.js), you'll find the `src/ORDS.js` module that demonstrates using this REST method:

```js
import axios from 'axios';

function ORDS() {}

ORDS.prototype.getSchema = async function() {
  return await axios.get(
      'http://localhost/ords/apidays/schema_repository/products', 
      {}
  )
  .then( res => res.data.schema )
  .catch(err => err);
}

export default new ORDS();
```

With all this in place, our React frontend can now create the following form:

![React frontend with input form generated from an annotated Oracle Database 23ai JSON schema.](/img/posts/2025/oracle-case-study/form.webp)

<Infobox> Interestingly, whenever you change the schema annotation in the database, it is immediately reflected inside your browser once you refreshed it. You can try with:
```sql
ALTER TABLE products MODIFY name ANNOTATIONS (
  REPLACE "title" 'Product name'
);
```
</Infobox> 


#### JSON Relational Duality View

Once the new product has been validated inside the frontend, it is sent to the database for insertion into the relational table. To ease this process, we'll leverage one of the greatest 23ai new features: **JSON Relational Duality View**.

This new type of view acts as a gateway between the JSON and relational worlds. Basically, one can insert JSON documents into a JSON relational duality view and the database will automatically map the proper JSON fields to the relational columns. From a retrieval perspective, whenever a JSON relational duality view is queried, a JSON  document will be constructed from the underlying relational model at runtime.

Consider this *very simple* example (not even involving relationships between tables, nor flex fields, etc.):

```sql
-- GraphQL notation (SQL notation also exists)
create or replace json relational duality view products_dv as
products @insert {
  _id: NAME
  PRICE
  QUANTITY
};
```

Here we ask the view to accept `INSERT` SQL statements (via `@insert`) and remap the JSON `_id` attribute (mandatory JSON unique key) to the relational column `NAME` (note that JSON fields are case-sensitive). The other two attributes are automatically mapped because the JSON attributes and relational table column names are the same.

You can find hereunder the JSON schema of this JSON relational duality view:

```sql
-- Get JSON Schema from JSON Relational Duality View
select dbms_json_schema.describe( 'PRODUCTS_DV' );
```
Results:

```json
{
  "title": "PRODUCTS_DV",
  "dbObject": "APIDAYS.PRODUCTS_DV",
  "dbObjectType": "dualityView",
  "dbObjectProperties": [ "insert", "check" ], 
  "type": "object", 
  "properties": {
    "_metadata": {
      "etag": {
        "type": "string",
        "extendedType": "string",
        "maxLength": 200
      },
      "asof": {
        "type": "string",
        "extendedType": "string",
        "maxLength": 20
      }
    },
    "_id": {
      "type": "string",
      "extendedType": "string",
      "maxLength": 100,
      "dbFieldProperties": [ "check" ]
    },
    "PRICE": {
      "type": "number",
      "extendedType": "number",
      "dbFieldProperties": [ "check" ]
    },
    "QUANTITY": {
      "type": "number",
      "extendedType": "number",
      "dbFieldProperties": [ "check" ]
    }
  },
  "dbPrimaryKey": [
    "_id"
  ],
  "required": [
    "_id",
    "PRICE",
    "QUANTITY"
  ],
  "additionalProperties": false
}
```

So now we can run such an `INSERT` statement:

```sql
-- Insert JSON in a Relational table (Bridging the Gap...)
-- by using the JSON Relational Duality View
insert into PRODUCTS_DV(data) values( 
  json_transform( '{
                     "NAME": "Other nice product", 
                     "PRICE": 5, 
                     "QUANTITY": 10
                  }', 
                  RENAME '$.NAME' = '_id'
  )
);

commit;
```

You will notice that we are using the [`JSON_TRANSFORM()`](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/oracle-sql-function-json_transform.html) function to rename the `NAME` JSON attribute to `_id` expected by the `PRODUCTS_DV` JSON relational duality view.

```sql
select * from products_dv;
select * from products;
```

Running the 2 queries above respectively returns the data in JSON format:

| DATA                                                                                                                 |
|----------------------------------------------------------------------------------------------------------------------|
| {<br/>&nbsp;&nbsp;"_id": "Cake mould",<br/>&nbsp;&nbsp;"PRICE": 9.99,<br/>&nbsp;&nbsp;"QUANTITY": 15,<br/>&nbsp;&nbsp;"_metadata": { ... }<br/>}  |
| {<br/>&nbsp;&nbsp;"_id": "Wooden spatula",<br/>&nbsp;&nbsp;"PRICE": 4.99,<br/>&nbsp;&nbsp;"QUANTITY": 42,<br/>&nbsp;&nbsp;"_metadata": { ... }<br/>}  |
| {<br/>&nbsp;&nbsp;"_id": "Other nice product",<br/>&nbsp;&nbsp;"PRICE": 5,<br/>&nbsp;&nbsp;"QUANTITY": 10,<br/>&nbsp;&nbsp;"_metadata": { ... }<br/>} |

...and relational format:

|NAME|PRICE|QUANTITY|
|-|-|-|
|Cake mould|9.99|15|
|Wooden spatula|4.99|42|
|Other nice product|5|10|

<Infobox>The `_metadata` object will contain additional information such as an `etag` that can be used for [optimistic concurrency control](https://docs.oracle.com/en/database/oracle/oracle-database/23/jsnvu/using-optimistic-concurrency-control-duality-views.html).</Infobox>

#### POST method

With the JSON relational duality view in place, we can now implement the REST POST method by adding another ORDS handler:

```sql
BEGIN
  ORDS.DEFINE_HANDLER(
    p_module_name    => 'apidays',
    p_pattern        => 'products',
    p_method         => 'POST',
    p_source_type    => 'plsql/block',
    p_mimes_allowed  => NULL,
    p_comments       => NULL,
    p_source         => 
'begin
  insert into PRODUCTS_DV( data ) values( json_transform(:body_text, RENAME ''$.NAME'' = ''_id'') );
  commit;
end;');
       
COMMIT;

END;

/
```

#### Precheck Check Constraints

With 23ai, a check constraint can now be marked as [`PRECHECK`](https://docs.oracle.com/en/database/oracle/oracle-database/23/adfns/data-integrity.html#GUID-278AD7DD-C45D-4F43-8D60-8ABA2B062296). Doing so tells the database that a relational check constraint has a corresponding JSON schema constraint that preserves the semantics of the constraint and hence the database doesn't need to verify the check again. An example of a constraint that has no corresponding JSON schema constraint could be a foreign key.

Once a check constraint is marked as `PRECHECK`, you have the choice whether or not to disable the check constraint on the table as the retrieved JSON schema with `dbms_json_schema.describe()` will contain the check constraints as well.

<Danger>We do **NOT** advise to disable check constraints as it would allow inserting bad data into the relational tables directly. The remark about `PRECHECK` constraints is here to provide as much information as possible.</Danger>

```sql
-- Mark check constraints as PRECHECK
alter table products modify constraint strictly_positive_price precheck;
alter table products modify constraint non_negative_quantity precheck;

-- Now disable the constraints at the database level
-- They are checked in the clients
--
-- Warning: do that at your own risks!
alter table products modify constraint strictly_positive_price disable;
alter table products modify constraint non_negative_quantity disable;

-- Check constraints still present inside the JSON Schema
select dbms_json_schema.describe( 'PRODUCTS' );

-- but following INSERT will work and insert bad data
insert into products (name, price, quantity)
values ('Bad product', 0, -1);

commit;

select * from products;
```

### Data Use Case Domains

Another way to validate JSON data is to associate a JSON schema with a JSON column. In 23ai, an extension of the ISO standard Domains is available: [Data Use Case Domains](https://docs.oracle.com/en/database/oracle/oracle-database/23/adfns/registering-application-data-usage-database.html#GUID-4743FDE1-7C6E-471B-BC9D-442383CCA2F9).

Consider the following very simple data use case domain that could be considered as a scalar JSON data type alias:

```sql
-- Introducing Data Use Case Domains
create domain if not exists jsonb as json;

create table test ( 
  data jsonb -- JSON alias
);
```

Domains also allow for [centralizing JSON schema](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-schema.html#GUID-7D67DF73-CB21-4878-AF93-D1A213411EC0) so that they can be reused across tables and columns. The example below demonstrates how to associate a JSON schema within a data use case domain:

```sql
-- drop table if exists posts purge;
-- drop domain if exists BlogPost;
create domain if not exists BlogPost as json
validate '{
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
  },
  "$def": {
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
}';

-- Now use the Domain as a new column data type!
create table posts ( content BlogPost );

-- fails
insert into posts values (json{ 'garbageDocument' : true });

-- works
insert into posts values (
  json {
    'title': 'Best brownies recipe ever!',
    'content': 'Take chocolate...',
    'publishedDate': '2024-12-05T13:00:00Z',
    'author': {
      'username': 'Bob',
      'email': 'bob@blogs.com'
    },
    'tags': ['Cooking', 'Chocolate', 'Cocooning']
  }
);

commit;
```

Now let's look closer at the `publishedDate` field:

```sql
select p.content.publishedDate 
  from posts p;

-- the binary encoded data type is 'string'
select p.content.publishedDate.type() as type 
  from posts p;
```
Results:

|TYPE|
|-|
|string|

Using the `type()` [item method](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/sql-json-path-expression-item-methods.html), we can see the date is in fact stored as a string.

## Performance Improvement

With data use case domains, the Oracle Database 23ai can not only use JSON schema for JSON data validation but it can also improve performance by leveraging the  [`CAST`](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-schema.html#GUID-50DD1C0D-A1C1-49BA-88A5-977EB1B734FA) functionality. Consider the following data use case domain example:

```sql
drop table if exists posts purge;

drop domain if exists BlogPost;

-- Recreate the Domain with CAST/Type coercion enabled
create domain BlogPost as json
validate CAST using '{
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
      "extendedType": "timestamp",
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
  },
  "$def": {
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
}';

create table posts ( content BlogPost );
```

By enabling the JSON schema for type **CAST**ing, we can request the database to use the new `extendedType`  during the binary JSON encoding process. In the example above, this would mean that the encoded type would be a `timestamp` and no longer a `string` resulting in less parsing overhead compared to the previous version: from `string` to `timestamp` each time we retrieve the field for SQL processing (`WHERE` clause filtering, `SELECT` projection, etc.).

Let's check this:

```sql
create table posts ( content BlogPost );

-- We can retrieve the JSON schema associated to the column
-- via the Data Use Case Domain
select dbms_json_schema.describe( 'POSTS' );

-- works
insert into posts values (
'{
   "title": "Best brownies recipe ever!",
   "content": "Take chocolate...",
   "publishedDate": "2024-12-05T13:00:00Z",
   "author": {
     "username": "Bob",
     "email": "bob@blogs.com"
   },
   "tags": ["Cooking", "Chocolate", "Cocooning"]
 }'
);
commit;

-- Now let's look at the publishedDate field...
select p.content.publishedDate from posts p;

-- ...its binary encoded data type is 'timestamp'
select p.content.publishedDate.type() from posts p;

-- I can add 5 days to this date...
select p.content.publishedDate.timestamp() + interval '5' day 
from posts p;
```

<Infobox>We use the item method `timestamp()` in the last statement above because otherwise the SQL dot notation would return a SQL `JSON` (by default in 23ai) on which we cannot apply an interval operation. However, because the value is already stored as `TIMESTAMP` inside the binary JSON format, there will be *no conversion* from `JSON` to `timestamp` here.</Infobox>

Last but not least, by enabling type casting, native SQL data type checks are also performed ensuring 100% fidelity between stored binary values in the encoded JSON and SQL data types. As a result, we can store not just the standard JSON data types but also the SQL data types inside the encoded binary JSON such as `NUMBER`, `DATE`, `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `INTERVAL`, `RAW`, `VECTOR`, etc.

## Relational Model Evolution

Our last use case that leverages JSON schema inside the Oracle Database is available since version 12cR2. Imagine, you are a data analyst and the only tool you have to build charts only allows you to see tables and columns. Each time a new data attribute is added, you know that it will take time before you see it appearing inside your BI tool because of the involved development processes.

Now, imagine this is no more the case...

Let's look at the following example:

```sql
create table orders ( j json );

insert into orders(j) values (
  json { 'firstName': 'Bob', 'address': 'Paris' }
);
commit;

select j from orders;
```
Results:

| J                                                                      |
|------------------------------------------------------------------------|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris"<br/>} |

We have an `orders` table with one column containing a JSON document. The JSON document itself  has 2 fields and 2 values. Now, we'll create a [**JSON Search index**](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-search-index-ad-hoc-queries-and-full-text-search.html) (that can perform Full-Text search). This index can optionally maintain a JSON Data Guide in real-time, meaning the JSON schema for the JSON documents stored inside the JSON column.

With this ability comes another one: [Change Triggers For Data Guide-Enabled Search Index](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/change-triggers-data-guide-enabled-search-index.html#GUID-2F4C6F52-0D96-4405-8F85-CDA0B234D0D5) which, based on the maintained JSON schema, can react to any newly added JSON attributes and dynamically expose these by adding the corresponding virtual columns.

The example below demonstrates this behavior:

```sql
-- drop index s_idx force;

-- Create a Full-Text Search index for JSON with Data Guide
-- enabled and add_vc stored procedure enabled to change
-- table structure: add virtual column for JSON fields,
-- helpful for Analytics => you directly have the existing
-- JSON fields listed as columns!
create search index s_idx on orders(j) for json
parameters('dataguide on change add_vc');

select * from orders;
```
Results:

| J                                                                 |J$address|J$firstName|
|-------------------------------------------------------------------|-|-|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris"<br/>} |Paris|Bob|

```sql
insert into orders(j) values (
  json { 'firstName': 'Bob', 'address': 'Paris', 'vat': false }
);
commit;

select * from orders;
```
Results:

| J                                                                                    |J$address|J$firstName|J$vat|
|--------------------------------------------------------------------------------------|-|-|-|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris"<br/>}                    |Paris|Bob|null|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris",<br/>&nbsp;&nbsp;"vat": false<br/>} |Paris|Bob|false|

```sql

insert into orders(j) values (
  json { 'firstName': 'Bob', 'address': 'Paris', 'vat': false, 'tableEvolve': true }
);
commit;

select * from orders;
```
Results:

| J                                                                                                                    |J$address|J$firstName|J$vat|J$tableEvolve|
|----------------------------------------------------------------------------------------------------------------------|-|-|-|-|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris"<br/>}                                                |Paris|Bob|null|null|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris",<br/>&nbsp;&nbsp;"vat": false<br/>}                            |Paris|Bob|false|null|
| {<br/>&nbsp;&nbsp;"firstName": "Bob",<br/>&nbsp;&nbsp;"address": "Paris",<br/>&nbsp;&nbsp;"vat": false,<br/>&nbsp;&nbsp;"tableEvolve": true<br/>} |Paris|Bob|false|true|

<Infobox>The trigger executes asynchronously, hence not delaying DML response times, however, because of it being asynchronous, it may take a second before you will see the new virtual column.</Infobox>

## Conclusion

We have shown lots of features inside the Oracle Database 23ai which provide powerful capabilities to have JSON data coexist with relational data, and JSON schema clearly strengthens this even more. But this is only the beginning and as you discover more and more features that work the same way regardless of the data model, or that allow going back and forth from one model to another, you'll understand the true value of a converged database which has one goal: removing barriers, simplifying architecture and making developers more productive!

![Oracle Database 23ai is a converged database now supporting JSON schema.](/img/posts/2025/oracle-case-study/converged_database.webp)

Lean more:
- [Oracle Database 23ai `DBMS_JSON_SCHEMA` PL/SQL package](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/DBMS_JSON_SCHEMA.html#GUID-89B9C48D-D905-482C-A78C-8DB314EDF072)
- [Oracle Database 23ai JSON Developer Guide](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/index.html)
- [Getting started with Oracle Database 23ai](https://medium.com/db-one/oracle-database-download-install-tutorial-my-getting-started-guide-044925c10ca2)
- [Oracle Database 23ai JSON Feature Highlights](https://www.oracle.com/database/23ai/#json)
