---
title: "Why JSON Schema needs a Code of Conduct"
date: "2021-11-24"
tags:
  - Community
type: Community
cover: /img/posts/2021/code-of-conduct-for-json-schema/cover.webp
authors:
  - name: Ben Hutton
    photo: /img/avatars/benhutton.webp
    twitter: relequestual
    byline: JSON Schema Specification Lead @Postman
excerpt: "The community of JSON Schema is growing, and the community needs a culture for interactions to avoid past mistakes."
---

If the JSON Schema project had a Code of Conduct in the early days, I suspect we would be years ahead of where we are today. It may seem unlikely, and you may feel like you rarely see a code of conduct in action, but having a Code of Conduct lays some foundational expectations from contributors. You could argue that you shouldn't NEED a Code of Conduct, that people should use common sense and be nice... but it's not so clear cut. Let me explain.

## My culture is not your culture

Star Trek fans will no doubt be well aware of the "Prime Directive". For the rest of us, the Prime Directive is a top priority general order to not interfere with other cultures and civilizations. The theory goes, humans are more likely to have a disastrous effect regardless of the intent because cultures can be very different.

While the failure of an open-source project is unlikely to cause the collapse of another civilization in our reality, the general principle still applies; You cannot presume to know the culture of others. What is normal or acceptable in one culture is not in another.

How do these concepts translate from fiction to reality? While there are many extreme examples, one TV advert always stuck with me as a good example of cultural differences causing undesirable results.

The advert depicts an English man sitting down for a meal with 10 or so Chinese businessmen. The English man orders an eel, possibly by mistake as he looks worried, but eats the whole thing. The voiceover says, "The English believe it's a slur on your host's food if you don't clear your plate, whereas the Chinese feel you're questioning my generosity if you do." The restaurant brings out another eel, this time much larger.

This advert was one of a series published for HSBC, highlighting the importance of "local knowledge". While it makes a nice soundbite, it is a good demonstration of different cultural norms and expectations.

## Communication is mostly non-verbal

Avoiding cultural clashes is even harder when using mostly text to communicate. Experts estimate that only 7% of how we communicate is by using the meaning of the words we use. That leaves 93% attributes to tone and body language. Wow.

When you communicate through text with people you usually communicate with in person, it's usually not difficult to fill in for the lack of tone. But, when you've never met or seen the person you're interacting with, you have no reference or basis to make assumptions. What sometimes happens is we fill in those missing parts to draw our own conclusions, which may not match the intent.

So how should an open-source project on GitHub avoid cultural clashes and misunderstandings?

Emojis can help increase the likelihood of understanding the correct intent, as they can convey tonal and emotional implications. Increasing the level of understanding and intent certainly helps avoid misunderstandings, but this isn't always going to help with cultural differences.

## Our culture and colloquial language

It's easy to forget how much culture affects how we interact every day. "Shaka, when the walls fell." You might recognize this as a quote from StarTrek. Imagine you land on a planet and you have a universal translator, but the words just don't make any sense. In this fictional situation, the alien language only uses colloquialisms; phrases that have meaning beyond the words used.

We find colloquialisms in one language which are nonsensical to most others. Many of you will find yourself part of various internet cultures, and these too will have their own colloquialisms. With images being a way we can communicate online, we've built visual colloquial language, which we call memes.

