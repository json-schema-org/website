---
title: Astonishing Serializations & Schemas of Hyperborea
date: "2022-05-18"
tags: []
type: Engineering
cover: /img/posts/2022/hyperborea/cover.jpg
authors:
  - name: Yanick Champoux
    photo: /img/avatars/yanick.jpg
    twitter: yenzie
    byline: Necrohacker
excerpt: Using JSON Schema for validating role-playing character sheets.
canonicalLink: https://techblog.babyl.ca/entry/hyperborea-character
---

> Originally published at [techblog.babyl.ca](https://techblog.babyl.ca/entry/hyperborea-character).

For the last two years I am part of a band of intrepid
adventurers joining forces every Thursday night via the teleporting magic of Discords, semi-arguably doing our best
not to die horrible deaths in the raucously unforgiving world
of [Astonishing Swordsmen and Sorcerers of Hyperborea][assh],
a pulpy cousin of Dungeons & Dragons. The game is orchestrated
by evil dungeon mastermind [Gizmo Mathboy][gizmo], and it's a massive amount
of fun.

But the world of Hyperborea is not only besieged by monsters. Oh no. It is also
a realm filled with rules, and statistics, and all manners of fate-defining
dice rolls. And of the nexus capturing a lot of those arcane laws is --
unsurprising to all savvy to the genre -- the character sheet.

Being good little nerds, we usually do a good job of keeping the character
sheets up-to-date. But we're all fallible creatures; mistakes creep in. Which
made me think... surely there are ways to automate some validations on those
character sheets. In fact, we already keep our sheets as [YAML][yaml]
documents. [JSON Schemas][jsonschema] can totally be used to define document
schemas... surely it could twisted a little bit more to accommodate the exotic
logic of a game?

The answer is that, of *course*, everything can be twisted provided the spell is dark
enough. This blog entry and its associated [project repository][repo], while not
an exhaustive solution (yet), is intended to the goodies that JSON
Schema could bring to the table, as well as the tools of the ecosystem.

So... Interested, fellow adventurers? Then gird those loins, sheath those blades,
and follow me: into the JSON Schema jungle we go!

## Preparing the ground

First, let's introduce the core tools I'll be using for this project.

For all
things JSON Schema, we'll be using [ajv][ajv] (and [ajv-cli][ajv-cli] for cli
interactions). It's a fast, robust implementation of the JSON Schema
specs with a lot of bonus features, and to ice the cake it provides an easy
mechanism to add custom validation keywords, something we'll abuse before
long.

And since we'll do a lot of command-line stuff, I'll bring in [Task][task],
a YAML-based task runner -- basically `Makefile` with the insane
whitespace-based syntax replaced by, uh, a different insane
whitespace-based syntax I'm comfortable with.

Incidentally, the final form of all the code I'm going to discuss
in this article is in [this repo][repo].

## JSON is the worst

Okay, that's overly mean. JSON is a great serialization format, but it's
a soulless drag to edit manually. But that's not much of a problem, as `JSON Schema`
is kind of a misnomer: both the target documents and the schemas themselves
are ultimately just plain old data structure -- JSON just happens to be
the typical serialization for it. Well, typical be damned, we'll go with
YAML as our source. And for convenience for the other pieces to come,
we'll convert those YAML documents to JSON via [transerialize][].

```yaml
# in Taskfile.yml
tasks:
    schemas: fd -e yml -p ./schemas-yaml -x task schema SCHEMA='{}'

    schema:
        vars:
            DEST:
                sh: echo {{.SCHEMA}} | perl -pe's/ya?ml/json/g'
        sources: ["{{.SCHEMA}}"]
        generates: ["{{.DEST}}"]
        cmds: transerialize {{.SCHEMA}} {{.DEST}}
```

Oh yeah, `task` is unfortunately janky where loops
are concerned, so I'm using [fd][fd] and re-entries to
deal with all the individual schema conversions.

## Setting up the validation train

