import { RedisCommonProperties } from './RedisCommonProperties';
import { Sku } from './Sku';
export type RedisCreateProperties = internal.RedisCreateProperties & RedisCommonProperties;
namespace internal {
  /**
   * Properties supplied to Create Redis operation.
   */
  export interface RedisCreateProperties {
    /**
     * The SKU of the Redis cache to deploy.
     */
    sku: Sku;
    /**
     * The full resource ID of a subnet in a virtual network to deploy the Redis cache in. Example format: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
     */
    subnetId?: string & Pattern<'^/subscriptions/[^/]*/resourceGroups/[^/]*/providers/Microsoft.(ClassicNetwork|Network)/virtualNetworks/[^/]*/subnets/[^/]*$'>;
    /**
     * Static IP address. Required when deploying a Redis cache inside an existing Azure Virtual Network.
     */
    staticIP?: string & Pattern<'^\\d+\\.\\d+\\.\\d+\\.\\d+$'>;
  }
}
