declare namespace ARM {
  type SubscriptionId = string;
  type Location = string;
  type ResourceGroup = string;

  interface Resource<Namespace extends string, Name extends string> {
    readonly id: string;
    resourceGroup: ResourceGroup;
  }

  interface SubResource<Parent extends Resource<any, any> | SubResource<any, any>, Name extends string> {
    readonly id: string;
    resourceGroup: ResourceGroup;
  }

  interface Tracking {
    readonly location: Location;
    tags?: Dictionary<string>;
  }

  interface Entity {
    etag?: string;
  }

  interface TrackedEntityResource<Namespace extends string, Name extends string, PropertyType> extends Resource<Namespace, Name>, Tracking, Entity {
    properties: PropertyType;
  }

  interface TrackedEntitySubResource<Parent extends Resource<any, any> | SubResource<any, any>, Name extends string, PropertyType> extends SubResource<Parent, Name>, Tracking, Entity {
    properties: PropertyType;
  }

}