Before we go hog-wild on the schema itself, we need
to figure out how we'll invoke things. And to do that, let's
seed our schema and sample document in the most boring, minimalistic
manner possible.

```yaml
# file: schemas-yaml/character.yml
$id: https://hyperboria.babyl.ca/character.json
title: Hyperboria character sheet
type: object
```

```yaml
# file: samples/verg.yml

# Verg is my character, and always ready to face danger,
# so it makes sense that he'd be volunteering there
name: Verg-La
```

We have a schema, we have a document, and the straightforward way to
validate it is to do the following.

```sh
⥼ ajv validate -s schemas-yaml/character.yml -d samples/verg.yml
samples/verg.yml valid
```

Sweet. Now we just need to formalize it a little bit in `Taskfile` and
we're ready to roll.

```yaml
# file: Taskfile.yml
# in the tasks
validate:
    silent: true
    cmds:
        - |
            ajv validate  \\
                --all-errors \\
                --errors=json \\
                --verbose \\
                -s schemas-yaml/character.yml \\
                -d {{.CLI_ARGS}}
```

## Starting on the schema

To warm ourselves up, let's begin with some easy fields.
A character has obviously a name and a player.

```yaml
# file: schemas-yaml/character.json
$id: https://hyperboria.babyl.ca/character.json
title: Hyperboria character sheet
type: object
additionalProperties: false
required:
    - name
    - player
properties:
    name: &string
        type: string
    player: *string
```

Nothing special there, except for the YAML anchor and alias, because I'm a
lazy bugger.

```yaml
⥼ task validate -- samples/verg.yml
samples/verg.yml invalid
[
    ...
    "message": "must have required property 'player'",
    ...
]
```

Woo! Validation is screaming at us! The output is abbreged here because
I configured it to be extra-verbose in the taskfile. But the gist is clear:
we're supposed to have a player name and we don't. So let's add it.

```yaml
# file: samples/verg.yml
name: Verg-La
player: Yanick
```

And with the player name added, all is well again.

```sh
⥼ task validate -- samples/verg.yml
samples/verg.yml valid
```

## Adding stats and definitions

Next thing, core statistics! All statistics are following the same
rules (numbers between 1 and 20). Copying and pasting the
schema for all stats would be uncouth. Using anchors as in the previous
section is an option, but in this case it's better to use the
a schema definition, to make things a little more formal.

```yaml
# file: schemas-yaml/character.yml
# only showing deltas
required:
    # ...
    - statistics
properties:
    # ...
    statistics:
        type: object
        allRequired: true
        properties:
            strength: &stat
                $ref: "#/$defs/statistic"
            dexterity: *stat
            constitution: *stat
            intelligence: *stat
            wisdom: *stat
            charisma: *stat
$defs:
    statistic:
        type: number
        minimum: 1
        maximum: 20
```

Note that the `allRequired` is a custom keyword made available by
`ajv-keywords`, and to use it we have to amend our call to
`ajv validate` in the the taskfile:

```yaml
# file: Taskfile.yml
validate:
    silent: true
    cmds:
        - |
            ajv validate \\
                --all-errors \\
                --errors=json \\
                --verbose \\
                -c ajv-keywords \\
                -s schemas-yaml/character.yml \\
                -d {{.CLI_ARGS}}
```

To conform to the schema, we add the stats to our sample character too:

```yaml
# file: samples/verg.yml
statistics:
    strength: 11
    dexterity: 13
    constitution: 10
    intelligence: 18
    wisdom: 15
    charisma: 11
```

And we check and, yup, our sheet is still valid.

```sh
⥼ task validate -- samples/verg.yml
samples/verg.yml valid
```

## One sample doesn't serious testing make

So far, we've used Verg as our test subject. We tweak the schema,
run it against the sheet, tweak the sheet, rince, lather, repeat. But as
the schema is getting more complex, we probably want to add a real test
suite to our little project.

One way would be to use `ajv test`, which has the appeal that no additional
code is required.

