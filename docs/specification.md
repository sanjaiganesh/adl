# Specification for ADL

## Definitions

#### API
An `API` is considered to be a collection of operations, resources, models, enums, types and configruation

## Details

Grammar: Typescript.

Fit use-cases into language.

Lean on OpenAPI and others to provide a foundation of knowledge.

### API 

File: `./ExampleService.ts `
``` typescript
/**
 * REST Api for PetShopAutoRepair  
 */
export namespace PetShopAutoRepair {
  /**
   * API Versions available via the PetShopAutoRepair service.
   */
  export enum ApiVersions { 
    '2018-03-01' = '2018-03-01';
  }
} 
```

### Resource/service

Grouping operations, whether around the notion of a `Resource` or `Service` 
REST Resources can be represented as a collection of related operations. 

File: `./Resources/ExampleService.ts `
``` typescript
```
#### Declaring a resource
#### Specifying metadata
#### Methods
#### Parameters
#### Responses
#### Decorating a  

### Reusable Types
### Enums
### Models