What I'm implying here is that we can, and do, create our own cultures, and that's OK. We as JSON Schema chose to adopt the Contributor Covenant for [several reasons](https://github.com/json-schema-org/community/blob/main/docs/adr/2021-08-26-code-of-conduct.md), and this sets our cultural tone. It defines how we should interact, and what our expectations should be when we interact. In addition to the Contributor Covenant, we continue to keep the IETF Guidelines for Conduct (BCP 54), creating our own Code of Conduct.

## Why a Code of Conduct?

We've explored that cultural differences can make it hard to understand intent. But, even if the intent is clear, sometimes specific conduct can be unwelcome.

With open-source, people come and go. The people who were super helpful today may be busy tomorrow... or de-prioritise a specific project for years. Aside from making people feel welcome to be nice, it makes good sense in terms of developing and maintaining the project long term. People are more likely to stay if they continue to feel welcomed and valued.

Some get involved because it's their job, some because it's fun and rewarding. Some are lucky enough to be able to combine those two aspects. But whatever your reason, we want open source to be a positive experience.

While I often suggest people avoid making assumptions, when your communication is limited, you have to make some assumptions or ask for clarification. However, a Code of Conduct allows you to frame your interactions with expectations. "If a comment reads bad, but I assume their intent was good, can I understand the likely meaning differently?"

Beyond setting the expectations of good interactions, there is conduct we (agreeing with the Contributor Covenant) defined as not acceptable such as public or private harassment. While it's hard to imagine a culture where that would be acceptable, there are some cultural norms and expectations that are totally unacceptable in many cultures.

The Contributor Covenant makes clear the expectations in the form of a pledge and provides examples of meeting those expectations, but it doesn't give any specific hard rules for working (how to do "business"). CBP 54 does give some clear expectations, such as how we should work: "We dispute ideas by using reasoned argument rather than through intimidation or personal attack."

We feel the combination we presented and agreed upon in full view and comment from the community aligns with our expectations, and we hope you agree. If that changes or your opinions differ, we will gladly hear them, and try to understand. This is part of what consensus building looks like, some of which is set out in CBP 54.

Our choice for the Code of Conduct was partly based on the document's reputation and existing usage. The Contributors Covenant has been adopted by many projects and organizations and has undergone several revisions. It has been developed and updated by many with much experience and knowledge of code of conducts, which is something we can't say for anyone in our team.

## What if we just... did nothing?

Without getting too philosophical, humans seem to often find conflict even when full communication is possible. It's almost inevitable that with text-only communication, there are going to be some misunderstandings, and that drives conflict.

JSON Schema as a project previously stalled because the core team (as much as I can tell) had [differing expectations](https://github.com/json-schema/json-schema/issues/52). Discussions got heated. Tempers were raised. There was no default laid expectation to frame potential misunderstandings. There was no framework for resolving or remediating conflicts.

Right now, there is a fair amount of fragmentation of JSON Schema tooling and version support. We are actively trying to help ease the issue, but my feeling is this only came about where the specification development stopped. If it had continued, and those projects and tools had been supported, we might have found ourselves in an easier situation.

We've lost knowledge. We're trying to capture knowledge and decision reasoning moving forward, but there are some things we just simply don't know, and likely now never will. Key people of the previous team that worked on JSON Schema seem to have stepped away from any public open-source work. It may be a coincidence, but based on very public arguments, I suspect not.

When we frame our interactions with expectations, we give the benefit of the doubt. With an increasingly wide user base, we have to expect contributors may not have English as their first language, making graceful interpretation increasingly important.

One strength of JSON Schema is the ability to use any compliant implementation, and swap out one for another with minimal effort if needed. Do others need to use the schema in another programming language? No problem. That's great for validation, but what about generating types or classes? What about UI generation and database generation? What about generating documentation?

Having fixed many problems and inconsistencies, developed many new features, and re-established active development of JSON Schema, the legitimacy and trust of the project are growing. We are now interacting with and guiding several initiatives to define standardized extensions to JSON Schema. Standardized to ensure interoperability.

As our community grows, so must our approach with which we engage with our community, and our expectations. Establishing a Code of Conduct is just one of several initiatives that seek to elevate JSON Schema from being an unsung silent hero, into the legitimate, established, and well used critical standard we know it can be. We must learn from our history if we don't want to repeat its mistakes.

## How do I get involved?

We recently updated our homepage to include a few links to our active community and regular activities, but let's recap here anyway.

The majority of our discussions happen on our [open slack server](https://json-schema.org/slack). Our general channel is for all discussions, including those looking for help. We have other channels for specification development and implementers, the official test suite, even for monitoring GitHub and StackOverflow activity. It's our central hub. But, it is ephemeral, and we lose access to older messages (a limitation of the free account).

The more long-living and searchable location for activity and discussion is now our [GitHub Discussions](https://github.com/json-schema-org/community/discussions). Currently, these are limited to our community repository, but we plan to open these up across other repositories later.

Currently, there are two sets of regular calls we hold.

First is our [JSON Schema Office Hours](https://github.com/json-schema-org/community/discussions/34); an hour every week at the same time where anyone can come and ask questions or just discuss anything JSON Schema related. It has seen low traffic, but it sends an important signal to our community: "We're here to help you as much as we can." Every Tuesday at 15:00 UTC.

Second is our [Open Community Working Meetings](https://github.com/json-schema-org/community/discussions/35). For these we alternate between times; First Friday of the month at 20:00 UTC, third Friday of the month at 14:00 UTC. This enables the calls to be open to a broader audience. These meetings have a semi-formal agenda and serve as a call to action to gather feedback and thoughts on key decisions and to progress work that needs to be done. We always make sure we capture the resulting action items and follow up in the next session.

Both sets of calls are open for anyone to join. Both are recorded, but only the Open Community Working Meeting is shared publicly. The Office Hours session is not shared, hopefully allowing people to speak more freely.

Besides Slack, GitHub Discussions, and regular meetings, we do make use of Twitter. You can find me running the [@jsonschema account](https://www.twitter.com/jsonschema). Any mention of "JSON Schema" feeds into a channel on Slack, so we see most of the discussion, and can lend a hand or point people in a direction as appropriate.

Hopefully, this has been a helpful look at why JSON Schema specifically needs a Code of Conduct. Maybe you're considering if your project needs a Code of Conduct. If you have any questions, thoughts, or comments as a result of this article, please feel free to use any of the above methods to make contact.

Image by <a href="https://pixabay.com/users/broesis-5213623/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2366955">Maike und Björn Bröskamp</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2366955">Pixabay</a>
