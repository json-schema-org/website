---
title: JSON Schema examples
---

## Address
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

## Calendar
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

## Card
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

## Geographical location
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