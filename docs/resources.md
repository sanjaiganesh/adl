# Azure ARM Resources

Azure ARM resources follow a very specific pattern, and ADL has support for declaring ARM Resources in a compact, clear manner.

### Declaring an Arm Resource

``` typescript
export interface MyResourceProperties {
  name: string & MinLength<4>;
}

export type MyResource = ARM.TrackedEntityResource<'Microsoft.Foo', 'MyResource', MyResourceProperties>;

```