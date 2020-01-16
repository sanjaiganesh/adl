# Specification for ADL

## Definitions

#### API
An `API` is considered to be a collection of operations, resources, models, enums, types and configuration for use in communication with a service. The API describes how a developer can interact with that service and what functionality the service provides. We use the service's API to create SDKs and libraries for other programming languages so developers can write code against that service.

## Details
> Grammar: `Typescript`

Using Typescript as the description language, we can leverage the tooling already created for it. Typescript offers enough flexibility to allow the use-cases we need for describing services. Based on prior description languages such as OpenAPI, ADL can provide a higher fidelity while still feeling familiar.

### API
> File: `./PetShopAutoRepair.ts`
``` typescript
/**
 * REST API for PetShopAutoRepair
 * 
 * API Versions available via the PetShopAutoRepair service. Order is significant.
 * 
 * @version 2018-03-01
 * @version 2019-02-12
 * @version 2019-05-06
 * @version 7.0.0
 * @version 6.0.0
 * @version 2020-01-01
 */
export namespace PetShopAutoRepair {

}
```

### Resource/Service

Grouping operations, whether around the notion of a `Resource` or `Service`
REST Resources can be represented as a collection of related operations. 

File: `./Resources/ExampleService.ts`
``` typescript
```
#### Declaring a resource


#### Specifying metadata


### Operations
#### Methods


#### Parameters


#### Responses
- `Response<T>`


#### Decoration
- @HttpPut
- @Path
- @Name

### Models
- `Interface` or `Class`

### Enums

### Common Types
- `ArmResource`

