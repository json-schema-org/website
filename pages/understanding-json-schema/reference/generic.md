---
title: "Value restrictions"
section: docs
prev: 
  label: Type Specific Keywords
  url: /understanding-json-schema/reference/type
next: 
  label: 'Media : string-encoding non-JSON data'
  url: /understanding-json-schema/reference/non_json_data
---

The `enum` and `const` keywords contribute to data validation by defining limits on the values a property can hold.

- **Define a set of values**. Use the `enum` keyword to specify a finite set of acceptable values for a property. This ensures that only predefined options are valid.
  
- **Define a fixed, single value**. Use the `const` keyword to force a property to have a single, fixed value. This keyword is more restrictive than `enum`. 

Learn more about how to use these keywords with the following resources:

- [Enumerated values](../../understanding-json-schema/reference/enum)
- [Constant values](../../understanding-json-schema/reference/const)

By effectively utilizing these keywords, you can significantly enhance the reliability and accuracy of your JSON data.