```sh
⥼ ajv test -c ajv-keywords \\
    -s schemas-yaml/character.yml \\
    -d samples/verg.yml \\
    --valid
samples/verg.yml passed test
# bad-verg.yml is like verg.yml, but missing the player name
⥼ ajv test -c ajv-keywords \\
    -s schemas-yaml/character.yml \\
    -d samples/bad-verg.yml \\
    --invalid
samples/bad-verg.yml passed test
```

But what it has in simplicity, it lacks in modularity. Those
schemas are going to get a little more involved, and targeting
pieces of them would be good. So instead we'll go with good old unit test,
via [vitest][].

For example, let's test statistics.

```js
// file: src/statistics.test.js
import { test, expect } from "vitest";

import Ajv from "ajv";

import characterSchema from "../schemas-json/character.json";

const ajv = new Ajv();
// we just care about the statistic schema here, so that's what
// we take
const validate = ajv.compile(characterSchema.$defs.statistic);

test("good statistic", () => {
    expect(validate(12)).toBeTruthy();
    expect(validate.errors).toBeNull();
});

test("bad statistic", () => {
    expect(validate(21)).toBeFalsy();
    expect(validate.errors[0]).toMatchObject({
        message: "must be <= 20",
    });
});
```

We add a `test` task to our taskfile:

```yaml
# file: Taskfile.yml
test:
    deps: [schemas]
    cmds:
        - vitest run
```

And just like that, we have tests.

```sh
⥼ task test
task: [schemas] fd -e yml -p ./schemas-yaml -x task schema SCHEMA='{}'
task: [schema] transerialize schemas-yaml/test.yml schemas-json/test.json
task: [schema] transerialize schemas-yaml/character.yml schemas-json/character.json
task: [test] vitest run

 RUN  v0.10.0 /home/yanick/work/javascript/hyperboria-character-sheet

 √ src/statistics.test.js (2)

Test Files  1 passed (1)
     Tests  2 passed (2)
      Time  1.41s (in thread 5ms, 28114.49%)
```

## More schemas!

Next step: the character class. While we could just slam an `enum`
in the main schema and call it done, it's a list that might be re-used
somewhere else, so it might pay off to define it in its own schema, and
refer to it in the character sheet schema.

Addititional challenge! In Hyperborea you can have a generic class, or a
class and sub-class. Which can be schematized explicitly, like this:

```yaml
oneOf:
    - enum: [ magician, figher ]
    - type: object
      properties:
        generic: { const: fighter }
        subclass: { enum: [ barbarian, warlock, ... ] }
    ...
```

But that's a lot of repetitive typing. Instead, it'd be nice to
have the source be more compact, if a little less JSON Schemy. Say, something
like this:

```yaml
$id: https://hyperboria.babyl.ca/classes.json
title: Classes of characters for Hyperborea
$defs:
    fighter:
        - barbarian
        - berserker
        - cataphract
        - hunstman
        - paladin
        - ranger
        - warlock
    magician: [cryomancer, illusionist, necromancer, pyromancer, witch]
```

And then have a little script massage the data as we turn the YAML into
JSON. Fortunately (what a lucky break!), `transerialize` does allow
for a transformation script to be wedged in the process. So we can change
our `taskfile` schema task to be:

```yaml
schema:
    vars:
        TRANSFORM:
            sh: |
                echo {{.SCHEMA}} | \\
                    perl -lnE's/yml$/pl/; s/^/.\//; say if -f $_'
        DEST:
            sh: echo {{.SCHEMA}} | perl -pe's/ya?ml/json/g'
    cmds:
        - transerialize {{.SCHEMA}} {{.TRANSFORM}} {{.DEST}}
```

And then we slip in a transform script that looks like this:

