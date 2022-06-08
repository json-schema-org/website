---
layout: page
title: Test
---

```json
{ 
  "$id": "https://example.com/geographical-location.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Longitude and Latitude Values",
  "description": "A geographical coordinate.",
  "required": [ "latitude", "longitude", {"dfsdf": 343, "yd": "asdfsdf"  }, [[[1, 2], "sdfsdf"]] ],
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
      "maximum": 180,
      "specialNumber": -123123.23E+3,
      "boolean1": true,
      "boolean2": false,
      "null": null
    }
  }
}
```
