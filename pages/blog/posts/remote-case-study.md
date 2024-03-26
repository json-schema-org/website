---
title: "Using JSON Schema at Remote to scale forms and data validations"
date: "2023-05-06"
type: Case Study
cover: /img/posts/2023/remote-case-study/cover.webp
authors:
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    link: https://www.twitter.com/relequestual
excerpt: "Using JSON Schema at Remote was the first step to solving data validation and form generation problems across all levels at Remote."
---

## Challenge

Forms. Legal forms, employment forms, salary forms, all the forms! Hiring from many different countries creates many different requirements, and Remote has to handle them all. Continually evolving laws and regulations in one country is enough to keep up with, let alone close to 100 countries!

"Imagine wanting to hire someone in Argentina, Germany, and Nigeria. Those are all incredibly different countries with different laws and requirements, and we have to handle all of them." - Sandrina Pereira, Staff Frontend Engineer at Remote.com.

<figure class="mt-10">
  <img src="/img/posts/2023/remote-case-study/Remote-Contract details.webp"/>
  <figcaption class="mt-2 mb-10 text-sm text-center text-gray-500">One of the onboarding forms for Netherlands, among more than 500 unique forms to all the countries.</figcaption>
</figure>

When Remote first started,  the company only covered a handful of countries with a few specific forms per country. Scaling to hundreds of country forms with complex requirements is impressive. Did you even realize that the working hours and weekend days are different across countries and employment types? In some countries, the weekend is Friday and Saturday. And there are many other types of schedules besides the traditional 9 to 5. Getting that wrong for someone's salary payment could have huge implications.

Managing and maintaining hardcoded forms in full HTML format (or even frontend components), wasn't going to be viable for the scaling Remote wanted.

"Our hardcoded solution was blocking us from scaling our business. Duplicated code, inconsistent server/client validations, huge JavaScript bundles…" explains Sandrina.

Remote needed a way to configure forms on the server side to be used by the Remote API, including centralized validations that could be shared between the server and the client.

## Solution

JSON Schema was designed specifically for JSON data validation, but that hasn't stopped emergent use cases. While there are several form generation libraries that take JSON Schema as their input, Remote wanted to have total control, and needed the freedom to evolve the solution as required.

"All of that is now being solved with JSON Schemas," continued Sandrina. They worked on JSON Schema for forms and validation initially in their Development Foundations team, and later as part of the company's "Onboarding" vertical. Their onboarding process, which requires a lot of data, has to be the best experience possible to avoid incompletion, without compromising data safety or accuracy.

