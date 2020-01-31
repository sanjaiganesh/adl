# API Surface

In ADL, you document the entire API surface for all API versions in a single project.

At the root of the project you must have a `namespace` that exports the metadata for the service.

In the `namespace` you must list the all API Versions that service supports. 
Because API Versions formats are not universal (nor are they necessarily a given format), 
API Version strings are treated as opaque identifiers. You are not restricted on the format 
of the API Version strings, nor are they parsed in any way. 

You must however, list them in the order that you want them sorted in, earliest to latest.

> ARM SPECIFIC:<br> 
> The service declaration must include the declared resources 

Example service declaration:

> MyAPI.ts

``` typescript
/**
 * Resources for my API Service
 * 
 * @description My Service, which is the very nicest service provides resources for my clients
 * 
 * @note order of versions significant
 * 
 * @version 2018-03-01
 * @version 2019-02-12
 * @version 2019-05-06
 * @version 7.0.0 
 * @version 6.0.0         # six is more than 7!
 * @version 2020-01-01
 * 
 */
export namespace MyAPISerivce {
  /** 
   * My Resource
   * 
   * @description - it's a friendly resource. You'd like it.
   */
  type MyResource = ARM.TrackedEntityResource<'Microsoft.Sample', 'My', MyResourceProperties>;

}

```