---
title: "And Then There Were Three"
date: "2022-06-23"
tags:
  - Update
  - News
type: Community
cover: /img/posts/2022/and-then-there-were-three/cover.webp
authors:
  - name: Greg Dennis
    photo: /img/avatars/gregsdennis.webp
    link: https://www.linkedin.com/in/gregdennis/
    byline: JSON Tooling Implementer, Specification & Tooling Architect @Postman
excerpt: "More full-time contributors is better, right?"
---

Hi, everybody!

I'm Greg Dennis.  I'm the author of [`json-everything`](https://github.com/gregsdennis/json-everything), which aims to be an all-encompassing tool suite for JSON needs in .Net, including JSON Path, JSON Patch, and (of course) JSON Schema, amongst others.  I'm also responsible for driving and authoring the output requirements in the JSON Schema specification.

Piggybacking on [Julian's news](hello-world-hello-postman), I'm also joining Postman to work on JSON Schema full time as a Specification & Tooling Architect!  This means that I will be working on updating the specification as well as helping define and implement validation and other JSON-Schema-adjacent tooling.  I also expect to be highly involved in the community by supporting other tooling implementors.

## Being Involved

JSON Schema has always been a passion project for me.  I didn't really see it at work\*, and I never had a problem for which JSON Schema was the solution.  Nevertheless, I recognized its potential that it _could_ be the solution other people needed, and I wanted to contribute by giving them an easy adoption path.

\* *I have primarily worked in the .Net world, where there are a lot of other data validation tools, most of which are built into the framework and centered around deserialization.  However, with the popularity of JSON Schema growing (especially around code generation), we could find a proper place for it in .Net soon.*

I first became involved with JSON Schema in 2015 when I was looking for JSON-related functionality to implement in my library, Manatee.Json.  I liked the ability to validate JSON data, and I especially liked that the validation requirements themselves could be represented in JSON.

At that time, Draft 4 had been available for a couple years, and the project was just starting to be picked up again after having been nearly abandoned.  Although I didn't know it then, I kind of just stumbled upon the project at the right time.  I started reading through some of the open issues, commenting on a few, and I joined the Slack workspace.

It soon became apparent that I wasn't going away, and I was invited to contribute as a core member of the team.  I spent my spare time discussing changes and new features, while trying to balance how helpful or easy to use a particular feature would be to JSON Schema users (primarily schema authors) against how hard that feature would be to implement.

Since then, I have contributed to countless discussions, commented on alterations to the specification, and even made a few authorship contributions of my own, including the aforementioned section on output formatting.

I've learned a lot from my involvement with JSON Schema.

Most significantly, having a focus on interoperability has opened my eyes to the needs of programming languages and frameworks that I haven't used.  Working primarily in C-based languages, I had never considered that different programming languages could actually _do_ different things.  Previous to my experience here, I had thought different languages all provided the same set of functionality, the only difference being that some made certain tasks easier.

I've also learned that JSON Schema is used for a lot more than just validation: hyperschema, code generation, and form generation are primary examples.  The diversity of application really makes JSON Schema a great concept.

## Being an Implementor

I've had two libraries (so far) that implement JSON Schema.

[Manatee.Json](https://www.nuget.org/packages/Manatee.Json) was the first, and it was half a learning platform for me to develop my coding skills and half intended to actually be useful to people.  It wasn't fast by any stretch of the imagination (I later found out that it was just my home-brew parsing that was slow), but it was accurate to the specification, and it had done moderately well in the nuget.org download stats.  At the time of this writing, it continues to be downloaded 300 times per day and has reached 1 million downloads despite it being deprecated for two years.

The second library, [JsonSchema.Net](https://www.nuget.org/packages/JsonSchema.Net), released in 2020, aims to be a more practical production-use library.  I created it as a JSON Schema companion to .Net's new built-in `System.Text.Json` parser/serializer, which was released in 2019.  In the two years that it's been available, it has amassed almost 450K downloads at about 670 per day.

JsonSchema.Net also has several "expansion pack" libraries that provide additional functionality, such as schema generation from .Net code, data generation from a schema, and two vocabularies that I wrote to address a couple open GitHub issues on the specification repository: external data access and identifying item uniqueness within arrays by specified keys.

I always keep an eye out for other extended uses for JSON Schema (and JSON in general) to add to the suite, and now I have more time to do it!

## Being an Employee

Last year, when Ben announced he was joining Postman to work on JSON Schema full time, I had reservations about the direction of the project.  Was Postman looking to own the project?  What would that mean for its future or for our ability (as volunteer contributors) to enact changes?

Ben's response was incredible and perfect:  he championed JSON Schema joining the OpenJS Foundation, cementing its independence.  And that he did it while being a Postman employee was reassurance that Postman was in it for the betterment of the open source community.

Then business carried on as usual.  We were all working hard toward the release of an editorial, non-functional patch release for 2020-12 (now released!), and Ben found that he needed some more dedicated help.  So in Slack DMs, he asked me if I would be interested in joining up.  Even though I was just getting settled in at a new company, I couldn't let this opportunity pass me by.  Getting paid to work on a passion project is the dream!

And now, I'm extremely excited to announce that I'm joining Postman Open Technologies as a Specification & Tooling Architect.  I will have three focuses: work on the JSON Schema specification, support for its implementors, and development support of adjacent uses.

To start with the specification, the output format will continue to be a primary focus for me.  Earlier this year, I opened a [discussion](https://github.com/orgs/json-schema-org/discussions/63) on potential improvements.  I think that we're in a good place, and I need to start creating PRs that move the current language in the specification to the new design.

I'm not sure yet what implementor support will look like, but based on our [implementations page](https://json-schema.org/implementations.html), it seems that many of them haven't updated to supporting 2020-12 yet.  Outreach is probably the best place to start here.  We need to find out the status of each of these projects.  Are they still maintained?  Do they _intend_ to stay up-to-date with the specification?  Do they need help?  Answering these questions will be the first step.

And finally adjacent tooling.  I'm really excited about this part because it will highlight for me how JSON Schema is being used in the real world, thereby _validating_ (ha!) its usefulness.

I'm really excited about the opportunity that Postman has given me to work full time on a project that I love and its adjacency, and I foresee a bright future for this project and the community that continues to support and build it.

Thank you to everyone I've met on this journey, used my libraries, asked questions, contributed code, or just offered opinions!  I love being a part of this community!

Cover photo by me 😁
