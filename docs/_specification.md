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
```typescript
CreateOrUpdate: ( ... ) =>
```
Methods indicate which operations are available for a client.

#### JSDoc Information
```typescript
  /**
   * Create or replace the patching schedule for Redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter Default - Default string modeled as parameter for auto generation to work correctly.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Response to put/get patch schedules for Redis cache
   * 
   * @added 2019-01-01
   * @deprecated 2019-06-06
   * @deleted 2020-01-01
   */
```
Currently, ADL uses JSDoc data and tags as metadata about the operation. For example, the descriptions of the operation and parameters are using the standard JSDoc tags. For version information, we can have `added`, `deprecated`, and `deleted` tags to indicate which versions they support.

#### Parameters
```typescript
(subscriptionId: string,
 resourceGroupName: string,
 name: string,
 $default: Path<Constant<'default'>, 'default'>,
 apiVersion: Query<string, 'api-version'>,
 parameters: Body<RedisPatchSchedule>,
 headers?: Headers<{ 'x-ms-foo': string; 'cache-until': Duration }>,
 cookies?: Cookies<{}>, query?: Queries<{}>)
```
Parameters are used to describe what can be sent to the operation. These can include any part of the operation, `path`, `query`, `body`, `headers`, and `cookies`.

#### Responses
```typescript
    JsonResponse<201> & LRO<RedisResource, Location> & MyHeaderCollection |
    Response<201, 'application/json'> & RedisResource & OriginalUri |
    Response<201, 'application/json'> & RedisResource & AzureAsyncOperation |
    Exception<Http4XX>
```
Responses are what the operation returns. Types are created that allow you to combine them together to accurately describe the operations' results. For the basic `Response`, you can provide the HTTP status code and the MIME type of the response. If you combine that with a model type, then you have a complete response and body. There are other ideas for types to combine, like long-running operations and paging. Additionally, `Exception` describes a response that is a bad response. This shows explicit intent over the general `Response` type.

#### Decoration
```typescript
  @HttpPut
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{default}')
  @Name('CreateOrUpdate')
```
Decorators are used to indicate functional information about the operation. There are decorators to which HTTP method to use, the path to the endpoint, and the exposed name of the operation.

### Models
- `Interface` or `Class`

### Enums

### Common Types
- `ArmResource`

