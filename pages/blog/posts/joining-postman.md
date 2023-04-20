---
title: "Joining Postman"
date: "2022-07-03"
tags:
  - Update
  - News
type: Community
cover: /img/posts/2022/joining-postman/baldy-hs-web.webp
authors:
  - name: Jason Desrosiers
    photo: /img/avatars/jasondesrosiers.jpeg
    twitter: jasondesrosiers
    byline: JSON Specification & Tooling Architect
excerpt: "In the last couple of weeks, you may have seen that Postman has been investing
heavily in JSON Schema's future by hiring some of its top contributors giving
them the opportunity to work full time on improving the JSON Schema
specification and tooling ecosystem. I'm happy to announce that I'm the next
addition to that team."
---

In the last couple of weeks, you may have seen that Postman has been investing
heavily in JSON Schema's future by hiring some of its top contributors giving
them the opportunity to work full time on improving the JSON Schema
specification and tooling ecosystem. I'm happy to announce that I'm the next
addition to that team.

JSON Schema has always been a small group of volunteers working in their free
time with no financial support for their work. Thanks to Postman, we now have a
team of four that has the financial support and creative freedom to focus on the
projects and goals we never had time for in the past. I'm excited to see what
this team can achieve in the next couple years.

When Postman hired Ben Hutton last year to work full time on JSON Schema, there
was some concern within our community that Postman might try to own or influence
the evolution of JSON Schema in someway the way we often see with certain big
companies having undue influence on web standards today. Fortunately, this
hasn't been the case with Postman and none of us who have joined in the past
month would have joined if it were. Postman is just making it possible for us to
put more time and effort into doing what we've been doing for years.

## Background

I discovered JSON Schema around 2013 when draft-04 was new. I was designing APIs
and I was doing a deep dive on REST and hypermedia. I discovered JSON
Hyper-Schema and it's unique approach to hypermedia allowed me to introduce
hypermedia to APIs in an unobtrusive way and express relationships that weren't
possible with other approaches. But, the biggest win was that using a JSON
Hyper-Schema implementation called Jsonary along with some basic hand rolled
tooling, I could design APIs in a interactive way. I could try out workflows by
clicking links and filling out forms before we invested in building anything
out. It was API first design before it had a name.

Around 2015-ish, I started contributing to specification discussions and
supporting the community through StackOverflow where I'm the all time top
answerer of JSON Schema questions. For a while I was too busy with other
obligations necessary for paying bills to be as involved as much as I wanted to
be. But, a couple years ago I managed to transition to doing consulting part
time with the goal of doing work to pay the bills when necessary and spending as
much time as I could afford on things that bring me joy like working on JSON
Schema.

During that time I decided to work on a JSON Hyper-Schema implementation. I was
hoping to make use of an existing validation library and build a JSON
Hyper-Schema client on top of it, but nothing existed that was capable of that.
I ended up writing my own validation implementation which became one of the
first 2019-09 implementations. The goal of this implementation was to be a set
of tools to create JSON Schema related libraries. The validation implementation
was just a proof of concept of something you can create with these tools.
Eventually, I'll get back to actually implementing that JSON Hyper-Schema
client.

## Goals

Now that I can focus full time on JSON Schema, I have many goals. The following
are my top three objectives at the moment, but who knows how the winds will
change and priorities will shift over time.

My first priority is to get the `application/schema+json` media type registered
with IANA. It's been used for years in many applications and it's about time it
was officially recognized and defined. This is a unique challenge because of how
much JSON Schema has evolved over the years and will evolve in the years to
come. Whatever we end up with needs to be inclusive of past and future JSON
Schema.

Another goal is to complete the updates to the Understanding JSON Schema
documentation. Because the JSON Schema community was unfunded and limited to
contributing in our free time, things like documentation usually didn't get the
attention it deserved. Last year I began an effort to update the documentation
to cover the most recent two (!) drafts that had gone undocumented. I got most
of the way through it, but there are a few things like dynamic references
and the vocabulary system that I didn't get to before I had to take a consulting
gig and make some money.

As I said before, I'm a huge fan of JSON Hyper-Schema. Due to not having
sufficient resources and lack of adoption, we've paused work on the JSON
Hyper-Schema specification. Now that I'm able to work on JSON Schema full time,
I want to bring JSON Hyper-Schema (or something like it) back. This is a big job
that above all needs tooling developed so people can see how powerful it can be.

## Personal

Since this is something of an introduction post, I guess I should include some
personal trivia as well. I live in San Luis Obispo, California. When I'm not at
a keyboard you'll probably find me hiking and/or camping deep in the mountains,
rock climbing, or coaching gymnastics. The cover image for this post is me doing
a handstand at the summit of Mt Baldy in Southern California.