```perl
# file: schemas-yaml/classes.pl
sub {
    my $schema = $_->{oneOf} = [];

    push @$schema, { enum => [ keys $_->{'$defs'}->%* ] };

    for my $generic ( keys $_->{'$defs'}->%* ) {
        push @$schema, {
            type => 'object',
            properties => {
                generic => { const => $generic },
                subclass => { enum => $_->{'$defs'}{$generic} }
            }
        }
    }

    return $_;
}
```

With that, the output schema is inflated to what we want. We're having our concise cake eating the big fluffy one too. Nice!

So what is left is to link the schemas together. We refer
to the classes schema from the character schema:

```yaml
# file: schemas-yaml/character.yml
required:
    # ...
    - class
properties:
    # ...
    class: { $ref: "/classes.json" }
```

We also need to tell `ajv` of the existence of that new schema:

```yaml
validate:
    silent: true
    cmds:
        - |
            ajv validate \\
                --all-errors \\
                --errors=json \\
                --verbose \\
                -c ajv-keywords \\
                -r schemas-json/classes.json \\
                -s schemas-json/character.json \\
                -d {{.CLI_ARGS}}
```

Finally, we add Verg's class to his sheet:

```yaml
# file: samples/verg.yml
class:
  generic: magician
  subclass: cryomancer
```

And just like that, Verg (and our character schema) is all classy and stuff.

## Referencing other parts of the schema

So far we can set up our character sheet schema to ensure that we
have the fields that we want, with the types and values that we want.
But something else we want to do is to validate the relations
between properties.

For example, characters have a health statistic. Each time the character
levels up, the player rolls a dice and increases the health accordingly.
As you image, forgetting to get that bonus can prove to be a lethal mistake,
so it'd be nice to ensure that never happens.

We'll do it through the magic of [JSON Pointers][jpointer] and avj's $data, like so:

```yaml
# file: schemas-yaml/character.yml
level: { type: number, minimum: 1 }
health:
    type: object
    required: [ max ]
    properties:
        max: { type: number }
        current: { type: number }
        log:
            type: array
            description: history of health rolls
            items: { type: number }
            minItems: { $data: /level }
            maxItems: { $data: /level }
```

Basically (and once we add a `--data` flag to `ajv` to tell it to enable
that feature), any mention of `{ $data: '/path/to/another/value/in/the/schema' }` will be replaced by the value for which that JSON pointer resolves to
in the document being validated. That's something that is not part of JSON
Schema proper, but it's a mightily useful way to interconnect the schema
and the document being validated.

Word of caution, though: I say 'any mention of $data', but that's
overselling it. There are a few cases where `$data` fields won't be resolved.
If you are to use that feature, make sure to reserve a few minutes to read
the AJV docs about it. Trust me, it'll save you a few "what the everlasting heck?" moments.

## Custom keywords

In the previous section, we checked that the number of rolls for health is
equal to the level of the character. That's already something. But
the logical next step is to ensure that the sum of those rolls are
equal to the max health points we have. We'd need something like:

```yaml
# file: schemas-yaml/character.yml
health:
    type: object
    properties:
        max:
            type: number
            sumOf: { list: { $data: 1/log } }
        log:
            type: array
            items: { type: number }
```

That's where custom keywords enter the picture. AJV allows us to
augment the JSON Schema vocabulary with new keywords.

