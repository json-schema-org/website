---
title: "JSON Schema deduplicated complex logic and validation at Cookpad"
date: "2021-12-09"
type: Case Study
cover: /img/posts/2021/cookpad-case-study/cover.webp
authors:
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    twitter: relequestual
excerpt: "Using JSON Schema at Cookpad improved the accuracy and experience when registering products, and has greatly reduced the operational burden of product screening."
language: en
translations:
  en: cookpad-case-study-en
  jp: cookpad-case-study-jp
---

## Challenge

Cookpad Mart is one of the new businesses that Cookpad Inc. is focusing on. It is an e-commerce platform that mainly deals with fresh food, and retailers in the city and local producers participate in Cookpad Mart as sellers. Dedicated refrigerators are installed as pick-up locations for users in various places such as convenience stores, drug stores, train stations, and condominiums. Users can place orders from the app and receive fresh food from the refrigerator.

Cookpad Mart was developing a management screen for sellers that provided functions for sellers to register products and perform daily shipping operations.

"It is necessary to enter different types of data depending on the type and state of the product, but which information should be manually entered from the form in which all items are listed? It is very difficult to judge each time," says Kenshi Shiode, Engineer, Cookpad Mart Team. There was a need for a mechanism to sort out appropriate forms according to the type and condition of the product.

In addition, it is not possible to completely prevent the registration of invalid data simply by controlling the distribution of forms on the front-end.
Although in-house operation members perform product screening before the product starts selling, it is desirable that the product is registered after being validated on the back-end side in order to avoid the burden of product screening and mistakes.

## Solution

The team considered using custom code to generate complicated forms, but were concerned about consistent validation in the browser and on the server side. In looking to create a common Schema, JSON Schema was chosen as the mechanism. "We decided to introduce JSON Schema as a mechanism that can separate and validate complicated forms," says Kenshi.

## Impact

JSON Schema has improved the accuracy and experience when registering products, and has greatly reduced the operational burden of product screening.

Using JSON Schema has reduced the burden of changing requirements. "Even if new requirements increase in the future, it can be solved by simply updating the JSON Schema definition, and validation of the form distribution control logic on the front-end side and validation on the back-end side can be easily performed," says Kenshi.

## Key Impact Results

<Bigquote>
  From 10% of submissions being deficient, to zero.
</Bigquote>

"Previously, about 10% of newly registered products had incomplete input of quality assurance items, but with the introduction of JSON Schema, there are no deficiencies in the quality assurance items," says Kenshi.

## About Cookpad Inc.

<p className="text-2xl my-10">Cookpad is a global recipe sharing platform, boasting an average of 100 million people every month across the world, spanning 76 countries, supporting 34 languages, and boasting more than 5.5 million shared recipes. It is the largest recipe sharing service in Japan.</p>

<div className="container flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 place-content-between">
  <figure className="group m-auto">
    <img className="flex-1" src="/img/posts/2021/cookpad-case-study/fridge.webp" />
    <figcaption className="absolute text-2xl -mt-9 px-4 bg-gray-600 bg-opacity-50">
        <span className="text-white">Cookpad Mart Fridges</span>
    </figcaption>
  </figure>
  <figure className="group m-auto">
    <img className="flex-1" src="/img/posts/2021/cookpad-case-study/office.webp" />
    <figcaption className="absolute text-2xl -mt-9 px-4 bg-gray-600 bg-opacity-50">
        <span className="text-white">Cookpad Offices</span>
    </figcaption>
  </figure>
</div>

As a tech company, they work to "make everyday cooking fun". They believe that cooking is the key to a happier and healthier life for people, communities and the planet. Providing easier access to fresh quality ingredients enables better cooking, which is where Cookpad Mart has an impact.

"Delicious things while they are delicious" is one of the primary thoughts of Cookpad Mart, looking to connect customers more directly with producers. Fresh ingredients, recommendations, and recipes, make for an appealing proposition. "The crispy and elastic texture and the dripping milky texture are the real pleasures of fresh mozzarella," reads one example product.

High quality ingredients that come from small producers tend to be difficult to find in the general market, making the most sensible approach to be mostly self-service listing. While Cookpad Mart operates in a limited area for now, the ability to scale and reduce manual review and approval is important, in addition to enabling customers to get the freshest ingredients.

## Benefits in development

"We thought that we should use the same logic for backend and frontend applications. At first we thought about creating our own custom JSON Structure, but we had to write many `if` statements, and I do not want to imagine!"

<Bigquote>
"JSON Schema helps us to implement backend validation and frontend form generation easily. It was quite an excellent experience!" explains Kenshi, estimating that time spent building validation has been cut in half as a result of using JSON Schema.
</Bigquote>

One mantra developers often hear is DRY: 'don't repeat yourself'. "We could focus ONLY on JSON Schema definitions and everything has been automatically generated and applied," says Kenshi, "That was an excellent moment." Reducing duplication of logic reduces the likelihood of a mismatch in expectations between the client and server side.

While AI is often compared to many `if` statements, experienced application developers usually seek to reduce complexity and therefore risk. Reducing complexity by removing many conditional blocks has made code reviews easier, and even had a positive impact on continuing maintenance tasks. "Engineers would like to reduce "if" statements as much as possible I think," quips Kenshi.

Many JSON Schemas we see are kept quite simple, but there's a lot of power on offer for those willing to read the documentation. "I was really astonished with the vocabulary of JSON Schema," Kenshi continues, "There are not only simple expressions like type and length, but also complex expressions like `oneOf` and even `If-Then-Else`."

Conditional validation is new when you consider the long life of JSON Schema. Once you unlock the understanding of the multiple approaches to applying subschemas, composition can be satisfying and powerful. "When I found the rich vocabulary prepared by JSON Schema, I felt confident to use JSON Schema. Very nice!" We happen to agree, Kenshi!

Thank you to Kenshi Shiode, Engineer, and Cookpad, for allowing and enabling us to share this case study with you.

Note:
Some parts of this case study are originally located in a blog posting by Cookpad, located at https://techlife.cookpad.com/entry/mart-json-schema. Used with permission.