Remote decided to create their [own form generation tool](https://remote.com/blog/json-schema-forms-guide), allowing them to layer on additional custom keywords in JSON Schema related to the presentation of form fields as needed. "After deep research with proof of concepts, taking into account the critical nature of forms in our core product, we decided to take a leap of faith… " The first version of this library has very recently been open-sourced, so you can try it today! Go check [@remoteoss/json-schema-form](https://github.com/remoteoss/json-schema-form)!

<figure class="mt-10">
  <img class="rounded-lg" src="/img/posts/2023/remote-case-study/blog-image.webp"/>
  <figcaption class="mt-2 mb-10 text-sm text-center text-gray-500">Diagram of how JSON Schema integrates with the server and client.</figcaption>
</figure>

Data doesn't just come via forms though, but also through APIs, which usually includes third parties. "We started this journey as part of the Remote API, a horizontal tool by itself. Gradually it will affect every area of Remote. Ultimately our vision is to have every form that talks to our API powered by a 'headless form' on top of JSON Schemas," Sandrina explains. Getting data boundaries right can be hard, but it pays to do the work. Having the validation on the server reusing it on the client, not only simplifies the development, but also reduces attack surface in terms of security.

As with adding any new technology to your stack, you must critically evaluate if it will be viable long term, and how flexible it will be for any changes in your existing stack. Sandrina and her colleagues did their research…

"Although JSON Schema is not an "official standard", seeing big players adopting and contributing to its maturity is a big point of trust for us. JSON Schema is in active development by its strong community, with a high adoption rate by many companies, including mature libraries in many languages, as the ones we use: JavaScript and Elixir."

<p className="text-2xl my-10">"When looking for a way to describe and validate JSON objects, there was no other solid alternative. JSON Schema was adopted with confidence." - Sandrina Pereira, Staff Frontend Engineer at Remote.com.</p>

## Impact

Using JSON Schema as the SSoT (Single Source of Truth) unlocked a lot of potential. "JSON Schemas were the first step to solving data validation and form generation problems across all levels at Remote," explains Sandrina.

Once you start with JSON Schema, it's not uncommon to discover multiple uses. Remote creates JSON Schemas on the server and uses them to validate API payloads, run periodic validation reports (based on legal requirements), and auto-complete in code. Additionally, the client consumes these schemas to generate visual representations such as forms and tables.

Armed with the SSoT, Remote sees reduced time to create and maintain forms, but also a measurable reduction in support tickets related to inconsistent data and incorrect validation. Most importantly for Remote, they also reduced the time to onboard new international employees and contractors. While other improvements were made at the same time as integrating JSON Schema, they were confident JSON Schema was pivotal.

## Key Impact Results

Adapt and evolve at a large scale, providing services quicker, and onboarding from weeks to days. Here's a list of the biggest results so far:

- Shared validations between the server and client
- Reduced JS bundles and code duplication, replaced by API requests
- Reduced number of tickets reporting inconsistent validations.
- Conclude tickets much quicker
- Create and maintain forms more easily
- Opened the doors to allow the Internal Operations team to build the forms themselves

"JSON Schemas are the connector to keep our data accurate on a large scale, speeding up many of our provided services to our customers. In some cases, the time taken to implement the forms for a new country was reduced from weeks to just a couple of days."

## Remote - The Company

<p className="text-2xl my-10">Remote makes it easy to onboard and pay your international employees and contractors. Remote is a global, fully distributed company in the Human Resources industry, with no physical offices. "Our employees are free to work from their chosen locations around the world!"</p>

Sandrina Pereira: "I'm a Staff Frontend Engineer working in the Onboarding vertical, and we are the ones who have the biggest and more dynamic forms that carry all the data needed to hire new people." Without question, a critical position to enable the value proposition Remote offers.

With many companies having had to provide a means to work remotely where possible, why limit the talent pool to one geographical location?

Remote wants to empower employees too: "Talent is everywhere, but opportunities aren't. Remote makes it possible for employers to hire anybody from anywhere, to present access to opportunities for anyone, to ultimately make better lives for themselves." These are not just words for Remote.

In 2021, Remote launched their [Refugee program](https://remote.com/news/en-GLO/208556-announcing-remote-for-refugees), enabling employers to invest in a cost effective way, while also helping refugees rebuild their lives. Remote has also set up [dedicated resources for displaced Ukrainians](https://remotecom.notion.site/Remote-for-Ukrainians-b9cf24e00ef145b1b96cd3cca919c9b2).

Remote raised a $300 million Round C in 2022, at a validation of over $3 billion.


## Further Benefits

<p className="text-2xl my-10">"JSON Schemas is bringing us data consistency (annotation) and data security (server validations)." - Sandrina Pereira, Staff Frontend Engineer at Remote.com.</p>

Having migrated some core parts of the business, Remote followed to create an interface allowing Operations teams to edit forms themselves, stored as JSON Schema to benefit from validation. Static JSON Schema files have served them well, but ultimately they needed to be able to react faster to change.

<figure class="mt-10">
  <img class="rounded-lg" src="/img/posts/2023/remote-case-study/Remote-Form builder.webp"/>
  <figcaption class="mt-2 mb-10 text-sm text-center text-gray-500">Backoffice tool to build the Country Forms, powered by JSON Schema.</figcaption>
</figure>

Knowledge sharing has also benefited from JSON Schema, with Remote revamping their Knowledge Base. Country specific data such as supported VISA options and onboarding timelines, can be encoded into a data structure, which in turn can be validated both on the server and client side.

Initially unsure how far JSON Schema could go, and despite Remote pushing the barrier of what JSON Schema can do, it has proven to have an important impact on Remote's ability to scale.

"JSON Schema has proven its value as part of our core tooling ecosystem to validate data and generate its visual representations, such as forms and tables, which are a fundamental piece to take our services to a large-scale without compromising accuracy, speed, and most importantly, customer happiness!" We are glad you've found value in JSON Schema Sandrina! Long may it continue.

Thank you to [Sandrina Pereira](https://www.linkedin.com/in/sandrina-p), Staff Frontend Engineer, and [Remote.com](https://remote.com), for allowing and enabling us to share this case study with you. Sandrina would also like to acknowledge and thank her colleagues who kicked-off this journey more than a year ago: [André Albuquerque](https://pt.linkedin.com/in/amalbuquerque), [António Capelo](https://www.linkedin.com/in/antoniocapelo/), [António Silva](https://www.linkedin.com/in/antonio-silva-0a6a72b4/), [Livia Barbosa](https://www.linkedin.com/in/liviaab/), and [João Almeida](https://www.linkedin.com/in/engjoaoalmeida/).
