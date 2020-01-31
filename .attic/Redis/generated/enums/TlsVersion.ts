/**
 * Optional: requires clients to use a specified TLS version (or higher) to connect (e,g, '1.0', '1.1', '1.2')
 */
export enum TlsVersion {
  OneDot0 = '1.0',
  OneDot1 = '1.1',
  OneDot2 = '1.2'
}

export interface Dictionary<T> {
  [key: string]: T;
}
type SubscriptionId = string;
type Location = string;
type ResourceGroup = string;

export interface AbstractResource {
  readonly id: string;
  readonly location: Location;
  resourceGroup: ResourceGroup;

  tags?: Dictionary<string>;
}

export interface Resource<Namespace, Name, PropertyType> extends AbstractResource {
  properties: PropertyType;
}


export class Implementation<ResType extends Resource<any /*??*/, any/*??*/, any /*??*/>>  {
  /** How do I propogate types in the above line for Resource<...> from ResType?   */
  CreateOrUpdate: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup, location: Location, id: string, resource: ResType) => Response<200> & ResType | Exception<Default>;
  Delete: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup, id: string) => Response<200> | Response<404> | Exception<Default>;
  Get: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup, id: string) => Response<200> & ResType | Exception<Default>;
  ListByResourceGroup: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup) => Response<200> & Iterable<ResType> | Exception<Default>;
  List: (subscriptionId: SubscriptionId) => Response<200> & Iterable<ResType> | Exception<Default>;
}

export interface MyResource extends Resource<'Microsoft.Foo', 'Foo', MyProps> {

}

export interface MyProps {
  name: string;
}


export class Implementation2<R extends Resource<any, any, any>> {
  CreateOrUpdate: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup, location: Location, id: string, resource: R) => Response<200> & R | Exception<Default>;
  Delete: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup, id: string) => Response<200> | Response<404> | Exception<Default>;
  Get: (subscriptionId: SubscriptionId, resourceGroup: ResourceGroup, id: string) => Response<200> & R | Exception<Default>;
  ListByResourceGroup: (resourceGroup: ResourceGroup) => Response<200> & Iterable<R> | Exception<Default>;
  List: () => Response<200> & Iterable<R> | Exception<Default>;
}

// implicit from MyResource:
export class MyResources extends Implementation<MyResource> {


}


/** Text that is here is the summary text.
 * 
 * @description - this is the description text. Ideally, it's longer that the text that you briefly describe the type with.
 * 
 * @since 2019-01-01 - this schema was added at this API version
 * @deprecated 2019-06-06  - it was deprecated at this API version
 * @deleted 2020-01-01 - This field should absolutely not be present past this version
 */
export interface ResourceProperties {
  /** 
   * The resource name
   * 
   * @description The description can further explain what this does.
  */
  name: string;

  /** 
   * The resource description
   * 
   * @since 2019-06-06 - this is when this member was introduced
  */
  description: string;

  /** A property we changed, because we're mean
   * 
   * @deleted 2020-01-01
   * @replacedBy {companyAddress} 
   */
  address: string;

  /** The new property for the company address.
   * 
   * @since 2020-01-01
   */
  companyAddress: string;

  /** A new property for the home address.
   * 
   * @since 2020-01-01
   */
  homeAddress?: string;  // it's optional!
}