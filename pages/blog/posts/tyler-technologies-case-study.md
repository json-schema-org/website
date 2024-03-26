---
title: "How Tyler Technologies reduced its client feedback loop with JSON Schema"
date: "2022-05-09"
type: Case Study
cover: /img/posts/2022/tyler-technologies-case-study/cover.webp
authors:
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    twitter: relequestual
excerpt: "Using JSON Schema at Tyler Technologies meant showing added value to clients could take minutes rather than days or in some cases weeks."
---

## Challenge

With multiple government clients, Tyler Technologies faces the continual challenge of meeting stringent differing requirements defined in law. Building custom rules for each client was very time-consuming, and Tyler Technologies were seeking to create a multi-tenancy application solution that could be customised for each client without needing custom code.

Tyler's multi-tenant application solution needed an easy way to define custom data and validation rules, giving power to the client, rather than having to make heavy investment in custom development work.

"This way we can spend our time providing business value and innovating the application instead of handling all the custom work manually." - Andres Moreno, Lead Software Engineer at Tyler Technologies.

## Solution

JSON Schema allowed Tyler Technologies to create and maintain different model definitions for each client in a simple and understandable format.

JSON Schema was chosen as a viable solution for defining data structures. Tyler found wide adoption of the standard across the industry, partial familiarity from using OpenAPI, and broadness of open-source tools providing rich functionality.

"With JSON Schema, Formly, and AJV we were able to get the functionality we needed to render and validate fields dynamically for each tenant without requiring a developer to do it!" - Andres Moreno

Formly allows for the dynamic generation of forms from JSON Schema, enabling each client to have unique forms based on their unique definitions. AJV allowed for the validation of data from those same forms on the server-side.

"We are focused on API-First development, so we needed a way to allow validation on the server-side for when our API was used directly rather than through the generated forms," Andres continued.

Further, AJV has options to take advantage of annotations such as the `default` keyword, filling in missing attributes, and optionally filtering out data not defined in the schema. These options allowed Tyler Technologies to provide additional value to customers, catering to broader requirements.

## Impact

The effort required to develop and deliver custom work for customer-specific requirements was reduced. Existing schemas can now be easily updated using APIs, without the need to wait for a full deployment cycle.

A new custom field would need to be fully identified and get approval, sent to the development team, verified by QA, and finally deployed to the production environment. "This process can span multiple days or even weeks," explains Andres.

Rather than a full development cycle and release process, updating a JSON Schema takes just a few minutes by those that know JSON Schema, dramatically reducing the time to resolution of bugs related to custom data structures.

## Key Impact Results
<Bigquote>
Showing added value to clients in minutes, rather than days or weeks.
</Bigquote>

"From what used to be a multi-day/week process, to being able to get something in front of the client within minutes," says Andres.

## Tyler Technologies

<p className="text-2xl my-10">Tyler Technologies is a leading provider of end-to-end information management solutions and services for local governments. In recent years they've been playing a key role in the digital transformation of the public sector.</p>

<div className="container flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 place-content-between mb-4">
  <figure className="group m-auto">
    <img className="flex-1 " src="/img/posts/2022/tyler-technologies-case-study/2187563_0051.webp" />
  </figure>
  <figure className="group m-auto">
    <img className="flex-1" src="/img/posts/2022/tyler-technologies-case-study/2187563_0278.webp" />
  </figure>
</div>

"We empower the public sector to create smarter, safer, and stronger communities. Our team is providing the most innovative solutions to the processes each of our customers have without reinventing the wheel; We choose to assemble instead of building everything ourselves."

Custom development work for each client is a big investment, and a more cost-effective and performant approach was required.

## Benefits in development

<p className="text-2xl my-10">"We are very confident that JSON Schema has solved the challenges that we had faced as we started these projects" - Andres Moreno</p>

Initially using Formly's proprietary configuration format to dynamically generate forms, Tyler needed validation of the resulting data on the server-side. Creating different configurations for the client-side and server-side, which needed to match, wasn't going to give Tyler the scalability they needed.

While investigating, they discovered that Formly also supported configuration using JSON Schema. The same JSON Schema could be used for validation on the client and server sides. With minimal research and prototyping, it became clear using JSON Schema was going to be useful.

After demonstrating how JSON Schema could be easily used to build an extensible application, other teams at Tyler saw the appeal of using a single configuration to both dynamically generate forms and perform validation on the submitted data.

JSON Schema is now a core concern when developing existing and new applications.

"We are very confident that JSON Schema has solved the challenges that we had faced as we started these projects. We can say with certainty that we are going to continue using JSON Schema as the core of the application for any future applications that are built using the cloud infrastructure that we have put in place," explains Andres.

Thank you to Andres Moreno, Lead Software Engineer, and Tyler Technologies, for allowing and enabling us to share this case study with you.