There is a few ways to define that custom keyword. The one I opted for
is defining it as a JavaScript function (here made a little more
complex because we're dealing internally with JSON pointers):

```js
// file: src/sumOf.cjs

const _ = require("lodash");
const ptr = require("json-pointer");

function resolvePointer(data, rootPath, relativePath) {
    if (relativePath[0] === "/") return ptr.get(data, relativePath);

    const m = relativePath.match(/^(\d+)(.*)/);
    relativePath = m[2];
    for (let i = 0; i < parseInt(m[1]); i++) {
        rootPath = rootPath.replace(/\/[^\/]+$/, "");
    }

    return ptr.get(data, rootPath + relativePath);
}

module.exports = (ajv) =>
    ajv.addKeyword({
        keyword: "sumOf",
        $data: true,
        errors: true,
        validate: function validate(
            { list, map },
            total,
            _parent,
            { rootData, instancePath }
        ) {
            if (list.$data)
                list = resolvePointer(rootData, instancePath, list.$data);

            if (map) data = _.map(data, map);

            if (_.sum(list) === total) return true;

            validate.errors = [
                {
                    keyword: "sumOf",
                    message: "should add up to sum total",
                    params: {
                        list,
                    },
                },
            ];

            return false;
        },
    });
```

As usual we have to tell `ajv` to include that new bit of code via
`-c ./src/sumOf.cjs`. But beside that, congrats, we have a new keyword!

## More of the same

By now we have most of the tools we want, all that is left to do is to
turn the crank.

Experience points? Much of the same logic as for the health points:

```yaml
# file: schemas-yaml/character.yml
experience:
    type: object
    properties:
        total:
            type: number
            sumOf:
                list: { $data: '1/log' }
                map: amount
        log:
            type: array
        items:
            type: object
            properties:
                date: *string
                amount: *number
                notes: *string

```

The other basic attributes are trivial:

```yaml
# file: schemas-yaml/character.yml
gender: *string
age: *number
height: *string
appearance: *string
alignment: *string
```

Fields based on lists? Been there, done that:

```yaml
# file: schemas-yaml/character.yml
  race: { $ref: /races.json }
  languages:
    type: array
    minItems: 1
    items:
      $ref: /languages.json
```

Spells are only for magicians? Not a problem.

```yaml
# file: schemas-yaml/character.yml
type: object
properties:
    # ...
    spells:
      type: array
      items: { $ref: /spells.json }
      maxSpells:
        class: { $data: /class }
        level: { $data: /level }
```

With the new keyword `maxSpells`:

```js
// file: src/maxSpells.cjs

const _ = require("lodash");
const resolvePointer = require('./resolvePointer.cjs');

module.exports = (ajv) =>
    ajv.addKeyword({
        keyword: "maxSpells",
        validate: function validate(
            schema,
            data,
            _parent,
            { rootData, instancePath }
        ) {
            if (schema.class.$data) {
                schema.class = resolvePointer(
                    rootData, instancePath, schema.class.$data
                );
            }

            if( schema.class !== 'magician'
                && schema.class?.generic !== 'magician'
                && data.length ) {
                validate.errors = [
                    {
                        message: "non-magician can't have spells",
                    },
                ];
                return false;
            }

            return true;
        },
        $data: true,
        errors: true,
    });
```

Gears? Pfah! Sure.

```yaml
# file: schemas-yaml/character.yml
properties:
    # ...
    gear: { $ref: '#/$defs/gear' }
$defs:
  gear:
    type: array
    items:
      oneOf:
        - *string
        - type: object
          properties:
            desc:
              type: string
              description: description of the equipment
            qty:
              type: number
              description: |
                quantity of the item in the
                character's possession
          required: [ desc ]
          additionalProperties: false
          examples:
            - { desc: 'lamp oil', qty: 2 }
```

By now you get the point. A lot of constraints can be expressed via vanilla JSON Schema keywords. For the weirder things, new keywords can be added. And
for anything that is onerous to type of, we have to remember that underneath
it's all JSON, and we know darn well how to munge that.

[jpointer]: https://datatracker.ietf.org/doc/html/rfc6901
[vitest]: https://vitest.dev/
[fd]: https://github.com/sharkdp/fd
[transerialize]: https://metacpan.org/dist/File-Serialize/view/bin/transerialize
[task]: https://taskfile.dev
[ajv-cli]: https://www.npmjs.com/package/ajv-cli
[ajv]: https://github.com/ajv-validator/ajv
[repo]: https://git.babyl.ca/yanick/hyperborea-character-sheet
[jsonschema]: https://json-schema.org/
[ASSH]: https://www.hyperborea.tv/
[gizmo]: https://www.twitter.com/gizmomathboy
[yaml]: https://yaml.org/
