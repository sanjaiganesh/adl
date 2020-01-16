# ADL - An Api Description Language using TypeScript

## Goals today:
 - parse and persist an ADL model
 - convert from/to OpenAPI (as much as we can)
 - some docs that illustrate the ideas 

## Aspiration

An alternative to [OpenAPI, Swagger] means of descrbing an API surface, that facilitates describing multiple API versions of an API.

- provide a better authoring experience for OpenAPI specifications
- handle multiple api-versions without significantly increasing complexity.
- provide a more natural language for expressing an API surface
- protocol agnostic
- existing tools available, not reinventing the wheel.

## Reasoning
OpenAPI is a fairly valuable standard for generating wire-protocol documentation for 
Http APIs.

Unfortunately, it has a few pain-points, that ratchet up the complexity the deeper you get:
- multiple API versions - docmenting an evolving surface
- multipe files ($refs as a means to connect peices is fragile.)
- YAML/JSON as an encoding format renders the content to be merely data. 
- JSON Schema lacks sufficent fidelity to manage a lot of cases easily
- content aware editors are nearly non-existant
- Path Centric model taints the API both in design and expression

### Alternatives
Of course, there are an incredible number of ways to document APIs:
 - OpenAPI - YAML/JSON 
 - Smithy - 
 - RAML - 
 - GraphQL -
 - CSDL 

### Priorities
In deciding a path, 

- Leverage existing tooling as much as possible
- Language should be able to capture an API, however it's constructed
- Project-specific linting/constraints should easy to build and enforce
- Typical change scenarios need to have the lowest friction

