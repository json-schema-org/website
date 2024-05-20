
### Benchmarks

Benchmarks that compare at least two implementations supporting draft-06+ may be listed here.

-   JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-benchmark](https://github.com/ebdrup/json-schema-benchmark)</userevent> - an independent benchmark for Node.js JSON-schema validators based on JSON-Schema Test Suite (MIT)

-   PHP
  -   <userevent type='plausible-event-name=activation-click-tool'>[php-json-schema-bench](https://github.com/swaggest/php-json-schema-bench)</userevent> - comparative benchmark for JSON-schema PHP validators using JSON-Schema Test Suite and z-schema/JSCK (MIT)

-   JVM (Java, Kotlin, Scala)
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-validation-comparison](https://www.creekservice.org/json-schema-validation-comparison/)</userevent> - an independent functional and performance comparison of JVM-based validator implementations using JSON-Schema Test Suite and more (MIT)

### API documentation

-   JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[@cloudflare/doca](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/doca)</userevent> ([JSON Schema Tools](https://github.com/cloudflare/json-schema-tools)), _draft-04, -06, -07, and Doca extensions_ (UI forthcoming)
  -   <userevent type='plausible-event-name=activation-click-tool'>[@adobe/jsonschema2md](https://github.com/adobe/jsonschema2md)</userevent> makes it easier by providing a number of scripts that can turn JSON Schema files into readable Markdown documentation that is ready for consumption on GitHub or processed using Jekyll or other static site generators. _JSON Schema 2019-09_ ([partial](https://github.com/adobe/jsonschema2md/blob/master/schemasupport.md))

-   Python
  -   <userevent type='plausible-event-name=activation-click-tool'>[FastAPI](https://github.com/tiangolo/fastapi)</userevent> (MIT) is an API framework based on Python 3.6+ types that generates [OpenAPI 3](https://www.openapis.org) schemas, including **JSON Schemas** for all the models declared.

### Link Description Object utilities

-   JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[@cloudflare/json-hyper-schema](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/json-hyper-schema)</userevent> _draft-07, -06, -04_ (BSD-3-Clause)


## Schema generators

Schema generators need not support generating every schema keyword.
For schema generators, compatibility with a draft means that either:

* Schemas produced explicitly set the draft with `$schema`
* Schemas produced lack `$schema` but are valid against the appropriate meta-schema

For example, the only incompatibilities between draft-04 and draft-06 involve `exclusiveMinimum`, `exclusiveMaximum`, and `id` vs `$id`.  If a generator does not set `$schema` and does not ever emit those keywords, then it is compatible with draft-06 even if it was written with draft-04 in mind.

### From code

-   .NET
  -   <userevent type='plausible-event-name=activation-click-tool'>[Json.NET](https://www.newtonsoft.com/jsonschema)</userevent> (AGPL-3.0) - generates schemas from .NET types
  -   <userevent type='plausible-event-name=activation-click-tool'>[NJsonSchema](https://github.com/RSuter/NJsonSchema/)</userevent> - (Ms-PL) - generates schemas from .NET types, see issue [574](https://github.com/RSuter/NJsonSchema/issues/574) for draft-06+ support progress
  -   <userevent type='plausible-event-name=activation-click-tool'>[JsonSchema.Net.Generation](https://github.com/gregsdennis/json-everything)</userevent> (MIT) - generates schemas from .NET types
  -   <userevent type='plausible-event-name=activation-click-tool'>[LateApexEarlySpeed.Json.Schema](https://github.com/lateapexearlyspeed/Lateapexearlyspeed.JsonSchema)</userevent> (BSD-3-Clause) - generates schemas (draft 2020.12) from fluent builders & .NET types
-   Go
  -   <userevent type='plausible-event-name=activation-click-tool'>[jsonschema](https://github.com/invopop/jsonschema)</userevent> - (MIT) - generate schemas from Go structs. Supports Draft 2020-12.
-   PHP
  -   <userevent type='plausible-event-name=activation-click-tool'>[Liform](https://github.com/Limenius/liform)</userevent> (MIT) - generates schemas from Symfony forms
-   TypeScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[typescript-json-schema](https://github.com/YousefED/typescript-json-schema)</userevent>
-   Python
  -   <userevent type='plausible-event-name=activation-click-tool'>[Pydantic](https://pydantic-docs.helpmanual.io/)</userevent> (MIT) - generates schemas from Python models based on Python 3.6+ type hints.
  -   <userevent type='plausible-event-name=activation-click-tool'>[msgspec](https://jcristharif.com/msgspec/)</userevent> (BSD-3-Clause) - generates schemas from Python type annotations.
  -   <userevent type='plausible-event-name=activation-click-tool'>[mashumaro](https://github.com/Fatal1ty/mashumaro)</userevent> (Apache 2.0) - generates schemas from Python type annotations
  -   <userevent type='plausible-event-name=activation-click-tool'>[drf-jsonschema-serializer](https://github.com/maykinmedia/drf-jsonschema-serializer)</userevent> (BSD-3-Clause) - generates schemas from Django Rest Framework serializers
-   Java
  -   <userevent type='plausible-event-name=activation-click-tool'>[jsonschema-generator](https://github.com/victools/jsonschema-generator)</userevent> (Apache 2.0) - generates schemas from Java types *supports Drafts 6, 7, 2019-09 and 2020-12*
-   Scala
  -   <userevent type='plausible-event-name=activation-click-tool'>[scala-jsonschema](https://github.com/andyglow/scala-jsonschema)</userevent> (Apache 2.0) - generates schemad out of Scala case classes
-   Ruby
  -   <userevent type='plausible-event-name=activation-click-tool'>[Shale](https://github.com/kgiszczak/shale)</userevent> (MIT) - generates schema from Ruby models *supports Draft 2020-12*
-   Rust
  -   <userevent type='plausible-event-name=activation-click-tool'>[Schemars](https://github.com/GREsau/schemars)</userevent> (MIT) - generates schema from Rust code *supports Draft 7* 

### From data

-   Java
  -   <userevent type='plausible-event-name=activation-click-tool'>[saasquatch/json-schema-inferrer](https://github.com/saasquatch/json-schema-inferrer)</userevent> _2020-12, 2019-09, draft-07, draft-06, draft-04_ (Apache 2.0) - Java library for inferring JSON Schemas from one or multiple JSON samples.
-   Scala
  -   <userevent type='plausible-event-name=activation-click-tool'>[Schema Guru](https://github.com/snowplow/schema-guru)</userevent> (Apache 2.0) - CLI util, Spark Job and Web UI for deriving JSON Schemas out of corpus of JSON instances; see issue [178](https://github.com/snowplow/schema-guru/issues/178) for progress towards draft-06+ support
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSONoid](https://github.com/michaelmior/jsonoid-discovery/)</userevent> (MIT) - command line tool and Spark application for inferring schemas from JSON documents, supports draft 2020-12
-   Clojure
  -   <userevent type='plausible-event-name=activation-click-tool'>[luposlip/json-schema](https://github.com/luposlip/json-schema)</userevent> (Apache 2.0) - infer JSON Schema from Clojure data
-   Online (web tool)
  -   <userevent type='plausible-event-name=activation-click-tool'>[jsonschema.net](https://www.jsonschema.net/)</userevent> - generates schemas from example data
  -   <userevent type='plausible-event-name=activation-click-tool'>[Liquid Online Tools](https://www.liquid-technologies.com/online-json-to-schema-converter)</userevent> - infer JSON Schema from sample JSON data
  -   <userevent type='plausible-event-name=activation-click-tool'>[quicktype.io](https://app.quicktype.io/#l=schema)</userevent> - infer JSON Schema from samples, and generate TypeScript, C++, go, Java, C#, Swift, etc. types from JSON Schema

### From model

-   <userevent type='plausible-event-name=activation-click-tool'>[Dataspecer](https://dataspecer.com)</userevent> - Generates JSON Schema (and JSON-LD context) from conceptual model *supports Draft 2020-12*

## Generators from schemas

Tools that generate artifacts from schemas need not support every keyword,
as not all keywords work well for generative use cases.

Generators are considered compatible with a draft if they support (or benignly
ignore) the appropriate `$schema` value, and interpret the keywords that they
do support according to that draft.

For example, if a generator that was originally written for draft-04 does not
support `id`, `exclusiveMinimum`, or `exclusiveMaximum`, then as long as it does
not require a draft-04 `$schema`, it is compatible with draft-06 since those
are the only keywords that changed.

### Type generation

-   TypeScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts)</userevent> (MIT) - generates TypeScript types from JSON schemas
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript)</userevent> (MIT) - JSON Schema to TypeScript type generator used by Amazon, Microsoft, Mozilla, Webpack, and others

### Code generation

-   Dotnet
  -  <userevent type='plausible-event-name=activation-click-tool'>[Corvus.JsonSchema](https://www.nuget.org/packages/Corvus.Json.JsonSchema.TypeGeneratorTool/)</userevent> - generates an idiomatic dotnet type model from JSON Schema files, supporting all JSON Schema features, including property accessors, enumeration, common string `format`, and JSON document building/modification; over low-level `System.Text.Json` types. *supports Draft 6, Draft 7, Draft 2019-09 and Draft 2020-12*.
-   Elm
  -  <userevent type='plausible-event-name=activation-click-tool'>[json-schema-to-elm](https://github.com/dragonwasrobot/json-schema-to-elm)</userevent> - generates Elm types, JSON decoders+encoders, and fuzz tests from one or more JSON Schema files, using [dragonwasrobot/json_schema](https://github.com/dragonwasrobot/json_schema) *supports Draft 7*
-   Go
  -  <userevent type='plausible-event-name=activation-click-tool'>[go-jsonschema](https://git.sr.ht/~emersion/go-jsonschema)</userevent> - generates Go types and helpers from JSON schema files *supports Draft 2020-12* 
  -  <userevent type='plausible-event-name=activation-click-tool'>[protoc-gen-jsonschema](https://github.com/chrusty/protoc-gen-jsonschema)</userevent> - Generates JSON schemas from protobuf proto v2 and v3 files.
-   Java
  -  <userevent type='plausible-event-name=activation-click-tool'>[jsonCodeGen](https://github.com/schlothauer-wauer/jsoncodegen)</userevent> (MIT) - Groovy based generation tasks from JSON schema. Already includes templates/generators for Java Beans, Swagger specification files and PlantUML diagrams.
  -  <userevent type='plausible-event-name=activation-click-tool'>[jsonschema2pojo](https://github.com/joelittlejohn/jsonschema2pojo)</userevent> (Apache 2.0) - generates Java types from JSON Schema (or example JSON) and can annotate those types for data-binding with Jackson 2.x or Gson. *draft-07*
  -  <userevent type='plausible-event-name=activation-click-tool'>[jsonschematypes](https://github.com/jimblackler/jsonschematypes)</userevent> (Apache 2.0) - Java library to generate Java or TypeScript classes from standard JSON Schemas. *JSON Schema 2019-09, draft-07, -06, -04, -03*
  -  <userevent type='plausible-event-name=activation-click-tool'>[jsongenerator](https://github.com/jimblackler/jsonschematypes/tree/master/codegen)</userevent> *JSON Schema 2019-09, draft-07, -06, -04, -03* (Apache-2.0)
  -  <userevent type='plausible-event-name=activation-click-tool'>[OpenAPI JSON Schema Generator](https://github.com/openapi-json-schema-tools/openapi-json-schema-generator)</userevent> (Apache-2.0) - Allows auto-generation of API client libraries (SDK generation) given an [OpenAPI](https://www.openapis.org) document. This project focuses on making the output 100% compliant with openapi + JSON schema specs. JSON Schema 2020-12, draft-05
- Kotlin
  -  <userevent type='plausible-event-name=activation-click-tool'>[json-kotlin-schema-codegen](https://github.com/pwall567/json-kotlin-schema-codegen)</userevent> (MIT) - Generates Kotlin data classes, Java classes or TypeScript interfaces from JSON Schema.
  -  <userevent type='plausible-event-name=activation-click-tool'>[OpenAPI JSON Schema Generator](https://github.com/openapi-json-schema-tools/openapi-json-schema-generator)</userevent> (Apache-2.0) - Allows auto-generation of API client libraries (SDK generation) given an [OpenAPI](https://www.openapis.org) document. This project focuses on making the output 100% compliant with openapi + JSON schema specs. JSON Schema 2020-12, draft-05
-   Online (web tool)
  -  <userevent type='plausible-event-name=activation-click-tool'>[quicktype.io](https://app.quicktype.io/#l=schema)</userevent> - infer JSON Schema from samples, and generate TypeScript, C++, go, Java, C#, Swift, etc. types from JSON Schema
-   PHP
  -  <userevent type='plausible-event-name=activation-click-tool'>[php-code-builder](https://github.com/swaggest/php-code-builder)</userevent>(MIT) - generates PHP mapping structures defined by JSON schema using [swaggest/json-schema](https://github.com/swaggest/php-json-schema) *supports Draft 7*
-   Python
  -  <userevent type='plausible-event-name=activation-click-tool'>[yacg](https://github.com/OkieOth/yacg)</userevent> (MIT) - parse JSON Schema and [OpenAPI](https://www.openapis.org) files to build a meta model from them. This meta model can be used in Mako templates to generate source code, other schemas or plantUml.
  -  <userevent type='plausible-event-name=activation-click-tool'>[statham](https://github.com/jacksmith15/statham-schema)</userevent> (MIT) - generate type-annotated models from JSON Schema documents.
  -  <userevent type='plausible-event-name=activation-click-tool'>[OpenAPI JSON Schema Generator](https://github.com/openapi-json-schema-tools/openapi-json-schema-generator)</userevent> (Apache-2.0) - Allows auto-generation of API client libraries (SDK generation) given an [OpenAPI](https://www.openapis.org) document. This project focuses on making the output 100% compliant with openapi + JSON schema specs. JSON Schema 2020-12, draft-05
-   Rust
  -  <userevent type='plausible-event-name=activation-click-tool'>[schemafy](https://github.com/Marwes/schemafy/)</userevent> - generates Rust types and serialization code from a JSON schema. *supports Draft 4*
-   Scala
  - <userevent type='plausible-event-name=activation-click-tool'>[json-schema-to-case-class](https://github.com/cchandurkar/json-schema-to-case-class)</userevent> (MIT) - NPM Package, [Web UI](https://cchandurkar.github.io/json-schema-to-case-class) and a CLI to generate Scala case classes from JSON Schema. *Supports JSON Schema 2019-09, draft-07, -06, -04, -03*
-   TypeScript
  -  <userevent type='plausible-event-name=activation-click-tool'>[jsongenerator](https://github.com/jimblackler/jsonschematypes/tree/master/codegen)</userevent> *JSON Schema 2019-09, draft-07, -06, -04, -03* (Apache-2.0)
  -  <userevent type='plausible-event-name=activation-click-tool'>[Shale](https://github.com/kgiszczak/shale)</userevent> (MIT) - generates Ruby models from a JSON schema *supports Draft 2020-12*

### Web UI generation

_TODO: Sort by draft support._

Various levels of support for UI generation primarily from the validation vocabulary or combined with UI specific definition.

-   JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[Alpaca Forms](http://www.alpacajs.org/)</userevent> (ASL 2.0)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Angular Schema Form](https://github.com/json-schema-form/angular-schema-form)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Angular2 Schema Form](https://github.com/makinacorpus/angular2-schema-form)</userevent> *unrelated to Angular Schema Form* (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Angular6-json-schema-form](https://github.com/hamzahamidi/Angular6-json-schema-form)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Dashjoin JSON Schema Form](https://github.com/dashjoin/json-schema-form)</userevent> (Apache 2) *draft-06 (minus oneOf, anyOf, allOf, not)*
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSON Editor](https://github.com/json-editor/json-editor)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSON Form (joshfire)](https://github.com/joshfire/jsonform)</userevent> (joshfire) (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Json Forms (brutusin)](https://github.com/brutusin/json-forms)</userevent> (brutusin) (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-form (Remote.com)](https://github.com/remoteoss/json-schema-form)</userevent> (Remote.com) (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSON Schema Form Element](https://jsfe.js.org)</userevent> (ISC)
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSONForms (jsonforms.io)](https://jsonforms.io/)</userevent> (EclipseSource) (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Liform-react](https://github.com/Limenius/liform-react)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[React JSON Schema Form (mozilla)](https://github.com/mozilla-services/react-jsonschema-form)</userevent> (Apache 2)
  -   <userevent type='plausible-event-name=activation-click-tool'>[React Json Schema Form (Mui)](https://github.com/vip-git/react-jsonschema-form-material-ui)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[React Schema Form (networknt)](https://github.com/networknt/react-schema-form)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[Restspace Schema Form](https://github.com/restspace/schema-form)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[uniforms (Vazco)](https://github.com/vazco/uniforms)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[UI Schema for React](https://github.com/ui-schema/ui-schema)</userevent> (MIT) *2019-09 / draft-08, -07, -06, -04 (incompatible `type=integer`)*

### Data from schemas

-   .Net
  -   <userevent type='plausible-event-name=activation-click-tool'>[JsonSchema.Net.DataGeneration](https://github.com/gregsdennis/json-everything)</userevent> (MIT) Data generation from JSON schemas, powered by the Bogus testing data generation library.
-   Python
  -   <userevent type='plausible-event-name=activation-click-tool'>[hypothesis-jsonschema](https://github.com/Zac-HD/hypothesis-jsonschema)</userevent> (MPL) *draft-07, -06, -04*;  takes any schema, even with complex and interacting constraints, and returns a [Hypothesis](https://hypothesis.works/) strategy which can generate valid documents for testing.
-   Java
  -   <userevent type='plausible-event-name=activation-click-tool'>[jsongenerator](https://github.com/jimblackler/jsongenerator)</userevent> *JSON Schema 2019-09, draft-07, -06, -04, -03* (Apache-2.0)

## Utilities

Draft compatibility for utilities is generally specific to the purpose of
the utility, and decided on a case-by-case basis.

### General processing

-   JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-ref-parser](https://github.com/BigstickCarpet/json-schema-ref-parser)</userevent> (MIT) Tools for dereferencing non-cyclic schemas, bundling referenced schemas into a single file, and other `$ref` processing.
  -   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-library](https://github.com/sagold/json-schema-library)</userevent> (MIT) - Exposes tools to work with json-schema, including: data creation from json-schema, `$ref` processing, walk through schemas, etc.
  -   <userevent type='plausible-event-name=activation-click-tool'>[@cloudflare/json-schema-walker](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/json-schema-walker)</userevent> ([JSON Schema Tools](https://github.com/cloudflare/json-schema-tools)), _draft-07, -06, -04, and Cloudflare's Doca extensions_ Walks schemas and runs pre- and post-walk callbacks.  Can modify schemas in place. (BSD-3-Clause)
  -   <userevent type='plausible-event-name=activation-click-tool'>[@hyperjump/json-schema-core](https://github.com/jdesrosiers/json-schema-core)</userevent>
        (MIT) Tools for working with schemas that handle identifiers and
        references. Build vocabularies and other JSON Schema based tools.

### Schema to Schema

-   JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[@cloudflare/json-schema-transform](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/json-schema-transform)</userevent> ([JSON Schema Tools](https://github.com/cloudflare/json-schema-tools)), (BSD-3-Clause) Utilities using @cloudflare/json-schema-walker for transformations including `allOf` merging and example roll-up.
  -   <userevent type='plausible-event-name=activation-click-tool'>[mokkabanna/json-schema-merge-allof](https://github.com/mokkabonna/json-schema-merge-allof)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[mokkabanna/json-schema-compare](https://github.com/mokkabonna/json-schema-compare)</userevent> (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[loganvolkers/json-schema-resolve-allof](https://www.npmjs.com/package/json-schema-resolve-allof)</userevent> (_license not stated_)
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSON-Schema-Instantiator](https://github.com/tomarad/JSON-Schema-Instantiator)</userevent> (MIT)

### Schema draft migration

-   JavaScript
  -  <userevent type='plausible-event-name=activation-click-tool'>[AlterSchema](https://github.com/sourcemeta/alterschema)</userevent> _JSON Schema 2020-12, 2019-09, draft-07, -06, -04_

### Format converters

-   [OpenAPI](https://www.openapis.org)
  -   <userevent type='plausible-event-name=activation-click-tool'>[JSON Schema to OpenAPI Schema](https://github.com/wework/json-schema-to-openapi-schema)</userevent> _draft-04_ Draft-06 and -07 planned per README (MIT)
  -   <userevent type='plausible-event-name=activation-click-tool'>[OpenAPI specification to JSON Schema](https://github.com/instrumenta/openapi2jsonschema)</userevent> Draft-07 (MIT)
-   Orderly
  -   <userevent type='plausible-event-name=activation-click-tool'>[Orderly](https://github.com/lloyd/orderly)</userevent> (BSD-3-Clause)
-   RAML
  -   <userevent type='plausible-event-name=activation-click-tool'>[ramldt2jsonschema](https://github.com/raml-org/ramldt2jsonschema)</userevent> _draft-06, 04_ (Apache-2.0)
-   Webpack
  -   <userevent type='plausible-event-name=activation-click-tool'>[@cloudflare/json-schema-ref-loader](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/json-schema-ref-loader)</userevent> ([JSON Schema Tools](https://github.com/cloudflare/json-schema-tools)), (BSD-3-Clause) Webpack loader for dereference-able schemas in JSON, JSON5, YAML, or JavaScript
  -   <userevent type='plausible-event-name=activation-click-tool'>[@cloudflare/json-schema-apidoc-loader](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/json-schema-apidoc-loader)</userevent> ([JSON Schema Tools](https://github.com/cloudflare/json-schema-tools)), Back-end for [@cloudflare/doca](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/doca), _draft-04, -06, -07, and Doca extensions_
-   XSD
  -   <userevent type='plausible-event-name=activation-click-tool'>[Oxygen XSD to JSON Schema](https://www.oxygenxml.com/json_converter.html#xsd-to-json-schema)</userevent> - Generate from an XSD file a similar JSON Schema structure.
  -   <userevent type='plausible-event-name=activation-click-tool'>[XSD to JSON Schema IntellJ plugin](https://plugins.jetbrains.com/plugin/19024-xsd-to-json-schema)</userevent> - Plugin for converting an XML Schema (XSD) file to a JSON Schema file.

### Testing

-   Python
  -   <userevent type='plausible-event-name=activation-click-tool'>[hypothesis-jsonschema](https://github.com/Zac-HD/hypothesis-jsonschema)</userevent> (MPL) *draft-07, -06, -04*;  takes any schema, even with complex and interacting constraints, and returns a [Hypothesis](https://hypothesis.works/) strategy which can generate valid documents for testing.

### Editors

-   <userevent type='plausible-event-name=activation-click-tool'>[Altova XMLSpy 2019r3](https://www.altova.com/xmlspy-xml-editor#json_schema)</userevent> - *Graphical JSON Schema editor for draft-06 and draft-7, as well as validation of JSON files based on JSON Schema*
-   <userevent type='plausible-event-name=activation-click-tool'>[Dashjoin JSON Schema editor](https://dashjoin.github.io/#/schema)</userevent> - *Graphical online JSON Schema editor for draft-06 (minus oneOf, anyOf, allOf, not). The generated schema can be tested immediately via a form that is driven by it.*
-   <userevent type='plausible-event-name=activation-click-tool'>[Hackolade Studio](https://hackolade.com/help/JSONSchemaEditor.html)</userevent> - *Visual JSON Schema editor for draft-04, draft-06, draft-07, 2019-09, 2020-12, as well as data modeling tool for NoSQL databases, storage formats, REST APIs, and JSON in RDBMS.  Also converts to and from: different draft specifications, DDL, XSD, Swagger, OpenAPI, YAML, Avro, Parquet, Protobuf, and most of the NoSQL script syntaxes.  Includes a GUI for Entity-Relationship Diagrams and a Command-Line Interface.*
-   <userevent type='plausible-event-name=activation-click-tool'>[JSONBuddy](https://www.json-buddy.com/)</userevent> - *Text and grid-style JSON editor and validator. Complete JSON Schema development environment with JSON Schema analyzer, context sensitive entry-helpers, sample data generation based on JSON Schema and JSON Schema validation debugger: Step through the validation process and set breakpoints. JSON Schema testing tool including schema coverage. Support for draft-4, draft-6, draft-7, 2019-09 and 2020-12.*
-   <userevent type='plausible-event-name=activation-click-tool'>[JSONEditor Online](https://jsoneditoronline.org/)</userevent> - *View, edit, format, and validate JSON online* Support draft-4, draft-6, and draft-7.
-   <userevent type='plausible-event-name=activation-click-tool'>[Liquid JSON Schema Editor](https://www.liquid-technologies.com/json-schema-editor)</userevent> - *Graphical JSON Schema editor for draft-04, draft-06, draft-07 and 2019-09, with split source code and grphical editing. Includes validation of JSON files based on JSON Schema, JSON Sample Generator and JSON Schema Documentation Generator.*
-   <userevent type='plausible-event-name=activation-click-tool'>[Oxygen JSON Schema Editor](https://www.oxygenxml.com/xml_developer/json_schema_editor.html)</userevent> - *JSON Schema editor with a variety of editing features and helper views (Design/Text/Author). Support for validation and editing JSON Schema draft-4, draft-6, and draft-7, 2019-09 (partial), 2020-12 (partial). Validation and editing of JSON files based on JSON Schema.*
-   <userevent type='plausible-event-name=activation-click-tool'>[Perseid Modeler](https://www.datensen.com/data-modeling/perseid-modeler-for-json-schema.html)</userevent> - *a modeling tool for JSON Schema and [OpenAPI](https://www.openapis.org). Key features include: visual JSON schema creation using tree and ERD-like diagrams, support for JSON schema structures including operators and conditions, import of existing schemas from files, creation of detailed HTML reports, export to PDF, script generation, and more. Supported versions: draft 4, 6, 7, 2019-09 and 2020-12*
-   <userevent type='plausible-event-name=activation-click-tool'>[Stoplight Studio](https://stoplight.io/)</userevent> - *JSON Schema IDE (text-based and GUI) with support for JSON/YAML linting, which can also be based on JSON Schema rules via Spectral. Support for draft-4, draft-6 and draft-7.*
-   <userevent type='plausible-event-name=activation-click-tool'>[Visual Studio Code](https://code.visualstudio.com/)</userevent> - *Schema driven code completion, hovers and validation for editing JSON files (including schemas)*
-   <userevent type='plausible-event-name=activation-click-tool'>[WebStorm](https://www.jetbrains.com/webstorm/)</userevent>, [IntelliJ IDEA](https://www.jetbrains.com/idea/), and other [JetBrains IDEs](https://www.jetbrains.com/products.html?fromMenu#type=ide) - *Code completion, documentation, and validation for JSON and YAML files using JSON Schema. Support for draft-4, draft-6, and draft-7.*
-   <userevent type='plausible-event-name=activation-click-tool'>[Eclipse IDE](https://www.eclipse.org/downloads/eclipse-packages)</userevent> - *Rich JSON edition supporting schema for instantaneous validation and error reporting, completion, documentation.*

### Documentation generators

- <userevent type='plausible-event-name=activation-click-tool'>[docusaurus-json-schema-plugin](https://github.com/jy95/docusaurus-json-schema-plugin)</userevent> - Schema viewer. Runs within a [Docusaurus](https://docusaurus.io/) web app. Supports draft-7, 2019-09, Draft 2020-12
- <userevent type='plausible-event-name=activation-click-tool'>[json-schema-static-docs](https://tomcollins.github.io/json-schema-static-docs/)</userevent> - Generates human friendly markdown documentation from JSON Schema. Includes links between pages based on $ref values. Supports draft-7.
- <userevent type='plausible-event-name=activation-click-tool'>[jsonschematic](https://github.com/yanick/jsonschematic/)</userevent> - Svelte-based schema viewer. Runs as a local web app. Supports draft-7.
- <userevent type='plausible-event-name=activation-click-tool'>[docson](https://github.com/lbovet/docson)</userevent> - Javascript-based schema viewer.  Runs as a local web app. Supports draft-4.
- <userevent type='plausible-event-name=activation-click-tool'>[json-schema-for-humans](https://pypi.org/project/json-schema-for-humans/)</userevent> - Generate HTML representation of a schema. Python-based. Supports draft-7.
- <userevent type='plausible-event-name=activation-click-tool'>[oXygen JSON Schema Documentation](https://www.oxygenxml.com/json_converter.html#generate-json-schema-documentation)</userevent> - Generate JSON Schema documentation in HTML format including diagrams.
- <userevent type='plausible-event-name=activation-click-tool'>[wetzel](https://github.com/CesiumGS/wetzel)</userevent> - Generates Markdown and AsciiDoc. With some limitations, supports draft-3, draft-4, draft-7, and 2020-12.

## Schema Repositories

-   <userevent type='plausible-event-name=activation-click-tool'>[SchemaStore.org](https://schemastore.org/json/)</userevent> - validate against common JSON Schemas

## Schema Linter

-   <userevent type='plausible-event-name=activation-click-tool'>[json-schema-linter](https://www.json-schema-linter.com/)</userevent> - Lint/validate/parse json-schema itself, and find typos, missing properties, missing required keys, etc. Supports draft 4, 6, and 7.
-   <userevent type='plausible-event-name=activation-click-tool'>[Stoplight Spectral](https://stoplight.io/open-source/spectral)</userevent> - A flexible JSON/YAML linter for creating automated style guides, with baked in support for [OpenAPI v2/v3 ](https://www.openapis.org)and JSON Schema. Supports draft 4, 6, and 7.

## Linter plugins

- <userevent type='plausible-event-name=activation-click-tool'>[remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema)</userevent> - Validate **Markdown** frontmatter **YAML** against an associated **JSON schema** with this **remark-lint** rule plugin.
- <userevent type='plausible-event-name=activation-click-tool'>[eslint-plugin-json-schema-validator](https://github.com/ota-meshi/eslint-plugin-json-schema-validator)</userevent> - ESLint plugin that validates code using JSON schema and reports violations.

## Hyper-Schema
