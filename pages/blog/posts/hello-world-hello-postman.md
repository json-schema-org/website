---
title: "Hello World, Hello Postman"
date: "2022-06-16"
tags:
  - Update
  - News
type: Community
cover: /img/posts/2022/hello-world-hello-postman/cover.webp
authors:
  - name: Julian Berman
    photo: /img/avatars/julian.webp
    twitter: JulianWasTaken
    byline: JSON Schema Test Suite Maintainer & Technical Lead, API Specifications @Postman
excerpt: "Oh hello there! A second person is now working full-time on JSON Schema."
---

Hi! I'm Julian Berman.

If you're a user of JSON Schema, you may know me as the author of [a popular Python implementation of JSON Schema](https://github.com/python-jsonschema/jsonschema). If you're an implementer of the JSON Schema specification, you may instead know me as the primary maintainer of [the cross-language JSON Schema test suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite).

I'd love to share some good news with the JSON Schema community.

In short: I've joined [Postman's](https://www.postman.com/) Open Technology team to work on JSON Schema full-time. In doing so I'm joining a growing existing group of folks from the ecosystem, including amongst them [Ben Hutton](https://www.twitter.com/relequestual), JSON Schema's specification lead. This brings the number of people working on JSON Schema full-time up to 2 (and counting!).

What does this mean? Primarily, on my part, more mindspace dedicated to JSON Schema, and hopefully thereby some long-needed improvements to the test suite, to my implementation, to new implementations, and beyond. We hope to grow the community even further, and to connect more strongly with it.

Before talking more about that, I'd love to take you through my journey to get here. It's been a fun one.

## At the Start

My connection to JSON Schema started in 2011, more than 10 years ago. I was working on a now long-forgotten web project which needed a validation layer, and stumbled across JSON Schema as something I might use to fill the need. [As is not uncommon in the programming world](https://codewithoutrules.com/2016/09/09/side-projects/), the side project became the main project, and the web application is now long-forgotten. I don't even think I remember what it was meant to do.

My first public commit of the Python `jsonschema` project was in [December of that year](https://github.com/python-jsonschema/jsonschema/commit/2c25dc77051fbdb10b7e5552f317edb72bb6bcc4).

At the time, I decided to write a Python implementation not because one didn't already exist – on the contrary, at the time in 2011, there already were one or two out there. My implementation was instead almost born out of coincidence. I was growing as a developer at the time, and starting to form opinions about what I thought good code looked like (occasionally overly strong ones). When I found some specification inconsistencies in the pre-existing implementations, it gave me an itch to write something I could "own" and learn from as a maintainer.

It wasn't long before my implementation was used by other projects, and those other projects were reaching out with issues, requests, thanks or feedback.
Hearing others appreciated my work was definitely good motivation to continue to invest effort into it.

## The Test Suite

Not long after writing my little Python library, I started what would become the [official, language-agnostic test suite for implementers of JSON Schema](https://github.com/json-schema-org/JSON-Schema-Test-Suite). For awhile I churned away on the suite, hoping it would make it easier for others to do what I'd done – to write a spec-conformant implementation of JSON Schema.

At the time, the implementations I found were each replicating their own incomplete, internal test suites. It seemed eminently beneficial to centralize the effort, giving someone authoring a library a way of running a "known" set of tests which would tell them whether their libraries were working as expected and specified.

The test suite was originally not "official" by any means. I worked on it from my own account with no real connections to the work happening on the specification itself. Graciously however, a member of the specification team at the time reached out and proactively asked me to bring it within the JSON Schema organization, while continuing to maintain it. While I wasn't surprised in the interest in such a thing, I certainly was proud of having produced something useful.

I've never been the one to drive new functionality in JSON Schema. My role instead has been more of an interpreter, taking what has been written and using the test suite to shine a light on corner cases. From early on, I was firm that the test suite wasn't a vehicle for enacting change to the specification, it was simply a representation of what the specifications already prescribed. Doing so was critical for its success (success both of the suite and the specification itself). Specifications are never perfect, and still today the JSON Schema specification continues to be improved and iterated on; nonetheless the test suite has given implementers a shared understanding of what the specification says (allowing discussions for how to improve it to carry on elsewhere).

## A Bit More Reflection & Thanks

I owe a decent amount of debt to JSON Schema as a whole. It's been with me for a very long time in my programming career thus far, and I've learned a lot through needing to maintain bits and pieces of its orbit. Maintaining a widely used library is not easy at all at times, and JSON Schema gave me a way to exercise these muscles. At times, it has moved up or down on my (long) list of interests, but never completely off it. For over 10 years I've had it somewhere in my conscious.

It's led me to serendipitous encounters sitting halfway around the world with developers who unknown to both of us had just dealt with an outage I'd caused to their internal systems by doing a release (n.b. pin your dependencies folks!). Luckily we both could crack a smile at the coincidence by that point.

I've enjoyed waking up to unexpected emails from respectable open source projects' maintainers telling me they use it, or thanking me for it when we bump into each other. I've come across important looking documents with government seals on them giving guidance on how to use the library I wrote initially as an afterthought, and couldn't help but be amused.

## What's Next

And so, proudly, it's time for JSON Schema to play a bigger part in my day-to-day. I join Postman with an expected bit of tentativeness – joining a for-profit company, one of course worries about any undue influences on direction of an open source project. I can say happily that Postman have been nothing but gracious supporters so far – of JSON Schema, of open source more broadly, and certainly of myself. The tentativeness I start with I expect to disappear quite quickly and be replaced with gratitude. There are many many knowledgeable people to both learn from and interact with here, something I think will prove to be invaluable.

As for work on JSON Schema, there are many things I've wanted to do these past few years, particularly with the test suite, that there was just never enough time to dedicate to. Hardening the suite has even more potential to help expand JSON Schema's usage than we've tapped so far. There are things about maintainership which embarrass me somewhat, as any project occasionally does to its maintainers. The glacial pull request queue is definitely up there on that list; if you're a contributor, you have my deep apologies if a pull request of yours has sat stagnant. It will be one of the things I definitely aim to fix quickly. There are of course many things I am quite proud of as well, and hope to continue doing.

Through the years I've occasionally spoken about JSON Schema at conferences or meetups, or occasionally poked my head beyond the borders of my implementation or the test suite. I intend to do more of both, and be better at it all.

And more broadly than myself, we have even bigger dreams. Stay tuned for more details there, both here on the blog as well as on the issue trackers and discussion boards throughout the organization.

Please help! Your feedback, as a user, as an implementer of the specification, or as an observer, are all likely invaluable to making sure JSON Schema moves forward. Please do reach out – to Ben, to myself, to other wonderful folks who form JSON Schema's contributors, and/or via the [JSON Schema Slack](https://json-schema.org/slack). I know we'd all love to hear feedback, things you'd like to see, constructive complaints, or general thoughts on how we can grow the community.

In particular, if you're an open source maintainer who depends on my library, or on the test suite, please introduce yourself if we don't already know each other! I'd love to hear about what either can do better for you.

Thanks for the ride so far!

Cover photo by <a href="https://unsplash.com/@jimkalligas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jim Kalligas</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>.
